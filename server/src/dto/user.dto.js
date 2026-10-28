// Allowlist: newly added user fields remain private by default.
export function toPublicUser(user) {
  return { id: user.id, displayName: user.displayName };
}
