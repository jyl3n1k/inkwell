# Inkwell Server Module Structure — v1

## Routes / Controllers

- Receive HTTP requests.
- Call the appropriate service.
- Return HTTP responses.
- Never query Prisma or the database directly.

## Services

### AuthService

Responsible for:

- Password hashing
- Password verification
- Token issuance

### PostService

Responsible for:

- Post business rules
- Ownership checks
- Draft and published state transitions

## Repositories

### UserRepository

Saves and retrieves users through Prisma.

### PostRepository

Saves and retrieves posts through Prisma.

Repositories are the only modules that communicate directly with Prisma and PostgreSQL.

## Dependency flow

```text
Routes -> AuthService -> UserRepository -> PostgreSQL
Routes -> PostService -> PostRepository -> PostgreSQL
```

Modules pass simple data objects to each other and do not depend on another module's internal implementation details.
