# OWASP Top 10 review - Workshop 16

Reviewed November 1, 2026, using the workshop's OWASP 2021 categories.

| # | Category | Status in Inkwell | Action |
|---|---|---|---|
| A01 | Broken Access Control | Publishing already derives authorId from the verified JWT. Added DELETE /api/posts/:id with authentication and an ownership check. There are currently no comment or edit endpoints. | Return 403 for another user's post, 404 for a missing post, and 204 for an owner's deletion. Regression tests cover these paths, invalid credentials, and tagged-post deletion. |
| A02 | Cryptographic Failures | Passwords use bcrypt. JWT signing previously fell back to predictable development secrets. | Generated independent random 32-byte secrets in ignored local environment files. Removed fallback secrets; startup rejects missing, short, or identical secrets. Never commit actual secrets. |
| A03 | Injection | Post, tag, user, and search queries use Prisma parameterized operations; no raw SQL interpolates request input. | Verified existing protection; React also renders post content as text (Workshop 15 regression test). |
| A04 | Insecure Design | Existing STRIDE review covers current publishing, browsing, authentication, and pagination threats. | See THREAT-MODEL.md; no additional design fix identified in this pass. |
| A05 | Security Misconfiguration | The previous central error handler exposed exception messages in production. Auth routes also returned unexpected exception messages directly. | Registered shared error middleware, suppress production exception details, and log errors internally. Auth routes forward unexpected errors to it while retaining expected validation/credential responses. Production/development error regression tests pass. Set NODE_ENV=production in deployments. |
| A06 | Vulnerable and Outdated Components | Ran npm audit and npm audit fix separately in client and server. Updated lockfiles using compatible fixes. | No high or critical findings remain. Residual findings documented below; CI audits both directories at the high threshold. |
| A07 | Authentication Failures | Existing JWT verification and shared login/registration rate limiter are covered by Workshop 15 tests. | Verified; no new authentication flow needed. |
| A08 | Software and Data Integrity Failures | Lockfiles are committed and the audit workflow installs with npm ci. Full pipeline integrity review remains outside this workshop. | Deferred to Lectures 20/21; dependency audits alone do not establish pipeline integrity. |
| A09 | Security Logging and Monitoring Failures | Failed logins previously produced no security event. | Added shared Pino logger configured by LOG_LEVEL (default info); unknown-email and wrong-password attempts log auth.login.failed with email, timestamp, and warning level. No passwords or tokens are logged. Error middleware uses the same logger. Log aggregation and alerting remain future deployment work. |
| A10 | Server-Side Request Forgery | No current server feature fetches a user-supplied URL. | Not currently applicable. Revisit before implementing avatar-by-URL or remote imports. |

## Dependency audit results

After compatible fixes on November 1, 2026:

| Directory | Low | Moderate | High | Critical |
|---|---:|---:|---:|---:|
| server | 3 | 16 | 0 | 0 |
| client | 0 | 6 | 0 | 0 |

Server findings remain in Jest tooling: deepmerge, glob, minimatch and dependent packages. npm proposes a breaking Jest downgrade to 25.1.0 for these remaining findings. Client findings remain in the ESLint/minimatch chain, for which npm reports no available fix. These are development tooling paths, not grounds to report a completely clean audit. Do not use npm audit fix --force to downgrade core tooling. Revisit when compatible upstream fixes become available.

Both npm audit --audit-level=high checks pass. Counts are a snapshot and can change as advisory data changes. This workstation required a temporary CA bundle exported from Windows trusted certificate stores for registry access; TLS verification remained enabled and no repository npm configuration was changed.

## Setup and verification

Environment example files intentionally leave signing secrets blank. Copy the appropriate example if needed, then generate each secret independently:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Assign separate outputs to ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET in each private server environment file. Local secrets were regenerated during this workshop, so previously issued tokens need a fresh login. Randomness comes from secret generation; length checks alone cannot establish entropy.

The new migration changes PostTag -> Post to ON DELETE CASCADE, removing only join rows when a post is deleted; shared tags remain. It was applied successfully to the local development and test databases. For another checkout:

```powershell
cd server
node --env-file=.env node_modules/prisma/build/index.js migrate deploy
node --env-file=.env.test node_modules/prisma/build/index.js migrate deploy
npm.cmd test
cd ../client
npm.cmd test
npm.cmd run build
npm.cmd run lint
```

Verification: 42 server tests across six suites and two client tests across two suites passed. The client production build and lint passed. CI dependency-audit configuration is included; hosted execution will occur after pushing.

## Submission

Commit and push the workshop changes, then run git log --oneline -10 and capture a screenshot of the actual resulting commit history. The screenshot is a separate submission artifact and must be taken after committing. No commit or push was performed during implementation, as requested.
