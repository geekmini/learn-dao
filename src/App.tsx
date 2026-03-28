import { useState } from 'react'
import { curriculum } from './data/curriculum'
import type { WeekCard } from './data/curriculum'
import { useApiSettings } from './hooks/useApiSettings'
import { useChatHistory } from './hooks/useChatHistory'
import { ChatButton } from './components/ChatButton'
import { ChatModal } from './components/ChatModal'
import { SettingsModal } from './components/SettingsModal'
import './App.css'

function WeekCardWithChat({
  card,
  weekLabelClass,
  onOpenChat,
}: {
  card: WeekCard
  weekLabelClass: string
  onOpenChat: (card: WeekCard) => void
}) {
  const { hasHistory } = useChatHistory(card.id)

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
  const { settings, updateSettings, isConfigured } = useApiSettings()

  const handleOpenChat = (card: WeekCard) => {
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
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            title="设置"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {!isConfigured && <span className="settings-btn-alert" />}
          </button>
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
    </>
  )
}

export default App
