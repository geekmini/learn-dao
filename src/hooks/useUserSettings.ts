import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ApiSettings } from './useApiSettings'

const DEFAULT_SETTINGS: ApiSettings = {
  apiKey: '',
  model: 'claude-sonnet-4-6',
}

export function useUserSettings(userId: string | undefined) {
  const [settings, setSettings] = useState<ApiSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(!!userId)

  useEffect(() => {
    if (!userId) return

    let cancelled = false
    supabase
      .from('user_settings')
      .select('api_key, model')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (data) {
          setSettings({ apiKey: data.api_key, model: data.model })
        } else if (!error || error.code === 'PGRST116') {
          setSettings(DEFAULT_SETTINGS)
        }
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [userId])

  const updateSettings = useCallback(
    (patch: Partial<ApiSettings>) => {
      if (!userId) return

      setSettings((prev) => {
        const next = { ...prev, ...patch }

        supabase.from('user_settings').upsert({
          user_id: userId,
          api_key: next.apiKey,
          model: next.model,
          updated_at: new Date().toISOString(),
        }).then(({ error }) => {
          if (error) console.error('Failed to save settings:', error)
        })

        return next
      })
    },
    [userId],
  )

  const isConfigured = settings.apiKey.length > 0

  return { settings, updateSettings, isConfigured, isLoading } as const
}
