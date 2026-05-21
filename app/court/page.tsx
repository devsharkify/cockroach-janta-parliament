'use client'

import { useState, useEffect, useCallback } from 'react'
import { useFingerprint } from '@/lib/hooks/useFingerprint'
import { NATIONAL_COURT_POSITIONS, STATE_COURT_POSITIONS } from '@/lib/courtPositions'
import type { CourtPosition } from '@/lib/courtPositions'

const MAX_VOTES = 1000
const LS_VOTES_KEY = 'court_votes_used'

interface PositionWithCount extends CourtPosition {
  applicant_count: number
}

interface Application {
  id: string
  applicant_name: string
  reason: string
  vote_count: number
  fingerprint: string
}

interface ActivePosition {
  position: CourtPosition
  applications: Application[]
  loading: boolean
  applied: boolean
  newApp: Application | null
}

export default function CourtPage() {
  const fingerprint = useFingerprint()
  const [positions, setPositions] = useState<PositionWithCount[]>([])
  const [loadingPositions, setLoadingPositions] = useState(true)
  const [active, setActive] = useState<ActivePosition | null>(null)
  const [form, setForm] = useState({ name: '', reason: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [votesUsed, setVotesUsed] = useState(0)
  const [votingId, setVotingId] = useState<string | null>(null)

  // Load votes used from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LS_VOTES_KEY)
    if (stored) setVotesUsed(parseInt(stored, 10) || 0)
  }, [])

  // Fetch all positions with counts
  useEffect(() => {
    fetch('/api/court?all=1')
      .then(r => r.json())
      .then(data => {
        if (data.positions) setPositions(data.positions)
      })
      .catch(() => {})
      .finally(() => setLoadingPositions(false))
  }, [])

  const openPosition = useCallback(async (pos: CourtPosition) => {
    if (active?.position.id === pos.id) {
      setActive(null)
      return
    }
    setActive({ position: pos, applications: [], loading: true, applied: false, newApp: null })
    setForm({ name: '', reason: '' })
    setFormError(null)
    try {
      const res = await fetch(`/api/court?position_id=${pos.id}`)
      const data = await res.json()
      setActive(prev => prev ? { ...prev, applications: data.applications ?? [], loading: false } : null)
    } catch {
      setActive(prev => prev ? { ...prev, loading: false } : null)
    }
  }, [active?.position.id])

  async function handleApply() {
    if (!fingerprint) { setFormError('Loading identity... please wait.'); return }
    const name = form.name.trim()
    const reason = form.reason.trim()
    if (name.length < 3 || name.length > 40) { setFormError('Name must be 3–40 characters'); return }
    if (reason.length < 1 || reason.length > 120) { setFormError('Reason must be 1–120 characters'); return }
    setSubmitting(true)
    setFormError(null)
    try {
      const res = await fetch('/api/court', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ positionId: active!.position.id, applicantName: name, reason, fingerprint }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { setFormError(data.error ?? 'Failed to apply'); setSubmitting(false); return }
      const newApp: Application = data.application
      setActive(prev => prev ? {
        ...prev,
        applied: true,
        newApp,
        applications: [newApp, ...prev.applications],
      } : null)
      // Update count in positions list
      setPositions(ps => ps.map(p => p.id === active!.position.id ? { ...p, applicant_count: p.applicant_count + 1 } : p))
    } catch {
      setFormError('Failed to apply. Try again.')
    }
    setSubmitting(false)
  }

  async function handleVote(app: Application) {
    if (!fingerprint || votesUsed >= MAX_VOTES || votingId) return
    setVotingId(app.id)
    try {
      const res = await fetch('/api/court/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: app.id, positionId: active!.position.id, fingerprint }),
      })
      const data = await res.json()
      if (data.ok) {
        const newUsed = data.votesUsed ?? votesUsed + 1
        setVotesUsed(newUsed)
        localStorage.setItem(LS_VOTES_KEY, String(newUsed))
        setActive(prev => prev ? {
          ...prev,
          applications: prev.applications.map(a => a.id === app.id ? { ...a, vote_count: a.vote_count + 1 } : a),
        } : null)
      }
    } catch {}
    setVotingId(null)
  }

  const nationalPositions = positions.filter(p => p.level === 'national')
  const statePositions = positions.filter(p => p.level === 'state')

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#1a0050' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b-4 border-black" style={{ backgroundColor: '#1a0050' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <a href="/" className="text-yellow-300 font-black text-sm hover:text-yellow-200 transition-colors">
            ← PARLIAMENT
          </a>
          <span className="text-white/20">|</span>
          <span className="text-white font-black text-sm tracking-widest uppercase">Janta Supreme Court</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-3">🏛️</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight uppercase">
            JANTA SUPREME COURT
          </h1>
          <p className="font-mono text-lg" style={{ color: '#D4A017' }}>
            38 robes. Zero mercy. Full chaos.
          </p>
          <div className="mt-4 inline-block border-4 border-black bg-yellow-300 px-4 py-1 shadow-[4px_4px_0_black]">
            <span className="font-black text-black text-sm">
              {votesUsed}/{MAX_VOTES} VOTES USED
            </span>
          </div>
        </div>

        {loadingPositions ? (
          <div className="text-center py-20">
            <div className="text-5xl animate-spin inline-block mb-4">🪳</div>
            <p className="text-white/50 font-mono">Loading court positions...</p>
          </div>
        ) : (
          <>
            {/* NATIONAL BENCH */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 flex-1 bg-yellow-300/30" />
                <h2 className="font-black text-white text-xl uppercase tracking-widest">National Bench</h2>
                <div className="h-1 flex-1 bg-yellow-300/30" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {nationalPositions.map(pos => (
                  <PositionCard
                    key={pos.id}
                    pos={pos}
                    active={active}
                    form={form}
                    formError={formError}
                    submitting={submitting}
                    votesUsed={votesUsed}
                    votingId={votingId}
                    fingerprint={fingerprint}
                    maxVotes={MAX_VOTES}
                    onOpen={openPosition}
                    onFormChange={setForm}
                    onApply={handleApply}
                    onVote={handleVote}
                  />
                ))}
              </div>
            </section>

            {/* STATE HIGH COURTS */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 flex-1 bg-yellow-300/30" />
                <h2 className="font-black text-white text-xl uppercase tracking-widest">State High Courts</h2>
                <div className="h-1 flex-1 bg-yellow-300/30" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {statePositions.map(pos => (
                  <PositionCard
                    key={pos.id}
                    pos={pos}
                    active={active}
                    form={form}
                    formError={formError}
                    submitting={submitting}
                    votesUsed={votesUsed}
                    votingId={votingId}
                    fingerprint={fingerprint}
                    maxVotes={MAX_VOTES}
                    onOpen={openPosition}
                    onFormChange={setForm}
                    onApply={handleApply}
                    onVote={handleVote}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

interface CardProps {
  pos: PositionWithCount
  active: ActivePosition | null
  form: { name: string; reason: string }
  formError: string | null
  submitting: boolean
  votesUsed: number
  votingId: string | null
  fingerprint: string | null
  maxVotes: number
  onOpen: (pos: CourtPosition) => void
  onFormChange: (f: { name: string; reason: string }) => void
  onApply: () => void
  onVote: (app: Application) => void
}

function PositionCard({
  pos, active, form, formError, submitting, votesUsed, votingId, fingerprint, maxVotes,
  onOpen, onFormChange, onApply, onVote,
}: CardProps) {
  const isOpen = active?.position.id === pos.id

  return (
    <div
      className="border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_black] transition-all"
      style={{ backgroundColor: '#2a0070' }}
    >
      {/* Card header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-[10px] font-black border-2 border-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: pos.level === 'national' ? '#D4A017' : '#7c3aed', color: '#000' }}
              >
                {pos.level === 'national' ? 'NATIONAL' : 'STATE'}
              </span>
              <span className="text-[10px] font-mono text-white/40">{pos.shortTitle}</span>
            </div>
            <p className="font-black text-white text-sm leading-tight">{pos.title}</p>
            {pos.state && (
              <p className="text-white/40 text-xs font-mono mt-0.5">{pos.state}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-mono text-white/50">
            {pos.applicant_count} applicant{pos.applicant_count !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => onOpen(pos)}
            className="border-2 border-yellow-300 text-yellow-300 font-black text-xs px-3 py-1.5 rounded-xl hover:bg-yellow-300 hover:text-black transition-colors shadow-[2px_2px_0_black]"
          >
            {isOpen ? 'CLOSE ✕' : 'APPLY →'}
          </button>
        </div>
      </div>

      {/* Expanded panel */}
      {isOpen && (
        <div className="border-t-4 border-black p-4 space-y-4" style={{ backgroundColor: '#1a0050' }}>
          {!active!.applied ? (
            <>
              <p className="text-yellow-300 font-black text-xs uppercase tracking-widest">Apply for this position</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-white/60 text-xs font-mono mb-1">Your Cockroach Name (3–40 chars)</label>
                  <input
                    type="text"
                    maxLength={40}
                    value={form.name}
                    onChange={e => onFormChange({ ...form, name: e.target.value })}
                    placeholder="e.g. Kachra Kumar Nyaymurti"
                    className="w-full bg-black/40 border-2 border-white/20 focus:border-yellow-300 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/20 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-mono mb-1">Why do you want this? (max 120 chars)</label>
                  <input
                    type="text"
                    maxLength={120}
                    value={form.reason}
                    onChange={e => onFormChange({ ...form, reason: e.target.value })}
                    placeholder="e.g. I have lived in the drain long enough to know justice"
                    className="w-full bg-black/40 border-2 border-white/20 focus:border-yellow-300 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/20 focus:outline-none transition-colors"
                  />
                  <p className="text-right text-xs font-mono text-white/30 mt-1">{form.reason.length}/120</p>
                </div>
                {formError && (
                  <p className="text-red-400 text-xs font-mono bg-red-400/10 border border-red-400/30 rounded-xl px-3 py-2">{formError}</p>
                )}
                <button
                  onClick={onApply}
                  disabled={submitting || !fingerprint}
                  className="w-full border-4 border-black bg-yellow-300 text-black font-black py-3 rounded-xl shadow-[4px_4px_0_black] hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? '⚡ Applying...' : 'APPLY NOW →'}
                </button>
                {!fingerprint && (
                  <p className="text-white/30 text-xs text-center font-mono">Loading identity...</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="text-3xl mb-1">🎉</div>
              <p className="text-yellow-300 font-black text-sm">Application submitted!</p>
              <p className="text-white/50 text-xs font-mono mt-1">Rally your cockroach supporters below.</p>
            </div>
          )}

          {/* Applicant list */}
          {active!.loading ? (
            <div className="text-center py-4">
              <div className="text-2xl animate-spin inline-block">🪳</div>
            </div>
          ) : active!.applications.length > 0 ? (
            <div className="space-y-2 mt-2">
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Current Applicants</p>
              {active!.applications.map(app => (
                <div
                  key={app.id}
                  className="border-2 border-white/10 rounded-xl p-3 flex items-start gap-3"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-white text-sm">{app.applicant_name}</p>
                    <p className="text-white/50 text-xs font-mono mt-0.5 leading-relaxed">{app.reason}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => onVote(app)}
                      disabled={votesUsed >= maxVotes || votingId === app.id || !fingerprint}
                      className="border-2 border-black bg-yellow-300 text-black font-black text-xs px-2 py-1 rounded-lg shadow-[2px_2px_0_black] hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {votingId === app.id ? '...' : 'VOTE'}
                    </button>
                    <span className="text-yellow-300 font-black text-xs">{app.vote_count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !active!.applied && (
              <p className="text-white/30 text-xs font-mono text-center">No applicants yet. Be the first!</p>
            )
          )}

          {/* Votes counter */}
          <div className="border-t border-white/10 pt-3 text-center">
            <p className="text-white/30 text-xs font-mono">
              {votesUsed}/{maxVotes} court votes used
            </p>
            {votesUsed >= maxVotes && (
              <p className="text-red-400 text-xs font-mono mt-1 font-black">All court votes exhausted!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Suppress unused import warnings for positions arrays used indirectly
void NATIONAL_COURT_POSITIONS
void STATE_COURT_POSITIONS
