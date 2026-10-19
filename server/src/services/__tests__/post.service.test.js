import { jest } from "@jest/globals";

const mockPostRepository = {
  createWithTags: jest.fn(),
  searchPublished: jest.fn(),
};

const mockEventBus = {
  emit: jest.fn(),
};

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));

jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("PostService.publish", () => {
  test("creates a PUBLISHED post and emits post.published", async () => {
    const savedPost = {
      id: "p1",
      title: "Hello",
      body: "World",
      status: "PUBLISHED",
    };
    mockPostRepository.createWithTags.mockResolvedValue(savedPost);

    const post = await PostService.publish({
      authorId: "u1",
      title: "Hello",
      body: "World",
    });

    expect(post).toEqual(savedPost);
    expect(mockPostRepository.createWithTags).toHaveBeenCalledWith(
      expect.objectContaining({
        authorId: "u1",
        title: "Hello",
        body: "World",
        status: "PUBLISHED",
      }),
    );
    expect(mockEventBus.emit).toHaveBeenCalledTimes(1);
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      "post.published",
      expect.objectContaining({ postId: "p1" }),
    );
  });

  test("rejects an empty title", async () => {
    await expect(
      PostService.publish({
        authorId: "u1",
        title: "",
        body: "World",
      }),
    ).rejects.toThrow();

    expect(mockPostRepository.createWithTags).not.toHaveBeenCalled();
    expect(mockEventBus.emit).not.toHaveBeenCalled();
  });
});

describe("PostService.search", () => {
  test("S1: returns matches with default pagination", async () => {
    const posts = [{ id: "p1", title: "Hello" }];
    mockPostRepository.searchPublished.mockResolvedValue({
      posts,
      hasMore: false,
    });

    await expect(
      PostService.search({ query: "Hello" }),
    ).resolves.toEqual({ posts, hasMore: false, page: 1 });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "Hello",
      page: 1,
      pageSize: 10,
    });
  });

  test("S2: returns an empty result when nothing matches", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({
      posts: [],
      hasMore: false,
    });

    await expect(
      PostService.search({ query: "no-match" }),
    ).resolves.toEqual({ posts: [], hasMore: false, page: 1 });
  });

  test("S3: honors explicit pagination and preserves hasMore", async () => {
    const posts = [{ id: "p2", title: "Another post" }];
    mockPostRepository.searchPublished.mockResolvedValue({
      posts,
      hasMore: true,
    });

    await expect(
      PostService.search({ query: "post", page: 2, pageSize: 1 }),
    ).resolves.toEqual({ posts, hasMore: true, page: 2 });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "post",
      page: 2,
      pageSize: 1,
    });
  });

  test("S4: propagates a repository failure", async () => {
    const failure = new Error("Search unavailable");
    mockPostRepository.searchPublished.mockRejectedValue(failure);

    await expect(
      PostService.search({ query: "Hello" }),
    ).rejects.toBe(failure);
  });
});
