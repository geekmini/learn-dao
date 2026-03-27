## Coding Conventions

- Extract business logic into custom React hooks (`src/hooks/`)
- Add unit tests for all custom hooks (`src/hooks/__tests__/`)
- Use vitest + @testing-library/react for hook testing
- Keep components thin — they render UI, hooks handle logic
- All text content is in Chinese

## E2E Testing Conventions

- Use Playwright for e2e tests (`e2e/`)
- BDD-style structure: `describe('Feature: ...')` > `describe('Scenario: ...')` > `test()`
- Feature names and scenario names in Chinese
- Page Object Model pattern (`e2e/pages/`) for reusable page interactions
- Feature test files in `e2e/features/` named `<feature>.spec.ts`
- Mock external APIs (e.g. `/api/chat`) in tests that involve network calls

## Integration Testing Conventions

- Integration tests for API handlers live in `src/api/__tests__/`
- Use `dotenv` to load `.env` for API keys
- Guard real API tests with `const describeIfApiKey = API_KEY ? describe : describe.skip`
- Run with `pnpm test:integration` (separate from unit tests)
- Non-network tests (validation, error handling) should always run
- Real API tests should assert response is non-error, not just non-empty

## Test Scripts

- `pnpm test` — unit tests only (hooks)
- `pnpm test:integration` — API handler tests (real API requires `.env`)
- `pnpm test:e2e` — Playwright browser tests
