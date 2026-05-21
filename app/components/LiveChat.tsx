'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  generateBots,
  getRandomMsg,
  getBreakingMsg,
  getUserReply,
  type BotIdentity,
  type ChatMessage,
} from '@/lib/chatBots'

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function uid() { return Math.random().toString(36).slice(2, 9) }
function timeStr(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function LiveChat() {
  const [isOpen, setIsOpen]     = useState(false)
  const [msgs, setMsgs]         = useState<ChatMessage[]>([])
  const [input, setInput]       = useState('')
  const [online, setOnline]     = useState(1247)
  const [typing, setTyping]     = useState<{ name: string; color: string }[]>([])
  const [unread, setUnread]     = useState(0)

  const scrollRef   = useRef<HTMLDivElement>(null)
  const endRef      = useRef<HTMLDivElement>(null)
  const botsRef     = useRef<BotIdentity[]>([])
  const lastBotRef  = useRef('')
  const isOpenRef   = useRef(false)
  const inputRef    = useRef<HTMLInputElement>(null)

  useEffect(() => { isOpenRef.current = isOpen }, [isOpen])

  /* ── Init bots + seed messages ── */
  useEffect(() => {
    const bots = generateBots(1000)
    botsRef.current = bots
    setOnline(rand(1200, 1500))

    const init: ChatMessage[] = Array.from({ length: 7 }, (_, i) => {
      const bot = bots[rand(0, 999)]
      return {
        id: uid(),
        botId: bot.id,
        botName: bot.name,
        partyCode: bot.partyCode,
        partyColor: bot.partyColor,
        symbol: bot.symbol,
        text: getRandomMsg(bot),
        timestamp: new Date(Date.now() - (7 - i) * 22000),
      }
    })
    setMsgs(init)
    lastBotRef.current = init[init.length - 1].botName
  }, [])

  /* ── Push one bot message ── */
  const pushBot = useCallback(() => {
    const bots = botsRef.current
    if (!bots.length) return
    const bot = bots[rand(0, bots.length - 1)]
    const text = getRandomMsg(bot, lastBotRef.current)
    const msg: ChatMessage = {
      id: uid(),
      botId: bot.id,
      botName: bot.name,
      partyCode: bot.partyCode,
      partyColor: bot.partyColor,
      symbol: bot.symbol,
      text,
      timestamp: new Date(),
    }
    lastBotRef.current = bot.name
    setMsgs(prev => [...prev.slice(-90), msg])
    if (!isOpenRef.current) setUnread(u => u + 1)
  }, [])

  /* ── Ambient messages every 2-5s ── */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const schedule = () => { t = setTimeout(() => { pushBot(); schedule() }, rand(2200, 5000)) }
    schedule()
    return () => clearTimeout(t)
  }, [pushBot])

  /* ── Breaking news every 65-100s ── */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const schedule = () => {
      t = setTimeout(() => {
        const msg: ChatMessage = {
          id: uid(),
          botId: 'system',
          botName: '📡 EC_BREAKING',
          partyCode: 'EC',
          partyColor: '#ef4444',
          symbol: '📡',
          text: getBreakingMsg(),
          timestamp: new Date(),
          isSystem: true,
        }
        setMsgs(prev => [...prev.slice(-90), msg])
        if (!isOpenRef.current) setUnread(u => u + 1)
        schedule()
      }, rand(65000, 100000))
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  /* ── Online count fluctuation ── */
  useEffect(() => {
    const i = setInterval(() => {
      setOnline(n => Math.max(900, Math.min(2200, n + rand(-45, 65))))
    }, 11000)
    return () => clearInterval(i)
  }, [])

  /* ── Auto-scroll ── */
  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, isOpen])

  /* ── Open: reset unread + scroll ── */
  useEffect(() => {
    if (isOpen) {
      setUnread(0)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'instant' }), 60)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [isOpen])

  /* ── Send user message ── */
  function sendMessage() {
    const text = input.trim()
    if (!text) return
    setInput('')

    const userMsg: ChatMessage = {
      id: uid(),
      botId: 'user',
      botName: 'You',
      partyCode: 'YOU',
      partyColor: '#FBBF24',
      symbol: '🗳️',
      text,
      timestamp: new Date(),
      isUser: true,
    }
    setMsgs(prev => [...prev.slice(-90), userMsg])

    const count = rand(2, 4)
    const bots = botsRef.current
    if (!bots.length) return
    const respBots = Array.from({ length: count }, () => bots[rand(0, bots.length - 1)])
    setTyping(respBots.map(b => ({ name: b.name.split('_')[0], color: b.partyColor })))

    respBots.forEach((bot, i) => {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: uid(),
          botId: bot.id,
          botName: bot.name,
          partyCode: bot.partyCode,
          partyColor: bot.partyColor,
          symbol: bot.symbol,
          text: getUserReply('You'),
          timestamp: new Date(),
        }
        lastBotRef.current = bot.name
        setMsgs(prev => [...prev.slice(-90), reply])
        if (i === count - 1) setTyping([])
      }, rand(700, 1800) + i * rand(400, 900))
    })
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  /* ══════════════════ RENDER ══════════════════ */
  return (
    <div className="fixed bottom-5 right-5 z-[9998] flex flex-col items-end gap-3 pointer-events-none">

      {/* ── Chat Panel ── */}
      {isOpen && (
        <div
          className="pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-white/10"
          style={{
            width: 'min(360px, calc(100vw - 24px))',
            height: 'min(540px, calc(100vh - 100px))',
            background: '#0c0c0c',
            boxShadow: '0 12px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(251,191,36,0.15)',
          }}
        >
          {/* Header */}
          <div
            className="shrink-0 flex items-center justify-between px-4 py-3"
            style={{ background: '#111', borderBottom: '1px solid #222' }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl leading-none">🪳</span>
              <div>
                <div className="font-black text-white text-[11px] uppercase tracking-widest leading-none">
                  Roach Parliament
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block shrink-0" />
                  <span className="text-[10px] text-white/40 font-mono">
                    {online.toLocaleString('en-IN')} roaches online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">LIVE</span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto flex flex-col gap-2 px-3 py-3"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
          >
            {/* Welcome pill */}
            <div className="flex justify-center mb-1">
              <span className="text-[9px] font-mono text-white/20 px-3 py-1 rounded-full border border-white/10">
                🪳 {msgs.length > 0 ? `${(1000 + msgs.length).toLocaleString()}+ messages today` : 'Welcome to the drain'}
              </span>
            </div>

            {msgs.map(msg => {
              if (msg.isUser) {
                /* User bubble — right */
                return (
                  <div key={msg.id} className="flex justify-end gap-2 items-end">
                    <div className="max-w-[78%]">
                      <div
                        className="rounded-2xl rounded-br-sm px-3 py-2 text-[11px] font-mono leading-relaxed"
                        style={{ background: '#FBBF24', color: '#000' }}
                      >
                        {msg.text}
                      </div>
                      <div className="text-[9px] text-white/20 text-right mt-0.5 font-mono pr-1">
                        {timeStr(msg.timestamp)}
                      </div>
                    </div>
                    <div
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                      style={{ background: '#FBBF2433', border: '2px solid #FBBF2466' }}
                    >
                      🗳️
                    </div>
                  </div>
                )
              }

              if (msg.isSystem) {
                /* Breaking news — full width */
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl px-3 py-2.5 border-l-4"
                    style={{ background: '#1a0000cc', borderColor: '#ef4444' }}
                  >
                    <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                      {msg.botName}
                    </div>
                    <div className="text-[11px] text-red-200 font-mono leading-relaxed">{msg.text}</div>
                    <div className="text-[9px] text-red-400/30 mt-1 font-mono">{timeStr(msg.timestamp)}</div>
                  </div>
                )
              }

              /* Bot bubble — left */
              return (
                <div key={msg.id} className="flex gap-2 items-start">
                  <div
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm leading-none mt-0.5"
                    style={{ background: msg.partyColor + '25', border: `1.5px solid ${msg.partyColor}55` }}
                  >
                    {msg.symbol}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span
                        className="text-[10px] font-black truncate max-w-[130px] leading-none"
                        style={{ color: msg.partyColor }}
                      >
                        {msg.botName}
                      </span>
                      <span
                        className="text-[8px] font-black px-1.5 py-0.5 rounded-sm leading-none shrink-0"
                        style={{ background: msg.partyColor + '20', color: msg.partyColor }}
                      >
                        {msg.partyCode}
                      </span>
                      <span className="text-[9px] text-white/15 font-mono ml-auto shrink-0">
                        {timeStr(msg.timestamp)}
                      </span>
                    </div>
                    <div
                      className="rounded-xl rounded-tl-sm px-3 py-2 text-[11px] text-white/80 font-mono leading-relaxed border-l-2"
                      style={{ background: '#1c1c1c', borderColor: msg.partyColor + '55' }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {typing.length > 0 && (
              <div className="flex items-center gap-2 px-1 mt-1">
                <div className="flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/25"
                      style={{ animation: `bounce 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/25 font-mono">
                  {typing.slice(0, 2).map(t => t.name).join(', ')}
                  {typing.length > 2 ? ` +${typing.length - 2}` : ''} typing...
                </span>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input bar */}
          <div
            className="shrink-0 flex gap-2 items-center px-3 py-3"
            style={{ background: '#111', borderTop: '1px solid #1e1e1e' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Join the chaos..."
              maxLength={200}
              className="flex-1 rounded-xl px-3 py-2 text-[11px] font-mono text-white placeholder-white/20 outline-none transition-colors"
              style={{
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
              }}
              onFocus={e => (e.target.style.borderColor = '#FBBF2466')}
              onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="shrink-0 w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center transition-all disabled:opacity-25"
              style={{ background: '#FBBF24', color: '#000' }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="pointer-events-auto relative flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95 border-2"
        style={{
          background: isOpen ? '#FBBF24' : '#111',
          borderColor: '#FBBF24',
          color: isOpen ? '#000' : '#FBBF24',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <span className="text-base leading-none">🪳</span>
        <span className="uppercase tracking-wider text-xs leading-none">
          {isOpen ? 'Close' : 'Live Chat'}
        </span>

        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <span
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: '#ef4444' }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}

        {/* Live pulse when open */}
        {isOpen && (
          <span className="w-2 h-2 rounded-full bg-black animate-pulse inline-block" />
        )}

        {/* Offline pulse when closed */}
        {!isOpen && (
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
        )}
      </button>
    </div>
  )
}
