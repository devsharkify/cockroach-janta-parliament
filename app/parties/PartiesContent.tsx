'use client'

import { useRouter } from 'next/navigation'
import type { PartyData } from '@/app/api/parties/route'

const PARTY_COPY: Record<string, { description: string; funnyStat: string }> = {
  CJP: {
    description: 'The original roach establishment. If you want to win and don\'t know why, CJP is for you.',
    funnyStat: '#1 in naali coverage',
  },
  ACP: {
    description: 'The people\'s pest. Fighting for the naali since the naali was a ditch.',
    funnyStat: '#1 in chaos',
  },
  CCP: {
    description: 'Old roach, new tricks. We\'ve been in the drain longer than you\'ve been alive.',
    funnyStat: '#1 in legacy drain rights',
  },
  RCP: {
    description: 'Your galli, your party. We only contest where our roaches live.',
    funnyStat: '#1 in hyper-local kachra',
  },
}

function formatNumber(n: number): string {
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(1)}L`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export default function PartiesContent({ parties }: { parties: PartyData[] }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Page header */}
      <div className="bg-[#3C3489] text-white px-4 pt-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <a
            href="/"
            className="text-sm font-bold text-white/70 hover:text-white transition-colors"
          >
            ← Back to Parliament
          </a>
          <div className="mt-4 text-5xl">🪳</div>
          <h1 className="mt-2 text-4xl font-black tracking-tight">PARTIES</h1>
          <p className="mt-1 text-white/60 text-sm">
            Four parties. One parliament. Infinite naali drama.
          </p>
        </div>
      </div>

      {/* Party grid */}
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {parties.map((party) => {
          const copy = PARTY_COPY[party.code] ?? { description: '', funnyStat: '#1 in something' }

          return (
            <div
              key={party.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              style={{ borderLeft: `8px solid ${party.color}` }}
            >
              {/* Color band header */}
              <div
                className="px-5 py-4"
                style={{ background: party.color }}
              >
                <span className="text-5xl font-black text-white tracking-tight leading-none">
                  {party.code}
                </span>
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#1a1a2e]">{party.name}</h2>
                  <p className="text-sm italic text-gray-500 mt-0.5">&ldquo;{party.tagline}&rdquo;</p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{copy.description}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                  <span>{party.candidateCount} candidates</span>
                  <span className="text-gray-300">|</span>
                  <span>{formatNumber(party.totalVotes)} votes</span>
                </div>

                {/* Funny stat badge */}
                <div
                  className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full text-white w-fit"
                  style={{ background: party.color }}
                >
                  ⚡ {copy.funnyStat}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <button
                    onClick={() => router.push(`/file/1?party=${party.code}`)}
                    className="flex-1 bg-yellow-300 text-black border-4 border-black font-black text-sm py-2.5 px-4 rounded-xl hover:bg-black hover:text-yellow-300 transition-colors text-center"
                  >
                    JOIN THIS PARTY →
                  </button>
                  <button
                    onClick={() => router.push(`/parties/${party.code}`)}
                    className="flex-1 border-4 font-black text-sm py-2.5 px-4 rounded-xl transition-colors text-center"
                    style={{
                      borderColor: party.color,
                      color: party.color,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.background = party.color
                      el.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.background = 'transparent'
                      el.style.color = party.color
                    }}
                  >
                    VIEW CANDIDATES →
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
