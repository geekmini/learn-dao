import { useState, useEffect, useCallback, useRef } from 'react'
import type { UIMessage } from 'ai'
import { supabase } from '../lib/supabase'

export function useSupabaseChatHistory(cardId: string, userId: string | undefined) {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [isLoading, setIsLoading] = useState(!!userId)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => clearTimeout(debounceRef.current)
  }, [])

  useEffect(() => {
    if (!userId) return

    let cancelled = false
    supabase
      .from('chat_messages')
      .select('messages')
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (data?.messages) {
          setMessages(data.messages as UIMessage[])
        } else if (!error || error.code === 'PGRST116') {
          setMessages([])
        }
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [userId, cardId])

  const saveMessages = useCallback(
    (newMessages: UIMessage[]) => {
      setMessages(newMessages)

      if (!userId) return

      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        supabase
          .from('chat_messages')
          .upsert(
            {
              user_id: userId,
              card_id: cardId,
              messages: newMessages as unknown as Record<string, unknown>[],
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,card_id' },
          )
          .then(({ error }) => {
            if (error) console.error('Failed to save chat history:', error)
          })
      }, 500)
    },
    [userId, cardId],
  )

  const clearMessages = useCallback(() => {
    setMessages([])

    if (!userId) return

    supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId)
      .eq('card_id', cardId)
      .then(({ error }) => {
        if (error) console.error('Failed to clear chat history:', error)
      })
  }, [userId, cardId])

  const hasHistory = messages.length > 0

  return { messages, saveMessages, clearMessages, hasHistory, isLoading } as const
}
