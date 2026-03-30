import { useState } from 'react'
import { curriculum } from './data/curriculum'
import type { WeekCard } from './data/curriculum'
import { useAuth } from './contexts/AuthContext'
import { useUserSettings } from './hooks/useUserSettings'
import { useSupabaseChatHistory } from './hooks/useSupabaseChatHistory'
import { ChatButton } from './components/ChatButton'
import { ChatModal } from './components/ChatModal'
import { SettingsModal } from './components/SettingsModal'
import { LoginButton } from './components/auth/LoginButton'
import { UserMenu } from './components/auth/UserMenu'
import { LoginPromptModal } from './components/auth/LoginPromptModal'
import './App.css'

function WeekCardWithChat({
  card,
  weekLabelClass,
  onOpenChat,
  userId,
}: {
  card: WeekCard
  weekLabelClass: string
  onOpenChat: (card: WeekCard) => void
  userId: string | undefined
}) {
  const { hasHistory } = useSupabaseChatHistory(card.id, userId)

  return (
    <div className="week-card">
      <div className="week-card-header">
        <div className={`week-label ${weekLabelClass}`}>{card.label}</div>
        <ChatButton onClick={() => onOpenChat(card)} hasHistory={hasHistory} />
      </div>
      <div className="week-focus">{card.focus}</div>
      <div className="week-items">
        {card.items.map((item, i) => (
          <span key={i}>
            {item}
            {i < card.items.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [chatCard, setChatCard] = useState<WeekCard | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  const { user, session, isLoading: authLoading, signInWithGoogle, signOut } = useAuth()
  const { settings, updateSettings, isConfigured } = useUserSettings(user?.id)

  const handleOpenChat = (card: WeekCard) => {
    if (authLoading) return
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    if (!isConfigured) {
      setShowSettings(true)
      return
    }
    setChatCard(card)
  }

  return (
    <>
      <div className="header">
        <div className="header-top">
          <div className="header-eyebrow">{curriculum.headerEyebrow}</div>
          {user ? (
            <UserMenu
              user={user}
              onOpenSettings={() => setShowSettings(true)}
              onLogout={signOut}
            />
          ) : (
            <LoginButton onClick={signInWithGoogle} />
          )}
        </div>
        <h1>{curriculum.headerTitle}</h1>
        <div className="header-sub">
          {curriculum.headerSub.map((line, i) => (
            <span key={i}>
              {line}
              {i < curriculum.headerSub.length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>

      <div className="spine">
        <div className="spine-title">修行者学习的三根支柱</div>
        {curriculum.pillars.map((pillar, i) => (
          <div className="spine-cell" key={i}>
            <strong>{pillar.title}</strong>
            {pillar.body}
          </div>
        ))}
      </div>

      {curriculum.phases.map((phase) => (
        <div className={`phase-block ${phase.colorClass}`} key={phase.id}>
          <div className="phase-header">
            <span className="phase-badge">{phase.badge}</span>
            <div>
              <div className="phase-title">{phase.title}</div>
              <div className="phase-sub">{phase.subtitle}</div>
            </div>
          </div>
          <div className="divider"></div>

          {phase.insight && (
            <div className="insight">
              <strong>{phase.insight.split('：')[0]}：</strong>
              {phase.insight.split('：').slice(1).join('：')}
            </div>
          )}

          <div className="weeks-row">
            {phase.weeks.map((week) => (
              <WeekCardWithChat
                key={week.id}
                card={week}
                weekLabelClass=""
                onOpenChat={handleOpenChat}
                userId={user?.id}
              />
            ))}
          </div>

          <div className="two-col">
            {phase.boxes.map((box, i) => (
              <div className="pbox" key={i}>
                <div className="pbox-title">{box.title}</div>
                <div className="pbox-body">
                  {box.body.map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < box.body.length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="milestone">
            <span className="dot"></span>
            {phase.milestone}
          </div>
        </div>
      ))}

      <div className="footer-block">
        <div className="footer-title">{curriculum.footerTitle}</div>
        <div className="questions-grid">
          {curriculum.footerQuestions.map((q, i) => (
            <div className="q-item" key={i}>{q}</div>
          ))}
        </div>
        <div className="footer-note">{curriculum.footerNote}</div>
      </div>

      {chatCard && (
        <ChatModal
          card={chatCard}
          apiSettings={settings}
          session={session}
          onClose={() => setChatCard(null)}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showLoginPrompt && (
        <LoginPromptModal
          onLogin={signInWithGoogle}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  )
}

export default App
