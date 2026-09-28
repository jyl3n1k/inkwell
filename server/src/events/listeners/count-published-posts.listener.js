import { EventBus } from "../event-bus.js";

// Counts successful publishes in this process; resets when the server restarts.
let totalPostsPublished = 0;

EventBus.on("post.published", () => {
  totalPostsPublished += 1;
});

export function getPublishStats() {
  return { totalPostsPublished };
}
