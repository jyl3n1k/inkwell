# Review: Workshop 9 tagging, search, and publish events

**Code reviewed:** Workshop 9 commit `b302f3e`  
**Reviewer:** Self-review  
**Time spent:** [enter your actual review time]

## Findings

1. `server/package.json` did not specify a minimum Node.js version.
   **Resolution:** Add `"engines": { "node": ">=22.0.0" }` in Workshop 10.

2. `server/src/db/client.js` imports `@prisma/client` outside `repositories/`,
   which conflicts with the new review checklist.
   **Outcome:** Documented for a follow-up architecture decision. The existing
   database client setup should be assessed before changing imports.

## Checklist notes

- Route, Service, and Repository responsibilities: [record your assessment]
- Naming, duplication, and error handling: [record your assessment]
- UX and accessibility: Not applicable to this server-only change.
- Backlog, commit message, and secrets: [record your assessment]

**Review outcome:** [enter your conclusion after reviewing]
