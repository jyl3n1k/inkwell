import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

const registration = {
  email: "alice@example.com",
  displayName: "Alice",
  password: "correcthorse",
};

beforeEach(async () => {
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
