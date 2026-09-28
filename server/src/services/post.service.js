import { PostRepository } from "../repositories/post.repository.js";
import { assertNonEmpty, ValidationError } from "../utils/validation.js";
import { SubstringSearchStrategy } from "./search/substring-search.strategy.js";
import { EventBus } from "../events/event-bus.js";

const searchStrategy = SubstringSearchStrategy;

export const PostService = {
  async publish({ authorId, title, body, tagNames = [] }) {
    assertNonEmpty(title, "title", "MISSING_TITLE");
    assertNonEmpty(body, "body", "MISSING_BODY");
    if (!Array.isArray(tagNames) ||
        tagNames.some((name) => typeof name !== "string" || !name.trim())) {
      throw new ValidationError("tagNames must be an array of non-empty strings.", "INVALID_TAGS");
    }
    const names = [...new Set(tagNames.map((name) => name.trim().toLowerCase()))];
    const post = await PostRepository.createWithTags({
      authorId, title, body, tagNames: names,
      status: "PUBLISHED", publishedAt: new Date(),
    });
    EventBus.emit("post.published", {
      postId: post.id, authorId, title: post.title, tags: names,
    });
    return post;
  },

  async listPublished({ page = 1, pageSize = 10 }) {
    const result = await PostRepository.findPublished({ page, pageSize });
    return { ...result, page };
  },

  async search({ query, page = 1, pageSize = 10 }) {
    const result = await searchStrategy.search(query, { page, pageSize });
    return { ...result, page };
  },
};
