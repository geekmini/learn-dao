import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

const mockUpsert = vi.fn()
const mockDelete = vi.fn()
let singleResult: { data: unknown; error: unknown } = { data: null, error: null }

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve(singleResult),
          }),
        }),
      }),
      upsert: (...args: unknown[]) => {
        mockUpsert(...args)
        return Promise.resolve({ error: null })
      },
      delete: () => ({
        eq: () => ({
          eq: () => {
            mockDelete()
            return Promise.resolve({ error: null })
          },
        }),
      }),
    }),
  },
}))

import { useSupabaseChatHistory } from '../useSupabaseChatHistory'

beforeEach(() => {
  vi.clearAllMocks()
  singleResult = { data: null, error: null }
})

describe('useSupabaseChatHistory', () => {
  it('returns empty messages when no userId', () => {
    const { result } = renderHook(() => useSupabaseChatHistory('week-1', undefined))
    expect(result.current.messages).toEqual([])
    expect(result.current.hasHistory).toBe(false)
  })

  it('loads messages from Supabase', async () => {
    const mockMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'hello' }] },
    ]
    singleResult = { data: { messages: mockMessages }, error: null }

    const { result } = renderHook(() => useSupabaseChatHistory('week-1', 'user-123'))

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(1)
    })
    expect(result.current.hasHistory).toBe(true)
  })

  it('saves messages with debounce', async () => {
    const { result } = renderHook(() => useSupabaseChatHistory('week-1', 'user-123'))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const newMessages = [
      { id: '1', role: 'user' as const, parts: [{ type: 'text' as const, text: 'hello' }], createdAt: new Date() },
    ]

    act(() => {
      result.current.saveMessages(newMessages)
    })

    // Not called yet due to debounce
    expect(mockUpsert).not.toHaveBeenCalled()

    // Wait for debounce
    await new Promise((r) => setTimeout(r, 600))

    expect(mockUpsert).toHaveBeenCalled()
  })

  it('clears messages and deletes from Supabase', async () => {
    singleResult = {
      data: { messages: [{ id: '1', role: 'user', parts: [] }] },
      error: null,
    }

    const { result } = renderHook(() => useSupabaseChatHistory('week-1', 'user-123'))

    await waitFor(() => {
      expect(result.current.hasHistory).toBe(true)
    })

    act(() => {
      result.current.clearMessages()
    })

    expect(result.current.messages).toEqual([])
    expect(result.current.hasHistory).toBe(false)
    expect(mockDelete).toHaveBeenCalled()
  })
})
