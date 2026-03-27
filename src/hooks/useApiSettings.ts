import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export interface ApiSettings {
  apiKey: string
  model: string
}

const DEFAULT_SETTINGS: ApiSettings = {
  apiKey: '',
  model: 'claude-sonnet-4-6',
}

const STORAGE_KEY = 'learn-dao-api-settings'

export function useApiSettings() {
  const [settings, setSettings] = useLocalStorage<ApiSettings>(
    STORAGE_KEY,
    DEFAULT_SETTINGS,
  )

  const updateSettings = useCallback(
    (patch: Partial<ApiSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }))
    },
    [setSettings],
  )

  const isConfigured = settings.apiKey.length > 0

  return { settings, updateSettings, isConfigured } as const
}
