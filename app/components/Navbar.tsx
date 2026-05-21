'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Home', emoji: '🏠' },
  { href: '/results', label: 'Results', emoji: '🏆' },
  { href: '/parties', label: 'Parties', emoji: '🪳' },
  { href: '/parties/create', label: 'Start Party', emoji: '🏴' },
  { href: '/supreme', label: 'Supreme', emoji: '👑' },
  { href: '/court', label: 'Court', emoji: '🏛️' },
  { href: '/ec', label: 'EC', emoji: '🗳️' },
  { href: '/tv', label: 'CJTV', emoji: '📺' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setMenuOpen(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* ── STICKY NAVBAR ── */}
      <nav
        className="sticky top-0 z-50 bg-black border-b-4 border-yellow-300/20"
        style={{ height: 56 }}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            onClick={closeMenu}
          >
            <span className="text-2xl leading-none">🪳</span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-1 font-black text-sm uppercase tracking-wide transition-colors ${
                  isActive(href)
                    ? 'text-yellow-300'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {label}
                {isActive(href) && (
                  <span
                    className="absolute bottom-[-4px] left-0 right-0 h-[3px] bg-yellow-300 rounded-full"
                    aria-hidden
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA + HAMBURGER */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop CTA */}
            <Link
              href="/file"
              className="hidden md:inline-flex items-center gap-1 px-4 py-1.5 bg-yellow-300 text-black font-black text-sm rounded-lg border-2 border-yellow-300 hover:bg-yellow-400 transition-colors"
              style={{ letterSpacing: '-0.2px' }}
            >
              CONTEST →
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 text-yellow-300 text-2xl font-black leading-none focus:outline-none"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN OVERLAY ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black flex flex-col"
          style={{ paddingTop: 56 }}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-yellow-300 text-3xl font-black leading-none focus:outline-none"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>

          {/* Nav links */}
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8">
            {LINKS.map(({ href, label, emoji }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`flex items-center gap-3 text-3xl font-black uppercase tracking-tight transition-colors ${
                  isActive(href)
                    ? 'text-yellow-300'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="text-2xl">{emoji}</span>
                {label}
                {isActive(href) && (
                  <span className="text-yellow-300 text-xl ml-1">←</span>
                )}
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              href="/file"
              onClick={closeMenu}
              className="mt-4 px-8 py-4 bg-yellow-300 text-black font-black text-xl rounded-2xl border-4 border-yellow-300 hover:bg-yellow-400 transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.15)] text-center"
            >
              🪳 CONTEST →
            </Link>
          </div>

          {/* Bottom decorative text */}
          <p className="text-center text-white/20 font-mono text-xs pb-8 px-4">
            #NaaliKiSansad · 543 seats · zero chill
          </p>
        </div>
      )}
    </>
  )
}
