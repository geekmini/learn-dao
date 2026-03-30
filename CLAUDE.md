# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
task setup              # Install all dependencies (pnpm + playwright)
task dev                # Vite (port 5173) + API server (port 3000) via concurrently
task build              # tsc -b && vite build → dist/
task test               # Unit tests (vitest, excludes integration)
task test:integration   # API handler tests (requires ANTHROPIC_API_KEY in .env)
task test:e2e           # Playwright e2e tests (auto-starts dev server)
task test:e2e:ui        # Playwright with UI dashboard
task test:all           # Run all tests (unit + integration + e2e)
task lint               # ESLint check
task lint:fix           # ESLint auto-fix
```

Run a single test file: `pnpm exec vitest run src/hooks/__tests__/useLocalStorage.test.ts`
Run a single e2e spec: `pnpm exec playwright test e2e/features/chat.spec.ts`

### Environment variables

- `.env.local` — Frontend vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) + server vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- `.env` — Used by `dev-api.ts` (via dotenv) and integration tests (via env-cmd). Also reads `.env.local` via dotenv chain.
- `.env.example` — Template with comments; copy to `.env.local`

## Architecture

**Vite + React 19 + TypeScript SPA** with a Vercel serverless API route for AI chat.

### Data flow

`curriculum.ts` (typed data) → `App.tsx` (renders phases/cards) → user clicks chat button → `ChatModal` opens → `useCurriculumChat` hook creates a `DefaultChatTransport` pointing to `/api/chat` → Vercel serverless function streams response from Anthropic API using user-provided API key.

### Key layers

- **`src/data/curriculum.ts`** — All curriculum content as typed data. `buildSystemPrompt(cardId)` generates the AI system prompt with full curriculum context + focused card.
- **`src/contexts/AuthContext.tsx`** — Supabase Auth provider (Google OAuth). Exports `AuthProvider` + `useAuth()` hook.
- **`src/hooks/`** — All business logic. `useCurriculumChat` orchestrates the AI SDK `useChat` hook with Supabase persistence via `useSupabaseChatHistory` and `useUserSettings`.
- **`src/hooks/useUserSettings.ts`** — Supabase-backed API key + model storage (replaces `useApiSettings`).
- **`src/hooks/useSupabaseChatHistory.ts`** — Supabase-backed chat history per card (replaces `useChatHistory`).
- **`src/lib/supabase.ts`** — Singleton Supabase client initialized from `VITE_SUPABASE_*` env vars.
- **`src/components/`** — Thin presentational components (ChatModal, SettingsModal, ChatButton).
- **`src/components/auth/`** — LoginButton, UserMenu (avatar + dropdown), LoginPromptModal.
- **`api/chat.ts`** — Vercel serverless function. Verifies JWT via Supabase service role client, then streams Anthropic response.

### AI SDK (v6)

Uses Vercel AI SDK v6 which has breaking changes from v2:
- Messages use `UIMessage` type with `.parts[]` array (not `.content` string)
- `useChat` returns `sendMessage({text})` and `status` (not `handleSubmit`/`isLoading`)
- Transport via `new DefaultChatTransport({api, body})` (not `{api}` option)
- Server returns `result.toUIMessageStreamResponse()` (not `toDataStreamResponse`)

### Auth flow

Google OAuth via Supabase → `AuthContext` manages session → `useUserSettings` and `useSupabaseChatHistory` query Supabase with RLS (row-level security) scoped to `auth.uid()`. Curriculum is publicly browsable; only AI chat requires login. `api/chat.ts` receives `authToken` in POST body and verifies server-side.

### Deployment

Configured for Vercel (`vercel.json`): SPA rewrites + `api/` serverless functions on Node.js 20.x. Requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` env vars in Vercel project settings.

## Testing structure

- **Unit tests** (`src/hooks/__tests__/`) — vitest + @testing-library/react, jsdom environment
- **Integration tests** (`src/api/__tests__/`) — test API handler directly; real API calls guarded by `ANTHROPIC_API_KEY` env var from `.env`
- **E2E tests** (`e2e/features/`) — Playwright, BDD-style (`Feature > Scenario > test`), Page Object Model in `e2e/pages/`, feature/scenario names in Chinese

## Gotchas

- Use `.maybeSingle()` not `.single()` for Supabase queries that may return 0 rows (PostgREST returns 406 with `.single()`)
- `react-hooks/set-state-in-effect` lint rule: don't call `setState` directly in `useEffect` body; use initial state or move to `.then()` callback
- `react-refresh/only-export-components`: context files exporting both Provider + hook need `// eslint-disable-next-line`
- `dev-api.ts` loads `.env.local` then `.env` via dotenv chain
