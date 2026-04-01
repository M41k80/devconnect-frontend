'use client'

import Link from 'next/link'
import { Layers, Compass, Plus } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth.store'
import { useI18n } from '@/app/i18n'
import { cn } from '@/app/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated } = useAuthStore()
  const { t } = useI18n()
  const links = [
    { href: '/projects', label: t.nav.projects, icon: Layers },
    ...(isAuthenticated ? [{ href: '/discover', label: t.nav.discover, icon: Compass }] : []),
  ]

  if (!isOpen) return null

  return (
    <div
      className="md:hidden border-t px-4 py-3 space-y-1 anim-fade-in"
      style={{ background: 'var(--bg-raised)', borderColor: 'var(--border)' }}
    >
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className={cn(
            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            location.pathname === href ? 'bg-[--brand]/10 text-[--brand]' : 'text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]'
          )}
        >
          <Icon size={16} /> {label}
        </Link>
      ))}

      {!isAuthenticated ? (
        <div className="flex gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href="/login" className="dc-btn-ghost flex-1 text-sm py-2">{t.nav.login}</Link>
          <Link href="/register" className="dc-btn-primary flex-1 text-sm py-2">{t.nav.register}</Link>
        </div>
      ) : (
        <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href="/projects/new" className="dc-btn-primary w-full text-sm py-2.5">
            <Plus size={14} /> {t.projects.createNew}
          </Link>
        </div>
      )}
    </div>
  )
}