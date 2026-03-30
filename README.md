# Learn DAO

A Daoist cultivation curriculum learning platform with a built-in AI study assistant.

## Tech Stack

- Vite + React 19 + TypeScript
- Vercel Serverless Functions (API)
- Supabase (Auth + Database)
- Vercel AI SDK v6 + Anthropic Claude

## Prerequisites

### 1. Install System Dependencies

```bash
brew bundle
```

Or install manually:

```bash
brew install node@22 pnpm go-task vercel-cli
```

### 2. Install Project Dependencies

```bash
task setup
```

### 3. Configure Environment Variables

Copy `.env.example` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `VITE_SUPABASE_URL` | Frontend Supabase connection | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Frontend Supabase anon key | Same as above |
| `SUPABASE_URL` | Server-side Supabase connection | Same as `VITE_SUPABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side JWT verification | Supabase Dashboard → Settings → API → service_role (secret) |

### 4. Supabase Setup

- Enable **Google** OAuth in Supabase Dashboard → Authentication → Providers
- Create an OAuth client in Google Cloud Console with redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`

## Development

```bash
task dev        # Start local dev server (Vite + API)
task build      # Build for production
task lint       # ESLint check
task lint:fix   # ESLint auto-fix
```

## Testing

```bash
task test            # Unit tests
task test:integration # API integration tests (requires API key in .env)
task test:e2e        # Playwright end-to-end tests
task test:all        # Run all tests
```
