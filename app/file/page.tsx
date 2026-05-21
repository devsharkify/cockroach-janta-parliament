'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CONSTITUENCIES } from '@/lib/constituencies'
import { ALL_PARTIES } from '@/lib/types'

const PARTIES = ALL_PARTIES.filter(p => p.code !== 'IND').concat(
  ALL_PARTIES.filter(p => p.code === 'IND')
)

type SeatCandidate = {
  partyCode: string | null
  partyName: string | null
}

export default function FilePickerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedState, setSelectedState] = useState('')
  const [selectedSeatNum, setSelectedSeatNum] = useState('')
  const [selectedParty, setSelectedParty] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [takenPartyCodes, setTakenPartyCodes] = useState<Set<string>>(new Set())
  const [seatCandidates, setSeatCandidates] = useState<SeatCandidate[]>([])
  const [fetchingParties, setFetchingParties] = useState(false)

  // pre-select party from URL
  useEffect(() => {
    const p = searchParams.get('party')
    if (p && PARTIES.find(x => x.code === p)) setSelectedParty(p)
  }, [searchParams])

  // pre-select state + constituency from ?seat= param
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

  // Fetch taken party codes when seat changes
  useEffect(() => {
    if (!selectedSeatNum) {
      setTakenPartyCodes(new Set())
      setSeatCandidates([])
      return
    }
    setFetchingParties(true)
    fetch(`/api/seats/${selectedSeatNum}`)
      .then(r => r.json())
      .then(data => {
        const taken = new Set<string>()
        const candidateList: SeatCandidate[] = []
        if (Array.isArray(data.candidates)) {
          for (const c of data.candidates) {
            if (c.partyCode && c.partyCode !== 'IND') taken.add(c.partyCode)
            candidateList.push({ partyCode: c.partyCode, partyName: c.partyName })
          }
        }
        setTakenPartyCodes(taken)
        setSeatCandidates(candidateList)
      })
      .catch(() => {})
      .finally(() => setFetchingParties(false))
  }, [selectedSeatNum])

  const stateSeats = CONSTITUENCIES.find(c => c.state === selectedState)?.seats ?? []
  const selectedSeat = stateSeats.find(s => String(s.number) === selectedSeatNum)
  const selectedPartyObj = PARTIES.find(p => p.code === selectedParty)

  // Party candidate summary
  const partyCandidateCounts: Record<string, { name: string; count: number; color: string }> = {}
  for (const c of seatCandidates) {
    if (!c.partyCode || c.partyCode === 'IND') continue
    const partyInfo = PARTIES.find(p => p.code === c.partyCode) ?? { name: c.partyName ?? c.partyCode, color: '#888888' }
    if (!partyCandidateCounts[c.partyCode]) {
      partyCandidateCounts[c.partyCode] = { name: partyInfo.name, count: 0, color: partyInfo.color }
    }
    partyCandidateCounts[c.partyCode].count++
  }
  const contestingParties = Object.entries(partyCandidateCounts)

  function handleFile() {
    if (!selectedSeatNum) { setError('Pick a constituency first 🪳'); return }
    if (!selectedParty)   { setError('Pick a party (or go Independent)'); return }
    setError('')
    router.push(`/file/${selectedSeatNum}?party=${selectedParty}`)
  }

  const selectClass =
    'w-full border-2 border-black/20 rounded-xl font-mono bg-white/90 px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 appearance-none cursor-pointer transition-colors'

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT: Form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 lg:max-w-[52%] bg-black flex flex-col">

        {/* Header strip */}
        <div className="px-6 pt-5 pb-4 border-b border-white/10 flex items-center gap-3">
          <Link href="/" className="text-yellow-300/50 hover:text-yellow-300 font-black text-xs tracking-widest">
            ← HOME
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-yellow-300 font-black text-xs uppercase tracking-widest">Contest</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-10 lg:px-10">

          {/* Hero text */}
          <div className="mb-8">
            <div className="text-5xl mb-3">🪳</div>
            <h1 className="text-4xl lg:text-5xl font-black text-white uppercase leading-none mb-2">
              WHERE WILL<br />
              <span className="text-yellow-300">YOU CONTEST?</span>
            </h1>
            <p className="text-white/40 font-mono text-sm">
              543 seats · all free · results every Saturday 11PM IST
            </p>
          </div>

          {/* Form card */}
          <div className="space-y-5">

            {/* Step 1 — State */}
            <div>
              <label className="block font-black text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                1 · Your State / UT
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
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40">▾</span>
              </div>
            </div>

            {/* Step 2 — Constituency */}
            <div className={selectedState ? '' : 'opacity-30 pointer-events-none'}>
              <label className="block font-black text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                2 · Constituency
                {selectedState && (
                  <span className="ml-2 text-yellow-300 normal-case font-mono">{stateSeats.length} seats</span>
                )}
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
                    <option key={s.number} value={s.number}>{s.name}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/40">▾</span>
              </div>
              {selectedSeat && (
                <p className="text-xs font-mono text-white/25 mt-1 ml-1">
                  #{selectedSeat.number} · {selectedState}
                </p>
              )}
            </div>

            {/* Step 3 — Party */}
            <div className={selectedSeatNum ? '' : 'opacity-30 pointer-events-none'}>
              <label className="block font-black text-[10px] uppercase tracking-widest text-white/40 mb-2">
                3 · Pick Your Gang
              </label>

              {/* Contested parties */}
              {selectedSeatNum && !fetchingParties && contestingParties.length > 0 && (
                <div className="mb-3 p-3 bg-yellow-300/10 border border-yellow-300/30 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-wider text-yellow-300/70 mb-2">
                    Already filed in this seat:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {contestingParties.map(([code, info]) => (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
                        style={{ background: info.color }}
                      >
                        {code} — {info.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto pr-0.5">
                {PARTIES.map(p => {
                  const isContested = takenPartyCodes.has(p.code)
                  const isSelected  = selectedParty === p.code
                  return (
                    <button
                      key={p.code}
                      onClick={() => { setSelectedParty(p.code); setError('') }}
                      disabled={!selectedSeatNum}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all"
                      style={{
                        borderColor: isSelected ? p.color : isContested ? '#f59e0b44' : '#ffffff15',
                        background:  isSelected ? `${p.color}22` : isContested ? '#f59e0b08' : '#ffffff08',
                      }}
                    >
                      <span className="text-lg shrink-0">{p.symbol}</span>
                      <span className="flex-1 min-w-0">
                        <span className="font-black text-xs text-white block">{p.code} — {p.name}</span>
                        {isContested ? (
                          <span className="font-mono text-[10px] text-amber-400 block">⚠ CONTESTED — JOIN ANYWAY?</span>
                        ) : (
                          <span className="font-mono text-[10px] text-white/30 block truncate">{p.tagline}</span>
                        )}
                      </span>
                      {isSelected && <span className="font-black text-sm shrink-0" style={{ color: p.color }}>✓</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-400 font-bold text-sm">{error}</p>}

            {/* Summary */}
            {selectedSeat && selectedPartyObj && (
              <div className="rounded-xl border border-yellow-300/20 p-3 text-xs font-mono bg-yellow-300/5">
                <p className="text-yellow-300/60 mb-1">📋 Filing:</p>
                <p className="text-white/70">🗺 <strong className="text-white">{selectedSeat.name}</strong> #{selectedSeat.number} · {selectedState}</p>
                <p className="text-white/70">🏴 <strong style={{ color: selectedPartyObj.color }}>{selectedPartyObj.code}</strong> — {selectedPartyObj.name}</p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleFile}
              disabled={!selectedSeatNum || !selectedParty}
              className="w-full py-4 bg-yellow-300 text-black font-black text-lg rounded-xl border-4 border-yellow-300 hover:bg-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed shadow-[0_4px_0_rgba(212,173,23,0.4)]"
            >
              🪳 CONTEST →
            </button>

            <p className="text-center text-white/20 font-mono text-xs">
              Free · Anonymous · No ID required
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Hero image panel ───────────────────────────────────────── */}
      <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/parliament-hero.png"
          alt="Cockroach Janta Parliament Elections"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* dark overlay at left edge so it blends with form panel */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 35%)' }}
        />
        {/* Bottom badge */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
          <span className="bg-black/70 backdrop-blur text-yellow-300 font-black text-xs px-4 py-2 rounded-full border border-yellow-300/30 tracking-widest uppercase">
            🏛️ Cockroach Janta Parliament Elections
          </span>
          <span className="text-white/40 font-mono text-[10px]">Unity · Survival · Progress</span>
        </div>
      </div>

      {/* ── MOBILE: show image as banner above form ───────────────────────── */}
      <div className="lg:hidden w-full h-48 relative overflow-hidden order-first border-b-4 border-yellow-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/parliament-hero.png"
          alt="Cockroach Janta Parliament Elections"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end p-4">
          <h2 className="text-white font-black text-xl uppercase leading-none">
            🪳 File Your<br />Candidacy
          </h2>
        </div>
      </div>

    </div>
  )
}
