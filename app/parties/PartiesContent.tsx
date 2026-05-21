'use client'

import { useRouter } from 'next/navigation'
import type { PartyData } from '@/app/api/parties/route'
import { ALL_PARTIES } from '@/lib/types'

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

const TOTAL_SEATS = 543
const NALALA_THRESHOLD = 10

function formatNumber(n: number): string {
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(1)}L`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

function PartyCard({ party, router }: { party: PartyData; router: ReturnType<typeof useRouter> }) {
  const copy = PARTY_COPY[party.code] ?? { description: '', funnyStat: '#1 in something' }
  const meta = ALL_PARTIES.find(p => p.code === party.code)
  const symbol = meta?.symbol ?? '🪳'
  const persona = meta?.persona ?? ''
  const isNalala = party.candidateCount < NALALA_THRESHOLD

  return (
    <div
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
      style={{ borderLeft: `8px solid ${party.color}` }}
    >
      {/* Color band header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{ background: party.color }}
      >
        <span className="text-5xl font-black text-white tracking-tight leading-none">
          {party.code}
        </span>
        <span className="text-3xl leading-none">{symbol}</span>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1a1a2e]">{party.name}</h2>
          <p className="text-sm italic text-gray-500 mt-0.5">&ldquo;{party.tagline}&rdquo;</p>
          {persona && (
            <span
              className="inline-flex items-center mt-1.5 text-xs font-black px-2.5 py-1 rounded-full text-white"
              style={{ background: party.color }}
            >
              {persona}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{copy.description}</p>

        {/* Stats row */}
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 flex-wrap">
          <span>{party.candidateCount} candidates</span>
          <span className="text-gray-300">·</span>
          <span>{formatNumber(party.totalVotes)} votes</span>
        </div>

        {/* Nalala progress bar */}
        {isNalala ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-red-600">{party.candidateCount}/{NALALA_THRESHOLD} seats — NALALA RISK ⚠️</span>
            </div>
            <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{ width: `${(party.candidateCount / NALALA_THRESHOLD) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-black text-green-700">
            <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full w-full" />
            </div>
            <span className="shrink-0">✓ Nalala-safe</span>
          </div>
        )}

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
            onClick={() => router.push(`/file?party=${party.code}`)}
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
}

export default function PartiesContent({ parties }: { parties: PartyData[] }) {
  const router = useRouter()

  const safeParties = parties.filter(p => p.candidateCount >= NALALA_THRESHOLD)
  const nalalaParties = parties.filter(p => p.candidateCount < NALALA_THRESHOLD)

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
            {parties.length} parties. One parliament. Infinite naali drama.
          </p>

          {/* Parliament Strength summary */}
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 flex flex-col gap-2">
            <p className="text-xs font-black uppercase tracking-wider text-white/70">
              Parliament Strength — {TOTAL_SEATS} total seats
            </p>
            <div className="flex flex-wrap gap-2">
              {safeParties.map(p => (
                <span
                  key={p.code}
                  className="inline-flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full bg-green-500/20 text-green-300"
                >
                  ✓ {p.code}
                </span>
              ))}
              {nalalaParties.map(p => (
                <span
                  key={p.code}
                  className="inline-flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full bg-red-500/20 text-red-300"
                >
                  ⚠️ {p.code}
                </span>
              ))}
            </div>
            {safeParties.length > 0 && (
              <p className="text-xs text-white/50">
                {safeParties.length} nalala-safe · {nalalaParties.length} at risk
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Safe parties grid */}
      {safeParties.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <h2 className="text-lg font-black text-[#1a1a2e] mb-4 uppercase tracking-wider">
            ✅ Nalala-Safe Parties ({safeParties.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safeParties.map(party => (
              <PartyCard key={party.id} party={party} router={router} />
            ))}
          </div>
        </div>
      )}

      {/* Nalala parties section */}
      {nalalaParties.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-8 pb-8">
          <h2 className="text-lg font-black text-red-600 mb-1 uppercase tracking-wider">
            ⚠️ In the Nalala ({nalalaParties.length})
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            These parties have fewer than {NALALA_THRESHOLD} candidates and are at risk of being flushed. Join them to save their naali rights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nalalaParties.map(party => (
              <PartyCard key={party.id} party={party} router={router} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom padding when both sections render */}
      {safeParties.length > 0 && nalalaParties.length === 0 && (
        <div className="pb-8" />
      )}
    </div>
  )
}
