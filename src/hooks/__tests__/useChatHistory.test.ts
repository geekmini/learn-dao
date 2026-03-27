import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChatHistory } from '../useChatHistory'
import type { UIMessage } from 'ai'

beforeEach(() => {
  localStorage.clear()
})

const mockMessages: UIMessage[] = [
  { id: '1', role: 'user', parts: [{ type: 'text', text: '什么是道？' }] },
  { id: '2', role: 'assistant', parts: [{ type: 'text', text: '道可道，非常道。' }] },
]

describe('useChatHistory', () => {
  it('returns empty messages for new card', () => {
    const { result } = renderHook(() => useChatHistory('week-1'))
    expect(result.current.messages).toEqual([])
    expect(result.current.hasHistory).toBe(false)
  })

  it('saves and retrieves messages', () => {
    const { result } = renderHook(() => useChatHistory('week-1'))

    act(() => {
      result.current.saveMessages(mockMessages)
    })

    expect(result.current.messages).toEqual(mockMessages)
    expect(result.current.hasHistory).toBe(true)
  })

  it('clears messages', () => {
    const { result } = renderHook(() => useChatHistory('week-1'))

    act(() => {
      result.current.saveMessages(mockMessages)
    })

    act(() => {
      result.current.clearMessages()
    })

    expect(result.current.messages).toEqual([])
    expect(result.current.hasHistory).toBe(false)
  })

  it('isolates history between different cards', () => {
    const { result: result1 } = renderHook(() => useChatHistory('week-1'))
    const { result: result2 } = renderHook(() => useChatHistory('week-2'))

    act(() => {
      result1.current.saveMessages(mockMessages)
    })

    expect(result1.current.hasHistory).toBe(true)
    expect(result2.current.hasHistory).toBe(false)
  })

  it('persists across hook re-renders', () => {
    const { result, rerender } = renderHook(() => useChatHistory('week-1'))

    act(() => {
      result.current.saveMessages(mockMessages)
    })

    rerender()
    expect(result.current.messages).toEqual(mockMessages)
  })
})
