import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { createTestUser, createTestPost, tokenFor, resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(resetDatabase);
afterAll(async () => { await prisma.$disconnect(); });

test("a user cannot delete another user's post", async () => {
  const owner = await createTestUser();
  const attacker = await createTestUser();
  const post = await createTestPost({ authorId: owner.id });
  const response = await request(app).delete(`/api/posts/${post.id}`)
    .set("Authorization", `Bearer ${tokenFor(attacker)}`);
  expect(response.status).toBe(403);
  expect(await prisma.post.findUnique({ where: { id: post.id } })).not.toBeNull();
});

test("an owner can delete a tagged post without deleting its tag", async () => {
  const owner = await createTestUser();
  const post = await prisma.post.create({ data: {
    authorId: owner.id, title: "Tagged", body: "Content",
    tags: { create: { tag: { create: { name: "security" } } } },
  } });
  const response = await request(app).delete(`/api/posts/${post.id}`)
    .set("Authorization", `Bearer ${tokenFor(owner)}`);
  expect(response.status).toBe(204);
  expect(await prisma.post.findUnique({ where: { id: post.id } })).toBeNull();
  expect(await prisma.postTag.count()).toBe(0);
  expect(await prisma.tag.count()).toBe(1);
});

test("an authenticated request for a missing post returns 404", async () => {
  const owner = await createTestUser();
  const response = await request(app).delete("/api/posts/missing-post")
    .set("Authorization", `Bearer ${tokenFor(owner)}`);
  expect(response.status).toBe(404);
});

test.each([undefined, "Bearer invalid"])("delete rejects invalid credentials: %s", async (authorization) => {
  const owner = await createTestUser();
  const post = await createTestPost({ authorId: owner.id });
  const pending = request(app).delete(`/api/posts/${post.id}`);
  if (authorization) pending.set("Authorization", authorization);
  expect((await pending).status).toBe(401);
  expect(await prisma.post.count()).toBe(1);
});
