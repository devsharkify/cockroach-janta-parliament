'use client'

import { useState, useRef } from 'react'
import { useFingerprint } from '@/lib/hooks/useFingerprint'

const PARTIES = [
  { id: 'CJP', code: 'CJP', name: 'Cockroach Janta Party',    color: '#7F77DD', tagline: 'Lazy, Loud, Lawful' },
  { id: 'CCP', code: 'CCP', name: 'Cockroach Congress Party', color: '#D85A30', tagline: 'Old Roach Magic' },
  { id: 'ACP', code: 'ACP', name: 'Aam Cockroach Party',      color: '#1D9E75', tagline: 'Naali Sabki, Iss Baar Cockroach Ki' },
  { id: 'RCP', code: 'RCP', name: 'Regional Cockroach Party', color: '#D4537E', tagline: 'Apni Galli Apna Kachra' },
  { id: 'IND', code: 'IND', name: 'Independent',              color: '#888888', tagline: 'No faction. Pure chaos.' },
]

type Step = 'name' | 'manifesto' | 'party' | 'submit' | 'share'

interface FilingFlowProps { seatNumber: number }

export default function FilingFlow({ seatNumber }: FilingFlowProps) {
  const fingerprint = useFingerprint()
  const [step, setStep] = useState<Step>('name')
  const [candidateName, setCandidateName] = useState('')
  const [namePattern, setNamePattern] = useState('')
  const [manifesto, setManifesto] = useState('')
  const [selectedParty, setSelectedParty] = useState(PARTIES[0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [isGeneratingManifesto, setIsGeneratingManifesto] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const manifestoRef = useRef<HTMLTextAreaElement>(null)

  async function spinName() {
    setIsSpinning(true)
    setError(null)
    try {
      const res = await fetch('/api/names/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatNumber }),
      })
      const data = await res.json()
      setCandidateName(data.name)
      setNamePattern(data.pattern)
    } catch {
      setError('Could not generate name. Try again.')
    }
    setIsSpinning(false)
  }

  async function generateManifesto() {
    setIsGeneratingManifesto(true)
    setError(null)
    try {
      const res = await fetch('/api/manifesto/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: candidateName,
          seat: `Seat ${seatNumber}`,
          state: 'India',
          party: selectedParty.name,
        }),
      })
      const data = await res.json()
      setManifesto(data.manifesto.slice(0, 280))
    } catch {
      setError('Could not generate manifesto. Write your own!')
    }
    setIsGeneratingManifesto(false)
  }

  async function submitCandidacy() {
    if (!fingerprint) { setError('Loading identity... please wait a moment.'); return }
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatNumber,
          displayName: candidateName,
          manifesto,
          partyId: selectedParty.id === 'IND' ? null : selectedParty.id,
          isIndependent: selectedParty.id === 'IND',
          fingerprint,
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error ?? 'Filing failed. Try again.')
        setIsSubmitting(false)
        return
      }
      setCandidateId(data.id)
      setStep('share')
    } catch {
      setError('Filing failed. Try again.')
    }
    setIsSubmitting(false)
  }

  const ogUrl = candidateId
    ? `/api/og/candidate?name=${encodeURIComponent(candidateName)}&seat=Seat%20${seatNumber}&party=${encodeURIComponent(selectedParty.code)}&color=${encodeURIComponent(selectedParty.color)}&manifesto=${encodeURIComponent(manifesto)}`
    : null

  const shareUrl = candidateId ? `${typeof window !== 'undefined' ? window.location.origin : ''}/candidate/${candidateId}` : ''

  async function shareToIG() {
    if (!ogUrl) return
    try {
      await navigator.share({ title: `I'm contesting from Seat ${seatNumber}!`, url: shareUrl })
    } catch {
      window.open(`https://www.instagram.com/`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-[#3C3489] font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#3C3489]/95 backdrop-blur border-b-2 border-[#D4A017] px-4 py-3 flex items-center gap-3">
        <a href="/" className="text-2xl">🪳</a>
        <span className="text-white font-black text-sm">
          File Candidacy — <span className="text-[#D4A017]">Seat #{seatNumber}</span>
        </span>
        <div className="ml-auto flex gap-1">
          {(['name', 'manifesto', 'party', 'submit'] as const).map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === s || (step === 'share' && i <= 3)
                  ? 'bg-[#D4A017]'
                  : ['name','manifesto','party','submit'].indexOf(step) > i
                  ? 'bg-[#D4A017]'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">

        {/* ── STEP 1: Name ── */}
        {step === 'name' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 1 of 4</p>
              <h1 className="text-3xl font-black text-white mb-1">Your Cockroach Identity</h1>
              <p className="text-white/50 text-sm">Auto-generated. Real names not allowed. Pure chaos.</p>
            </div>

            <div
              className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-[#D4A017]/50 transition-colors"
              onClick={!isSpinning ? spinName : undefined}
            >
              {candidateName ? (
                <>
                  <div className="text-5xl mb-3">🪳</div>
                  <p className={`text-2xl font-black text-white mb-2 transition-all ${isSpinning ? 'opacity-30 blur-sm' : ''}`}>
                    {candidateName}
                  </p>
                  <p className="text-white/30 text-xs font-mono">{namePattern}</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3 opacity-40">🪳</div>
                  <p className="text-white/40 text-sm">Tap to generate your identity</p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={spinName}
                disabled={isSpinning}
                className="flex-1 py-3 rounded-xl border-2 border-white/20 text-white font-black text-sm hover:border-white/40 transition-colors disabled:opacity-40"
              >
                {isSpinning ? '⚡ Spinning...' : '🔄 Spin Again'}
              </button>
              <button
                onClick={() => { if (candidateName) setStep('manifesto') }}
                disabled={!candidateName}
                className="flex-1 py-3 rounded-xl font-black text-sm transition-colors disabled:opacity-30"
                style={{ backgroundColor: candidateName ? '#D4A017' : '#888', color: '#000' }}
              >
                Lock Name →
              </button>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {!candidateName && (
              <button onClick={spinName} className="w-full py-4 rounded-xl bg-white/5 border-2 border-[#D4A017] text-[#D4A017] font-black text-lg hover:bg-[#D4A017]/10 transition-colors">
                🪳 Generate My Name
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2: Manifesto ── */}
        {step === 'manifesto' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 2 of 4</p>
              <h1 className="text-3xl font-black text-white mb-1">Your Manifesto</h1>
              <p className="text-white/50 text-sm">4 lines. 280 chars. What do you stand for?</p>
            </div>

            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-4">
              <p className="text-[#D4A017] text-xs font-mono mb-1">Filing as</p>
              <p className="text-white font-black">{candidateName}</p>
            </div>

            <div className="relative">
              <textarea
                ref={manifestoRef}
                value={manifesto}
                onChange={e => setManifesto(e.target.value.slice(0, 280))}
                placeholder={'Naali meri, vote tera.\nKachra saaf, future bright.\n...'}
                rows={6}
                className="w-full bg-white/5 border-2 border-white/20 rounded-xl p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-[#D4A017] placeholder:text-white/20 transition-colors"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/30 text-xs">{manifesto.length}/280</span>
                <span className={`text-xs ${manifesto.split('\n').length > 4 ? 'text-yellow-400' : 'text-white/30'}`}>
                  {manifesto.split('\n').length} / 4 lines
                </span>
              </div>
            </div>

            <button
              onClick={generateManifesto}
              disabled={isGeneratingManifesto}
              className="w-full py-3 rounded-xl border-2 border-[#D4A017]/40 text-[#D4A017] font-black text-sm hover:border-[#D4A017] hover:bg-[#D4A017]/10 transition-colors disabled:opacity-40"
            >
              {isGeneratingManifesto ? '🤖 Generating...' : "🤖 Don't know what to write? Auto-generate"}
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep('name')} className="px-5 py-3 rounded-xl border-2 border-white/20 text-white/60 font-black text-sm hover:border-white/40 transition-colors">
                ← Back
              </button>
              <button
                onClick={() => { if (manifesto.trim()) setStep('party') }}
                disabled={!manifesto.trim()}
                className="flex-1 py-3 rounded-xl font-black text-sm transition-colors disabled:opacity-30"
                style={{ backgroundColor: manifesto.trim() ? '#D4A017' : '#888', color: '#000' }}
              >
                Next: Pick Party →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Party ── */}
        {step === 'party' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 3 of 4</p>
              <h1 className="text-3xl font-black text-white mb-1">Pick Your Faction</h1>
              <p className="text-white/50 text-sm">Choose wisely. Or don't. It's all chaos.</p>
            </div>

            <div className="space-y-2">
              {PARTIES.map(party => (
                <button
                  key={party.id}
                  onClick={() => setSelectedParty(party)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: selectedParty.id === party.id ? party.color : 'rgba(255,255,255,0.1)',
                    backgroundColor: selectedParty.id === party.id ? `${party.color}20` : 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0"
                    style={{ backgroundColor: party.color }}
                  >
                    {party.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm">{party.name}</p>
                    <p className="text-white/40 text-xs italic">{party.tagline}</p>
                  </div>
                  {selectedParty.id === party.id && (
                    <span className="text-[#D4A017] text-lg shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('manifesto')} className="px-5 py-3 rounded-xl border-2 border-white/20 text-white/60 font-black text-sm hover:border-white/40 transition-colors">
                ← Back
              </button>
              <button
                onClick={() => setStep('submit')}
                className="flex-1 py-3 rounded-xl font-black text-sm"
                style={{ backgroundColor: '#D4A017', color: '#000' }}
              >
                Review & File →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Review & Submit ── */}
        {step === 'submit' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 4 of 4</p>
              <h1 className="text-3xl font-black text-white mb-1">Review & File</h1>
              <p className="text-white/50 text-sm">This is your moment. No turning back.</p>
            </div>

            {/* Candidate card preview */}
            <div className="border-2 rounded-2xl overflow-hidden" style={{ borderColor: selectedParty.color }}>
              <div className="p-3 text-white font-black text-xs text-center" style={{ backgroundColor: selectedParty.color }}>
                {selectedParty.code} — {selectedParty.name}
              </div>
              <div className="bg-white/5 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🪳</span>
                  <div>
                    <p className="text-white font-black text-lg">{candidateName}</p>
                    <p className="text-white/50 text-xs">Seat #{seatNumber}</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-[#D4A017] text-xs font-mono mb-1 uppercase tracking-wider">Manifesto</p>
                  <p className="text-white/80 text-sm font-mono whitespace-pre-line">{manifesto}</p>
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-xl p-3">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep('party')} className="px-5 py-3 rounded-xl border-2 border-white/20 text-white/60 font-black text-sm hover:border-white/40 transition-colors">
                ← Back
              </button>
              <button
                onClick={submitCandidacy}
                disabled={isSubmitting || !fingerprint}
                className="flex-1 py-4 rounded-xl font-black text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#D4A017', color: '#000' }}
              >
                {isSubmitting ? '⚡ Filing...' : '🪳 File My Candidacy'}
              </button>
            </div>

            {!fingerprint && (
              <p className="text-white/40 text-xs text-center">Loading your identity...</p>
            )}
          </div>
        )}

        {/* ── STEP 5: Share ── */}
        {step === 'share' && candidateId && (
          <div className="space-y-6 text-center">
            <div>
              <div className="text-7xl mb-4">🎉</div>
              <h1 className="text-3xl font-black text-white mb-1">You're In!</h1>
              <p className="text-[#D4A017] font-mono text-sm mb-1">{candidateName}</p>
              <p className="text-white/50 text-sm">is now contesting Seat #{seatNumber} under {selectedParty.name}</p>
            </div>

            {/* OG Image preview */}
            {ogUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4A017]/30 max-h-64 flex items-center justify-center bg-[#3C3489]">
                <img src={ogUrl} alt="Your candidate card" className="max-h-64 object-contain" />
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={shareToIG}
                className="w-full py-4 rounded-xl font-black text-base"
                style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: 'white' }}
              >
                📸 Share on Instagram Story
              </button>

              <button
                onClick={async () => {
                  try { await navigator.share({ title: candidateName, url: shareUrl }) }
                  catch { navigator.clipboard?.writeText(shareUrl) }
                }}
                className="w-full py-3 rounded-xl border-2 border-white/20 text-white font-black text-sm hover:border-white/40 transition-colors"
              >
                🔗 Copy Candidate Link
              </button>

              <a
                href={`/seat/${seatNumber}`}
                className="block w-full py-3 rounded-xl border-2 border-[#D4A017]/30 text-[#D4A017] font-black text-sm hover:border-[#D4A017] transition-colors"
              >
                🏛️ View My Seat →
              </a>
            </div>

            <p className="text-white/30 text-xs font-mono">
              Candidacy is live. Share your post on IG to rally votes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
