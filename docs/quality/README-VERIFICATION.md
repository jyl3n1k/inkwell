# README Verification - Workshop 14

Verification date: October 26, 2026.

## Findings and corrections

The previous README lacked a complete newcomer setup. Added clone instructions,
prerequisites, database creation/restart, environment examples, dependency
installation, Prisma migrations/generation, application startup, registration
instructions, test commands, and report inspection.

Integration and E2E databases use separate containers and ports. Playwright starts
its own application servers. The existing token-derived author identity is
preserved; the PDF's client-supplied authorId workaround is unnecessary here.

## Verification

Verification uses a fresh local clone with the uncommitted Workshop 14 changes
overlaid, since these changes have intentionally not been committed or pushed.
Environment files and node_modules were not copied into the clone.

- [x] Root, server, and client dependencies installed from their lockfiles.
- [x] Private environment files created from the documented examples.
- [x] Existing Docker containers restarted using the documented restart path;
  all three databases reported ready.
- [x] Development, integration, and E2E migration commands succeeded.
- [x] Prisma client generated from the schema in the fresh clone.
- [x] `npm run dev` started the API; `/api/health` returned HTTP 200 and status ok.
- [x] `npm run dev` started the client; its root returned HTTP 200 and the app entry.
- [x] Server tests in the fresh clone: 15 passed across 3 suites.
- [x] Client tests in the fresh clone: 1 passed.
- [x] Client production build in the fresh clone: passed.
- [x] Browser installation completed for Chromium, Firefox, and WebKit.
- [x] Final browser run in the working checkout: 12 passed, with no retries.
- [x] Changed client files pass ESLint; Git whitespace checks pass.

The fresh clone uses the existing local database containers rather than deleting
development data. The browser run uses only the isolated `inkwell_e2e` database.

### Browser results

| Browser | Mobile 390 x 664 | Tablet 768 x 1024 | Desktop 1280 x 800 | Feed axe scan |
| --- | --- | --- | --- | --- |
| Chromium | Pass | Pass | Pass | Pass |
| Firefox | Pass | Pass | Pass | Pass |
| WebKit | Pass | Pass | Pass | Pass |

All viewport entries invoke the same publishing test without viewport-specific
steps. It asserts navigation back to the feed, the actual published heading, and
the absence of horizontal overflow. The tablet needed no responsive CSS fix.

### Verification fixes

Firefox resource requests stalled when using localhost; the E2E server URLs now
use explicit IPv4 loopback addresses. Parallel browsers also caused a WebKit feed
load timeout on this machine. One worker keeps full browser instances from
competing for memory. With these configuration changes, all 12 tests passed.
The test logic and assertions were not weakened or made tablet-specific.

The final HTML browser report is available locally through
`npx playwright show-report` from the repository root. Reports are ignored by Git.

An earlier attempt was interrupted by a full disk. It was repeated in a new
temporary checkout after disk space was freed.
