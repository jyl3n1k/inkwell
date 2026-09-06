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

## GET /api/posts?page=n

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
