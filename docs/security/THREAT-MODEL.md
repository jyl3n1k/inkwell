# Inkwell threat model ? Workshop 15

## Attack surface

- `POST /api/auth/register`: public; accepts email, displayName, and password.
- `POST /api/auth/login`: public; accepts email and password.
- `POST /api/posts`: authenticated; accepts title, body, and tagNames.
- `GET /api/posts`: public feed and search; accepts page, pageSize, and search.
- JWT access tokens: bearer credentials in the Authorization header.

## STRIDE analysis and risk ratings

| Component | Threat | STRIDE category | Likelihood | Impact | Risk | Mitigation |
|---|---|---|---|---|---|---|
| POST /api/posts | Forged authorId publishes as another user | Spoofing | High | High | Critical | Verify JWT and derive authorId exclusively from req.user.id. Ignore client identity fields. |
| GET /api/posts | Feed/search exposes private author fields | Information Disclosure | High | Medium | High | Database selection plus toPublicUser allowlist returning only id and displayName. |
| POST /api/auth/login and /register | Unlimited attempts enable guessing and resource exhaustion | Spoofing / Denial of Service | Medium | High | High | Shared per-IP budget of five requests in ten minutes, then HTTP 429. |
| POST /api/posts and client rendering | Stored HTML executes in a reader's browser | Tampering / Information Disclosure | Medium | High | High | Render title/body through React text interpolation; regression test rejects active markup. |
| GET /api/posts (additional exercise) | Oversized pageSize causes excessive database work and response size | Denial of Service | Medium | High | High | Default 10; reject values outside integer range 1?100 with HTTP 400 before querying; apply to feed and search. |

## Design decisions

Authentication verifies who sent a token. Authorization must also bind the action to that identity: a valid Alice token cannot authorize publishing as Bob. The publish route explicitly builds its service input using req.user.id.

The public user DTO uses an allowlist. Future private fields such as phoneNumber stay private by default. The existing Prisma select is retained to avoid loading sensitive author data in the first place; the DTO defines the public response contract.

The workshop limiter configuration counts all requests per IP, including successes, and shares a budget across login and registration. It does **not** implement five consecutive failures per account. Its in-memory store is appropriate for this single-process exercise; multiple server instances would require shared storage. Proxy configuration must match a trusted deployment before changing Express trust proxy settings.

React's text escaping already protects PostCard. The regression test verifies literal script/image payloads and title markup, no injected DOM elements, and no script side effects. Introducing rich HTML rendering would require a new threat review.

The pageSize cap bounds returned records and the extra hasMore lookahead (at most 101 queried rows). It does not eliminate all DoS risks: expensive searches, large offsets, request volume, and post sizes need separate controls.

## Hardening log

- 2026-10-28 ? Workshop 15: retained existing JWT validation and author-spoofing protection; standardized verified identity on req.user and added forged-author, invalid-token, and expired-token regression tests.
- 2026-10-28 ? Workshop 15: added the public-user DTO to the shared feed/search response mapping, retaining existing database field selection.
- 2026-10-28 ? Workshop 15: added express-rate-limit to login and registration, with a shared-budget regression test.
- 2026-10-28 ? Workshop 15: verified existing stored-XSS resistance with PostCard.security.test.jsx.
- 2026-10-28 ? Workshop 15 exercise: added pageSize validation and feed/search tests for oversized, malformed, and boundary values.

## Security measurement baseline

- Four walkthrough threat categories addressed, plus the additional pageSize DoS mitigation. Identity binding and public database field selection already existed before this pass.
- Dedicated security tests now exercise all four listed HTTP endpoints; client rendering and DTO privacy also have dedicated tests. This is endpoint coverage, not comprehensive security coverage.
- Security maturity: ad hoc/reactive. This hardening pass and regression suite are a starting point, not an ongoing security program or evidence that every vulnerability is resolved.

## Verification and submission

From the repository root in PowerShell:

```powershell
npm.cmd --prefix server test
npm.cmd --prefix client test
```

Verified on 2026-10-28: all 33 server tests (four suites) and both client tests (two suites) pass. The existing `inkwell-workshop13-db` Docker container must be running for server integration tests.

After committing and pushing, run `git log --oneline -10` and capture a screenshot for the workshop submission. The screenshot must show the actual resulting commit history.
