import { toPublicUser } from "../user.dto.js";

test("public user allowlist excludes current and future private fields", () => {
  expect(toPublicUser({ id: "u1", displayName: "Alice", email: "private@example.com",
    passwordHash: "secret", phoneNumber: "private", isVerified: true,
  })).toEqual({ id: "u1", displayName: "Alice" });
});
