# Workshop 6 Verification Summary

## Results

I attempted to start the Express server and test the following API operations:

- Register a user with `POST /api/auth/register`
- Attempt duplicate registration
- Publish a post with `POST /api/posts`
- List published posts with `GET /api/posts?page=1`

The server could not start successfully because the repository modules import
`../db/client.js`, which does not exist yet. Consequently, the curl requests could
not connect to a running API server.

## Cause

`UserRepository` and `PostRepository` depend on a Prisma client exported by
`server/src/db/client.js`. The project does not yet contain that module or a working
Prisma schema and database configuration.

This is a known limitation documented in Workshop 6. Database persistence is
scheduled to be implemented in Workshop 8.

## Required Fix

To make the API requests work, the project will need to:

1. Install and configure Prisma.
2. Create an executable `prisma/schema.prisma`.
3. Configure the PostgreSQL database connection.
4. Generate the Prisma client.
5. Create `server/src/db/client.js`.
6. Apply the database migration.
7. Start the server and repeat the curl tests.
