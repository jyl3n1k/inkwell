import assert from "node:assert/strict";
import { test } from "node:test";
import express from "express";
import postRoutes from "../src/routes/post.routes.js";
import { PostService } from "../src/services/post.service.js";
import { TokenService } from "../src/services/token.service.js";
import { ValidationError } from "../src/utils/validation.js";

test("publishing uses verified identity and returns safe errors", async () => {
  const app = express();
  app.use(express.json());
  app.use("/api", postRoutes);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const original = PostService.publish;
  const token = TokenService.issueTokens({ id: "verified-author", email: "test@example.com" }).accessToken;
  const send = (authorization, body = { title: "Title", body: "Body" }) =>
    fetch(`http://127.0.0.1:${server.address().port}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
      body: JSON.stringify(body),
    });

  try {
    let calls = 0;
    PostService.publish = async (data) => { calls++; return { id: "post", ...data }; };
    assert.equal((await send()).status, 401);
    assert.equal((await send("Bearer invalid")).status, 401);
    assert.equal(calls, 0);

    const response = await send(`Bearer ${token}`, { title: "Title", body: "Body", authorId: "spoofed-author" });
    assert.equal(response.status, 201);
    assert.equal((await response.json()).authorId, "verified-author");

    PostService.publish = async () => { throw new ValidationError("title is required.", "MISSING_TITLE"); };
    assert.equal((await send(`Bearer ${token}`)).status, 400);

    PostService.publish = async () => { throw Object.assign(new Error("database details"), { code: "P2003" }); };
    const stale = await send(`Bearer ${token}`);
    assert.equal(stale.status, 401);
    assert.ok(!(await stale.text()).includes("database details"));

    PostService.publish = async () => { throw new Error("private database details"); };
    const failed = await send(`Bearer ${token}`);
    assert.equal(failed.status, 500);
    assert.equal((await failed.json()).error.message, "Unable to publish your post. Please try again.");
  } finally {
    PostService.publish = original;
    await new Promise((resolve) => server.close(resolve));
  }
});
