// Workshop placeholder: data resets whenever the server restarts.
const users = [];
const posts = [];
let nextUserId = 1;
let nextPostId = 1;

export const prisma = {
  user: {
    async findUnique({ where: { email } }) {
      return users.find((user) => user.email === email) ?? null;
    },
    async create({ data }) {
      const user = { id: String(nextUserId++), ...data };
      users.push(user);
      return user;
    },
  },
  post: {
    async create({ data }) {
      const post = { id: String(nextPostId++), ...data };
      posts.push(post);
      return post;
    },
    async findMany({ where, orderBy, skip = 0, take }) {
      const field = Object.keys(orderBy)[0];
      return posts
        .filter((post) => !where?.status || post.status === where.status)
        .sort((a, b) => new Date(b[field]) - new Date(a[field]))
        .slice(skip, take === undefined ? undefined : skip + take);
    },
  },
};
