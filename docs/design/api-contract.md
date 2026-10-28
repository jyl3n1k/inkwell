# Inkwell API Contract — v1

All errors use this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "A clear explanation"
  }
}
```

## POST /api/auth/register

Request:

```json
{
  "email": "user@example.com",
  "displayName": "Example User",
  "password": "example-password"
}
```

Success:

- Status: 201 Created
- Body: `{ user: UserPublic, accessToken: string, refreshToken: string }`

Errors:

- 400 `EMAIL_ALREADY_REGISTERED` — "This email is already registered."
- 400 `WEAK_PASSWORD` — "Password does not meet strength requirements."

## POST /api/auth/login

Request:

```json
{
  "email": "user@example.com",
  "password": "example-password"
}
```

Success:

- Status: 200 OK
- Body: `{ user: UserPublic, accessToken: string, refreshToken: string }`

Errors:

- 401 `INVALID_CREDENTIALS` — "Invalid email or password."

## Workshop 15 authentication throttling

Login and registration share a per-IP limit of five requests per ten minutes.
Further requests return HTTP 429 with code `TOO_MANY_ATTEMPTS` and a `Retry-After` header.

## GET /api/posts?page=n&pageSize=10&search=term

Query parameters:

- `page`: positive integer, default 1.
- `pageSize`: integer from 1 to 100, default 10. Invalid or oversized values return HTTP 400 with code `INVALID_PAGE_SIZE`.
- `search`: optional search text; the same pagination bounds apply to search results.

Post authors in both feed and search contain only `id` and `displayName`.


Success:

- Status: 200 OK
- Body: `{ posts: PostPublic[], page: number, hasMore: boolean }`

## POST /api/posts/:id/comments

Creates a comment on the post identified by `:id`. The authenticated user becomes the comment's author.

Request:

```json
{
  "body": "This is a comment."
}
```

Success:

- Status: 201 Created
- Body: `{ comment: CommentPublic }`

Errors:

- 400 `EMPTY_COMMENT` — "Comment body cannot be empty."
- 401 `AUTHENTICATION_REQUIRED` — "You must be logged in to comment."
- 404 `POST_NOT_FOUND` — "The requested post was not found."
