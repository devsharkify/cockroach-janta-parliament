import Link from 'next/link'
import IndiaMap from './components/IndiaMap'
import SeatFinder from './components/SeatFinder'
import SoulPanel from './components/SoulPanel'
import FilingFrenzy from './components/FilingFrenzy'
import LiveStats from './components/LiveStats'
import TrendingSeats from './components/TrendingSeats'
import { FOUNDING_PARTIES } from '@/lib/types'

const MOCK_STATS = {
  seats: 543,
  parties: 4,
}

const TICKER_ITEMS = [
  '🪳 BREAKING: Cockroach defeats sitting MP in Varanasi by 47,000 naali-votes',
  '📢 Khatmal_OG demands free broom ban — crowds go wild',
  '😭 Voter cries after voting 47 times in one session — "worth it"',
  '🗳️ "I just clicked for fun" — average CJP voter, no regrets',
  '👑 Supreme Commander issues decree: all drains now sacred',
  '🪳 New party formed: Neem Log Cockroach Union — 3 members already',
  '📣 Macchar Raja wins Patna Sahib with 100% of roach vote',
  '🔴 LIVE: 1,200 candidacies filed in the last hour — servers sweating',
  '🏛️ Parliament record: 543 seats, 0 bills passed, unlimited chaos',
  '🪳 Naali Sardar promises "one drain per family" — manifesto goes viral',
]

export default function HomePage() {
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">

      {/* ── ROACH SPRITE (ambient) ── */}
      <span className="roach-sprite" style={{ animationDuration: '18s' }} aria-hidden>🪳</span>
      <span className="roach-sprite" style={{ animationDuration: '27s', bottom: 32, opacity: 0.1 }} aria-hidden>🪳</span>

      {/* ═══════════════════════════════════════
          1. TICKER
      ═══════════════════════════════════════ */}
      <div className="bg-black text-yellow-300 text-xs font-mono py-1.5 overflow-hidden relative z-50">
        <div className="ticker-track">
          {tickerContent.map((item, i) => (
            <span key={i} className="mx-10 shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          2. HERO
      ═══════════════════════════════════════ */}
      <section className="relative bg-yellow-300 border-b-8 border-black overflow-hidden">
        {/* chaotic bg roaches */}
        <div
          className="absolute inset-0 flex flex-wrap gap-4 p-4 pointer-events-none select-none overflow-hidden rotate-12 scale-125"
          style={{ opacity: 0.07 }}
          aria-hidden
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="text-5xl">🪳</span>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center pt-10 pb-10 px-4 text-center">
          {/* meme caption */}
          <p className="text-black font-black text-xs uppercase tracking-widest mb-4 bg-white px-4 py-1.5 rounded border-4 border-black inline-block shadow-[3px_3px_0_black] rotate-[-1deg]">
            POV: democracy but make it chaos 🪳
          </p>

          {/* giant cockroach */}
          <div
            className="text-[8rem] leading-none mb-2"
            style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.25))' }}
          >
            🪳
          </div>

          {/* impact title */}
          <h1
            className="text-5xl sm:text-8xl font-black leading-none text-black uppercase mb-0"
            style={{ textShadow: '4px 4px 0 #7F77DD, 7px 7px 0 rgba(0,0,0,0.12)', letterSpacing: '-2px' }}
          >
            COCKROACH
          </h1>
          <h2
            className="text-5xl sm:text-8xl font-black leading-none uppercase mb-0"
            style={{ color: '#7F77DD', textShadow: '4px 4px 0 black', letterSpacing: '-2px' }}
          >
            JANTA
          </h2>
          <h3
            className="text-4xl sm:text-7xl font-black leading-none text-black uppercase mb-6"
            style={{ textShadow: '4px 4px 0 #D85A30', letterSpacing: '-2px' }}
          >
            PARLIAMENT 🏛️
          </h3>

          {/* meme subtitle band */}
          <div className="bg-black text-yellow-300 font-black text-base sm:text-xl px-6 py-3 mb-5 rotate-[-1deg] inline-block border-4 border-yellow-300 shadow-[5px_5px_0_rgba(0,0,0,0.3)]">
            543 SEATS. UNLIMITED VOTES. ZERO CHILL.
          </div>

          {/* live stat counters */}
          <LiveStats initialCandidates={12847} initialVotes={394201} />

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <a
              href="#seat-finder"
              className="inline-block px-8 py-4 bg-black text-yellow-300 font-black text-lg border-4 border-black rounded-2xl shadow-[5px_5px_0_rgba(0,0,0,0.3)] hover:bg-[#7F77DD] hover:border-[#7F77DD] transition-colors"
            >
              🪳 FIND YOUR SEAT →
            </a>
            <Link
              href="/file"
              className="inline-block px-8 py-4 bg-white text-black font-black text-lg border-4 border-black rounded-2xl shadow-[5px_5px_0_rgba(0,0,0,0.25)] hover:bg-black hover:text-yellow-300 transition-colors"
            >
              📋 FILE CANDIDACY (free)
            </Link>
          </div>

          <p className="text-black/60 text-xs font-mono mt-4">
            — Samrat Macchar, Supreme Cockroach Commander 👑
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          3. HOW IT WORKS
      ═══════════════════════════════════════ */}
      <section className="bg-white border-b-8 border-black py-10 px-4">
        <p className="text-center font-black text-xs uppercase tracking-widest text-black/40 mb-6">
          it&apos;s stupidly simple 🪳
        </p>
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', emoji: '🪳', title: 'PICK A SEAT',   desc: 'Choose any of 543 Lok Sabha constituencies. Find yours by city, PIN code, or name.' },
            { step: '2', emoji: '📋', title: 'FILE CANDIDACY', desc: 'Get an auto-generated cockroach identity and a Hinglish manifesto. Party optional.' },
            { step: '3', emoji: '🏆', title: 'WIN ON SATURDAY', desc: 'Votes count every Saturday 11PM IST. Most votes wins. Results are forever (ish).' },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border-4 border-black p-5 shadow-[4px_4px_0_black] relative"
              style={{ background: '#F7F5FF' }}
            >
              <div
                className="absolute -top-4 -left-4 w-9 h-9 rounded-full border-4 border-black bg-yellow-300 flex items-center justify-center font-black text-black text-sm shadow-[2px_2px_0_black]"
              >
                {s.step}
              </div>
              <div className="text-4xl mb-3">{s.emoji}</div>
              <h3 className="font-black text-base text-black mb-1 uppercase tracking-wide">{s.title}</h3>
              <p className="text-black/55 text-xs font-mono leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          4. INDIA MAP SECTION
      ═══════════════════════════════════════ */}
      <section className="border-b-8 border-black" style={{ background: '#0f0b30' }}>
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <h2
            className="text-center font-black text-2xl sm:text-3xl uppercase mb-1"
            style={{ color: '#D4A017', letterSpacing: '0.05em' }}
          >
            🗺️ WHERE WILL YOU CONTEST?
          </h2>
          <p className="text-center font-mono text-xs mb-6" style={{ color: '#7F77DD' }}>
            click any city to jump to its seat
          </p>

          <IndiaMap className="rounded-2xl overflow-hidden border-4 border-[#4a3fa0] shadow-[0_0_40px_rgba(127,119,221,0.3)]" />

          <div className="text-center mt-5">
            <a
              href="#seat-finder"
              className="inline-block font-black text-sm px-5 py-2 rounded-xl border-4 transition-colors"
              style={{ color: '#D4A017', borderColor: '#D4A017', background: 'transparent' }}
              onMouseOver={undefined}
            >
              or find your seat by number / PIN / name →
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. SEAT FINDER SECTION
      ═══════════════════════════════════════ */}
      <section id="seat-finder" className="bg-yellow-300 border-b-8 border-black py-10 px-4">
        <div className="max-w-lg mx-auto">
          {/* Section header */}
          <div className="text-center mb-6">
            <div className="inline-block bg-black text-yellow-300 font-black text-xs px-3 py-1 rounded border-2 border-black mb-3 tracking-widest uppercase">
              MAIN CONVERSION ZONE 🎯
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-black uppercase"
              style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.15)', letterSpacing: '-1px' }}
            >
              🎯 FIND YOUR BATTLEFIELD
            </h2>
            <p className="text-black/60 font-mono text-sm mt-1">
              pick a seat. any seat. it's free real estate.
            </p>
          </div>

          {/* SeatFinder component — the main CTA */}
          <div className="bg-white border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0_black]">
            <SeatFinder />
          </div>

          {/* Supporting nudge */}
          <p className="text-center text-black/50 font-mono text-xs mt-4">
            🪳 543 seats available · all free · no ID required · results every Saturday
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          6. DRAKE MEME / COMPARISON
      ═══════════════════════════════════════ */}
      <section className="bg-black text-white py-10 px-4 border-b-8 border-yellow-300">
        <p className="text-center text-yellow-300 font-black text-xs uppercase tracking-widest mb-6">
          the cockroach difference 🪳
        </p>
        <div className="max-w-lg mx-auto space-y-3">
          {[
            {
              nah: true,
              emoji: '😒',
              text: 'Normal elections. Voter ID. Vote once. Results in 6 months. Full boring.',
            },
            {
              nah: false,
              emoji: '😍',
              text: 'Cockroach Parliament. Anonymous. Vote 1000 times. Winner every Saturday. Full chaos. 🪳',
            },
          ].map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl p-4 border-4"
              style={{
                borderColor: row.nah ? '#333' : '#7F77DD',
                background: row.nah ? 'rgba(255,255,255,0.03)' : 'rgba(127,119,221,0.12)',
              }}
            >
              <div className="text-4xl shrink-0">{row.emoji}</div>
              <p
                className={`font-bold text-sm leading-snug ${
                  row.nah ? 'text-white/35 line-through' : 'text-yellow-300'
                }`}
              >
                {row.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRENDING SEATS
      ═══════════════════════════════════════ */}
      <section className="py-10 px-4 border-b-8 border-black" style={{ background: '#0f0b30' }}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <p className="font-black text-xs uppercase tracking-widest mb-1" style={{ color: '#D4A017' }}>
              hottest seats right now
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
              🔥 TRENDING BATTLEFIELDS
            </h2>
          </div>
          <TrendingSeats />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PARTY CARDS
      ═══════════════════════════════════════ */}
      <section className="bg-white py-10 px-4 border-b-8 border-black">
        <p className="text-center font-black text-xs uppercase tracking-widest text-black/40 mb-2">
          choose your cockroach gang 🪳
        </p>
        <p className="text-center font-mono text-xs text-black/30 mb-6">
          click a party to start filing
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
          {FOUNDING_PARTIES.map((p) => {
            const bgMap: Record<string, string> = {
              CJP: '#F0EEFF',
              CCP: '#FFF0EB',
              ACP: '#EDFAF4',
              RCP: '#FFF0F5',
            }
            const memeMap: Record<string, string> = {
              CJP: '"just vibes, bro"',
              CCP: '"old money roach"',
              ACP: '"naali is life"',
              RCP: '"my galli my rules"',
            }
            return (
              <Link
                key={p.code}
                href={`/parties/${p.code}`}
                className="rounded-2xl border-4 p-4 text-left hover:scale-105 transition-transform active:scale-95 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] block"
                style={{ borderColor: p.color, backgroundColor: bgMap[p.code] ?? '#fff' }}
              >
                <div className="text-3xl mb-2">🪳</div>
                <div className="font-black text-xl" style={{ color: p.color }}>
                  {p.code}
                </div>
                <div className="text-xs font-bold text-black/60 leading-tight">{p.name}</div>
                <div className="mt-1 text-xs text-black/40 font-mono">{p.tagline}</div>
                <div className="mt-2 text-xs italic text-black/30 font-mono">
                  {memeMap[p.code] ?? '"chaos gang"'}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          7. SOUL PANEL + STATS ROW
      ═══════════════════════════════════════ */}
      <section
        className="py-10 px-4 border-b-8 border-black"
        style={{ background: '#1a1060' }}
      >
        <p
          className="text-center font-black text-xs uppercase tracking-widest mb-6"
          style={{ color: '#D4A017' }}
        >
          your roach identity ⚡
        </p>

        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-6 items-start">
          {/* Left: SoulPanel */}
          <div className="w-full md:w-1/2">
            <p className="text-white/60 font-black text-xs uppercase tracking-wider mb-3">
              🪳 Your Soul Level
            </p>
            <SoulPanel className="w-full max-w-none" />
            <p className="text-white/30 font-mono text-xs mt-3">
              Vote, file, nominate — earn XP and level up your roach soul.
            </p>
          </div>

          {/* Right: Stats grid */}
          <div className="w-full md:w-1/2">
            <p className="text-white/60 font-black text-xs uppercase tracking-wider mb-3">
              🗳️ Parliament Stats
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'SEATS',      value: MOCK_STATS.seats.toLocaleString('en-IN'), icon: '🗺️', color: '#7F77DD' },
                { label: 'CANDIDATES', value: '12,847+',                                icon: '🪳', color: '#1D9E75' },
                { label: 'VOTES',      value: '3.9L+',                                  icon: '🗳️', color: '#D85A30' },
                { label: 'PARTIES',    value: String(MOCK_STATS.parties) + '+',         icon: '🏴', color: '#D4537E' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border-4 border-black p-4 text-center shadow-[4px_4px_0_black]"
                  style={{ background: '#2a1e80' }}
                >
                  <div className="text-3xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-black" style={{ color: s.color }}>
                    {s.value}
                  </div>
                  <div className="text-[10px] font-black text-white/40 tracking-widest mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/file"
                className="block text-center py-3 px-6 rounded-xl font-black text-base border-4 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black transition-colors shadow-[3px_3px_0_rgba(212,160,23,0.4)]"
              >
                🪳 BECOME A STATISTIC — FILE NOW
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. FILING FRENZY
      ═══════════════════════════════════════ */}
      <section className="bg-white py-10 px-4 border-b-8 border-black">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-6">
            <p className="font-black text-xs uppercase tracking-widest text-black/40 mb-1">
              what's happening right now
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-black uppercase">
              🔴 LIVE FILING FRENZY
            </h2>
            <p className="text-black/40 font-mono text-xs mt-1">
              real cockroaches. real seats. real chaos.
            </p>
          </div>
          <FilingFrenzy />
          <div className="text-center mt-5">
            <Link
              href="/file"
              className="inline-block px-6 py-3 bg-black text-yellow-300 font-black text-sm border-4 border-black rounded-xl hover:bg-[#7F77DD] transition-colors shadow-[4px_4px_0_rgba(0,0,0,0.25)]"
            >
              🪳 JOIN THE FRENZY — FILE YOUR CANDIDACY
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          9. BOTTOM CTA
      ═══════════════════════════════════════ */}
      <section className="bg-black py-14 px-4 text-center border-b-8 border-yellow-300">
        {/* Big impact line */}
        <div className="text-6xl sm:text-8xl mb-4">🪳</div>
        <h2
          className="font-black text-3xl sm:text-5xl text-yellow-300 uppercase mb-2 leading-none"
          style={{ textShadow: '4px 4px 0 #7F77DD', letterSpacing: '-1px' }}
        >
          READY TO CONTEST?
        </h2>
        <p className="text-white/40 font-mono text-sm mb-8">
          it's free. it's chaos. it's democracy. 🏛️
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/file"
            className="px-10 py-5 rounded-2xl bg-yellow-300 text-black font-black text-xl border-4 border-yellow-300 hover:bg-yellow-400 transition-colors shadow-[6px_6px_0_rgba(255,255,255,0.15)]"
          >
            🪳 FILE CANDIDACY (free)
          </Link>
          <Link
            href="/supreme"
            className="px-10 py-5 rounded-2xl bg-white/10 text-white font-black text-xl border-4 border-white/20 hover:bg-white/20 transition-colors"
          >
            👑 SUPREME COMMANDER
          </Link>
          <Link
            href="/results"
            className="px-10 py-5 rounded-2xl bg-[#7F77DD]/20 text-white font-black text-xl border-4 border-[#7F77DD]/40 hover:bg-[#7F77DD]/30 transition-colors"
          >
            🏆 VIEW RESULTS
          </Link>
        </div>

        {/* XP nudge */}
        <p className="text-yellow-300/40 font-mono text-xs mt-6">
          filing earns you +10 XP · voting earns +1 XP · winning earns +500 XP 👑
        </p>
      </section>

      {/* ═══════════════════════════════════════
          10. FOOTER
      ═══════════════════════════════════════ */}
      <footer className="bg-black border-t-4 border-white/10 py-6 pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <p className="text-white/60 font-black text-sm">🪳 COCKROACH JANTA PARLIAMENT</p>
          <p className="text-white/25 font-mono text-[10px] leading-relaxed">
            All votes are fake. All winners are real. Not affiliated with ECI or any real political party.
            <br />
            This is a satirical platform for entertainment purposes only.
            <br />
            No cockroaches were harmed in the making of this democracy.
          </p>
          <p className="text-yellow-300/30 font-black text-xs tracking-wide">
            #CockroachJantaParliament &nbsp;·&nbsp; #MainBhiCockroach &nbsp;·&nbsp; #NaaliForAll
          </p>
        </div>
      </footer>
    </div>
  )
}
