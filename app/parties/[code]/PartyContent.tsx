'use client'

import { useRouter } from 'next/navigation'
import type { TopCandidate } from '@/app/api/parties/[code]/route'

type Party = {
  id: string
  code: string
  name: string
  color: string
  tagline: string
  is_founding: boolean
}

type Props = {
  party: Party
  topCandidates: TopCandidate[]
  totalCandidates: number
  totalVotes: number
}

function formatNumber(n: number): string {
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(1)}L`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export default function PartyContent({ party, topCandidates, totalCandidates, totalVotes }: Props) {
  const router = useRouter()
  const maxVotes = Math.max(...topCandidates.map((c) => c.voteCount), 1)

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Hero */}
      <div
        className="text-white px-4 pt-6 pb-12"
        style={{ background: party.color }}
      >
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/parties')}
            className="text-sm font-bold text-white/70 hover:text-white transition-colors"
          >
            ← Back to all parties
          </button>

          <div className="mt-6 text-7xl font-black tracking-tight leading-none">
            {party.code}
          </div>
          <h1 className="mt-2 text-2xl font-black">{party.name}</h1>
          <p className="mt-1 text-white/70 text-base italic">&ldquo;{party.tagline}&rdquo;</p>

          <div className="mt-4 flex flex-wrap gap-6 text-sm font-bold text-white/80">
            <span>{totalCandidates} candidates</span>
            <span>{formatNumber(totalVotes)} votes cast</span>
            {party.is_founding && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-black text-white">
                FOUNDING PARTY
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Top candidates */}
        <section>
          <h2 className="text-xl font-black text-[#1a1a2e] mb-4">TOP CANDIDATES</h2>

          {topCandidates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🪳</div>
              <p className="text-lg font-black text-[#3C3489] mb-1">No roaches have filed for this party yet.</p>
              <p className="text-gray-500 text-sm">Be the first to represent.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCandidates.map((candidate, idx) => {
                const percent = maxVotes > 0 ? (candidate.voteCount / maxVotes) * 100 : 0
                return (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                    style={{ borderLeft: `6px solid ${party.color}` }}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg font-black text-gray-300 w-6 shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="text-xl">🪳</span>
                          <span className="font-black text-lg text-[#1a1a2e] truncate">
                            {candidate.displayName}
                          </span>
                        </div>
                        <button
                          onClick={() => router.push(`/seat/${candidate.seatNumber}`)}
                          className="shrink-0 text-xs font-black px-3 py-1.5 rounded-xl border-4 border-black hover:bg-black hover:text-white transition-colors"
                        >
                          SEAT {candidate.seatNumber}
                        </button>
                      </div>

                      <div className="mt-2">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: party.color }}
                        >
                          {party.code}
                        </span>
                      </div>

                      {candidate.manifesto && (
                        <p className="mt-3 text-sm text-gray-600 italic leading-relaxed">
                          &ldquo;{candidate.manifesto}&rdquo;
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1" style={{ height: 4, background: '#f5f5f5', borderRadius: 2 }}>
                          <div
                            style={{
                              height: 4,
                              background: party.color,
                              borderRadius: 2,
                              width: percent + '%',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                        <span className="text-xs font-black text-gray-500 shrink-0">
                          {formatNumber(candidate.voteCount)} vote{candidate.voteCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="pb-8">
          <button
            onClick={() => router.push(`/file?party=${party.code}`)}
            className="w-full text-black border-4 border-black font-black text-xl py-5 rounded-2xl transition-colors"
            style={{ background: '#facc15' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000'
              e.currentTarget.style.color = '#facc15'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#facc15'
              e.currentTarget.style.color = '#000'
            }}
          >
            CONTEST FOR {party.code} 🪳
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/parties')}
              className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to all parties
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
