import request from "supertest";
import { ipKeyGenerator } from "express-rate-limit";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { TokenService } from "../../services/token.service.js";
import { createTestUser, resetDatabase } from "../../test-utils/fixtures.js";

import { authRateLimiter } from "../../middleware/rate-limit.middleware.js";

const registration = {
  email: "alice@example.com",
  displayName: "Alice",
  password: "correcthorse",
};

beforeEach(async () => {
  await authRateLimiter.resetKey(ipKeyGenerator("::ffff:127.0.0.1"));
  await authRateLimiter.resetKey(ipKeyGenerator("127.0.0.1"));
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("full flow: register, publish, and browse", async () => {
  const registered = await request(app)
    .post("/api/auth/register")
    .send(registration);

  expect(registered.status).toBe(201);
  expect(registered.body.accessToken).toEqual(expect.any(String));

  const published = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${registered.body.accessToken}`)
    .send({
      title: "Hello, Inkwell",
      body: "My first real post.",
    });

  expect(published.status).toBe(201);
  expect(published.body.status).toBe("PUBLISHED");
  expect(published.body.authorId).toBe(registered.body.user.id);

  const feed = await request(app).get("/api/posts?page=1");

  expect(feed.status).toBe(200);
  expect(feed.body.posts).toHaveLength(1);
  expect(feed.body.posts[0]).toEqual(
    expect.objectContaining({
      id: published.body.id,
      title: "Hello, Inkwell",
      body: "My first real post.",
    }),
  );
});

test("duplicate registration returns EMAIL_ALREADY_REGISTERED", async () => {
  const first = await request(app)
    .post("/api/auth/register")
    .send(registration);

  expect(first.status).toBe(201);

  const second = await request(app)
    .post("/api/auth/register")
    .send({ ...registration, displayName: "Alice Two" });

  expect(second.status).toBe(400);
  expect(second.body.error.code).toBe("EMAIL_ALREADY_REGISTERED");
  expect(await prisma.user.count()).toBe(1);
});

test("exercise: registration and login work together", async () => {
  const registered = await request(app)
    .post("/api/auth/register")
    .send(registration);

  expect(registered.status).toBe(201);

  const loggedIn = await request(app)
    .post("/api/auth/login")
    .send({
      email: registration.email,
      password: registration.password,
    });

  expect(loggedIn.status).toBe(200);
  expect(loggedIn.body.user).toEqual(
    expect.objectContaining({
      id: registered.body.user.id,
      email: registration.email,
      displayName: registration.displayName,
    }),
  );
  expect(loggedIn.body.accessToken).toEqual(expect.any(String));
  expect(loggedIn.body.accessToken.length).toBeGreaterThan(0);
  expect(loggedIn.body.refreshToken).toEqual(expect.any(String));

  // Confirm the login token can authenticate a real request.
  const published = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${loggedIn.body.accessToken}`)
    .send({
      title: "Published after login",
      body: "Registration and login work together.",
    });

  expect(published.status).toBe(201);
  expect(published.body.authorId).toBe(registered.body.user.id);
});


test("publishing ignores a forged authorId and uses the verified token identity", async () => {
  const alice = await createTestUser();
  const bob = await createTestUser();
  const { accessToken } = TokenService.issueTokens(alice);
  const response = await request(app).post("/api/posts")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ title: "Spoof attempt", body: "Content", authorId: bob.id });
  expect(response.status).toBe(201);
  expect(response.body.authorId).toBe(alice.id);
  const saved = await prisma.post.findUnique({ where: { id: response.body.id } });
  expect(saved.authorId).toBe(alice.id);
});

test.each([undefined, "Basic fake", "Bearer invalid"])(
  "publishing rejects missing or invalid credentials: %s", async (authorization) => {
    const pending = request(app).post("/api/posts");
    if (authorization) pending.set("Authorization", authorization);
    const response = await pending.send({ title: "No access", body: "Content" });
    expect(response.status).toBe(401);
    expect(await prisma.post.count()).toBe(0);
  },
);

test("publishing rejects an expired token", async () => {
  const { default: jwt } = await import("jsonwebtoken");
  const token = jwt.sign({ sub: "expired-user" },
    process.env.ACCESS_TOKEN_SECRET || "dev-access-secret", { expiresIn: -1 });
  const response = await request(app).post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "No access", body: "Content" });
  expect(response.status).toBe(401);
  expect(await prisma.post.count()).toBe(0);
});

test("feed and search expose only public author fields and honor pageSize", async () => {
  const author = await createTestUser();
  await prisma.post.createMany({ data: [1, 2].map((n) => ({
    authorId: author.id, title: `Security ${n}`, body: "Content",
    status: "PUBLISHED", publishedAt: new Date(),
  })) });
  for (const search of ["", "&search=Security"]) {
    const response = await request(app).get(`/api/posts?pageSize=1${search}`);
    expect(response.status).toBe(200);
    expect(response.body.posts).toHaveLength(1);
    expect(response.body.hasMore).toBe(true);
    expect(response.body.posts[0].author).toEqual({ id: author.id, displayName: author.displayName });
  }
});

test.each(["101", "1000000000", "0", "-1", "1.5", "NaN", "Infinity", "", "1&pageSize=2"])(
  "feed and search reject invalid pageSize: %s", async (pageSize) => {
    for (const search of ["", "&search=Security"]) {
      const response = await request(app).get(`/api/posts?pageSize=${pageSize}${search}`);
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe("INVALID_PAGE_SIZE");
    }
  },
);

test("feed accepts the maximum pageSize", async () => {
  const response = await request(app).get("/api/posts?pageSize=100");
  expect(response.status).toBe(200);
});

test("login and registration share a five-request rate limit", async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await request(app).post("/api/auth/login")
      .send({ email: "missing@example.com", password: "wrongpassword" });
    expect(response.status).toBe(401);
  }
  for (const endpoint of ["login", "register"]) {
    const blocked = await request(app).post(`/api/auth/${endpoint}`).send(registration);
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe("TOO_MANY_ATTEMPTS");
    expect(blocked.headers["retry-after"]).toBeDefined();
  }
  expect(await prisma.user.count()).toBe(0);
});
