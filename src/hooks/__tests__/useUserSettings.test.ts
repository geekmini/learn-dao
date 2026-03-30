import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

const mockFrom = vi.fn()
const mockUpsert = vi.fn(() => Promise.resolve({ error: null }))
const mockSingle = vi.fn()

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => {
      mockFrom(...args)
      return {
        select: () => ({
          eq: () => ({
            single: () => mockSingle(),
          }),
        }),
        upsert: (...upsertArgs: unknown[]) => ({
          then: (cb: (val: { error: null }) => void) => {
            mockUpsert(...upsertArgs)
            cb({ error: null })
          },
        }),
      }
    },
  },
}))

import { useUserSettings } from '../useUserSettings'

beforeEach(() => {
  vi.clearAllMocks()
  mockSingle.mockResolvedValue({ data: null, error: null })
})

describe('useUserSettings', () => {
  it('returns default settings when no userId', () => {
    const { result } = renderHook(() => useUserSettings(undefined))
    expect(result.current.settings.apiKey).toBe('')
    expect(result.current.settings.model).toBe('claude-sonnet-4-6')
    expect(result.current.isConfigured).toBe(false)
  })

  it('loads settings from Supabase for authenticated user', async () => {
    mockSingle.mockResolvedValue({
      data: { api_key: 'sk-ant-test', model: 'claude-opus-4-6' },
      error: null,
    })

    const { result } = renderHook(() => useUserSettings('user-123'))

    await waitFor(() => {
      expect(result.current.settings.apiKey).toBe('sk-ant-test')
    })
    expect(result.current.settings.model).toBe('claude-opus-4-6')
    expect(result.current.isConfigured).toBe(true)
  })

  it('returns defaults when no row exists in Supabase', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: 'PGRST116' } })

    const { result } = renderHook(() => useUserSettings('user-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.settings.apiKey).toBe('')
    expect(result.current.isConfigured).toBe(false)
  })

  it('optimistically updates settings and upserts to Supabase', async () => {
    mockSingle.mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useUserSettings('user-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.updateSettings({ apiKey: 'sk-ant-new' })
    })

    expect(result.current.settings.apiKey).toBe('sk-ant-new')
    expect(result.current.isConfigured).toBe(true)
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        api_key: 'sk-ant-new',
      }),
    )
  })

  it('partially updates without overwriting other fields', async () => {
    mockSingle.mockResolvedValue({
      data: { api_key: 'sk-ant-existing', model: 'claude-sonnet-4-6' },
      error: null,
    })

    const { result } = renderHook(() => useUserSettings('user-123'))

    await waitFor(() => {
      expect(result.current.settings.apiKey).toBe('sk-ant-existing')
    })

    act(() => {
      result.current.updateSettings({ model: 'claude-opus-4-6' })
    })

    expect(result.current.settings.apiKey).toBe('sk-ant-existing')
    expect(result.current.settings.model).toBe('claude-opus-4-6')
  })
})
