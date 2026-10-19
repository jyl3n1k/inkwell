# Workshop 12: Unit Testing

## PostService.search() test-case design

| # | Technique | Input | Expected outcome |
|---|-----------|-------|------------------|
| S1 | Black-box: valid matching query; default pagination | query: "Hello"; repository returns one match | Returns the match, hasMore: false, and page: 1; uses pageSize: 10 |
| S2 | Black-box: no-match equivalence partition | query: "no-match"; repository returns no matches | Returns posts: [], hasMore: false, and page: 1 |
| S3 | Black-box: pagination boundary, pageSize of 1 | query: "post", page: 2, pageSize: 1; repository returns one result and hasMore: true | Uses the supplied pagination and returns page: 2 with hasMore: true |
| S4 | White-box: rejected dependency promise through the awaited strategy call | Repository rejects with Error("Search unavailable") | Search rejects with the same error |

## Implementation

- AuthService.register(): six tests from the workshop.
- PostService.publish(): two tests from the workshop.
- PostService.search(): four tests corresponding to the table above.
- Repository, token-service, and event-bus dependencies use Jest test doubles.
- Search tests exercise the real SubstringSearchStrategy with a mocked repository.
- No real database is used.

## Design decisions

- Jest runs with --experimental-vm-modules because the server uses ES modules.
- Small handwritten test doubles keep service tests isolated and simple.
- Publishing is checked for both the published state and its event.
- Search tests follow the current implementation, which delegates queries
  without adding query or pagination validation.

## Verification

Run `cd server && npm test` from the repository root.
Expected result: two passing test suites and twelve passing tests.
