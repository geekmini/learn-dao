import { useState, useRef, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'

interface UserMenuProps {
  user: User
  onOpenSettings: () => void
  onLogout: () => void
}

export function UserMenu({ user, onOpenSettings, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const avatarUrl = user.user_metadata?.avatar_url
  const name = user.user_metadata?.full_name || user.email || ''
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="user-menu" ref={menuRef}>
      <button className="user-menu-btn" onClick={() => setOpen(!open)} title={name}>
        {avatarUrl ? (
          <img className="user-avatar" src={avatarUrl} alt="" />
        ) : (
          <span className="user-avatar-fallback">{initial}</span>
        )}
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown-name">{name}</div>
          <button
            className="user-dropdown-item"
            onClick={() => { setOpen(false); onOpenSettings() }}
          >
            设置
          </button>
          <button
            className="user-dropdown-item"
            onClick={() => { setOpen(false); onLogout() }}
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}
