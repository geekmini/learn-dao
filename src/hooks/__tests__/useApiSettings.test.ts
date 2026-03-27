import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApiSettings } from '../useApiSettings'

beforeEach(() => {
  localStorage.clear()
})

describe('useApiSettings', () => {
  it('returns default settings when nothing stored', () => {
    const { result } = renderHook(() => useApiSettings())
    expect(result.current.settings.apiKey).toBe('')
    expect(result.current.settings.model).toBe('claude-sonnet-4-6')
    expect(result.current.isConfigured).toBe(false)
  })

  it('reports isConfigured when apiKey is set', () => {
    const { result } = renderHook(() => useApiSettings())

    act(() => {
      result.current.updateSettings({ apiKey: 'sk-ant-test' })
    })

    expect(result.current.isConfigured).toBe(true)
    expect(result.current.settings.apiKey).toBe('sk-ant-test')
  })

  it('partially updates settings without overwriting other fields', () => {
    const { result } = renderHook(() => useApiSettings())

    act(() => {
      result.current.updateSettings({ apiKey: 'sk-ant-test' })
    })

    act(() => {
      result.current.updateSettings({ model: 'claude-opus-4-20250514' })
    })

    expect(result.current.settings.apiKey).toBe('sk-ant-test')
    expect(result.current.settings.model).toBe('claude-opus-4-20250514')
  })

  it('persists settings across hook re-renders', () => {
    const { result, rerender } = renderHook(() => useApiSettings())

    act(() => {
      result.current.updateSettings({ apiKey: 'sk-ant-persist' })
    })

    rerender()
    expect(result.current.settings.apiKey).toBe('sk-ant-persist')
  })
})
