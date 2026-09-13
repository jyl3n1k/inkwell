import { prisma } from "../db/client.js";

export const UserRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  create({ email, displayName, passwordHash }) {
    return prisma.user.create({
      data: {
        email,
        displayName,
        passwordHash
      }
    });
  }
};
