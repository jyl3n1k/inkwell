# Inkwell SQA Plan — v1

## Standards

- Follow the [pull request checklist](../../.github/PULL_REQUEST_TEMPLATE.md).
- Check architecture against [ADR-001](../architecture/adr-001-modular.monolith.md).
- Follow the [API contract](../design/api-contract.md).
- Record exceptions and follow-ups in the [defect log](DEFECT-LOG.md).

## Reviews

- Authors self-review changes using the pull request checklist.
- Seek peer review before merging shared changes.
- Record findings in [docs/reviews](../reviews/), including reviews that find no defects.

## Testing

- Current verification is primarily manual.
- Unit tests for Services and Repositories are planned for Lecture 12.
- Route integration tests are planned for Lecture 13.
- End-to-end tests for critical flows are planned for Lecture 14.
- Passing the checks currently available does not establish reliability under all inputs or operating conditions.

## Defect Tracking

- Record defects found through reviews, testing, or manual use in the [defect log](DEFECT-LOG.md).
- Each entry records its cause category, discovery stage, and remediation or open follow-up.
- Review the log for repeated causes as new entries are added.

## Metrics Tracked

- Defects found per lecture or increment.
- Distribution of defect cause categories.
- Review turnaround, recorded informally while the project is small.

## Ownership

The student or team implementing Inkwell maintains this plan and the associated review and defect records.
]633;E;{   printf '\\n## Metrics Snapshot — %s\\n\\n' "$(date +%F)"\x3b   printf -- '- Commits after the Workshop 11 commit: %s\\n' "$commit_count"\x3b   printf -- '- Logged defects and review findings: %s\\n' "$defect_count"\x3b   printf -- '- Backlog items marked Requirements Defined or later: %s\\n' "$defined_count"\x3b } >> docs/quality/SQA-PLAN.md;00ce9feb-cde9-4ebd-9770-6ffedd781e5d]633;C
## Metrics Snapshot — 2026-10-04

- Commits after the Workshop 11 commit: 16
- Logged defects and review findings: 3
- Backlog items marked Requirements Defined or later: 4
