import { useCallback } from 'react'
import type { UIMessage } from 'ai'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY_PREFIX = 'learn-dao-chat-'

export function useChatHistory(cardId: string) {
  const [messages, setMessages] = useLocalStorage<UIMessage[]>(
    `${STORAGE_KEY_PREFIX}${cardId}`,
    [],
  )

  const saveMessages = useCallback(
    (newMessages: UIMessage[]) => {
      setMessages(newMessages)
    },
    [setMessages],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [setMessages])

  const hasHistory = messages.length > 0

  return { messages, saveMessages, clearMessages, hasHistory } as const
}
