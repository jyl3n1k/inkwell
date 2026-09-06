# ADR-001: Use a Modular Monolith with a Three-Tier Client-Server Architecture

**Status:** Accepted

## Context

Inkwell is a one-semester course project built incrementally by a small team. It uses React, Express, PostgreSQL, and Prisma.

The architecture must:

- Be straightforward to build and maintain.
- Support gradual development.
- Avoid unnecessary operational complexity.
- Allow future growth if the application expands.

## Decision

Inkwell will use a three-tier client-server architecture:

- **Presentation tier:** React single-page application.
- **Logic tier:** One Express server organized as a modular monolith.
- **Data tier:** PostgreSQL accessed through Prisma.

The Express server uses these layers:

```text
Routes -> Services -> Repositories
```

Only the Repository layer may access the database through Prisma.

The client and server can be deployed separately, but the server remains one deployable application.

## Alternatives Considered

### Microservices

Rejected because microservices add unnecessary development and operational complexity. Their independent-scaling benefits are not currently needed for a project of this size.

### Server-rendered Monolith

Rejected because it would generate pages on the server and would not follow the separate client-server architecture established for Inkwell.

### Pipe-and-Filter or Event-Driven Architecture

Rejected as the primary architecture because Inkwell mainly handles HTTP requests and responses rather than data-processing pipelines.

Event-driven techniques may still be used for individual features, such as notifying followers when a post is published.

## Consequences

### Positive

- Supports fast, incremental development.
- Keeps responsibilities clearly organized.
- Makes the application easier to understand and maintain.
- Allows individual features to be separated into services later if necessary.

### Negative

- The Express server is a single deployment.
- If the server stops working, all API features become unavailable.
- This tradeoff is acceptable for the project's current size.
- The decision may be revisited if higher availability becomes necessary.
