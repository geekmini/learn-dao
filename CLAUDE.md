# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                # Vite dev server (port 5173, proxies /api to localhost:3000)
pnpm build              # tsc -b && vite build → dist/
pnpm test               # Unit tests (vitest, excludes integration)
pnpm test:integration   # API handler tests (requires ANTHROPIC_API_KEY in .env)
pnpm test:e2e           # Playwright e2e tests (auto-starts dev server)
pnpm test:e2e:ui        # Playwright with UI dashboard
pnpm lint:check         # ESLint check
pnpm lint:fix           # ESLint auto-fix
```

Run a single test file: `pnpm exec vitest run src/hooks/__tests__/useLocalStorage.test.ts`
Run a single e2e spec: `pnpm exec playwright test e2e/features/chat.spec.ts`

## Architecture

**Vite + React 19 + TypeScript SPA** with a Vercel serverless API route for AI chat.

### Data flow

`curriculum.ts` (typed data) → `App.tsx` (renders phases/cards) → user clicks chat button → `ChatModal` opens → `useCurriculumChat` hook creates a `DefaultChatTransport` pointing to `/api/chat` → Vercel serverless function streams response from Anthropic API using user-provided API key.

### Key layers

- **`src/data/curriculum.ts`** — All curriculum content as typed data. `buildSystemPrompt(cardId)` generates the AI system prompt with full curriculum context + focused card.
- **`src/hooks/`** — All business logic. `useCurriculumChat` orchestrates the AI SDK `useChat` hook with localStorage persistence via `useChatHistory` and `useApiSettings`.
- **`src/components/`** — Thin presentational components (ChatModal, SettingsModal, ChatButton).
- **`api/chat.ts`** — Vercel serverless function. Receives `{messages, systemPrompt, apiKey, model}`, creates an Anthropic client with the user's key, streams via `streamText()`.

### AI SDK (v6)

Uses Vercel AI SDK v6 which has breaking changes from v2:
- Messages use `UIMessage` type with `.parts[]` array (not `.content` string)
- `useChat` returns `sendMessage({text})` and `status` (not `handleSubmit`/`isLoading`)
- Transport via `new DefaultChatTransport({api, body})` (not `{api}` option)
- Server returns `result.toUIMessageStreamResponse()` (not `toDataStreamResponse`)

### Deployment

Configured for Vercel (`vercel.json`): SPA rewrites + `api/` serverless functions on Node.js 20.x. API key is provided by the user client-side, not stored server-side.

## Testing structure

- **Unit tests** (`src/hooks/__tests__/`) — vitest + @testing-library/react, jsdom environment
- **Integration tests** (`src/api/__tests__/`) — test API handler directly; real API calls guarded by `ANTHROPIC_API_KEY` env var from `.env`
- **E2E tests** (`e2e/features/`) — Playwright, BDD-style (`Feature > Scenario > test`), Page Object Model in `e2e/pages/`, feature/scenario names in Chinese
