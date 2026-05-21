'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/* ── Types ───────────────────────────────────────────────────────────────── */
interface DashStats {
  isMock: boolean
  totalCandidates: number
  activeCandidates: number
  withdrawnCandidates: number
  totalVotes: number
  totalSouls: number
  totalParties: number
  pageViews: number
  todayViews: number
  todayCandidates: number
  todayVotes: number
  userArticles: number
  currentCycle: {
    cycleNumber: number
    status: string
    snapshotAt: string
    votesThisCycle: number
  } | null
  votesByParty: { partyCode: string; partyName: string; votes: number }[]
  candidatesByState: { state: string; count: number }[]
  xpDistribution: { level: number; souls: number }[]
  topSeats: { seatNumber: number; totalVotes: number }[]
  dailyStats: { date: string; label: string; candidates: number; votes: number; pageViews: number }[]
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(n: number | undefined | null): string {
  if (n == null) return '—'
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(1)}L`
  if (n >= 1_000)    return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('en-IN')
}

function relTime(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  const abs  = Math.abs(diff)
  const past = diff < 0
  const h = Math.floor(abs / 3600000)
  const m = Math.floor((abs % 3600000) / 60000)
  if (h >= 24) return `${Math.floor(h / 24)}d ${past ? 'ago' : 'from now'}`
  if (h > 0)   return `${h}h ${m}m ${past ? 'ago' : 'from now'}`
  return `${m}m ${past ? 'ago' : 'from now'}`
}

/* ── Stat card ───────────────────────────────────────────────────────────── */
function StatCard({ label, value, sub, color = '#7F77DD', emoji }: {
  label: string; value: string; sub?: string; color?: string; emoji: string
}) {
  return (
    <div
      className="rounded-2xl p-5 border-4 border-black shadow-[4px_4px_0_black] flex flex-col gap-1"
      style={{ background: `${color}18`, borderColor: color }}
    >
      <div className="text-2xl leading-none">{emoji}</div>
      <div className="font-black text-2xl text-black leading-none">{value}</div>
      <div className="font-black text-xs uppercase tracking-widest" style={{ color }}>{label}</div>
      {sub && <div className="font-mono text-[10px] text-black/40">{sub}</div>}
    </div>
  )
}

function SectionHeader({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span>{emoji}</span>
      <h2 className="font-black text-sm uppercase tracking-widest text-black/60">{title}</h2>
      <div className="flex-1 h-[2px] bg-black/10" />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   6-DIGIT PIN GATE
══════════════════════════════════════════════════════════════ */
function PinGate({ onSuccess }: { onSuccess: (pin: string) => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  /* Focus first box on mount */
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  const submit = useCallback(async (pin: string) => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(`/api/admin/stats?pin=${pin}`)
      if (res.status === 401) {
        setError(true)
        setShake(true)
        setTimeout(() => {
          setShake(false)
          setDigits(['', '', '', '', '', ''])
          inputRefs.current[0]?.focus()
        }, 600)
        return
      }
      onSuccess(pin)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [onSuccess])

  const handleChange = (idx: number, val: string) => {
    // Only allow digits
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = digit
    setDigits(next)
    setError(false)

    if (digit && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
    // Auto-submit when all 6 filled
    if (digit && idx === 5) {
      const pin = [...next].join('')
      if (pin.length === 6) submit(pin)
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits]; next[idx] = ''
        setDigits(next)
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus()
        const next = [...digits]; next[idx - 1] = ''
        setDigits(next)
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus()
    if (e.key === 'Enter') {
      const pin = digits.join('')
      if (pin.length === 6) submit(pin)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setDigits(pasted.split(''))
      submit(pasted)
    }
  }

  const filled = digits.filter(Boolean).length

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a1060 0%, #05071a 80%)' }}
    >
      <div className="w-full max-w-sm text-center">

        {/* Logo */}
        <div
          className="text-7xl mb-4 select-none inline-block"
          style={{ animation: 'crown-spin 10s linear infinite' }}
        >
          🪳
        </div>
        <h1 className="font-black text-3xl uppercase text-white tracking-tight leading-none mb-1">
          Admin Cockpit
        </h1>
        <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-10">
          Cockroach Janta Parliament · Restricted
        </p>

        {/* PIN boxes */}
        <div
          className={`flex justify-center gap-3 mb-6 transition-transform ${shake ? 'animate-bounce' : ''}`}
          onPaste={handlePaste}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              disabled={loading}
              className={[
                'w-12 h-14 text-center text-2xl font-black rounded-xl border-2 transition-all outline-none',
                'bg-white/10 text-white caret-yellow-300',
                error
                  ? 'border-red-500 bg-red-500/20'
                  : d
                    ? 'border-yellow-300 bg-yellow-300/10 text-yellow-300'
                    : 'border-white/20 focus:border-white/60',
              ].join(' ')}
            />
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ background: i < filled ? '#D4A017' : 'rgba(255,255,255,0.15)' }}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
            ⚠️ Wrong PIN. Try again.
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <p className="font-mono text-xs text-white/30 animate-pulse">🔐 Verifying...</p>
        )}

        {/* Hint */}
        {!loading && !error && (
          <p className="font-mono text-[10px] text-white/20">
            Enter 6-digit PIN to access cockpit
          </p>
        )}
      </div>

      <style>{`
        @keyframes crown-spin {
          0%   { transform: rotate(-8deg) scale(1); }
          25%  { transform: rotate(0deg) scale(1.08); }
          50%  { transform: rotate(8deg) scale(1); }
          75%  { transform: rotate(0deg) scale(1.08); }
          100% { transform: rotate(-8deg) scale(1); }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════════ */
function Dashboard({ pin }: { pin: string }) {
  const [stats, setStats] = useState<DashStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [snapshotLoading, setSnapshotLoading] = useState(false)
  const [snapshotResult, setSnapshotResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [useMock, setUseMock] = useState(false)

  const fetchStats = useCallback(async (forceMock?: boolean) => {
    setLoading(true)
    setError('')
    const isMock = forceMock !== undefined ? forceMock : useMock
    try {
      const res = await fetch(`/api/admin/stats?pin=${pin}${isMock ? '&mock=1' : ''}`)
      if (!res.ok) throw new Error('Stats fetch failed')
      setStats(await res.json())
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin])  // intentionally exclude useMock — we pass forceMock explicitly

  const toggleMock = () => {
    const next = !useMock
    setUseMock(next)
    fetchStats(next)
  }

  // fetch once on mount
  useEffect(() => { fetchStats(false) }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const triggerSnapshot = async () => {
    if (!confirm('Close current cycle, compute winners, open next cycle. Are you sure?')) return
    setSnapshotLoading(true)
    setSnapshotResult(null)
    try {
      const res = await fetch(`/api/admin/stats?pin=${pin}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setSnapshotResult(`✅ Cycle #${data.cycleNumber} closed · ${data.winnersComputed} winners computed`)
      await fetchStats()
    } catch (err) {
      setSnapshotResult(`❌ ${err instanceof Error ? err.message : 'Failed'}`)
    } finally {
      setSnapshotLoading(false)
    }
  }

  if (!stats && loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-3">🪳</div>
          <p className="font-black text-sm uppercase tracking-widest text-black/40">Loading cockpit...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
        <div className="border-4 border-red-500 rounded-2xl p-6 bg-white text-center max-w-sm">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="font-black text-red-600 mb-3">{error}</p>
          <button onClick={() => fetchStats()} className="px-6 py-2 bg-black text-yellow-300 font-black text-sm rounded-xl border-4 border-black">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const cycle = stats.currentCycle
  const maxPartyVotes  = Math.max(...stats.votesByParty.map(p => p.votes), 1)
  const maxStateCount  = Math.max(...stats.candidatesByState.map(s => s.count), 1)
  const maxXp          = Math.max(...stats.xpDistribution.map(r => r.souls), 1)
  const XP_COLORS = ['#7F77DD', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c']

  return (
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* HEADER */}
      <div className="bg-[#05071a] px-4 py-4 sticky top-0 z-50" style={{ borderBottom: `4px solid ${useMock ? '#D4A017' : '#22c55e'}` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪳</span>
            <div>
              <div className="font-black text-yellow-300 text-lg uppercase leading-none">Admin Cockpit</div>
              <div className="font-mono text-[9px] text-white/30 tracking-widest">cockroachparliament.online/superadmin</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="font-mono text-[10px] text-white/30 hidden sm:block">
                {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            {/* DATA MODE TOGGLE — prominent solid pill */}
            <button
              onClick={toggleMock}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0_rgba(0,0,0,0.5)] active:translate-y-[1px] transition-all"
              style={useMock
                ? { background: '#D4A017', color: '#05071a' }
                : { background: '#16a34a', color: '#ffffff' }
              }
              title="Click to switch between mock sample data and live database data"
            >
              <span className="text-base leading-none">{useMock ? '🧪' : '🟢'}</span>
              <span>{useMock ? 'MOCK DATA' : 'LIVE DATA'}</span>
            </button>
            <button
              onClick={() => fetchStats()}
              disabled={loading}
              className="px-4 py-2 border-2 border-white/20 rounded-xl text-white font-black text-sm uppercase hover:border-white/60 hover:bg-white/10 transition-colors disabled:opacity-40"
            >
              {loading ? '⟳ ...' : '⟳ REFRESH'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* MOCK BANNER */}
        {stats?.isMock && (
          <div className="flex items-center gap-3 bg-yellow-300 border-4 border-black rounded-2xl px-5 py-3 shadow-[4px_4px_0_black]">
            <span className="text-2xl">🧪</span>
            <div>
              <div className="font-black text-sm text-black uppercase tracking-wide">Mock Data Mode</div>
              <div className="font-mono text-xs text-black/60">Showing sample/demo data — not from live database. Toggle to 🟢 LIVE to see real stats.</div>
            </div>
          </div>
        )}

        {/* STAT CARDS */}
        <div>
          <SectionHeader title="Live Snapshot" emoji="📊" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard emoji="🪳" label="Candidates" value={fmt(stats.activeCandidates)}
              sub={`${fmt(stats.withdrawnCandidates)} withdrawn`} color="#7F77DD" />
            <StatCard emoji="🗳️" label="Total Votes" value={fmt(stats.totalVotes)}
              sub={cycle ? `${fmt(cycle.votesThisCycle)} this cycle` : undefined} color="#e74c3c" />
            <StatCard emoji="👤" label="Souls" value={fmt(stats.totalSouls)}
              sub="Unique players" color="#2ecc71" />
            <StatCard emoji="🏴" label="Parties" value={fmt(stats.totalParties)}
              sub="Registered" color="#f39c12" />
            <StatCard emoji="👁️" label="Page Views" value={fmt(stats.pageViews)}
              sub={`${fmt(stats.todayViews)} today`} color="#3498db" />
            <StatCard emoji="📰" label="User Articles" value={fmt(stats.userArticles)}
              sub="CJTV submissions" color="#e67e22" />
          </div>
        </div>

        {/* TODAY STRIP */}
        <div>
          <SectionHeader title="Today's Activity" emoji="📅" />
          <div className="grid grid-cols-3 gap-3">
            <StatCard emoji="📝" label="New Candidates" value={fmt(stats.todayCandidates)} color="#1abc9c" />
            <StatCard emoji="🗳️" label="Votes Cast" value={fmt(stats.todayVotes)} color="#e67e22" />
            <StatCard emoji="👁️" label="Views" value={fmt(stats.todayViews)} color="#8e44ad" />
          </div>
        </div>

        {/* 7-DAY ANALYTICS */}
        {stats.dailyStats && stats.dailyStats.length > 0 && (() => {
          const maxVotes = Math.max(...stats.dailyStats.map(d => d.votes), 1)
          const maxCands = Math.max(...stats.dailyStats.map(d => d.candidates), 1)
          return (
            <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
              <SectionHeader title="Last 7 Days — Analytics" emoji="📈" />

              {/* Dual bar chart */}
              <div className="flex gap-3 h-40 items-end mb-3">
                {stats.dailyStats.map((day) => (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                    {/* Votes bar */}
                    <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '100%' }}>
                      <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: '100%' }}>
                        {/* Votes */}
                        <div
                          className="w-full rounded-t-md bg-[#7F77DD] transition-all"
                          style={{ height: `${(day.votes / maxVotes) * 65}%` }}
                          title={`${day.votes.toLocaleString()} votes`}
                        />
                        {/* Candidates */}
                        <div
                          className="w-full rounded-t-md bg-yellow-400 transition-all"
                          style={{ height: `${(day.candidates / maxCands) * 35}%` }}
                          title={`${day.candidates} candidates`}
                        />
                      </div>
                    </div>
                    <div className="font-black text-[9px] text-black/40 uppercase">{day.label}</div>
                  </div>
                ))}
              </div>

              {/* Legend + numbers table */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#7F77DD]" /><span className="font-mono text-[10px] text-black/50">Votes</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-yellow-400" /><span className="font-mono text-[10px] text-black/50">Candidates Filed</span></div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-black">
                      {['Day', ...stats.dailyStats.map(d => d.label)].map((h, i) => (
                        <th key={i} className="text-left font-black uppercase tracking-widest pb-1.5 text-black/40 pr-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-black/5">
                      <td className="py-1.5 pr-3 font-black text-[#7F77DD]">Votes</td>
                      {stats.dailyStats.map(d => (
                        <td key={d.date} className="py-1.5 pr-3 font-mono">{d.votes.toLocaleString('en-IN')}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-black/5">
                      <td className="py-1.5 pr-3 font-black text-yellow-500">Candidates</td>
                      {stats.dailyStats.map(d => (
                        <td key={d.date} className="py-1.5 pr-3 font-mono">{d.candidates.toLocaleString('en-IN')}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        })()}

        {/* CYCLE + DANGER ZONE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
            <SectionHeader title="Current Cycle" emoji="🔄" />
            {cycle ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest text-white"
                    style={{ background: cycle.status === 'live' ? '#2ecc71' : '#e74c3c' }}>
                    {cycle.status.toUpperCase()}
                  </span>
                  <span className="font-black text-2xl text-black">Cycle #{cycle.cycleNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Votes this cycle', value: fmt(cycle.votesThisCycle) },
                    { label: 'Snapshot at', value: new Date(cycle.snapshotAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
                    { label: 'Time to snapshot', value: relTime(cycle.snapshotAt) },
                    { label: 'Day', value: new Date(cycle.snapshotAt).toLocaleDateString('en-IN', { weekday: 'long' }) },
                  ].map(row => (
                    <div key={row.label} className="bg-black/5 rounded-xl px-3 py-2">
                      <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider">{row.label}</div>
                      <div className="font-black text-sm text-black mt-0.5">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-black/40 font-mono text-sm">No active cycle</div>
            )}
          </div>

          <div className="border-4 border-red-500 rounded-2xl bg-red-50 shadow-[4px_4px_0_#e74c3c] p-5">
            <SectionHeader title="Danger Zone" emoji="🔴" />
            <p className="font-mono text-xs text-red-700/70 mb-4 leading-relaxed">
              Closes current cycle, computes per-seat winners from vote data, writes results, opens new live cycle. Irreversible.
            </p>
            <button
              onClick={triggerSnapshot}
              disabled={snapshotLoading || !cycle}
              className="w-full py-4 bg-red-600 text-white border-4 border-red-800 rounded-xl font-black text-sm uppercase shadow-[4px_4px_0_#7f1d1d] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#7f1d1d] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {snapshotLoading ? '⏳ Computing...' : '🔴 TRIGGER SNAPSHOT'}
            </button>
            {snapshotResult && (
              <div className={`mt-3 font-mono text-xs px-3 py-2 rounded-lg border ${snapshotResult.startsWith('✅') ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                {snapshotResult}
              </div>
            )}
          </div>
        </div>

        {/* VOTES BY PARTY */}
        <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5 overflow-x-auto">
          <SectionHeader title="Votes by Party (Current Cycle)" emoji="🏴" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left font-black text-xs uppercase tracking-widest pb-2 text-black/40 w-8">#</th>
                <th className="text-left font-black text-xs uppercase tracking-widest pb-2 text-black/40">Party</th>
                <th className="text-right font-black text-xs uppercase tracking-widest pb-2 text-black/40">Votes</th>
                <th className="text-left font-black text-xs uppercase tracking-widest pb-2 text-black/40 pl-4 w-40">%</th>
              </tr>
            </thead>
            <tbody>
              {stats.votesByParty.map((row, i) => (
                <tr key={row.partyCode} className="border-b border-black/5">
                  <td className="py-2 font-mono text-xs text-black/30">{i + 1}</td>
                  <td className="py-2">
                    <div className="font-black text-sm">{row.partyCode}</div>
                    <div className="font-mono text-[10px] text-black/40">{row.partyName}</div>
                  </td>
                  <td className="py-2 text-right font-black">{fmt(row.votes)}</td>
                  <td className="py-2 pl-4">
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#7F77DD] rounded-full" style={{ width: `${(row.votes / maxPartyVotes) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
              {stats.votesByParty.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center font-mono text-xs text-black/30">No vote data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CANDIDATES BY STATE + TOP SEATS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
            <SectionHeader title="Candidates by State" emoji="🗺️" />
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {stats.candidatesByState.map((row, i) => (
                <div key={row.state} className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-black/30 w-5 shrink-0">{i + 1}</span>
                  <span className="font-black text-xs w-36 shrink-0 truncate">{row.state}</span>
                  <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2ecc71] rounded-full" style={{ width: `${(row.count / maxStateCount) * 100}%` }} />
                  </div>
                  <span className="font-black text-xs shrink-0">{fmt(row.count)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
            <SectionHeader title="Top Seats by Votes" emoji="🔥" />
            <div className="space-y-2">
              {stats.topSeats.map((row, i) => (
                <div key={row.seatNumber} className="flex items-center gap-3 py-1.5 border-b border-black/5">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] text-white"
                    style={{ background: i < 3 ? ['#f39c12', '#95a5a6', '#cd7f32'][i] : '#7F77DD' }}
                  >
                    {i + 1}
                  </span>
                  <a href={`/seat/${row.seatNumber}`} target="_blank" rel="noopener noreferrer"
                    className="font-black text-sm hover:text-[#7F77DD] transition-colors">
                    Seat #{row.seatNumber}
                  </a>
                  <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(row.totalVotes / (stats.topSeats[0]?.totalVotes || 1)) * 100}%` }} />
                  </div>
                  <span className="font-black text-sm shrink-0">{fmt(row.totalVotes)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* XP DISTRIBUTION */}
        <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
          <SectionHeader title="XP Level Distribution" emoji="⭐" />
          <div className="flex items-end gap-3 h-32">
            {stats.xpDistribution.map((row, i) => (
              <div key={row.level} className="flex flex-col items-center gap-1 flex-1">
                <div className="font-black text-[9px] text-black/50">{fmt(row.souls)}</div>
                <div className="w-full rounded-t-lg transition-all"
                  style={{ height: `${Math.max(8, (row.souls / maxXp) * 100)}%`, background: XP_COLORS[i % XP_COLORS.length] }} />
                <div className="font-black text-[10px] text-black/50">Lv.{row.level}</div>
              </div>
            ))}
            {stats.xpDistribution.length === 0 && (
              <p className="text-center font-mono text-xs text-black/30 w-full self-center">No XP data yet</p>
            )}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="border-4 border-black/20 rounded-2xl bg-white p-5">
          <SectionHeader title="Quick Links" emoji="🔗" />
          <div className="flex flex-wrap gap-2">
            {[
              '/api/stats', '/results', '/parties', '/supreme',
              '/court', '/ec', '/tv', '/file', '/leaderboard',
            ].map(href => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 border-2 border-black rounded-lg font-mono text-xs hover:bg-black hover:text-yellow-300 transition-colors">
                {href} ↗
              </a>
            ))}
          </div>
        </div>

        <div className="text-center font-mono text-[10px] text-black/20 pb-4">
          🪳 cockroachparliament.online/superadmin · Not for public use
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [pin, setPin] = useState<string | null>(null)
  if (!pin) return <PinGate onSuccess={setPin} />
  return <Dashboard pin={pin} />
}
