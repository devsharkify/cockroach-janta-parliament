'use client'

import { useState, useCallback } from 'react'

/* ── Types ───────────────────────────────────────────────────────────────── */
interface AdminStats {
  totalCandidates: number
  activeCandidates: number
  withdrawnCandidates: number
  totalVotes: number
  totalSouls: number
  totalParties: number
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
}

interface PublicStats {
  totalCandidates: number
  totalVotes: number
  totalSouls: number
  pageViews: number
  todayViews: number
  todayCandidates: number
  todayVotes: number
  nextSnapshot: string | null
  updatedAt: string
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(n: number | undefined | null): string {
  if (n == null) return '—'
  if (n >= 1_00_000) return `${(n / 1_00_000).toFixed(1)}L`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('en-IN')
}

function relTime(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  const abs = Math.abs(diff)
  const past = diff < 0
  const h = Math.floor(abs / 3600000)
  const m = Math.floor((abs % 3600000) / 60000)
  if (h >= 24) return `${Math.floor(h / 24)}d ${past ? 'ago' : 'from now'}`
  if (h > 0) return `${h}h ${m}m ${past ? 'ago' : 'from now'}`
  return `${m}m ${past ? 'ago' : 'from now'}`
}

/* ── Sub-components ──────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, color = '#7F77DD', emoji,
}: { label: string; value: string; sub?: string; color?: string; emoji: string }) {
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

/* ── Login gate ──────────────────────────────────────────────────────────── */
function LoginGate({ onLogin }: { onLogin: (secret: string) => void }) {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${secret.trim()}` },
      })
      if (res.status === 401) { setError('Wrong secret. Touch grass.'); return }
      if (!res.ok) throw new Error('Server error')
      onLogin(secret.trim())
    } catch {
      setError('Could not reach server. Check connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#05071a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🪳</div>
          <h1 className="font-black text-3xl uppercase text-white tracking-tight">Admin Cockpit</h1>
          <p className="font-mono text-xs text-white/30 mt-1 tracking-widest">COCKROACH JANTA PARLIAMENT</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="border-4 border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="font-black text-xs uppercase tracking-widest text-white/50">Admin Secret</label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="••••••••••••••••"
              autoFocus
              className="w-full border-2 border-white/20 rounded-xl bg-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-yellow-300/50 placeholder:text-white/20"
            />
          </div>
          {error && (
            <div className="text-red-400 font-mono text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !secret.trim()}
            className="w-full py-3 bg-yellow-300 border-4 border-black rounded-xl font-black text-sm uppercase shadow-[4px_4px_0_black] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_black] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? '🔐 Verifying...' : '🔐 ENTER COCKPIT'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Main Dashboard ──────────────────────────────────────────────────────── */
function Dashboard({ secret }: { secret: string }) {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [publicStats, setPublicStats] = useState<PublicStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [snapshotLoading, setSnapshotLoading] = useState(false)
  const [snapshotResult, setSnapshotResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [adminRes, pubRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${secret}` } }),
        fetch('/api/stats'),
      ])
      if (!adminRes.ok) throw new Error('Admin stats failed')
      const [ad, pub] = await Promise.all([adminRes.json(), pubRes.json()])
      setAdminStats(ad)
      setPublicStats(pub)
      setLastRefresh(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fetch failed')
    } finally {
      setLoading(false)
    }
  }, [secret])

  /* Auto-fetch on mount */
  useState(() => { fetchAll() })

  const triggerSnapshot = async () => {
    if (!confirm('This closes the current cycle, computes winners, and opens a new one. Are you sure?')) return
    setSnapshotLoading(true)
    setSnapshotResult(null)
    try {
      const res = await fetch('/api/admin/snapshot', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Snapshot failed')
      setSnapshotResult(
        `✅ Cycle #${data.cycleNumber} closed · ${data.winnersComputed} winners computed · Next cycle started`
      )
      await fetchAll()
    } catch (err) {
      setSnapshotResult(`❌ ${err instanceof Error ? err.message : 'Failed'}`)
    } finally {
      setSnapshotLoading(false)
    }
  }

  if (!adminStats && loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-3">🪳</div>
          <p className="font-black text-sm uppercase tracking-widest text-black/40">Loading cockpit...</p>
        </div>
      </div>
    )
  }

  if (!adminStats) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
        <div className="border-4 border-red-500 rounded-2xl p-6 bg-white text-center max-w-sm">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="font-black text-red-600 mb-3">{error || 'Failed to load stats'}</p>
          <button onClick={fetchAll} className="px-6 py-2 bg-black text-yellow-300 font-black text-sm rounded-xl border-4 border-black">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const cycle = adminStats.currentCycle
  const maxPartyVotes = Math.max(...adminStats.votesByParty.map(p => p.votes), 1)
  const maxStateCount = Math.max(...adminStats.candidatesByState.map(s => s.count), 1)

  return (
    <div className="min-h-screen bg-[#FAFAF7]">

      {/* ── HEADER ── */}
      <div className="bg-[#05071a] border-b-4 border-yellow-300 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪳</span>
            <div>
              <div className="font-black text-yellow-300 text-lg uppercase leading-none">Admin Cockpit</div>
              <div className="font-mono text-[9px] text-white/30 tracking-widest">COCKROACH JANTA PARLIAMENT</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="font-mono text-[10px] text-white/30 hidden sm:block">
                Refreshed {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
            <button
              onClick={fetchAll}
              disabled={loading}
              className="px-4 py-1.5 border-2 border-white/20 rounded-lg text-white/60 font-black text-xs uppercase hover:border-white/50 hover:text-white transition-colors disabled:opacity-40"
            >
              {loading ? '⟳ Loading...' : '⟳ Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* ── STAT CARDS ── */}
        <div>
          <SectionHeader title="Live Snapshot" emoji="📊" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard emoji="🪳" label="Candidates" value={fmt(adminStats.activeCandidates)}
              sub={`${fmt(adminStats.withdrawnCandidates)} withdrawn`} color="#7F77DD" />
            <StatCard emoji="🗳️" label="Total Votes" value={fmt(adminStats.totalVotes)}
              sub={cycle ? `${fmt(cycle.votesThisCycle)} this cycle` : undefined} color="#e74c3c" />
            <StatCard emoji="👤" label="Souls" value={fmt(adminStats.totalSouls)}
              sub="Unique players" color="#2ecc71" />
            <StatCard emoji="🏴" label="Parties" value={fmt(adminStats.totalParties)}
              sub="Registered" color="#f39c12" />
            <StatCard emoji="👁️" label="Page Views" value={fmt(publicStats?.pageViews)}
              sub={publicStats ? `${fmt(publicStats.todayViews)} today` : undefined} color="#3498db" />
            <StatCard emoji="🏛️" label="Seats" value="543"
              sub="Lok Sabha" color="#9b59b6" />
          </div>
        </div>

        {/* ── TODAY STRIP ── */}
        <div>
          <SectionHeader title="Today's Activity" emoji="📅" />
          <div className="grid grid-cols-3 gap-3">
            <StatCard emoji="📝" label="New Candidates" value={fmt(publicStats?.todayCandidates)} color="#1abc9c" />
            <StatCard emoji="🗳️" label="Votes Cast" value={fmt(publicStats?.todayVotes)} color="#e67e22" />
            <StatCard emoji="👁️" label="Views" value={fmt(publicStats?.todayViews)} color="#8e44ad" />
          </div>
        </div>

        {/* ── CYCLE + DANGER ZONE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Cycle info */}
          <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
            <SectionHeader title="Current Cycle" emoji="🔄" />
            {cycle ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest text-white"
                    style={{ background: cycle.status === 'live' ? '#2ecc71' : '#e74c3c' }}
                  >
                    {cycle.status.toUpperCase()}
                  </span>
                  <span className="font-black text-2xl text-black">Cycle #{cycle.cycleNumber}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Votes this cycle', value: fmt(cycle.votesThisCycle) },
                    { label: 'Snapshot at', value: new Date(cycle.snapshotAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
                    { label: 'Time to snapshot', value: relTime(cycle.snapshotAt) },
                    { label: 'Snapshot day', value: new Date(cycle.snapshotAt).toLocaleDateString('en-IN', { weekday: 'long' }) },
                  ].map(row => (
                    <div key={row.label} className="bg-black/5 rounded-xl px-3 py-2">
                      <div className="font-mono text-[9px] text-black/40 uppercase tracking-wider">{row.label}</div>
                      <div className="font-black text-sm text-black mt-0.5">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-black/40 font-mono text-sm">No active cycle found</div>
            )}
          </div>

          {/* Danger zone */}
          <div className="border-4 border-red-500 rounded-2xl bg-red-50 shadow-[4px_4px_0_#e74c3c] p-5">
            <SectionHeader title="Danger Zone" emoji="🔴" />
            <p className="font-mono text-xs text-red-700/70 mb-4 leading-relaxed">
              Triggering a snapshot closes the current election cycle, aggregates per-seat winners from vote data, writes results to the <code>results</code> collection, then opens a new live cycle. This is irreversible.
            </p>
            <button
              onClick={triggerSnapshot}
              disabled={snapshotLoading || !cycle}
              className="w-full py-4 bg-red-600 text-white border-4 border-red-800 rounded-xl font-black text-sm uppercase shadow-[4px_4px_0_#7f1d1d] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#7f1d1d] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {snapshotLoading ? '⏳ Computing winners...' : '🔴 TRIGGER SNAPSHOT NOW'}
            </button>
            {snapshotResult && (
              <div className={`mt-3 font-mono text-xs px-3 py-2 rounded-lg border ${snapshotResult.startsWith('✅') ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                {snapshotResult}
              </div>
            )}
            {!cycle && (
              <p className="mt-2 font-mono text-[10px] text-red-400">No live cycle — nothing to snapshot.</p>
            )}
          </div>
        </div>

        {/* ── VOTES BY PARTY ── */}
        <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5 overflow-x-auto">
          <SectionHeader title="Votes by Party (Current Cycle)" emoji="🏴" />
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left font-black text-xs uppercase tracking-widest pb-2 text-black/40 w-12">#</th>
                <th className="text-left font-black text-xs uppercase tracking-widest pb-2 text-black/40">Party</th>
                <th className="text-right font-black text-xs uppercase tracking-widest pb-2 text-black/40">Votes</th>
                <th className="text-left font-black text-xs uppercase tracking-widest pb-2 text-black/40 pl-4 w-48">Bar</th>
              </tr>
            </thead>
            <tbody>
              {adminStats.votesByParty.map((row, i) => (
                <tr key={row.partyCode} className="border-b border-black/5">
                  <td className="py-2 font-mono text-xs text-black/30">{i + 1}</td>
                  <td className="py-2">
                    <div className="font-black text-sm text-black">{row.partyCode}</div>
                    <div className="font-mono text-[10px] text-black/40">{row.partyName}</div>
                  </td>
                  <td className="py-2 text-right font-black text-sm text-black">{fmt(row.votes)}</td>
                  <td className="py-2 pl-4">
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7F77DD] rounded-full"
                        style={{ width: `${(row.votes / maxPartyVotes) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {adminStats.votesByParty.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center font-mono text-xs text-black/30">No vote data</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── CANDIDATES BY STATE + TOP SEATS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* By state */}
          <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5 overflow-x-auto">
            <SectionHeader title="Candidates by State" emoji="🗺️" />
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {adminStats.candidatesByState.map((row, i) => (
                <div key={row.state} className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-black/30 w-5 shrink-0">{i + 1}</span>
                  <span className="font-black text-xs text-black w-36 shrink-0 truncate">{row.state}</span>
                  <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2ecc71] rounded-full"
                      style={{ width: `${(row.count / maxStateCount) * 100}%` }}
                    />
                  </div>
                  <span className="font-black text-xs text-black shrink-0">{fmt(row.count)}</span>
                </div>
              ))}
              {adminStats.candidatesByState.length === 0 && (
                <p className="text-center font-mono text-xs text-black/30 py-4">No data</p>
              )}
            </div>
          </div>

          {/* Top seats */}
          <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
            <SectionHeader title="Top Seats by Votes" emoji="🔥" />
            <div className="space-y-2">
              {adminStats.topSeats.map((row, i) => (
                <div key={row.seatNumber} className="flex items-center gap-3 py-1.5 border-b border-black/5">
                  <span
                    className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] text-white"
                    style={{ background: i < 3 ? ['#f39c12', '#95a5a6', '#cd7f32'][i] : '#7F77DD' }}
                  >
                    {i + 1}
                  </span>
                  <a
                    href={`/seat/${row.seatNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-black text-sm text-black hover:text-[#7F77DD] transition-colors"
                  >
                    Seat #{row.seatNumber}
                  </a>
                  <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(row.totalVotes / (adminStats.topSeats[0]?.totalVotes || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="font-black text-sm text-black shrink-0">{fmt(row.totalVotes)}</span>
                </div>
              ))}
              {adminStats.topSeats.length === 0 && (
                <p className="text-center font-mono text-xs text-black/30 py-4">No data</p>
              )}
            </div>
          </div>
        </div>

        {/* ── XP DISTRIBUTION ── */}
        <div className="border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0_black] p-5">
          <SectionHeader title="XP Level Distribution" emoji="⭐" />
          <div className="flex items-end gap-3 h-32">
            {adminStats.xpDistribution.map(row => {
              const maxSouls = Math.max(...adminStats.xpDistribution.map(r => r.souls), 1)
              const height = Math.max(8, (row.souls / maxSouls) * 100)
              const colors = ['#7F77DD', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c']
              return (
                <div key={row.level} className="flex flex-col items-center gap-1 flex-1">
                  <div className="font-black text-[9px] text-black/50">{fmt(row.souls)}</div>
                  <div
                    className="w-full rounded-t-lg"
                    style={{ height: `${height}%`, background: colors[(row.level - 1) % colors.length] }}
                  />
                  <div className="font-black text-[10px] text-black/50">Lv.{row.level}</div>
                </div>
              )
            })}
            {adminStats.xpDistribution.length === 0 && (
              <p className="text-center font-mono text-xs text-black/30 w-full self-center">No XP data yet</p>
            )}
          </div>
        </div>

        {/* ── RAW QUICK LINKS ── */}
        <div className="border-4 border-black/20 rounded-2xl bg-white p-5">
          <SectionHeader title="Quick Links" emoji="🔗" />
          <div className="flex flex-wrap gap-2">
            {[
              { label: '/api/stats', href: '/api/stats' },
              { label: '/results', href: '/results' },
              { label: '/parties', href: '/parties' },
              { label: '/supreme (PM)', href: '/supreme' },
              { label: '/court', href: '/court' },
              { label: '/ec', href: '/ec' },
              { label: '/tv (CJTV)', href: '/tv' },
              { label: '/file', href: '/file' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 border-2 border-black rounded-lg font-mono text-xs text-black hover:bg-black hover:text-yellow-300 transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center font-mono text-[10px] text-black/20 pb-4">
          🪳 Admin Cockpit — Cockroach Janta Parliament · Not for public use
        </div>
      </div>
    </div>
  )
}

/* ── Root export ─────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [secret, setSecret] = useState<string | null>(null)

  if (!secret) return <LoginGate onLogin={setSecret} />
  return <Dashboard secret={secret} />
}
