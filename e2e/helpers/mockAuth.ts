import type { Page } from '@playwright/test'
import { mockSupabaseRequests } from './mockSupabase'

const SUPABASE_PROJECT_REF = 'ygheauzirsxihpeyrfpr'

const MOCK_USER = {
  id: 'e2e-test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: '测试用户',
    avatar_url: '',
  },
}

/**
 * Injects a fake Supabase session into localStorage before the page loads,
 * and mocks Supabase REST/auth endpoints so the app believes the user is logged in.
 */
export async function mockAuthenticatedUser(page: Page) {
  await mockSupabaseRequests(page)

  // Override user_settings to return configured API key
  await page.route(`https://${SUPABASE_PROJECT_REF}.supabase.co/rest/v1/user_settings**`, async (route) => {
    const method = route.request().method()
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ api_key: 'sk-ant-e2e-test', model: 'claude-sonnet-4-6' }),
      })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    }
  })

  // Inject fake session into localStorage before page loads
  await page.addInitScript(
    ({ projectRef, user }) => {
      const session = {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'mock-refresh-token',
        user,
      }
      window.localStorage.setItem(
        `sb-${projectRef}-auth-token`,
        JSON.stringify(session),
      )
    },
    { projectRef: SUPABASE_PROJECT_REF, user: MOCK_USER },
  )
}
