import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useMemo } from 'react'
import { buildSystemPrompt } from '../data/curriculum'
import { useChatHistory } from './useChatHistory'
import type { ApiSettings } from './useApiSettings'

export function useCurriculumChat(cardId: string, apiSettings: ApiSettings) {
  const { messages: savedMessages, saveMessages, clearMessages, hasHistory } =
    useChatHistory(cardId)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          systemPrompt: buildSystemPrompt(cardId),
          apiKey: apiSettings.apiKey,
          model: apiSettings.model,
        },
      }),
    [cardId, apiSettings.apiKey, apiSettings.model],
  )

  const chat = useChat({
    id: `chat-${cardId}`,
    messages: savedMessages.length > 0 ? savedMessages : undefined,
    transport,
  })

  const prevMessagesRef = useRef(chat.messages)

  useEffect(() => {
    if (
      chat.messages !== prevMessagesRef.current &&
      chat.messages.length > 0 &&
      chat.status === 'ready'
    ) {
      saveMessages(chat.messages)
    }
    prevMessagesRef.current = chat.messages
  }, [chat.messages, chat.status, saveMessages])

  const clearChat = () => {
    chat.setMessages([])
    clearMessages()
  }

  const isLoading = chat.status === 'submitted' || chat.status === 'streaming'

  return {
    messages: chat.messages,
    sendMessage: chat.sendMessage,
    status: chat.status,
    isLoading,
    error: chat.error,
    clearChat,
    hasHistory,
  } as const
}
