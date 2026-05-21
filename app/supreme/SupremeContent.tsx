'use client'

import Link from 'next/link'

const POWERS = [
  'Power to declare any seat "spiritually uncontested"',
  'Power to ban brooms in all constituencies',
  'Power to grant 50,000 ceremonial votes to loud supporters',
  'Power to declare Saturday sacred and results binding',
  'Power to name any naali after himself',
]

const DECREES = [
  {
    number: '001',
    text: 'All brooms are hereby banned. Any broom found within 10 metres of a naali shall be confiscated by the state cockroach.',
  },
  {
    number: '002',
    text: 'The city of Patna is hereby awarded 50,000 ceremonial votes for being the loudest constituency in Cycle 1.',
  },
  {
    number: '003',
    text: 'Saturday 11PM IST is now a national holiday. All screens must show the snapshot results.',
  },
]

const STAT_CHIPS = [
  '543 seats under my protection',
  '∞ votes possible per citizen',
  '1 snapshot every Saturday',
  '0 real politicians involved',
]

export default function SupremeContent() {
  return (
    <div className="min-h-screen overflow-x-hidden font-sans" style={{ background: '#05071a' }}>

      {/* ═══════════════════════════════════════
          1. THRONE SECTION
      ═══════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1060 0%, #05071a 70%)' }}
      >
        {/* Ambient roach swarm — very subtle */}
        <div
          className="absolute inset-0 flex flex-wrap gap-6 p-8 pointer-events-none select-none overflow-hidden"
          style={{ opacity: 0.04 }}
          aria-hidden
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="text-6xl">🪳</span>
          ))}
        </div>

        {/* Gold glow ring behind crown */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 320,
            height: 320,
            background: 'radial-gradient(circle, rgba(212,160,23,0.18) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
          aria-hidden
        />

        {/* Spinning Crown */}
        <div
          className="text-[7rem] sm:text-[10rem] leading-none mb-4 select-none"
          style={{ animation: 'crown-spin 12s linear infinite', display: 'inline-block' }}
          aria-hidden
        >
          👑
        </div>

        {/* Name */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-black uppercase text-center leading-none mb-3"
          style={{
            color: '#D4A017',
            textShadow: '0 0 40px rgba(212,160,23,0.6), 4px 4px 0 rgba(0,0,0,0.8)',
            letterSpacing: '-1px',
          }}
        >
          PRADHAN COCKROACH MINISTER
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-xl font-bold uppercase tracking-widest text-center mb-8"
          style={{ color: 'rgba(212,160,23,0.6)' }}
        >
          Pradhan Cockroach Minister — All 543 Constituencies
        </p>

        {/* Gold separator */}
        <div className="flex items-center gap-4 mb-8 w-full max-w-md">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #D4A017)' }} />
          <span className="text-2xl" style={{ color: '#D4A017' }}>✦</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #D4A017)' }} />
        </div>

        {/* Quote */}
        <blockquote
          className="text-center text-lg sm:text-2xl italic font-black max-w-xl leading-snug"
          style={{ color: 'rgba(212,160,23,0.85)', textShadow: '0 2px 12px rgba(212,160,23,0.2)' }}
        >
          &ldquo;I did not ask to rule. The naali chose me.&rdquo;
        </blockquote>

        {/* Scroll cue */}
        <p
          className="absolute bottom-8 font-mono text-xs tracking-widest animate-bounce"
          style={{ color: 'rgba(212,160,23,0.35)' }}
        >
          ▼ DECREES BELOW ▼
        </p>
      </section>

      {/* ═══════════════════════════════════════
          2. POWERS & DECREES
      ═══════════════════════════════════════ */}
      <section
        className="py-16 px-4"
        style={{ background: '#08091f' }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center font-black text-xs uppercase tracking-widest mb-2"
            style={{ color: 'rgba(212,160,23,0.5)' }}
          >
            — by the sacred scroll of the naali —
          </p>
          <h2
            className="text-3xl sm:text-5xl font-black uppercase text-center mb-10"
            style={{ color: '#D4A017', textShadow: '0 0 20px rgba(212,160,23,0.3)' }}
          >
            OFFICIAL POWERS
          </h2>

          <div className="grid gap-4">
            {POWERS.map((power, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl p-5 border"
                style={{
                  background: '#0d0f2e',
                  borderColor: 'rgba(212,160,23,0.25)',
                  boxShadow: '0 0 20px rgba(212,160,23,0.05)',
                }}
              >
                <span
                  className="text-xl shrink-0 mt-0.5 font-black"
                  style={{ color: '#D4A017' }}
                >
                  ✦
                </span>
                <p
                  className="font-bold text-base leading-snug"
                  style={{ color: 'rgba(212,160,23,0.9)' }}
                >
                  {power}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. CURRENT DECREES
      ═══════════════════════════════════════ */}
      <section
        className="py-16 px-4"
        style={{ background: '#05071a' }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center font-black text-xs uppercase tracking-widest mb-2"
            style={{ color: 'rgba(212,160,23,0.5)' }}
          >
            — issued by the supreme authority —
          </p>
          <h2
            className="text-3xl sm:text-5xl font-black uppercase text-center mb-10"
            style={{ color: '#D4A017', textShadow: '0 0 20px rgba(212,160,23,0.3)' }}
          >
            ACTIVE DECREES
          </h2>

          <div className="grid gap-6">
            {DECREES.map((decree) => (
              <div
                key={decree.number}
                className="relative rounded-2xl p-6 border-2 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #f5f0dc 0%, #ede5c0 100%)',
                  borderColor: '#8B6914',
                }}
              >
                {/* Parchment texture overlay */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.015) 24px, rgba(0,0,0,0.015) 25px)' }}
                  aria-hidden
                />

                <div className="relative flex items-start gap-4">
                  {/* Wax seal */}
                  <div className="shrink-0 text-3xl select-none" title="Official Seal">
                    🪳📜
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-black text-xs uppercase tracking-widest mb-2"
                      style={{ color: '#8B6914' }}
                    >
                      Decree #{decree.number}
                    </div>
                    <p
                      className="text-base leading-relaxed font-semibold"
                      style={{ color: '#3a2a05', fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {decree.text}
                    </p>
                  </div>
                  {/* Red wax seal */}
                  <div className="shrink-0 text-2xl select-none" title="Sealed">
                    🔴
                  </div>
                </div>

                {/* Official footer */}
                <div
                  className="relative mt-4 pt-3 border-t font-mono text-xs text-right"
                  style={{ borderColor: 'rgba(139,105,20,0.3)', color: '#8B6914' }}
                >
                  — Pradhan Cockroach Minister
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. STATS UNDER MY RULE
      ═══════════════════════════════════════ */}
      <section
        className="py-16 px-4"
        style={{ background: '#08091f' }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-center font-black text-xs uppercase tracking-widest mb-2"
            style={{ color: 'rgba(212,160,23,0.5)' }}
          >
            — the numbers don&apos;t lie —
          </p>
          <h2
            className="text-3xl sm:text-5xl font-black uppercase text-center mb-10"
            style={{ color: '#D4A017', textShadow: '0 0 20px rgba(212,160,23,0.3)' }}
          >
            UNDER MY RULE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STAT_CHIPS.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl px-6 py-5 text-center border font-black text-lg"
                style={{
                  background: '#0d0f2e',
                  borderColor: 'rgba(212,160,23,0.3)',
                  color: '#D4A017',
                  boxShadow: '0 0 24px rgba(212,160,23,0.08)',
                  textShadow: '0 0 12px rgba(212,160,23,0.3)',
                }}
              >
                {stat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. PLEDGE SECTION
      ═══════════════════════════════════════ */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, #1a1060 0%, #05071a 70%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-4 select-none">🪳</div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase mb-3 leading-none"
            style={{
              color: '#D4A017',
              textShadow: '0 0 40px rgba(212,160,23,0.5), 4px 4px 0 rgba(0,0,0,0.8)',
            }}
          >
            JOIN THE MOVEMENT
          </h2>
          <p
            className="font-mono text-sm mb-10"
            style={{ color: 'rgba(212,160,23,0.45)' }}
          >
            serve the PM. contest. vote. pledge.
          </p>

          {/* Gold separator */}
          <div className="flex items-center gap-4 mb-10 w-full max-w-xs mx-auto">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #D4A017)' }} />
            <span style={{ color: '#D4A017' }}>✦</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #D4A017)' }} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/seat/485"
              className="px-8 py-4 rounded-2xl font-black text-lg uppercase transition-all duration-150"
              style={{
                background: '#D4A017',
                color: '#05071a',
                boxShadow: '0 0 30px rgba(212,160,23,0.4), 4px 4px 0 rgba(0,0,0,0.5)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 50px rgba(212,160,23,0.7), 4px 4px 0 rgba(0,0,0,0.5)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 30px rgba(212,160,23,0.4), 4px 4px 0 rgba(0,0,0,0.5)'
              }}
            >
              👑 PLEDGE YOUR VOTE
            </Link>
            <Link
              href="/file"
              className="px-8 py-4 rounded-2xl font-black text-lg uppercase border-2 transition-all duration-150"
              style={{
                background: 'transparent',
                color: '#D4A017',
                borderColor: '#D4A017',
                boxShadow: '0 0 20px rgba(212,160,23,0.1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(212,160,23,0.1)'
                el.style.boxShadow = '0 0 30px rgba(212,160,23,0.2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'transparent'
                el.style.boxShadow = '0 0 20px rgba(212,160,23,0.1)'
              }}
            >
              📋 CONTEST
            </Link>
            <Link
              href="/parties/CJP"
              className="px-8 py-4 rounded-2xl font-black text-lg uppercase border-2 transition-all duration-150"
              style={{
                background: 'transparent',
                color: '#7F77DD',
                borderColor: '#7F77DD',
                boxShadow: '0 0 20px rgba(127,119,221,0.1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'rgba(127,119,221,0.1)'
                el.style.boxShadow = '0 0 30px rgba(127,119,221,0.2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = 'transparent'
                el.style.boxShadow = '0 0 20px rgba(127,119,221,0.1)'
              }}
            >
              🏴 VIEW PARTY
            </Link>
          </div>

          {/* XP nudge */}
          <p
            className="font-mono text-xs mt-8"
            style={{ color: 'rgba(212,160,23,0.3)' }}
          >
            filing earns +10 XP · voting earns +1 XP · winning earns +500 XP
          </p>
        </div>
      </section>

      {/* Crown spin keyframe injected inline */}
      <style>{`
        @keyframes crown-spin {
          0%   { transform: rotate(-8deg) scale(1);    }
          25%  { transform: rotate(0deg)  scale(1.06); }
          50%  { transform: rotate(8deg)  scale(1);    }
          75%  { transform: rotate(0deg)  scale(1.06); }
          100% { transform: rotate(-8deg) scale(1);    }
        }
      `}</style>
    </div>
  )
}
