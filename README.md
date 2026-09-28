# Inkwell

Inkwell is a Medium-like blog publishing platform developed incrementally throughout CS 415/515.

## Definition of Done

A backlog item is Done when:

- [ ] The code implementing it is committed with a descriptive commit message.
- [ ] It runs locally following the relevant lecture's Code Walkthrough.
- [ ] It does not break any previously passing verification steps.
- [ ] New environment variables, dependencies, and setup steps are documented here.

## Process

Inkwell follows an incremental development process: one lecture, one increment.

See [docs/BACKLOG.md](docs/BACKLOG.md) for the current product backlog.

## Workshop 9

With PostgreSQL running and `server/.env` configured, run from `server`:

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

Publishing accepts an optional `tagNames` array. Tags are trimmed, lowercased,
and deduplicated. `GET /api/posts?search=design&page=1` searches published
posts by title, body, or tag through the substring search strategy.

Two listeners handle `post.published`: one logs the event and one increments
the counter returned by `GET /api/stats` as `{ "totalPostsPublished": 0 }`.
This counter starts at zero on each server start; it is not a database total.
Verify it increases once per successful publish and does not increase when
publishing fails validation.
