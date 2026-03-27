import { useState } from 'react'
import type { ApiSettings } from '../hooks/useApiSettings'

interface SettingsModalProps {
  settings: ApiSettings
  onSave: (patch: Partial<ApiSettings>) => void
  onClose: () => void
}

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
]

export function SettingsModal({ settings, onSave, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [model, setModel] = useState(settings.model)

  const handleSave = () => {
    onSave({ apiKey: apiKey.trim(), model })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">设置</div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-body">
          <label className="settings-label">
            Anthropic API Key
            <input
              className="settings-input"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
            />
          </label>

          <label className="settings-label">
            模型
            <select
              className="settings-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="settings-footer">
          <button className="settings-save-btn" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
