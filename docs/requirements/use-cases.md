# Inkwell Use Cases

## US-01: Register Account

### Overview

- **Primary Actor:** Visitor
- **Preconditions:** The visitor does not already have an account using the submitted email address.
- **Postconditions:** A verified user account exists and the user can log in.

### Main Success Scenario

1. The visitor enters an email address, display name, and password.
2. The system validates the submitted information.
3. The system confirms that the email address is not already registered.
4. The system securely hashes the password.
5. The system creates the account.
6. The system sends the user an account-verification message.
7. The user verifies the account.

### Extensions

- **2a.** The password does not meet the security requirements: the system explains the requirements and does not create the account.
- **3a.** The email address is already registered: the system displays a general registration error without revealing account details.
- **6a.** The verification message cannot be sent: the account remains unverified and the user can request another message.

---

## US-02: Log In

### Overview

- **Primary Actor:** Registered user
- **Preconditions:** The user has a registered, verified account.
- **Postconditions:** The user holds a valid access token and refresh token, and subsequent requests are authenticated.

### Main Success Scenario

1. The user submits an email address and password.
2. The system verifies the credentials against the stored password hash.
3. The system issues a new access token and refresh token pair.
4. The client stores the refresh token securely and attaches the access token to later requests.

### Extensions

- **2a.** The credentials do not match: the system returns a general "invalid email or password" error.
- **2b.** The account is not verified: the system rejects the login and offers to resend the verification message.
- **3a.** Refresh-token creation fails: the system does not issue either token.

---

## US-03: Publish Post

### Overview

- **Primary Actor:** Author
- **Preconditions:** The author is authenticated.
- **Postconditions:** A post exists in the Published state and is visible on the public feed and the author's profile.

### Main Success Scenario

1. The author creates a draft with a title and body.
2. The client periodically autosaves the draft in local component state.
3. The author selects Publish.
4. The system verifies that the title and body are not empty.
5. The system changes the post to Published and records the publication time.
6. The post appears on the public feed and the author's profile.

### Extensions

- **1a.** The author navigates away while writing: the latest locally autosaved version is retained during the current session.
- **3a.** The user is not the owner of the post: the system rejects the request with an authorization error.
- **4a.** The title or body is empty: the system rejects the request and keeps the post as a draft.

### Negotiated MVP Scope

The first editor will provide plain-text title and body fields, manual publishing, and local component-state autosaving. Rich-text formatting, server-persisted draft recovery, and image uploads are deferred.

---

## US-04: Browse Feed

### Overview

- **Primary Actor:** Reader, either authenticated or visiting
- **Preconditions:** None
- **Postconditions:** The reader sees published posts ordered from newest to oldest.

### Main Success Scenario

1. The reader opens the public feed.
2. The system retrieves published posts ordered by publication date in fixed-size pages.
3. The reader views the posts.
4. The reader may request the next page.

### Extensions

- **2a.** No published posts exist: the system displays a clear empty-feed message.
- **2b.** The requested page is beyond the available posts: the system returns an empty page instead of an error.
