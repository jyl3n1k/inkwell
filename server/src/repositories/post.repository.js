import { prisma } from "../db/client.js";

const include = {
  tags: { include: { tag: true } },
  author: { select: { id: true, displayName: true } },
};

async function list(where, page, pageSize) {
  const rows = await prisma.post.findMany({
    where,
    include,
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1,
  });
  return { posts: rows.slice(0, pageSize), hasMore: rows.length > pageSize };
}

export const PostRepository = {
  create({ authorId, title, body, status, publishedAt }) {
    return prisma.post.create({
      data: { authorId, title, body, status, publishedAt },
    });
  },

  createWithTags({ authorId, title, body, status, publishedAt, tagNames = [] }) {
    return prisma.post.create({
      data: {
        authorId, title, body, status, publishedAt,
        tags: {
          create: tagNames.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { name } } },
          })),
        },
      },
      include,
    });
  },

  findPublished({ page, pageSize }) {
    return list({ status: "PUBLISHED" }, page, pageSize);
  },

  searchPublished({ query, page, pageSize }) {
    return list({
      status: "PUBLISHED",
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { body: { contains: query, mode: "insensitive" } },
        { tags: { some: { tag: { name: { contains: query, mode: "insensitive" } } } } },
      ],
    }, page, pageSize);
  },
};
