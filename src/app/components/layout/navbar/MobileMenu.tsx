'use client'

import Link from 'next/link'
import { Layers, Compass, Plus } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth.store'
import { useI18n } from '@/app/i18n'
import { cn } from '@/app/lib/utils'
import { MobileMenuProps } from '@/app/types/entities/mobile-menu-props.entity'

export function MobileMenu({ isOpen, onClose, onAuthClick }: MobileMenuProps) {
  const { isAuthenticated } = useAuthStore()
  const { t } = useI18n()
  const links = [
    { href: '/projects', label: t.nav.projects, icon: Layers },
    ...(isAuthenticated ? [{ href: '/discover', label: t.nav.discover, icon: Compass }] : []),
  ]

  if (!isOpen) return null

  return (
    <div
      className="md:hidden fixed inset-0 z-40 bg-black/40 flex flex-col items-center justify-start pt-24"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-xl p-6 flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()} // evita cerrar al click dentro
      >
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              location.pathname === href
                ? 'bg-[--brand]/10 text-[--brand]'
                : 'text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]'
            )}
          >
            <Icon size={16} /> {label}
          </Link>
        ))}

        {!isAuthenticated ? (
          <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              className="dc-btn-ghost w-full text-sm py-2"
              onClick={() => {
                onAuthClick?.()
                onClose()
              }}
            >
              {t.nav.login}
            </button>
            <button
              className="dc-btn-primary w-full text-sm py-2"
              onClick={() => {
                onAuthClick?.()
                onClose()
              }}
            >
              {t.nav.register}
            </button>
          </div>
        ) : (
          <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link href="/projects/new" className="dc-btn-primary w-full text-sm py-2.5">
              <Plus size={14} /> {t.projects.createNew}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}