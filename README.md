# Inkwell

Inkwell is a Medium-like blog publishing platform developed incrementally throughout CS 415/515.

## Getting Started

Commands below use Git Bash on Windows, or a Bash shell on macOS/Linux.

### Prerequisites and checkout

- Git, Node.js 22.22 or newer, and npm.
- Docker Desktop running with Linux containers.
- Free ports: 5432 (development database), 55433 (integration database),
  55434 (E2E database), 4000/5173 (development app), and 4001/5174 (E2E app).

```bash
git clone https://github.com/jyl3n1k/inkwell.git
cd inkwell
export NODE_USE_SYSTEM_CA=1
npm ci
```

### Development database

Create the container once:

```bash
docker run -d --name inkwell-postgres \
  -e POSTGRES_USER=inkwell -e POSTGRES_PASSWORD=inkwell \
  -e POSTGRES_DB=inkwell_dev -p 127.0.0.1:5432:5432 postgres:16
```

If it already exists, run `docker start inkwell-postgres` instead. Wait until
`docker exec inkwell-postgres pg_isready -U inkwell -d inkwell_dev`
reports that it is accepting connections before continuing.

### Server

From the repository root:

```bash
cd server
npm ci
cp .env.example .env
npx prisma migrate deploy
npx prisma generate
npm run dev
```

The API runs at http://localhost:4000; `/api/health` returns JSON.
Leave this terminal running.

### Client

In another terminal, from the repository root:

```bash
cd client
npm ci
npm run dev
```

Open http://localhost:5173. The client proxies `/api` to port 4000.
There is currently no registration screen. Create a local account through the API:

```bash
curl --fail-with-body http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"reader@example.com","displayName":"Reader","password":"correcthorse"}'
```

Then use **Log In**, followed by **Write**, to publish. Reusing that email for
registration returns a duplicate-email error; log in with the existing account.

### Environment settings

- `DATABASE_URL`: required PostgreSQL URL; use a different database for each suite.
- `PORT`: server port, defaults to 4000; E2E uses 4001.
- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`: token signing secrets. Local
  examples are included; use private, strong values for deployed environments.
- `API_PROXY_TARGET`: optional Vite proxy target, defaults to http://localhost:4000.
  Playwright sets it to http://127.0.0.1:4001 for its managed client server.
- `CI`: when set by CI, Playwright forbids focused tests and enables retries.
- `NODE_USE_SYSTEM_CA=1`: lets Node/npm trust certificates from the operating
  system, including a locally installed organizational certificate.

`.env`, `.env.test`, and `.env.e2e` are ignored by Git. Copy the supplied examples
for local development; do not commit private environment files.

## Running the tests

### Server unit and integration tests

Create an isolated integration-test container once (or use
`docker start inkwell-workshop13-db` if it exists):

```bash
docker run -d --name inkwell-workshop13-db \
  -e POSTGRES_USER=inkwell -e POSTGRES_PASSWORD=inkwell \
  -e POSTGRES_DB=inkwell_test -p 127.0.0.1:55433:5432 postgres:17
```

Wait for `docker exec inkwell-workshop13-db pg_isready -U inkwell -d inkwell_test`
to report ready. From the repository root:

```bash
cd server
cp .env.test.example .env.test
DATABASE_URL="postgresql://inkwell:inkwell@localhost:55433/inkwell_test" npx prisma migrate deploy
npm test
```

Expected: 15 passing tests in 3 Jest suites. Integration tests delete fixture data
only in `inkwell_test`. The separate `server/test` file uses Node's test runner
and is not discovered by Jest.

### Client component tests and production build

From the repository root:

```bash
cd client
npm test
npm run build
```

Expected: 1 passing component test and a successful production build.

### Browser E2E and accessibility tests

Create an isolated E2E container once (or use `docker start inkwell-e2e-db`
if it exists):

```bash
docker run -d --name inkwell-e2e-db \
  -e POSTGRES_USER=inkwell -e POSTGRES_PASSWORD=inkwell \
  -e POSTGRES_DB=inkwell_e2e -p 127.0.0.1:55434:5432 postgres:17
```

Wait for `docker exec inkwell-e2e-db pg_isready -U inkwell -d inkwell_e2e`
to report ready. From the repository root:

```bash
cp server/.env.e2e.example server/.env.e2e
cd server
DATABASE_URL="postgresql://inkwell:inkwell@localhost:55434/inkwell_e2e" npx prisma migrate deploy
cd ..
npx playwright install --with-deps
npm run test:e2e
```

Playwright starts and stops its own API (4001) and client (5174); leave those ports
free. It does not reuse development servers. The suite runs the same publishing
journey at mobile, tablet, and desktop viewport sizes in Chromium, Firefox, and
WebKit, plus a feed accessibility scan in each browser: **12 tests total**.
One worker runs the tests sequentially to limit local browser memory usage.
Accounts and titles use unique IDs, so repeat runs do not collide. E2E data stays
in `inkwell_e2e`; these tests never reset the development or integration database.

To inspect the HTML report after a run:

```bash
npx playwright show-report
```

Reports, traces, and screenshots are ignored by Git. Automated axe scans catch
some accessibility defects; manual keyboard and accessibility reviews remain
necessary. See [README verification](docs/quality/README-VERIFICATION.md).

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
npx prisma migrate deploy
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
