import Link from 'next/link'

const PARTIES = [
  { code: 'CJP', color: '#7F77DD', label: 'Cockroach Janta Party' },
  { code: 'CCP', color: '#D85A30', label: 'Cockroach Congress Party' },
  { code: 'ACP', color: '#1D9E75', label: 'Aam Cockroach Party' },
  { code: 'RCP', color: '#D4537E', label: 'Rashtriya Cockroach Party' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-yellow-300/20 py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* ── TOP ROW: Logo + Socials ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 mb-10">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <span className="text-2xl leading-none">🪳</span>
            <span className="font-black text-white text-lg uppercase tracking-tight leading-none">
              Cockroach Janta Parliament
            </span>
          </Link>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-1.5 text-white/60 hover:text-yellow-300 transition-colors font-bold text-sm"
              aria-label="Twitter"
            >
              <span className="text-lg">🐦</span>
              <span>Twitter</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-white/60 hover:text-yellow-300 transition-colors font-bold text-sm"
              aria-label="Instagram"
            >
              <span className="text-lg">📸</span>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* ── PARTY CHIPS ── */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {PARTIES.map(({ code, color, label }) => (
            <Link
              key={code}
              href="/parties"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ borderColor: color, color, background: `${color}18` }}
              title={label}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: color }}
                aria-hidden
              />
              {code}
            </Link>
          ))}
        </div>

        {/* ── DIVIDER ── */}
        <div className="border-t border-white/10 mb-8" />

        {/* ── DISCLAIMER ── */}
        <p className="text-white/40 font-mono text-xs text-center leading-relaxed mb-4 max-w-2xl mx-auto">
          "Satirical platform. Not affiliated with ECI or any political party. All candidates are fictional cockroaches. Results are meaningless. Democracy is a simulation. 🪳"
        </p>

        {/* ── HASHTAGS ── */}
        <p className="text-yellow-300/30 font-black text-xs tracking-wider text-center mb-4">
          #CockroachJantaParliament &nbsp;·&nbsp; #MainBhiCockroach &nbsp;·&nbsp; #NaaliKiSansad
        </p>

        {/* ── COPYRIGHT ── */}
        <p className="text-white/20 font-mono text-[10px] text-center">
          © 2026 Cockroach Janta Parliament. All rights reserved for the naali.
        </p>
      </div>
    </footer>
  )
}
