# Workshop 13: Integration and Component Testing

## Coverage

- Supertest exercises the real Express routes, services, repositories, and an
  isolated PostgreSQL database without mocks.
- The publishing journey registers a user, publishes with the registration
  token, and verifies the saved post appears in the feed.
- Duplicate registration checks the HTTP error contract and the user count.
- The additional exercise registers and logs in the same user, checks the
  returned identity and tokens, and publishes using the login token.
- React Testing Library renders PostEditor, submits through user interaction,
  and checks that an API error is displayed and associated with the title field.
  Only the fetch boundary is mocked.
- Existing Workshop 12 unit tests remain enabled.

## Local setup (Git Bash)

Start Docker Desktop, then create the isolated database container once:

```bash
docker run -d --name inkwell-workshop13-db \
  -e POSTGRES_USER=inkwell -e POSTGRES_PASSWORD=inkwell \
  -e POSTGRES_DB=inkwell_test -p 127.0.0.1:55433:5432 postgres:17
```

For subsequent runs, use `docker start inkwell-workshop13-db`.
Create the ignored `server/.env.test` with local test settings:

```dotenv
DATABASE_URL="postgresql://inkwell:inkwell@localhost:55433/inkwell_test"
ACCESS_TOKEN_SECRET="workshop13-test-access-secret"
REFRESH_TOKEN_SECRET="workshop13-test-refresh-secret"
```

From `server`, install dependencies and prepare the database:

```bash
npm ci
DATABASE_URL="postgresql://inkwell:inkwell@localhost:55433/inkwell_test" npx prisma migrate deploy
DATABASE_URL="postgresql://inkwell:inkwell@localhost:55433/inkwell_test" npx prisma generate
```

## Verification

- In `server`, run `npm test`: 12 unit tests and 3 integration tests.
- In `client`, run `npm ci` and `npm test`: 1 component test.
- Server tests run serially to avoid concurrent database resets. Each integration
  test clears the test tables; the reset helper refuses other database names.
- Jest discovers tests under `server/src`; the older `server/test` file uses
  Node's separate test runner and is not a Jest suite.
- The app is imported without binding a server port, and the integration suite
  disconnects Prisma after completion.

## Submission

Commit and push the changes, then capture a screenshot of `git log --oneline`.
Do not commit `server/.env.test`.
