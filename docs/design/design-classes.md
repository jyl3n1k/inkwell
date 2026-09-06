# Inkwell Design Classes — v1

## User (entity)

- id: string
- email: string (unique)
- displayName: string
- passwordHash: string
- isVerified: boolean
- createdAt: DateTime

## Post (entity)

- id: string
- authorId: string
- title: string
- body: string
- status: PostStatus (DRAFT | PUBLISHED)
- publishedAt: DateTime | null
- createdAt: DateTime

Methods:

- publish(): void
- isEditableBy(userId: string): boolean

Relationship: User "1" --> "*" Post (authors)

## Design decisions

- Post.status uses fixed values (`DRAFT` and `PUBLISHED`), rather than free text.
- `authorId` is stored directly on Post because each post has exactly one author.
- AuthService owns password hashing and verification so User remains focused on user data.
