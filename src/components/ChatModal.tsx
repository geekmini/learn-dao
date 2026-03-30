import { useRef, useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useCurriculumChat } from '../hooks/useCurriculumChat'
import type { ApiSettings } from '../hooks/useApiSettings'
import type { WeekCard } from '../data/curriculum'
import type { Session } from '@supabase/supabase-js'

interface ChatModalProps {
  card: WeekCard
  apiSettings: ApiSettings
  session: Session | null
  onClose: () => void
}

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text ?? '')
    .join('')
}

export function ChatModal({ card, apiSettings, session, onClose }: ChatModalProps) {
  const {
    messages,
    sendMessage,
    isLoading,
    error,
    clearChat,
  } = useCurriculumChat(card.id, card, apiSettings, session)

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input.trim() })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">AI 学习助手</div>
            <div className="modal-subtitle">
              {card.label} · {card.focus}
            </div>
          </div>
          <div className="modal-actions">
            <button className="modal-clear-btn" onClick={clearChat} title="清空记录">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              </svg>
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="modal-messages">
          {messages.length === 0 && (
            <div className="modal-empty">
              <p>围绕「{card.focus}」的学习内容，向 AI 导师提问。</p>
              <p className="modal-empty-hint">例如：请解释这周的核心概念、如何在实修中运用、与佛学的比较...</p>
            </div>
          )}
          {messages.filter(m => m.role !== 'system').map((message) => (
            <div
              key={message.id}
              className={`modal-message ${message.role === 'user' ? 'modal-message-user' : 'modal-message-assistant'}`}
            >
              <div className="modal-message-role">
                {message.role === 'user' ? '你' : '导师'}
              </div>
              <div className="modal-message-content">
                {message.role === 'assistant'
                  ? <Markdown remarkPlugins={[remarkGfm]}>{getMessageText(message)}</Markdown>
                  : getMessageText(message)
                }
              </div>
            </div>
          ))}
          {isLoading && (messages.length === 0 || getMessageText(messages[messages.length - 1]) === '') && (
            <div className="modal-message modal-message-assistant">
              <div className="modal-message-role">导师</div>
              <div className="modal-message-content modal-typing">
                <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
            </div>
          )}
          {error && (
            <div className="modal-error">
              请求失败：{error.message}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="modal-input-form" onSubmit={handleSubmit}>
          <textarea
            className="modal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            disabled={isLoading}
            autoFocus
            rows={1}
          />
          <button
            className="modal-send-btn"
            type="submit"
            disabled={isLoading || !input.trim()}
          >
            发送
          </button>
        </form>
      </div>
    </div>
  )
}
