# Review: Workshop 9 tagging, search, and publish events

**Code reviewed:** Workshop 9 commit `b302f3e` (US-10 tagging and US-11 search)
**Reviewer:** Self-review
**Review date:** 2026-10-04
**Defects and process findings:** 3
**Outcome:** Accept with documented follow-ups; the Node version finding was resolved in Workshop 10.

## Checklist assessment

| Area | Assessment |
| --- | --- |
| Route and Service responsibilities | Pass. The post route parses input, selects the Service operation, and maps errors to HTTP responses. Publishing, tag normalization, and search selection live in `PostService`. The stats route only reads the counter. |
| Prisma import boundary | Does not meet the literal checklist: `server/src/db/client.js` imports `@prisma/client` outside `repositories/`. This database setup predates Workshop 9; the new post repository imports the shared client rather than importing Prisma directly. |
| Function naming | Pass. Names such as `createWithTags`, `searchPublished`, and `getPublishStats` describe their purpose. |
| Duplicated logic | Pass for the reviewed change. Feed and search share the repository's paginated `list` helper, and title/body validation uses the existing helper. |
| Typed errors and API format | Pass for the reviewed change. Invalid tags raise `ValidationError`; the route returns the established `{ error: { code, message } }` shape. Unexpected publish errors use the existing 500 response shape; the GET route forwards errors to the shared error handler. |
| UX and accessibility | Not applicable. Workshop 9 changed the server API and documentation, with no new UI controls or layouts. |
| Commit message | Partial. `b302f3e` describes the work but does not include US-10 or US-11, as the new checklist requires. |
| Backlog | Pass. Workshop 9 added the tagging and search stories to `docs/BACKLOG.md` as US-10 and US-11 because US-08 and US-09 were already assigned. |
| Secrets | Pass for the reviewed commit. Its changed-file list contains no `.env` file, and the reviewed additions use configuration rather than embedding credentials. |

## Findings and disposition

1. **Minimum Node version was undocumented.** At the time of the Workshop 9 commit, `server/package.json` had no `engines.node` field. **Resolved** in Workshop 10 with `"node": ">=22.0.0"`.
2. **Prisma import rule conflicts with the existing database module.** `server/src/db/client.js` directly imports `@prisma/client`, although the checklist permits that import only under `repositories/`. **Open follow-up:** decide whether the shared database client is an explicit exception to the rule or should be moved behind a repository-owned module; then align the checklist and `server/src/repositories/README.md` with that decision.
3. **Workshop 9 commit lacks backlog IDs.** The message is descriptive but omits US-10 and US-11. **Recorded process finding:** include applicable backlog IDs in future commit messages; do not rewrite the already published Workshop 9 commit solely for this.

The review found no additional issues in the naming, duplicated logic, or typed-error handling of the Workshop 9 change. This log records the review result; it does not claim that the open architecture follow-up has been fixed.
