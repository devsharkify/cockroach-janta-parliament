'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFingerprint } from '@/lib/hooks/useFingerprint'
import VoteConfetti from '@/app/components/VoteConfetti'
import ShareModal from '@/app/components/ShareModal'

type Candidate = {
  id: string
  displayName: string
  partyCode: string | null
  partyColor: string | null
  partyName: string | null
  isIndependent: boolean
  manifesto: string
  voteCount: number
  createdAt: string
}

type SeatData = {
  seat: { number: number; name: string; state: string; stateCode: string; slug: string }
  candidates: Candidate[]
  totalVotes: number
  cycleId: string | null
}

export default function SeatContent({ seatNumber }: { seatNumber: number }) {
  const router = useRouter()
  const fingerprint = useFingerprint()

  const [seatData, setSeatData] = useState<SeatData | null>(null)
  const [loading, setLoading] = useState(true)
  const [votedFor, setVotedFor] = useState<Set<string>>(new Set())
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})

  // New state for enhancements
  const [showConfetti, setShowConfetti] = useState(false)
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; candidateIdx: number }>({
    isOpen: false,
    candidateIdx: 0,
  })
  const [liveData, setLiveData] = useState<SeatData | null>(null)
  // Track which candidate IDs had a count flash animation
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set())
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Merge live vote counts from polling into local voteCounts,
  // flashing any IDs whose count changed.
  const applyLiveData = useCallback(
    (data: SeatData) => {
      setLiveData(data)
      setVoteCounts((prev) => {
        const next = { ...prev }
        const changed: string[] = []
        for (const c of data.candidates) {
          if (next[c.id] !== c.voteCount) {
            changed.push(c.id)
            next[c.id] = c.voteCount
          }
        }
        if (changed.length > 0) {
          setFlashIds((f) => new Set([...f, ...changed]))
          setTimeout(() => {
            setFlashIds((f) => {
              const next = new Set(f)
              changed.forEach((id) => next.delete(id))
              return next
            })
          }, 500)
        }
        return next
      })
    },
    [],
  )

  // Start live polling interval (only one at a time)
  const startPolling = useCallback(() => {
    if (pollingRef.current) return // already running
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/seats/${seatNumber}`)
        if (res.ok) {
          const data: SeatData = await res.json()
          applyLiveData(data)
        }
      } catch {
        // network hiccup — keep polling
      }
    }, 5000)
  }, [seatNumber, applyLiveData])

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/seats/${seatNumber}`)
      .then((r) => r.json())
      .then((data: SeatData) => {
        setSeatData(data)
        const counts: Record<string, number> = {}
        for (const c of data.candidates) {
          counts[c.id] = c.voteCount
        }
        setVoteCounts(counts)
      })
      .finally(() => setLoading(false))
  }, [seatNumber])

  async function handleVote(candidateId: string) {
    if (!fingerprint) return
    // Optimistic update
    setVoteCounts((prev) => ({ ...prev, [candidateId]: (prev[candidateId] ?? 0) + 1 }))
    setVotedFor((prev) => new Set([...prev, candidateId]))

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, seatNumber, fingerprint }),
      })
      const data = await res.json()
      if (data.voteCount) {
        setVoteCounts((prev) => ({ ...prev, [candidateId]: data.voteCount }))
      }
      // Trigger confetti + start polling after first successful vote
      setShowConfetti(true)
      startPolling()
    } catch {
      // revert optimistic update on error
      setVoteCounts((prev) => ({ ...prev, [candidateId]: (prev[candidateId] ?? 1) - 1 }))
      setVotedFor((prev) => {
        const s = new Set(prev)
        s.delete(candidateId)
        return s
      })
    }
  }

  function openWhatsApp(candidate: Candidate, count: number) {
    const seatName = seatData?.seat.name ?? `Seat #${seatNumber}`
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/seat/${seatNumber}`
        : `/seat/${seatNumber}`
    const msg = encodeURIComponent(
      `🪳 I just voted for ${candidate.displayName} in ${seatName}! They have ${count} votes. Join the Cockroach Janta Parliament! ${url} #CockroachJantaParliament`,
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center gap-4">
        <div className="text-7xl animate-spin">🪳</div>
        <p className="text-2xl font-black text-[#3C3489]">Loading battlefield...</p>
      </div>
    )
  }

  if (!seatData) {
    return (
      <div className="min-h-screen bg-[#3C3489] flex items-center justify-center text-white text-center p-8">
        <div>
          <div className="text-7xl mb-4">🪳</div>
          <h1 className="text-3xl font-black mb-2">Seat not found</h1>
          <a href="/" className="text-[#D4A017] underline">
            ← Back to Parliament
          </a>
        </div>
      </div>
    )
  }

  const { seat, candidates } = seatData
  const totalVotes = Object.values(voteCounts).reduce((s, v) => s + v, 0)
  const maxVotes = Math.max(...Object.values(voteCounts), 1)

  // The candidate currently shown in the share modal
  const shareCandidate = candidates[shareModal.candidateIdx] ?? null

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Confetti overlay */}
      <VoteConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Share modal */}
      {shareCandidate && (
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal((s) => ({ ...s, isOpen: false }))}
          candidateName={shareCandidate.displayName}
          seatName={seat.name}
          seatNumber={seatNumber}
          voteCount={voteCounts[shareCandidate.id] ?? shareCandidate.voteCount}
          partyCode={shareCandidate.partyCode}
        />
      )}

      {/* Header */}
      <div className="bg-[#3C3489] text-white px-4 pt-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <a
              href="/"
              className="text-sm font-bold text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              ← Back to Parliament
            </a>
            <a
              href={`/file/${seatNumber}`}
              className="bg-[#D4A017] text-black font-black text-sm px-4 py-2 rounded-xl border-4 border-black hover:bg-yellow-300 transition-colors"
            >
              CONTEST HERE
            </a>
          </div>

          <div className="text-5xl mb-3">🪳</div>
          <h1 className="text-4xl font-black tracking-tight">SEAT #{seat.number}</h1>
          <h2 className="text-xl font-bold mt-1 opacity-90">{seat.name}</h2>
          <p className="text-sm mt-2 opacity-60">
            {seat.state}
          </p>
        </div>
      </div>

      {/* Candidate count header */}
      {candidates.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-1">
          <p className="text-sm font-black text-[#3C3489] uppercase tracking-wide">
            {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} contesting
            {' · '}
            {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
            {liveData && (
              <span className="ml-2 text-[#1D9E75] font-black animate-pulse">● LIVE</span>
            )}
          </p>
        </div>
      )}

      {/* Candidates */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {candidates.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🪳</div>
            <p className="text-xl font-black text-[#3C3489] mb-2">
              No roaches have filed here yet.
            </p>
            <p className="text-gray-500 mb-6">Be the first!</p>
            <button
              onClick={() => router.push('/file/' + seatNumber)}
              className="bg-yellow-300 text-black border-4 border-black font-black text-lg px-8 py-3 rounded-xl hover:bg-black hover:text-yellow-300 transition-colors"
            >
              FILE YOUR CANDIDACY 🪳
            </button>
          </div>
        ) : (
          <>
            {candidates.map((candidate, idx) => {
              const count = voteCounts[candidate.id] ?? 0
              const percent = maxVotes > 0 ? (count / maxVotes) * 100 : 0
              const hasVoted = votedFor.has(candidate.id)
              const partyColor = candidate.partyColor ?? '#7F77DD'
              const isFlashing = flashIds.has(candidate.id)

              return (
                <div
                  key={candidate.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                  style={{ borderLeft: `6px solid ${partyColor}` }}
                >
                  <div className="p-4">
                    {/* Name + share icon + vote button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl">🪳</span>
                        <span className="font-black text-lg text-[#1a1a2e] truncate">
                          {candidate.displayName}
                        </span>
                        {/* Share icon button */}
                        <button
                          onClick={() =>
                            setShareModal({ isOpen: true, candidateIdx: idx })
                          }
                          title="Share this candidate"
                          className="shrink-0 text-base leading-none px-1.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                          aria-label={`Share ${candidate.displayName}`}
                        >
                          📤
                        </button>
                      </div>
                      <button
                        onClick={() => handleVote(candidate.id)}
                        disabled={!fingerprint}
                        className={
                          hasVoted
                            ? 'shrink-0 bg-green-500 text-white border-4 border-green-500 font-black px-4 py-2 rounded-xl'
                            : 'shrink-0 bg-yellow-300 text-black border-4 border-black font-black px-4 py-2 rounded-xl hover:bg-black hover:text-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        }
                      >
                        {hasVoted ? 'VOTED ✓' : 'VOTE 🪳'}
                      </button>
                    </div>

                    {/* Party badge */}
                    <div className="mt-2 flex items-center gap-2">
                      {candidate.isIndependent ? (
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          Independent
                        </span>
                      ) : candidate.partyName ? (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: partyColor }}
                        >
                          {candidate.partyCode ?? candidate.partyName}
                        </span>
                      ) : null}
                    </div>

                    {/* Manifesto */}
                    {candidate.manifesto && (
                      <p className="mt-3 text-sm text-gray-600 italic leading-relaxed">
                        &ldquo;{candidate.manifesto}&rdquo;
                      </p>
                    )}

                    {/* Vote bar + count */}
                    <div className="mt-4 flex items-center gap-3">
                      <div
                        className="flex-1"
                        style={{ height: 4, background: '#f5f5f5', borderRadius: 2 }}
                      >
                        <div
                          style={{
                            height: 4,
                            background: partyColor,
                            borderRadius: 2,
                            width: percent + '%',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-black shrink-0 px-1.5 py-0.5 rounded transition-colors duration-300"
                        style={
                          isFlashing
                            ? { background: '#D4A017', color: '#000' }
                            : { color: '#6b7280' }
                        }
                      >
                        {count} vote{count !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* WhatsApp quick share — visible after voting */}
                    {hasVoted && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => openWhatsApp(candidate, count)}
                          className="flex items-center gap-1.5 bg-[#25D366] text-white font-black text-xs px-3 py-1.5 rounded-lg border-2 border-black hover:brightness-90 transition-all"
                        >
                          📱 Share
                        </button>
                        <button
                          onClick={() => setShareModal({ isOpen: true, candidateIdx: idx })}
                          className="flex items-center gap-1.5 bg-gray-100 text-black font-bold text-xs px-3 py-1.5 rounded-lg border-2 border-black hover:bg-gray-200 transition-all"
                        >
                          📤 More options
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Total votes footer */}
            <p className="text-center text-sm font-bold text-gray-400 pt-2">
              ⚡ {totalVotes} total vote{totalVotes !== 1 ? 's' : ''} cast in this seat
            </p>

            {/* File for this seat CTA */}
            <div className="pt-4 pb-8">
              <a
                href={`/file/${seatNumber}`}
                className="block w-full bg-[#D4A017] text-black border-4 border-black font-black text-xl py-5 rounded-2xl hover:bg-yellow-300 transition-colors text-center shadow-[4px_4px_0_black]"
              >
                FILE FOR THIS SEAT 🪳
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
