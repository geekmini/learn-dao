import type { Page } from '@playwright/test'

const SUPABASE_PROJECT_REF = 'ygheauzirsxihpeyrfpr'

/**
 * Mock all Supabase HTTP requests to prevent real network calls in E2E tests.
 * This should be called in every test to avoid hanging on Supabase requests.
 */
export async function mockSupabaseRequests(page: Page) {
  // Mock all Supabase auth endpoints
  await page.route(`https://${SUPABASE_PROJECT_REF}.supabase.co/auth/v1/**`, async (route) => {
    const url = route.request().url()

    if (url.includes('/token')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: { id: 'mock', email: 'test@test.com', user_metadata: {} },
        }),
      })
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    }
  })

  // Mock all Supabase REST API calls
  await page.route(`https://${SUPABASE_PROJECT_REF}.supabase.co/rest/v1/**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: 'null',
    })
  })

  // Also catch if env var fallback is used (http://localhost)
  await page.route('http://localhost/auth/v1/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
  })
  await page.route('http://localhost/rest/v1/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: 'null' })
  })
}
