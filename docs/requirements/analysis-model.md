# Inkwell Analysis Model

## Model Overview

This diagram shows the four views used to analyze Inkwell's requirements.

```mermaid
graph TD
    UC["Use Cases"] --> Scenario["Scenario-Based Model"]
    UC --> Class["Class-Based Model"]
    UC --> Functional["Functional Model"]
    UC --> Behavioral["Behavioral Model"]
```

---

## Scenario-Based Model

The use-case diagram shows which actors interact with the major Inkwell features.

```mermaid
graph TD
    Visitor((Visitor)) --> UC1[Register Account]
    RegisteredUser((Registered User)) --> UC2[Log In]
    Reader((Reader)) --> UC3[Browse Feed]
    Reader --> UC4[Read Post]
    Author((Author)) --> UC5[Publish Post]
    Author --> UC2
```

---

## Class-Based Model

The domain model identifies the main data entities and their relationships.

```mermaid
classDiagram
    class User {
        +id
        +email
        +displayName
        +passwordHash
        +isVerified
        +createdAt
    }

    class RefreshToken {
        +id
        +tokenHash
        +expiresAt
    }

    class Post {
        +id
        +title
        +body
        +status
        +publishedAt
        +createdAt
    }

    class Comment {
        +id
        +body
        +createdAt
    }

    User "1" --> "*" RefreshToken : holds
    User "1" --> "*" Post : authors
    User "1" --> "*" Comment : writes
    Post "1" --> "*" Comment : has
```

---

## Functional Model

This data-flow diagram shows how registration information moves through the system.

```mermaid
flowchart LR
    Visitor((Visitor)) -->|"registration form data"| Validate["Validate and Create Account"]
    Validate -->|"user record"| UserStore[(User Store)]
    Validate -->|"registration result"| Visitor
```

---

## Behavioral Model

This state diagram shows the possible states and transitions for a post. Archiving is modeled as a future feature and is not part of the current US-03 MVP.

```mermaid
stateDiagram-v2
    [*] --> Draft: author creates post
    Draft --> Draft: author edits
    Draft --> Published: author publishes
    Published --> Published: author edits
    Published --> Archived: future archive action
    Archived --> [*]
```
