'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CONSTITUENCIES } from '@/lib/constituencies'

const PARTIES = [
  { code: 'CJP', name: 'Cockroach Janta Party',    color: '#7F77DD', emoji: '🟣', tagline: 'Lazy, Loud, Lawful' },
  { code: 'ACP', name: 'Aam Cockroach Party',       color: '#1D9E75', emoji: '🟢', tagline: 'Naali Sabki, Iss Baar Cockroach Ki' },
  { code: 'CCP', name: 'Cockroach Congress Party',  color: '#D85A30', emoji: '🟠', tagline: 'Old Roach Magic' },
  { code: 'RCP', name: 'Regional Cockroach Party',  color: '#D4537E', emoji: '🔴', tagline: 'Apni Galli Apna Kachra' },
  { code: 'IND', name: 'Independent',               color: '#888888', emoji: '⚪', tagline: 'No faction. Pure chaos.' },
]

export default function FilePickerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedState, setSelectedState] = useState('')
  const [selectedSeatNum, setSelectedSeatNum] = useState('')
  const [selectedParty, setSelectedParty] = useState<string | null>(null)
  const [error, setError] = useState('')

  // pre-select party from URL if navigated from a party page
  useEffect(() => {
    const p = searchParams.get('party')
    if (p && PARTIES.find(x => x.code === p)) setSelectedParty(p)
  }, [searchParams])

  // pre-select state + constituency from ?seat= param (from HotSeats)
  useEffect(() => {
    const seatParam = searchParams.get('seat')
    if (!seatParam) return
    const seatNum = parseInt(seatParam, 10)
    for (const stateObj of CONSTITUENCIES) {
      const found = stateObj.seats.find(s => s.number === seatNum)
      if (found) {
        setSelectedState(stateObj.state)
        setSelectedSeatNum(String(seatNum))
        break
      }
    }
  }, [searchParams])

  // reset constituency when state changes (only via user interaction, not from ?seat= param)
  // handled in the select onChange below

  const stateSeats = CONSTITUENCIES.find(c => c.state === selectedState)?.seats ?? []
  const selectedSeat = stateSeats.find(s => String(s.number) === selectedSeatNum)
  const selectedPartyObj = PARTIES.find(p => p.code === selectedParty)

  function handleFile() {
    if (!selectedSeatNum) { setError('Pick a constituency first 🪳'); return }
    if (!selectedParty)   { setError('Pick a party (or go Independent)'); return }
    setError('')
    router.push(`/file/${selectedSeatNum}?party=${selectedParty}`)
  }

  const selectClass =
    'w-full border-4 border-black rounded-xl font-mono bg-white px-4 py-3 text-base focus:outline-none focus:border-[#7F77DD] appearance-none cursor-pointer'

  return (
    <div className="min-h-screen bg-yellow-300 flex flex-col">

      {/* Header strip */}
      <div className="bg-black text-yellow-300 py-3 px-4 flex items-center gap-3 border-b-4 border-black">
        <Link href="/" className="text-yellow-300/60 hover:text-yellow-300 font-black text-sm">← HOME</Link>
        <span className="text-yellow-300/30">|</span>
        <span className="font-black text-sm uppercase tracking-widest">File Your Candidacy</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-2">🪳</div>
            <h1 className="text-4xl font-black text-black uppercase leading-tight" style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.12)' }}>
              WHERE DO YOU<br />WANT TO CONTEST?
            </h1>
            <p className="text-black/55 font-mono text-sm mt-2">
              Pick your state → constituency → party. Then file.
            </p>
          </div>

          <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0_black] space-y-5">

            {/* Step 1 — State */}
            <div>
              <label className="block font-black text-xs uppercase tracking-widest text-black/50 mb-1.5">
                1. Your State / UT
              </label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={e => { setSelectedState(e.target.value); setSelectedSeatNum('') }}
                  className={selectClass}
                >
                  <option value="">— Select State / UT —</option>
                  {CONSTITUENCIES.map(c => (
                    <option key={c.state} value={c.state}>{c.state}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40 text-lg">▾</span>
              </div>
            </div>

            {/* Step 2 — Constituency */}
            <div className={selectedState ? '' : 'opacity-40 pointer-events-none'}>
              <label className="block font-black text-xs uppercase tracking-widest text-black/50 mb-1.5">
                2. Constituency
                {selectedState && <span className="ml-2 text-[#7F77DD]">({stateSeats.length} seats)</span>}
              </label>
              <div className="relative">
                <select
                  value={selectedSeatNum}
                  onChange={e => { setSelectedSeatNum(e.target.value); setError('') }}
                  className={selectClass}
                  disabled={!selectedState}
                >
                  <option value="">— Select Constituency —</option>
                  {stateSeats.map(s => (
                    <option key={s.number} value={s.number}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40 text-lg">▾</span>
              </div>
              {selectedSeat && (
                <p className="text-xs font-mono text-black/40 mt-1.5 ml-1">
                  Constituency #{selectedSeat.number} · {selectedState}
                </p>
              )}
            </div>

            {/* Step 3 — Party */}
            <div className={(selectedSeatNum ? '' : 'opacity-40 pointer-events-none')}>
              <label className="block font-black text-xs uppercase tracking-widest text-black/50 mb-2">
                3. Pick Your Gang
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PARTIES.map(p => (
                  <button
                    key={p.code}
                    onClick={() => { setSelectedParty(p.code); setError('') }}
                    disabled={!selectedSeatNum}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-4 text-left transition-all"
                    style={{
                      borderColor: selectedParty === p.code ? p.color : '#e5e7eb',
                      background: selectedParty === p.code ? p.color + '18' : '#fff',
                      boxShadow: selectedParty === p.code ? `3px 3px 0 ${p.color}` : 'none',
                    }}
                  >
                    <span className="text-xl shrink-0">{p.emoji}</span>
                    <span className="flex-1 min-w-0">
                      <span className="font-black text-sm text-black block">{p.code} — {p.name}</span>
                      <span className="font-mono text-xs text-black/45 truncate block">{p.tagline}</span>
                    </span>
                    {selectedParty === p.code && (
                      <span className="shrink-0 font-black text-sm" style={{ color: p.color }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 font-bold text-sm text-center">{error}</p>
            )}

            {/* Summary + CTA */}
            {selectedSeat && selectedPartyObj && (
              <div
                className="rounded-xl border-4 border-black p-3 text-sm font-mono bg-yellow-50"
              >
                <p className="font-black text-black mb-0.5">📋 Your filing:</p>
                <p className="text-black/70">
                  🗺️ <strong>{selectedSeat.name}</strong> (#{selectedSeat.number}), {selectedState}
                </p>
                <p className="text-black/70">
                  🏴 <strong style={{ color: selectedPartyObj.color }}>{selectedPartyObj.code}</strong> — {selectedPartyObj.name}
                </p>
              </div>
            )}

            <button
              onClick={handleFile}
              disabled={!selectedSeatNum || !selectedParty}
              className="w-full py-4 bg-black text-yellow-300 font-black text-lg border-4 border-black rounded-xl hover:bg-[#7F77DD] transition-colors disabled:opacity-35 disabled:cursor-not-allowed shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
            >
              🪳 FILE CANDIDACY →
            </button>

            <p className="text-center text-black/35 font-mono text-xs">
              Free · Anonymous · Results every Saturday 11PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
