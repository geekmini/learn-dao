import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useMemo } from 'react'
import { buildSystemPrompt, type WeekCard } from '../data/curriculum'
import { useSupabaseChatHistory } from './useSupabaseChatHistory'
import { useAuth } from '../contexts/AuthContext'
import type { ApiSettings } from './useApiSettings'
import type { Session } from '@supabase/supabase-js'

export function useCurriculumChat(cardId: string, card: WeekCard, apiSettings: ApiSettings, session: Session | null) {
  const { user } = useAuth()
  const { messages: savedMessages, saveMessages, clearMessages, hasHistory } =
    useSupabaseChatHistory(cardId, user?.id)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: {
          systemPrompt: buildSystemPrompt(cardId),
          apiKey: apiSettings.apiKey,
          model: apiSettings.model,
          authToken: session?.access_token ?? '',
        },
      }),
    [cardId, apiSettings.apiKey, apiSettings.model, session?.access_token],
  )

  const chat = useChat({
    id: `chat-${cardId}`,
    messages: savedMessages.length > 0 ? savedMessages : undefined,
    transport,
  })

  const prevMessagesRef = useRef(chat.messages)
  const hasTriggeredInit = useRef(false)

  useEffect(() => {
    if (
      !hasTriggeredInit.current &&
      savedMessages.length === 0 &&
      chat.messages.length === 0 &&
      chat.status === 'ready'
    ) {
      hasTriggeredInit.current = true
      const topicPrompt = `请根据「${card.label} · ${card.focus}」的学习内容（${card.items.join('、')}），给我推荐 3-4 个可以深入探讨的话题，每个话题用一句话简要描述。我会选择感兴趣的话题展开。`
      chat.sendMessage({ text: topicPrompt })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedMessages.length, chat.messages.length, chat.status, chat.sendMessage, card])

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
