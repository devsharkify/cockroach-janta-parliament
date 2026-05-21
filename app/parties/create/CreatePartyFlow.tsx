'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFingerprint } from '@/lib/hooks/useFingerprint'
import { ALL_PARTIES } from '@/lib/types'

// ── 30 symbol slots — order: available first, taken last ──────────────────────
const ALL_SYMBOLS_30 = [
  // ── Available for new parties (not in ALL_PARTIES) ──
  '🚽🪳', '🎪🪳', '🦠🪳', '☠️🪳', '👑🪳', '🎭🪳', '🔮🪳', '🏹🪳',
  '⚔️🪳', '🎺🪳', '🌪️🪳', '💣🪳', '🧨🪳', '🕷️🪳', '🦂🪳',
  // ── Already allocated to existing parties (marked TAKEN) ──
  '🪳', '✋🪳', '🧹🪳', '🏠🪳', '💧🪳', '🦟🪳', '🪷🪳', '✊🪳',
  '⭐🪳', '🌊🪳', '🛡️🪳', '🔥🪳', '⚡🪳', '🏛️🪳', '🪔🪳',
]

// Build set of taken symbols from ALL_PARTIES
const TAKEN_SYMBOLS = new Set(ALL_PARTIES.map(p => p.symbol))

// First available symbol (not taken)
const FIRST_AVAILABLE = ALL_SYMBOLS_30.find(s => !TAKEN_SYMBOLS.has(s)) ?? ALL_SYMBOLS_30[0]

const MAX_NEW_PARTIES = 30

const PRESET_COLORS = [
  '#7F77DD', '#D85A30', '#1D9E75', '#D4537E',
  '#00BCD4', '#FF6F00', '#F57F17', '#E91E63',
  '#C0392B', '#8E44AD', '#16A085', '#2C3E50',
]

function isValidHex(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v)
}

export default function CreatePartyFlow() {
  const router = useRouter()
  const fingerprint = useFingerprint()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [customHex, setCustomHex] = useState('')
  const [symbol, setSymbol] = useState(FIRST_AVAILABLE)
  const [tagline, setTagline] = useState('')
  const [manifesto, setManifesto] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Party slot tracking
  const [slotsUsed, setSlotsUsed]   = useState<number | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(true)

  useEffect(() => {
    fetch('/api/parties')
      .then(r => r.json())
      .then((data: { is_founding?: boolean }[]) => {
        if (Array.isArray(data)) {
          const newPartyCount = data.filter(p => !p.is_founding).length
          setSlotsUsed(newPartyCount)
        }
      })
      .catch(() => setSlotsUsed(null))
      .finally(() => setLoadingSlots(false))
  }, [])

  useEffect(() => {
    if (isValidHex(customHex)) setColor(customHex)
  }, [customHex])

  const handleCodeChange = (v: string) => {
    setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
  }

  const slotsRemaining   = slotsUsed !== null ? MAX_NEW_PARTIES - slotsUsed : null
  const allSlotsFull     = slotsRemaining !== null && slotsRemaining <= 0
  const symbolTaken      = TAKEN_SYMBOLS.has(symbol)

  const codeValid        = /^[A-Z0-9]{2,6}$/.test(code)
  const nameValid        = name.trim().length >= 5 && name.trim().length <= 60
  const colorValid       = isValidHex(color)
  const taglineValid     = tagline.length <= 60
  const manifestoValid   = manifesto.length <= 200
  const canSubmit        = codeValid && nameValid && colorValid && taglineValid &&
                           manifestoValid && !!fingerprint && !symbolTaken && !allSlotsFull

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name: name.trim(),
          color,
          symbol,
          tagline: tagline.trim(),
          fingerprint,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }

      router.push(`/parties/${data.party.code}`)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="bg-[#3C3489] text-white px-4 pt-6 pb-10">
        <div className="max-w-4xl mx-auto">
          <a href="/parties" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
            ← Back to Parties
          </a>
          <div className="mt-4 text-5xl">🏴</div>
          <h1 className="mt-2 text-4xl font-black tracking-tight">START YOUR PARTY</h1>
          <p className="mt-1 text-white/60 text-sm">
            Build a movement. Contest seats. Rule the naali.
          </p>

          {/* Slot counter */}
          <div className="mt-4 flex items-center gap-3">
            {loadingSlots ? (
              <span className="text-white/40 text-sm font-mono">Loading slots...</span>
            ) : slotsRemaining !== null ? (
              <>
                <div className="flex-1 max-w-xs bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, ((slotsUsed ?? 0) / MAX_NEW_PARTIES) * 100)}%`,
                      background: allSlotsFull ? '#ef4444' : slotsRemaining <= 5 ? '#f59e0b' : '#4ade80',
                    }}
                  />
                </div>
                <span className={`text-sm font-black ${allSlotsFull ? 'text-red-400' : slotsRemaining <= 5 ? 'text-yellow-300' : 'text-green-300'}`}>
                  {allSlotsFull
                    ? '🔒 ALL 30 SLOTS TAKEN'
                    : `${slotsRemaining} / ${MAX_NEW_PARTIES} party slots remaining`}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Full slots wall */}
      {allSlotsFull && (
        <div className="max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-black text-[#3C3489] mb-2">Parliament is Full</h2>
          <p className="text-gray-500 font-mono text-sm">
            All 30 new party slots have been claimed. The roaches have spoken.
          </p>
          <a
            href="/parties"
            className="mt-6 inline-block px-6 py-3 bg-[#3C3489] text-white font-black rounded-xl border-4 border-black hover:bg-black transition-colors"
          >
            ← Browse Existing Parties
          </a>
        </div>
      )}

      {!allSlotsFull && (
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ── FORM ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Nalala disclaimer */}
            <div className="flex gap-2 items-start bg-yellow-50 border-2 border-yellow-300 rounded-xl px-4 py-3">
              <span className="text-lg shrink-0">⚠️</span>
              <p className="text-sm font-bold text-yellow-800 leading-snug">
                Your party must contest at least 10 seats — otherwise your candidates go to the{' '}
                <strong>Nalala</strong> category (the shame zone).
              </p>
            </div>

            {/* Party Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                Party Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={e => handleCodeChange(e.target.value)}
                placeholder="e.g. SKCP"
                maxLength={6}
                className={`w-full border-4 rounded-xl px-4 py-3 font-black text-lg tracking-wider uppercase bg-white focus:outline-none transition-colors ${
                  code && !codeValid ? 'border-red-400' : 'border-black focus:border-[#3C3489]'
                }`}
              />
              <p className="text-xs text-gray-400">2–6 uppercase letters or numbers</p>
            </div>

            {/* Party Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                Party Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.slice(0, 60))}
                placeholder="e.g. National Drain Defence Party"
                className={`w-full border-4 rounded-xl px-4 py-3 font-bold bg-white focus:outline-none transition-colors ${
                  name && !nameValid ? 'border-red-400' : 'border-black focus:border-[#3C3489]'
                }`}
              />
              <p className="text-xs text-gray-400">{name.length}/60 characters</p>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                Party Color <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setColor(c); setCustomHex('') }}
                    className="w-9 h-9 rounded-lg border-4 transition-transform hover:scale-110"
                    style={{ background: c, borderColor: color === c ? '#000' : 'transparent' }}
                    aria-label={c}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customHex}
                  onChange={e => setCustomHex(e.target.value)}
                  placeholder="#FF5722"
                  maxLength={7}
                  className="w-28 border-2 rounded-lg px-2 py-1.5 text-sm font-mono bg-white focus:outline-none border-gray-300 focus:border-[#3C3489]"
                />
                {isValidHex(customHex) && (
                  <div className="w-7 h-7 rounded-md border-2 border-gray-300" style={{ background: customHex }} />
                )}
                <span className="text-xs text-gray-400">Custom hex</span>
              </div>
            </div>

            {/* Symbol picker — 30 slots */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Party Symbol <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-gray-400">
                  {ALL_SYMBOLS_30.filter(s => !TAKEN_SYMBOLS.has(s)).length} available · {TAKEN_SYMBOLS.size} taken
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {ALL_SYMBOLS_30.map(s => {
                  const taken      = TAKEN_SYMBOLS.has(s)
                  const isSelected = symbol === s
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { if (!taken) setSymbol(s) }}
                      disabled={taken}
                      title={taken ? 'Already allocated to an existing party' : s}
                      className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl border-2 transition-all text-xl
                        ${taken
                          ? 'opacity-35 cursor-not-allowed border-gray-200 bg-gray-50 grayscale'
                          : isSelected
                            ? 'border-black bg-yellow-50 shadow-[2px_2px_0_black] scale-105'
                            : 'border-gray-200 bg-white hover:border-[#3C3489] hover:scale-105'
                        }`}
                    >
                      {s}
                      {taken && (
                        <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-red-500 text-white px-1 rounded leading-tight">
                          TAKEN
                        </span>
                      )}
                      {isSelected && !taken && (
                        <span className="absolute -top-1.5 -right-1.5 text-[8px] font-black bg-black text-yellow-300 px-1 rounded leading-tight">
                          ✓
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {symbolTaken && (
                <p className="text-red-500 text-xs font-bold">
                  ⚠ This symbol is already allocated — pick an available one above.
                </p>
              )}
              {!symbolTaken && (
                <p className="text-xs text-gray-400">
                  Selected: <span className="text-lg">{symbol}</span>
                  <span className="ml-2 text-green-600 font-bold">✓ Available</span>
                </p>
              )}
            </div>

            {/* Tagline */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value.slice(0, 60))}
                placeholder="e.g. Drains for the people"
                className="w-full border-4 border-black rounded-xl px-4 py-3 font-medium bg-white focus:outline-none focus:border-[#3C3489] transition-colors"
              />
              <p className="text-xs text-gray-400">{tagline.length}/60 characters</p>
            </div>

            {/* Manifesto */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-gray-500">Manifesto</label>
              <textarea
                value={manifesto}
                onChange={e => setManifesto(e.target.value.slice(0, 200))}
                placeholder="What does your party stand for? (max 200 chars)"
                rows={3}
                className="w-full border-4 border-black rounded-xl px-4 py-3 font-medium bg-white focus:outline-none focus:border-[#3C3489] transition-colors resize-none"
              />
              <p className="text-xs text-gray-400">{manifesto.length}/200 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full bg-yellow-300 text-black border-4 border-black font-black text-base py-3.5 rounded-xl hover:bg-black hover:text-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'LAUNCHING...' : '🏴 LAUNCH PARTY →'}
            </button>

            {!fingerprint && (
              <p className="text-xs text-gray-400 text-center">Loading identity... please wait</p>
            )}
          </form>

          {/* ── LIVE PREVIEW ── */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-black uppercase tracking-wider text-gray-400">Live Preview</p>

            <div
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              style={{ borderLeft: `8px solid ${color}` }}
            >
              <div className="px-5 py-4 flex items-center gap-3" style={{ background: color }}>
                <span className="text-5xl font-black text-white tracking-tight leading-none">
                  {code || 'CODE'}
                </span>
                <span className="text-3xl leading-none">{symbol}</span>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <div>
                  <h2 className="text-xl font-black text-[#1a1a2e]">
                    {name.trim() || 'Your Party Name'}
                  </h2>
                  <p className="text-sm italic text-gray-500 mt-0.5">
                    &ldquo;{tagline.trim() || 'Your tagline here'}&rdquo;
                  </p>
                </div>

                {manifesto && (
                  <p className="text-sm text-gray-600 leading-relaxed">{manifesto}</p>
                )}

                <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                  <span>0 candidates</span>
                  <span className="text-gray-300">|</span>
                  <span>0 votes</span>
                </div>

                <div
                  className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full text-white w-fit"
                  style={{ background: color }}
                >
                  ⚡ New party
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <div
                    className="flex-1 text-center border-4 font-black text-sm py-2.5 px-4 rounded-xl opacity-50 cursor-not-allowed"
                    style={{ borderColor: color, color }}
                  >
                    JOIN THIS PARTY →
                  </div>
                </div>
              </div>
            </div>

            {/* Slot info */}
            {slotsRemaining !== null && (
              <div className="flex gap-2 items-start bg-[#3C3489]/10 border border-[#3C3489]/20 rounded-xl px-4 py-3">
                <span className="text-base shrink-0">🏴</span>
                <p className="text-xs text-[#3C3489] leading-snug font-bold">
                  <strong>{slotsRemaining}</strong> of {MAX_NEW_PARTIES} new party slots remain.
                  Once all slots are taken, no new parties can be formed.
                </p>
              </div>
            )}

            {/* Nalala warning */}
            <div className="flex gap-2 items-start bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <span className="text-base shrink-0">🚽</span>
              <p className="text-xs text-gray-500 leading-snug">
                Contest fewer than <strong>10 seats</strong> and your candidates will be listed under{' '}
                <strong className="text-red-500">Nalala</strong> — the parliament&apos;s shame section.
                Recruit hard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
