interface ChatButtonProps {
  onClick: () => void
  hasHistory: boolean
}

export function ChatButton({ onClick, hasHistory }: ChatButtonProps) {
  return (
    <button
      className="chat-btn"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      title="AI 学习助手"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M9.218 2h2.402L16 12.987h-2.402zM4.379 2h2.512l4.38 10.987H8.82l-.895-2.308h-4.58l-.896 2.307H0L4.38 2.001zm2.755 6.64L5.635 4.777 4.137 8.64z" />
      </svg>
      {hasHistory && <span className="chat-btn-dot" />}
    </button>
  )
}
