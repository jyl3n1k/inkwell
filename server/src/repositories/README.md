# Repository Layer

Repositories are the only modules permitted to import from `@prisma/client` or execute raw SQL.

The server follows this dependency flow:

```text
Routes -> Services -> Repositories -> PostgreSQL
```

Architecture rules:

- Routes receive HTTP requests and call services.
- Services apply business rules and call repositories.
- Repositories access the database through Prisma.
- Routes and services must not import Prisma directly.
- A layer must not skip another layer or call a higher layer.

These rules implement the architecture established by ADR-001. Automated enforcement will be added later in the project.
