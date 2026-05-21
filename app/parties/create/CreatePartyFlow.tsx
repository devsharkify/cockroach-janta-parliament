'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFingerprint } from '@/lib/hooks/useFingerprint'

const EMOJI_OPTIONS = [
  '🪳','🦟','🐛','🐜','🦂','🦎','🐍','🐢','🦀','🦞',
  '🐸','🐊','🐉','🦁','🐯','🐺','🦊','🐻','🐼','🦝',
  '🔥','💧','🌊','⚡','🌪️','🏔️','🌋','🌵','🌴','🌿',
  '⭐','🌟','💥','🎯','🎪','🏴','🚩','⚔️','🛡️','👑',
  '🪔','🔱','♾️','🌐','🗺️','🧲','⚙️','🔩','🪛','🔮',
]

const COLOR_PRESETS = [
  '#7F77DD','#D85A30','#1D9E75','#D4537E','#00BCD4','#FF6F00',
  '#F57F17','#5D4037','#1B5E20','#880E4F','#004D40','#6A1B9A',
  '#0D47A1','#BF360C','#37474F','#4A148C','#B71C1C','#1A237E',
  '#F9A825','#E91E63','#009688','#78909C','#FF5722','#263238',
]

type Step = 'code' | 'name' | 'look' | 'tagline' | 'review' | 'done'
const STEPS: Step[] = ['code', 'name', 'look', 'tagline', 'review']

interface PartyDraft {
  code: string
  name: string
  symbol: string
  color: string
  tagline: string
}

export default function CreatePartyFlow() {
  const router = useRouter()
  const fingerprint = useFingerprint()

  const [step, setStep] = useState<Step>('code')
  const [draft, setDraft] = useState<PartyDraft>({
    code: '',
    name: '',
    symbol: '🪳',
    color: '#FF5722',
    tagline: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdCode, setCreatedCode] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState('#FF5722')

  const currentIdx = STEPS.indexOf(step as Step)

  function set<K extends keyof PartyDraft>(key: K, val: PartyDraft[K]) {
    setDraft(d => ({ ...d, [key]: val }))
    setError(null)
  }

  function validateAndNext() {
    setError(null)
    if (step === 'code') {
      const code = draft.code.trim().toUpperCase()
      if (!/^[A-Z0-9]{2,6}$/.test(code)) {
        setError('Code must be 2–6 uppercase letters or numbers. No spaces.')
        return
      }
      set('code', code)
      setStep('name')
    } else if (step === 'name') {
      if (draft.name.trim().length < 5 || draft.name.trim().length > 60) {
        setError('Party name must be 5–60 characters.')
        return
      }
      setStep('look')
    } else if (step === 'look') {
      setStep('tagline')
    } else if (step === 'tagline') {
      if (draft.tagline.trim().length > 60) {
        setError('Tagline must be at most 60 characters.')
        return
      }
      setStep('review')
    }
  }

  async function submit() {
    if (!fingerprint) {
      setError('Loading your identity… please wait a moment.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: draft.code,
          name: draft.name.trim(),
          color: draft.color,
          tagline: draft.tagline.trim(),
          symbol: draft.symbol,
          fingerprint,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }
      setCreatedCode(data.party.code)
      setStep('done')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Done screen ────────────────────────────────────────────────────────────
  if (step === 'done' && createdCode) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-sm w-full">
          {/* Confetti row */}
          <div className="text-5xl mb-4 animate-bounce">{draft.symbol}</div>
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-black text-white text-2xl mb-4"
            style={{ background: draft.color }}
          >
            {draft.code}
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase">
            Party Born! 🪳
          </h1>
          <p className="text-white/60 font-mono text-sm mb-8">
            <span className="text-white font-black">{draft.name}</span> is now a registered cockroach party.
            Contest seats, get votes, win the naali.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/file?party=${createdCode}`)}
              className="w-full py-4 rounded-2xl bg-yellow-300 text-black font-black text-base border-4 border-black shadow-[4px_4px_0_black] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              🪳 CONTEST A SEAT NOW →
            </button>
            <button
              onClick={() => router.push(`/parties/${createdCode}`)}
              className="w-full py-3 rounded-xl font-black text-white/60 text-sm hover:text-white transition-colors"
            >
              View your party →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: Code ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Header */}
      <div className="bg-[#3C3489] text-white px-4 pt-6 pb-8">
        <div className="max-w-lg mx-auto">
          <a href="/parties" className="text-sm font-bold text-white/60 hover:text-white transition-colors">
            ← Back to Parties
          </a>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">
            🪳 Start a Party
          </h1>
          <p className="text-white/50 text-sm mt-1 font-mono">
            4 steps. 30 slots left in parliament.
          </p>

          {/* Progress dots */}
          <div className="flex gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="h-1.5 rounded-full flex-1 transition-all"
                style={{
                  background: i <= currentIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* ── STEP: CODE ── */}
        {step === 'code' && (
          <div>
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-1">Pick your party code</h2>
            <p className="text-sm text-gray-500 mb-6 font-mono">
              2–6 characters. All caps. This is your party&apos;s identity in parliament. Choose wisely.
            </p>
            <input
              type="text"
              maxLength={6}
              className="w-full px-5 py-4 border-4 border-black rounded-2xl text-3xl font-black tracking-widest uppercase text-center focus:outline-none focus:border-[#3C3489] bg-white"
              placeholder="e.g. DRCP"
              value={draft.code}
              onChange={e => set('code', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && validateAndNext()}
              autoFocus
            />
            <p className="text-xs text-gray-400 font-mono text-center mt-2">
              {draft.code.length}/6 chars · only A–Z and 0–9
            </p>
            {/* Examples */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['DRCP','NPCX','KPP','ROACH','ZBP','KKP'].map(eg => (
                <button
                  key={eg}
                  onClick={() => set('code', eg)}
                  className="px-3 py-1.5 rounded-xl border-2 border-gray-300 font-black text-sm text-gray-600 hover:border-[#3C3489] hover:text-[#3C3489] transition-colors"
                >
                  {eg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: NAME ── */}
        {step === 'name' && (
          <div>
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-1">What&apos;s your party called?</h2>
            <p className="text-sm text-gray-500 mb-6 font-mono">
              Full official name. 5–60 characters. Make it sound important.
            </p>
            <input
              type="text"
              maxLength={60}
              className="w-full px-5 py-4 border-4 border-black rounded-2xl text-xl font-black focus:outline-none focus:border-[#3C3489] bg-white"
              placeholder="e.g. Drain Rights Cockroach Party"
              value={draft.name}
              onChange={e => set('name', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && validateAndNext()}
              autoFocus
            />
            <p className="text-xs text-gray-400 font-mono text-right mt-2">
              {draft.name.trim().length}/60
            </p>
            {/* Suggestions */}
            <div className="mt-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Need inspiration?</p>
              <div className="flex flex-col gap-2">
                {[
                  'National Drain Rights Congress',
                  'All India Cockroach Liberation Front',
                  'Gutter Suraksha Morcha',
                  'Kachra Mukti Party',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => set('name', s)}
                    className="text-left px-4 py-2 rounded-xl border-2 border-gray-200 font-bold text-sm text-gray-700 hover:border-[#3C3489] hover:text-[#3C3489] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP: LOOK ── */}
        {step === 'look' && (
          <div>
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-1">Party color &amp; symbol</h2>
            <p className="text-sm text-gray-500 mb-5 font-mono">
              Choose your party&apos;s look. This is how you&apos;ll appear in every seat.
            </p>

            {/* Preview pill */}
            <div className="flex justify-center mb-6">
              <div
                className="flex items-center gap-3 px-6 py-3 rounded-2xl border-4 border-black font-black text-white text-xl shadow-[4px_4px_0_black]"
                style={{ background: draft.color }}
              >
                <span className="text-3xl">{draft.symbol}</span>
                <span className="tracking-widest">{draft.code || 'XYZ'}</span>
              </div>
            </div>

            {/* Color grid */}
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Color</p>
            <div className="grid grid-cols-8 gap-2 mb-3">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c}
                  onClick={() => { set('color', c); setCustomColor(c) }}
                  className="w-full aspect-square rounded-xl border-4 transition-all hover:scale-110"
                  style={{
                    background: c,
                    borderColor: draft.color === c ? 'black' : 'transparent',
                    boxShadow: draft.color === c ? '0 0 0 2px black' : 'none',
                  }}
                />
              ))}
            </div>
            {/* Custom color */}
            <div className="flex items-center gap-3 mb-6">
              <input
                type="color"
                value={customColor}
                onChange={e => { setCustomColor(e.target.value); set('color', e.target.value) }}
                className="w-10 h-10 rounded-xl border-2 border-gray-300 cursor-pointer"
              />
              <span className="font-mono text-sm text-gray-500">Custom color</span>
              <span className="font-mono text-xs text-gray-400">{draft.color}</span>
            </div>

            {/* Symbol grid */}
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Symbol</p>
            <div className="grid grid-cols-10 gap-1.5">
              {EMOJI_OPTIONS.map(em => (
                <button
                  key={em}
                  onClick={() => set('symbol', em)}
                  className="w-full aspect-square rounded-xl text-2xl flex items-center justify-center border-4 transition-all hover:scale-110"
                  style={{
                    borderColor: draft.symbol === em ? 'black' : 'transparent',
                    background: draft.symbol === em ? 'rgba(0,0,0,0.08)' : 'white',
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: TAGLINE ── */}
        {step === 'tagline' && (
          <div>
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-1">Party tagline</h2>
            <p className="text-sm text-gray-500 mb-6 font-mono">
              Your battle cry. Max 60 characters. Optional but powerful.
            </p>
            <input
              type="text"
              maxLength={60}
              className="w-full px-5 py-4 border-4 border-black rounded-2xl text-xl font-black italic focus:outline-none focus:border-[#3C3489] bg-white"
              placeholder="e.g. Naali is our birthright"
              value={draft.tagline}
              onChange={e => set('tagline', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && validateAndNext()}
              autoFocus
            />
            <p className="text-xs text-gray-400 font-mono text-right mt-2">
              {draft.tagline.length}/60
            </p>
            <div className="mt-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Slogans from the drain</p>
              <div className="flex flex-col gap-2">
                {[
                  'Naali is our birthright',
                  'From the gutter, for the gutter',
                  'One drain, one destiny',
                  'Kachra se kranthi',
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => set('tagline', s)}
                    className="text-left px-4 py-2 rounded-xl border-2 border-gray-200 font-bold text-sm italic text-gray-700 hover:border-[#3C3489] hover:text-[#3C3489] transition-colors"
                  >
                    &ldquo;{s}&rdquo;
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { set('tagline', ''); validateAndNext() }}
              className="mt-4 text-sm text-gray-400 hover:text-gray-700 font-bold transition-colors w-full text-center"
            >
              Skip tagline →
            </button>
          </div>
        )}

        {/* ── STEP: REVIEW ── */}
        {step === 'review' && (
          <div>
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-1">Review your party</h2>
            <p className="text-sm text-gray-500 mb-6 font-mono">
              One cockroach parliament. No refunds. No returns. Confirm below.
            </p>

            {/* Big preview card */}
            <div
              className="rounded-3xl border-4 border-black overflow-hidden shadow-[6px_6px_0_black] mb-6"
            >
              {/* Colour band */}
              <div
                className="px-6 py-5 flex items-center gap-4"
                style={{ background: draft.color }}
              >
                <span className="text-5xl">{draft.symbol}</span>
                <div>
                  <div className="text-4xl font-black text-white tracking-widest leading-none">{draft.code}</div>
                  <div className="text-sm text-white/80 font-mono mt-0.5">{draft.name}</div>
                </div>
              </div>
              {/* Info */}
              <div className="bg-white px-6 py-4">
                {draft.tagline && (
                  <p className="text-base italic text-gray-500 mb-3">&ldquo;{draft.tagline}&rdquo;</p>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Code</p>
                    <p className="font-black text-[#1a1a2e]">{draft.code}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Symbol</p>
                    <p className="text-xl">{draft.symbol}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Color</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200" style={{ background: draft.color }} />
                      <span className="font-mono text-sm text-gray-600">{draft.color}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {(['code','name','look','tagline'] as Step[]).map(s => (
                <button
                  key={s}
                  onClick={() => { setError(null); setStep(s) }}
                  className="px-4 py-2 rounded-xl border-2 border-gray-300 text-sm font-black text-gray-500 hover:border-[#3C3489] hover:text-[#3C3489] transition-colors capitalize"
                >
                  Edit {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-50 border-2 border-red-400 rounded-xl text-sm font-bold text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* CTA button */}
        {step !== 'done' && (
          <div className="mt-8">
            {step === 'review' ? (
              <button
                onClick={submit}
                disabled={isSubmitting || !fingerprint}
                className="w-full py-4 rounded-2xl bg-yellow-300 text-black font-black text-base border-4 border-black shadow-[4px_4px_0_black] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? '🪳 Registering...' : '🪳 LAUNCH THIS PARTY →'}
              </button>
            ) : (
              <button
                onClick={validateAndNext}
                className="w-full py-4 rounded-2xl bg-black text-white font-black text-base border-4 border-black shadow-[4px_4px_0_black] hover:bg-[#3C3489] transition-all"
              >
                Continue →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
