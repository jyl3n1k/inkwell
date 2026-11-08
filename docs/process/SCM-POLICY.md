# Software Configuration Management Policy

## Branching Strategy

Inkwell uses GitHub Flow to support the course's one-lecture, one-increment pace:

- `main` is always deployable.
- All work happens on short-lived branches named `<type>/<short-description>`,
  such as `feature/tag-search` or `fix/author-id-spoofing`.
- Contributors merge branches through pull requests that require all automated
  tests to pass and at least one reviewer to approve the change.
- Contributors keep changes small, update branches frequently, and delete
  branches after merging them.

## Commit Message Conventions

Inkwell follows Conventional Commits:

```text
<type>(<scope>): <short summary>
```

Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `security`.

Examples:

```text
feat(posts): add tag-based search
security(auth): fix authorId spoofing vulnerability
```

Consistent prefixes make the history searchable. For example,
`git log --grep="^security"` finds security-related commits.

## Configuration Items and Change Control

Version-controlled items include application source, database schemas and
migrations, dependency manifests and lockfiles, tests, CI configuration, and
project documentation. Keep private environment files and generated reports out
of Git; commit environment examples without private credentials.

Use the normal pull-request process for unreleased work. Before changing a
released and baselined version, complete the
[change request template](../../.github/CHANGE_REQUEST_TEMPLATE.md), identify
affected items and coupled components, assess backward compatibility, and obtain
review and approval before implementation.

## Release Baselines

Update [CHANGELOG.md](../../CHANGELOG.md) before creating a release baseline.
After the reviewed changes are merged and the full automated test suite passes,
create an annotated tag on the release commit and push it to GitHub:

```bash
git status
git tag -a v0.5.0 -m "Release 0.5.0: auth, posts, search, testing, OWASP Top 10 hardening"
git push origin main
git push origin v0.5.0
git log --oneline --decorate -5
git tag --list
```

Release tags identify permanent snapshots; do not move an existing release tag.
For Workshop 17, include a screenshot of `git log --oneline` after committing.
