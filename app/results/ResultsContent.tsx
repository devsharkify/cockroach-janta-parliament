'use client'

import { useRouter } from 'next/navigation'
import type { LeaderboardData } from '@/app/api/leaderboard/route'

export type { LeaderboardData }

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function rankBadge(rank: number) {
  if (rank === 1) return <span className="text-2xl">👑</span>
  if (rank === 2) return <span className="text-xl">🥈</span>
  if (rank === 3) return <span className="text-xl">🥉</span>
  return (
    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white font-black text-sm border-2 border-black">
      {rank}
    </span>
  )
}

function fireScale(votes: number, max: number): string {
  const ratio = max > 0 ? votes / max : 0
  if (ratio > 0.8) return '🔥🔥🔥🔥🔥'
  if (ratio > 0.6) return '🔥🔥🔥🔥'
  if (ratio > 0.4) return '🔥🔥🔥'
  if (ratio > 0.2) return '🔥🔥'
  return '🔥'
}

export default function ResultsContent({ data }: { data: LeaderboardData }) {
  const router = useRouter()
  const { topCandidates, partyStandings, trendingSeats, updatedAt } = data

  const maxVotes = topCandidates[0]?.voteCount ?? 1
  const maxPartyVotes = partyStandings[0]?.totalVotes ?? 1
  const maxTrendVotes = trendingSeats[0]?.recentVotes ?? 1

  return (
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* ── 1. HEADER ── */}
      <div className="bg-[#0f0b30] text-white px-4 pt-6 pb-10 border-b-8 border-yellow-300">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <a
              href="/"
              className="text-sm font-bold text-white/60 hover:text-white transition-colors"
            >
              ← Back to Parliament
            </a>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-yellow-300 text-black font-black text-xs px-3 py-1 rounded-full border-2 border-black">
                UPDATED {timeAgo(updatedAt).toUpperCase()}
              </span>
              <span className="bg-[#7F77DD]/20 text-[#7F77DD] font-black text-xs px-3 py-1 rounded-full border-2 border-[#7F77DD]">
                ⏰ Next snapshot: Saturday 11PM IST
              </span>
            </div>
          </div>
          <div className="text-6xl mb-2">🏆</div>
          <h1
            className="text-5xl sm:text-7xl font-black uppercase leading-none"
            style={{ textShadow: '4px 4px 0 #7F77DD', letterSpacing: '-2px' }}
          >
            LIVE RESULTS
          </h1>
          <p className="text-white/40 font-mono text-sm mt-2">
            who&apos;s winning the most chaotic election in Indian history
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">

        {/* ── 2. PARTY WAR ── */}
        <section>
          <h2 className="font-black text-2xl text-black uppercase mb-1 flex items-center gap-2">
            ⚔️ PARTY WAR
          </h2>
          <p className="text-black/40 font-mono text-xs mb-5">total votes across all seats</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {partyStandings.map((party, i) => {
              const pct = maxPartyVotes > 0 ? (party.totalVotes / maxPartyVotes) * 100 : 0
              const isLeader = i === 0
              return (
                <div
                  key={party.partyCode}
                  className="bg-white rounded-2xl border-4 border-black p-4 shadow-[4px_4px_0_black] relative"
                  style={{ borderColor: party.partyColor }}
                >
                  {isLeader && (
                    <span className="absolute -top-3 -right-3 text-2xl">🥇</span>
                  )}
                  <div
                    className="text-xl font-black mb-0.5"
                    style={{ color: party.partyColor }}
                  >
                    {party.partyCode}
                  </div>
                  <div className="text-[10px] font-bold text-black/50 leading-tight mb-3">
                    {party.partyName}
                  </div>
                  {/* bar */}
                  <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: 6, background: '#f0f0f0' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: party.partyColor, transition: 'width 0.6s ease' }}
                    />
                  </div>
                  <div className="font-black text-lg text-black">
                    {party.totalVotes.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-black/40 font-mono">
                    {party.candidateCount} candidates
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 3. TOP 10 CANDIDATES ── */}
        <section>
          <h2 className="font-black text-2xl text-black uppercase mb-1 flex items-center gap-2">
            🪳 TOP 10 CANDIDATES
          </h2>
          <p className="text-black/40 font-mono text-xs mb-5">ranked by total votes across all cycles</p>
          <div className="space-y-3">
            {topCandidates.map((c, i) => {
              const rank = i + 1
              const pct = maxVotes > 0 ? (c.voteCount / maxVotes) * 100 : 0
              const color = c.partyColor ?? '#7F77DD'
              return (
                <div
                  key={c.candidateId}
                  className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0_black] overflow-hidden"
                >
                  <div className="p-4">
                    {/* top row */}
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5 flex items-center justify-center w-8">
                        {rankBadge(rank)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <span
                            className="font-black text-lg text-[#1a1a2e] font-mono leading-tight"
                          >
                            {c.displayName}
                          </span>
                          <span className="font-black text-xl text-black shrink-0">
                            {c.voteCount.toLocaleString('en-IN')}
                            <span className="text-xs font-bold text-black/40 ml-1">votes</span>
                          </span>
                        </div>

                        {/* party badge */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {c.isIndependent ? (
                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                              Independent
                            </span>
                          ) : c.partyCode ? (
                            <span
                              className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                              style={{ background: color }}
                            >
                              {c.partyCode}
                            </span>
                          ) : null}
                          <span className="text-xs text-black/50 font-mono">
                            {c.seatName}, {c.state}
                          </span>
                        </div>

                        {/* manifesto */}
                        {c.manifesto && (
                          <p className="mt-2 text-sm text-gray-500 italic leading-relaxed">
                            &ldquo;{c.manifesto}&rdquo;
                          </p>
                        )}

                        {/* vote bar + view link */}
                        <div className="mt-3 flex items-center gap-3">
                          <div
                            className="flex-1 rounded-full overflow-hidden"
                            style={{ height: 5, background: '#f0f0f0' }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: color, transition: 'width 0.6s ease' }}
                            />
                          </div>
                          <button
                            onClick={() => router.push(`/seat/${c.seatNumber}`)}
                            className="shrink-0 text-xs font-black text-[#3C3489] hover:text-black transition-colors underline underline-offset-2"
                          >
                            VIEW SEAT →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 4. TRENDING RIGHT NOW ── */}
        <section>
          <h2 className="font-black text-2xl text-black uppercase mb-1 flex items-center gap-2">
            🔥 TRENDING RIGHT NOW
          </h2>
          <p className="text-black/40 font-mono text-xs mb-5">most votes in the last 24 hours</p>
          <div className="space-y-3">
            {trendingSeats.map((seat) => (
              <button
                key={seat.seatNumber}
                onClick={() => router.push(`/seat/${seat.seatNumber}`)}
                className="w-full text-left bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0_black] p-4 hover:bg-yellow-50 hover:shadow-[6px_6px_0_black] transition-all active:shadow-[2px_2px_0_black] active:translate-x-1 active:translate-y-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-black text-lg text-[#1a1a2e]">{seat.seatName}</div>
                    <div className="text-xs font-bold text-black/40 font-mono">{seat.state} · Seat #{seat.seatNumber}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-xl text-black">
                      {seat.recentVotes.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-black/40 font-mono">votes / 24h</div>
                    <div className="text-base mt-0.5">
                      {fireScale(seat.recentVotes, maxTrendVotes)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── 5. BOTTOM CTA ── */}
        <section className="pb-10 text-center">
          <div className="bg-black rounded-2xl border-4 border-yellow-300 p-8 shadow-[6px_6px_0_black]">
            <div className="text-5xl mb-3">🪳</div>
            <p className="text-white/60 font-mono text-sm mb-4">
              want to be on this list?
            </p>
            <button
              onClick={() => router.push('/file/1')}
              className="inline-block bg-yellow-300 text-black font-black text-xl px-10 py-4 rounded-2xl border-4 border-yellow-300 hover:bg-yellow-400 transition-colors shadow-[4px_4px_0_rgba(255,255,255,0.15)]"
            >
              FILE YOUR CANDIDACY →
            </button>
            <p className="text-yellow-300/30 font-mono text-xs mt-4">
              free · anonymous · instant · 543 seats available
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
