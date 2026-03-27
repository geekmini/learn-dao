import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('useLocalStorage', () => {
  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('returns stored value from localStorage', () => {
    localStorage.setItem('key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('stored')
  })

  it('sets value and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(JSON.parse(localStorage.getItem('key')!)).toBe('new-value')
  })

  it('supports updater function', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('removes value from localStorage', () => {
    localStorage.setItem('key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('key', 'default'))

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe('default')
    expect(localStorage.getItem('key')).toBeNull()
  })

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('key', 'not-json')
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('works with complex objects', () => {
    const initial = { a: 1, b: [2, 3] }
    const { result } = renderHook(() => useLocalStorage('obj', initial))

    act(() => {
      result.current[1]({ a: 10, b: [20] })
    })

    expect(result.current[0]).toEqual({ a: 10, b: [20] })
  })
})
