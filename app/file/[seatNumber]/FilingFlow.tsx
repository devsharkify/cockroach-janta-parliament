'use client'

import { useState, useRef, useEffect } from 'react'
import { useFingerprint } from '@/lib/hooks/useFingerprint'

const PARTIES = [
  { id: 'CJP', code: 'CJP', name: 'Cockroach Janta Party',    color: '#7F77DD', tagline: 'Lazy, Loud, Lawful',            desc: 'The original roach establishment' },
  { id: 'ACP', code: 'ACP', name: 'Aam Cockroach Party',      color: '#1D9E75', tagline: 'Naali Sabki, Iss Baar Cockroach Ki', desc: "The people's pest, fighting for the naali" },
  { id: 'CCP', code: 'CCP', name: 'Cockroach Congress Party', color: '#D85A30', tagline: 'Old Roach Magic',               desc: 'Old roach, new tricks' },
  { id: 'RCP', code: 'RCP', name: 'Regional Cockroach Party', color: '#D4537E', tagline: 'Apni Galli Apna Kachra',        desc: 'Your galli, your party' },
  { id: 'IND', code: 'IND', name: 'Independent',              color: '#888888', tagline: 'No faction. Pure chaos.',        desc: 'No allegiance. Just vibes.' },
]

const STEP_ORDER: Step[] = ['name', 'code', 'manifesto', 'party', 'submit']
const STEP_LABELS = ['Identity', 'Claim Code', 'Manifesto', 'Party', 'Review']

type Step = 'name' | 'code' | 'manifesto' | 'party' | 'submit' | 'share'

interface FilingFlowProps { seatNumber: number }

export default function FilingFlow({ seatNumber }: FilingFlowProps) {
  const fingerprint = useFingerprint()
  const [step, setStep] = useState<Step>('name')
  const [candidateName, setCandidateName] = useState('')
  const [namePattern, setNamePattern] = useState('')
  const [claimCode, setClaimCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [manifesto, setManifesto] = useState('')
  const [selectedParty, setSelectedParty] = useState(PARTIES[0])
  const [isSpinning, setIsSpinning] = useState(false)
  const [isGeneratingManifesto, setIsGeneratingManifesto] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [seatName, setSeatName] = useState<string | null>(null)
  const manifestoRef = useRef<HTMLTextAreaElement>(null)

  // Fetch seat name on mount
  useEffect(() => {
    fetch(`/api/seats/${seatNumber}`)
      .then(r => r.json())
      .then(data => {
        if (data?.seat?.name) setSeatName(data.seat.name)
      })
      .catch(() => {/* silently ignore */})
  }, [seatNumber])

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
          claimCode: claimCode || undefined,
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

  function handleCodeContinue() {
    setCodeError('')
    if (claimCode === '' && confirmCode === '') {
      // Both empty — treat as skip
      setStep('manifesto')
      return
    }
    if (!/^\d{4}$/.test(claimCode)) {
      setCodeError('Code must be exactly 4 digits.')
      return
    }
    if (claimCode !== confirmCode) {
      setCodeError('Codes do not match. Try again.')
      return
    }
    setStep('manifesto')
  }

  function handleCodeSkip() {
    setClaimCode('')
    setConfirmCode('')
    setCodeError('')
    setStep('manifesto')
  }

  const codeValid = /^\d{4}$/.test(claimCode) && claimCode === confirmCode

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

  // Step bar helpers
  const currentStepIndex = step === 'share' ? 5 : STEP_ORDER.indexOf(step)

  // Manifesto counter color
  const charCount = manifesto.length
  const counterColor = charCount <= 200 ? 'text-green-400' : charCount <= 260 ? 'text-yellow-400' : 'text-red-400'

  // Header title
  const headerTitle = seatName
    ? <><span className="text-[#D4A017]">{seatName}</span> <span className="text-white/50">(#{seatNumber})</span></>
    : <span className="text-[#D4A017]">Seat #{seatNumber}</span>

  return (
    <div className="min-h-screen bg-[#3C3489] font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#3C3489]/95 backdrop-blur border-b-2 border-[#D4A017] px-4 py-3 flex items-center gap-3">
        <a href="/" className="text-2xl">🪳</a>
        <span className="text-white font-black text-sm">
          File Candidacy — {headerTitle}
        </span>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Step bar — shown for steps 1–5, not on share */}
        {step !== 'share' && (
          <div className="flex items-center gap-0 mb-8">
            {STEP_LABELS.map((label, i) => {
              const stepKey = STEP_ORDER[i]
              const isCurrent = step === stepKey
              const isDone = currentStepIndex > i
              return (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-2 border-black ${isDone ? 'bg-green-400' : isCurrent ? 'bg-yellow-300' : 'bg-white/20 border-white/20 text-white/50'}`}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <div className="text-[10px] font-black mt-1 text-center hidden sm:block text-white/60">{label}</div>
                  </div>
                  {i < 4 && (
                    <div className={`flex-1 h-1 mx-1 rounded ${isDone ? 'bg-green-400' : 'bg-white/20'}`} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── STEP 1: Name ── */}
        {step === 'name' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 1 of 5</p>
              <h1 className="text-3xl font-black text-white mb-1">Your Cockroach Identity</h1>
              <p className="text-white/50 text-sm">Auto-generated. Real names not allowed. Pure chaos.</p>
            </div>

            <div
              className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-[#D4A017]/50 transition-colors"
              onClick={!isSpinning ? spinName : undefined}
            >
              {isSpinning ? (
                <>
                  <div className="text-5xl mb-3 animate-spin inline-block">🪳</div>
                  <p className="text-white/60 text-sm font-mono mt-2">Generating your identity...</p>
                </>
              ) : candidateName ? (
                <>
                  <div className="text-5xl mb-3">🪳</div>
                  <p className="text-2xl font-black text-white mb-2">{candidateName}</p>
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
                className="flex-1 min-h-[48px] py-3 rounded-xl border-2 border-white/20 text-white font-black text-sm hover:border-white/40 transition-colors disabled:opacity-40"
              >
                {isSpinning ? '⚡ Spinning...' : '🔄 Spin Again'}
              </button>
              <button
                onClick={() => { if (candidateName) setStep('code') }}
                disabled={!candidateName}
                className="flex-1 min-h-[48px] py-3 rounded-xl font-black text-sm transition-colors disabled:opacity-30"
                style={{ backgroundColor: candidateName ? '#D4A017' : '#888', color: '#000' }}
              >
                Lock Name →
              </button>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {!candidateName && (
              <button
                onClick={spinName}
                className="w-full min-h-[56px] py-4 rounded-xl bg-white/5 border-2 border-[#D4A017] text-[#D4A017] font-black text-lg hover:bg-[#D4A017]/10 transition-colors"
              >
                🪳 Generate My Name
              </button>
            )}
          </div>
        )}

        {/* ── STEP 2: Claim Code ── */}
        {step === 'code' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 2 of 5</p>
              <div className="text-6xl mb-3">🔐</div>
              <h1 className="text-3xl font-black text-white mb-1">Your Secret Claim Code</h1>
            </div>

            {/* Info card */}
            <div className="rounded-2xl p-5 space-y-3" style={{ backgroundColor: '#1a0a2e', border: '2px solid #D4A017' }}>
              <p className="text-white/80 text-sm leading-relaxed">
                If you <span className="text-[#D4A017] font-black">WIN</span> this election, you&apos;ll need this code to claim your seat and receive the winner badge.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                We store only the hash. The raw code is never saved. <span className="font-black text-white">NEVER share it.</span>
              </p>
            </div>

            {/* Warning box */}
            <div className="rounded-xl p-4 border-2 border-red-500/60 bg-red-500/10">
              <p className="text-red-400 text-sm font-black">
                ⚠️ If you lose this code, you lose your seat even if you win.
              </p>
              <p className="text-red-300/70 text-xs mt-1">
                The seat will show as "SEAT VACANT — CODE LOST" and cannot be recovered.
              </p>
            </div>

            {/* Code input */}
            <div className="space-y-4">
              <div>
                <label className="block text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">
                  Enter 4-digit PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="[0-9]*"
                  value={claimCode}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setClaimCode(val)
                    setCodeError('')
                  }}
                  placeholder="••••"
                  className="w-full font-black text-3xl tracking-[1rem] text-center bg-[#1a0a2e] border-2 border-[#D4A017]/40 focus:border-[#D4A017] rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors"
                  style={{ letterSpacing: '1rem' }}
                />
              </div>

              <div>
                <label className="block text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="[0-9]*"
                  value={confirmCode}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setConfirmCode(val)
                    setCodeError('')
                  }}
                  placeholder="••••"
                  className="w-full font-black text-3xl tracking-[1rem] text-center bg-[#1a0a2e] border-2 border-[#D4A017]/40 focus:border-[#D4A017] rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none transition-colors"
                  style={{ letterSpacing: '1rem' }}
                />
              </div>

              {/* Confirmation indicator */}
              {codeValid && (
                <p className="text-green-400 text-sm font-black text-center">CLAIM CODE ENTERED ✓</p>
              )}

              {codeError && (
                <p className="text-red-400 text-sm text-center">{codeError}</p>
              )}

              {/* Screenshot reminder */}
              <p className="text-[#D4A017]/70 text-xs text-center">
                ⚠️ Screenshot this or memorize it — we cannot recover it for you.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('name')}
                className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-white/20 text-white/60 font-black text-sm hover:border-white/40 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleCodeContinue}
                className="flex-1 min-h-[48px] py-3 rounded-xl font-black text-sm transition-colors"
                style={{ backgroundColor: '#D4A017', color: '#000' }}
              >
                CONTINUE →
              </button>
            </div>

            <button
              onClick={handleCodeSkip}
              className="w-full min-h-[44px] py-3 rounded-xl border-2 border-red-500/30 text-red-400/70 font-black text-sm hover:border-red-500/60 hover:text-red-400 transition-colors"
            >
              SKIP (risky) — no code, seat may go vacant
            </button>
          </div>
        )}

        {/* ── STEP 3: Manifesto ── */}
        {step === 'manifesto' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 3 of 5</p>
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
                className="w-full bg-white/5 border-2 border-white/20 rounded-xl px-4 py-4 text-white font-mono text-base resize-none focus:outline-none focus:border-[#D4A017] placeholder:text-white/20 transition-colors"
              />
              {/* Character counter */}
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs font-mono font-black ${counterColor}`}>{charCount}/280</span>
                <span className={`text-xs ${manifesto.split('\n').length > 4 ? 'text-yellow-400' : 'text-white/30'}`}>
                  {manifesto.split('\n').length} / 4 lines
                </span>
              </div>
              {/* Color bar */}
              <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${charCount <= 200 ? 'bg-green-400' : charCount <= 260 ? 'bg-yellow-400' : 'bg-red-400'}`}
                  style={{ width: `${(charCount / 280) * 100}%` }}
                />
              </div>
            </div>

            {/* Hinglish tip */}
            <p className="text-white/40 text-xs text-center italic">
              Tip: Try Hinglish! Mix Hindi and English for maximum viral potential 🔥
            </p>

            <button
              onClick={generateManifesto}
              disabled={isGeneratingManifesto}
              className="w-full min-h-[48px] py-3 rounded-xl border-2 border-[#D4A017]/40 text-[#D4A017] font-black text-sm hover:border-[#D4A017] hover:bg-[#D4A017]/10 transition-colors disabled:opacity-40"
            >
              {isGeneratingManifesto ? '🤖 Generating...' : "🤖 Don't know what to write? Auto-generate"}
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('code')}
                className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-white/20 text-white/60 font-black text-sm hover:border-white/40 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => { if (manifesto.trim()) setStep('party') }}
                disabled={!manifesto.trim()}
                className="flex-1 min-h-[48px] py-3 rounded-xl font-black text-sm transition-colors disabled:opacity-30"
                style={{ backgroundColor: manifesto.trim() ? '#D4A017' : '#888', color: '#000' }}
              >
                Next: Pick Party →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Party ── */}
        {step === 'party' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 4 of 5</p>
              <h1 className="text-3xl font-black text-white mb-1">Pick Your Faction</h1>
              <p className="text-white/50 text-sm">Choose wisely. Or don't. It's all chaos.</p>
            </div>

            <div className="space-y-3">
              {PARTIES.map(party => (
                <button
                  key={party.id}
                  onClick={() => setSelectedParty(party)}
                  className="w-full flex items-center gap-4 px-4 py-5 rounded-xl border-2 transition-all text-left"
                  style={{
                    borderColor: selectedParty.id === party.id ? party.color : 'rgba(255,255,255,0.1)',
                    backgroundColor: selectedParty.id === party.id ? `${party.color}25` : 'rgba(255,255,255,0.03)',
                    boxShadow: selectedParty.id === party.id ? `0 4px 0 ${party.color}60` : 'none',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 border-2 border-black/20"
                    style={{ backgroundColor: party.color }}
                  >
                    {party.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm">{party.name}</p>
                    <p className="text-white/50 text-xs italic mt-0.5">{party.desc}</p>
                  </div>
                  {selectedParty.id === party.id && (
                    <span className="text-[#D4A017] text-xl shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('manifesto')}
                className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-white/20 text-white/60 font-black text-sm hover:border-white/40 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('submit')}
                className="flex-1 min-h-[48px] py-3 rounded-xl font-black text-sm"
                style={{ backgroundColor: '#D4A017', color: '#000' }}
              >
                Review & File →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Review & Submit ── */}
        {step === 'submit' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-[#D4A017] text-xs font-mono uppercase tracking-widest mb-2">Step 5 of 5</p>
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
                    <p className="text-white/50 text-xs">Seat #{seatNumber}{seatName ? ` — ${seatName}` : ''}</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <p className="text-[#D4A017] text-xs font-mono mb-1 uppercase tracking-wider">Manifesto</p>
                  <p className="text-white/80 text-sm font-mono whitespace-pre-line">{manifesto}</p>
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center gap-2">
                  <span className="text-sm">🔐</span>
                  <p className="text-white/50 text-xs font-mono">
                    {claimCode ? 'Claim code set ✓' : 'No claim code (seat may go vacant if you win)'}
                  </p>
                </div>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-xl p-3">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setStep('party')}
                className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-white/20 text-white/60 font-black text-sm hover:border-white/40 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={submitCandidacy}
                disabled={isSubmitting || !fingerprint}
                className="flex-1 min-h-[48px] py-4 rounded-xl font-black text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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

        {/* ── STEP 6: Share ── */}
        {step === 'share' && candidateId && (
          <div className="space-y-6 text-center">
            <div>
              <div className="text-7xl mb-4">🎉</div>
              <h1 className="text-3xl font-black text-white mb-1">You&apos;re In!</h1>
              <p className="text-[#D4A017] font-mono text-sm mb-1">{candidateName}</p>
              <p className="text-white/50 text-sm">
                is now contesting {seatName ? `${seatName} (Seat #${seatNumber})` : `Seat #${seatNumber}`} under {selectedParty.name}
              </p>
            </div>

            {/* OG Image preview */}
            {ogUrl && (
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4A017]/30 max-h-64 flex items-center justify-center bg-[#3C3489]">
                <img src={ogUrl} alt="Your candidate card" className="max-h-64 object-contain" />
              </div>
            )}

            <div className="space-y-3">
              {/* WhatsApp — PRIMARY for India */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`🪳 I'm running for ${seatName ?? `Seat #${seatNumber}`} in the Cockroach Janta Parliament!\n\nMy manifesto: "${manifesto.slice(0, 100)}..."\n\nVote for me at cockroachparliament.in/seat/${seatNumber}\n\n#CockroachJantaParliament #MainBhiCockroach`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-black text-lg rounded-xl border-4 border-black shadow-[4px_4px_0_black] hover:bg-green-600 transition-colors"
              >
                📱 Share on WhatsApp
              </a>

              <button
                onClick={shareToIG}
                className="w-full min-h-[48px] py-4 rounded-xl font-black text-base"
                style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: 'white' }}
              >
                📸 Share on Instagram Story
              </button>

              <button
                onClick={async () => {
                  try { await navigator.share({ title: candidateName, url: shareUrl }) }
                  catch { navigator.clipboard?.writeText(shareUrl) }
                }}
                className="w-full min-h-[48px] py-3 rounded-xl border-2 border-white/20 text-white font-black text-sm hover:border-white/40 transition-colors"
              >
                🔗 Copy Candidate Link
              </button>

              <a
                href={`/seat/${seatNumber}`}
                className="block w-full min-h-[48px] py-3 rounded-xl border-2 border-[#D4A017]/30 text-[#D4A017] font-black text-sm hover:border-[#D4A017] transition-colors"
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
