'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFingerprint } from '@/lib/hooks/useFingerprint'

const PRESET_COLORS = [
  '#7F77DD', '#D85A30', '#1D9E75', '#D4537E',
  '#00BCD4', '#FF6F00', '#F57F17', '#E91E63',
]

function isValidHex(v: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(v)
}

export default function CreatePartyPage() {
  const router = useRouter()
  const fingerprint = useFingerprint()

  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [customHex, setCustomHex] = useState('')
  const [tagline, setTagline] = useState('')
  const [manifesto, setManifesto] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync color from custom hex input
  useEffect(() => {
    if (isValidHex(customHex)) setColor(customHex)
  }, [customHex])

  const handleCodeChange = (v: string) => {
    setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
  }

  const codeValid = /^[A-Z0-9]{2,6}$/.test(code)
  const nameValid = name.trim().length >= 5 && name.trim().length <= 60
  const colorValid = isValidHex(color)
  const taglineValid = tagline.length <= 60
  const manifestoValid = manifesto.length <= 200
  const canSubmit = codeValid && nameValid && colorValid && taglineValid && manifestoValid && !!fingerprint

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
        </div>
      </div>

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
                  style={{
                    background: c,
                    borderColor: color === c ? '#000' : 'transparent',
                  }}
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
            {/* Color band */}
            <div className="px-5 py-4" style={{ background: color }}>
              <span className="text-5xl font-black text-white tracking-tight leading-none">
                {code || 'CODE'}
              </span>
            </div>

            {/* Card body */}
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

          {/* Nalala warning if active */}
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
    </div>
  )
}
