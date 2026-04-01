import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t mt-24" style={{ borderColor: 'var(--border)', background: 'var(--bg-raised)' }}>
      <div className="dc-container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-display font-bold"
            style={{ background: 'linear-gradient(135deg, var(--brand), var(--accent))' }}
          >
            DC
          </div>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            DevConnect © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-5">
          {[
            { href: '/projects', label: 'Projects' },
            { href: 'https://github.com/devconnect', label: 'GitHub', external: true },
          ].map(({ href, label, external }) => (
            <Link
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="text-sm transition-colors hover:text-[--brand]"
              style={{ color: 'var(--text-dim)' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
