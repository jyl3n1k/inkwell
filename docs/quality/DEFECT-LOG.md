# Inkwell Defect Log

| ID | Found During | Cause Category | Description | Remediation |
| --- | --- | --- | --- | --- |
| D-001 | Workshop 10 review | Compatibility | Workshop 9 did not document the minimum supported Node.js version. | Resolved: added `engines.node` of `>=22.0.0` to `server/package.json`. |
| D-002 | Workshop 10 self-review | Architecture | `server/src/db/client.js` imports `@prisma/client` outside `repositories/`, contrary to the PR checklist. | Open: decide whether the shared database client is an exception or should move behind a repository-owned module; update the checklist accordingly. |
| D-003 | Workshop 10 self-review | Process | The Workshop 9 commit message omitted the related US-10 and US-11 backlog IDs. | Recorded: include applicable backlog IDs in future commit messages. |
