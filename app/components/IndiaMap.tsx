'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CITIES = [
  { cx: 182, cy: 95, seat: 101, name: 'Delhi', color: '#7F77DD' },
  { cx: 152, cy: 248, seat: 259, name: 'Mumbai', color: '#D85A30' },
  { cx: 205, cy: 320, seat: 173, name: 'Bengaluru', color: '#1D9E75' },
  { cx: 244, cy: 325, seat: 357, name: 'Chennai', color: '#D4537E' },
  { cx: 220, cy: 278, seat: 393, name: 'Hyderabad', color: '#7F77DD' },
  { cx: 318, cy: 162, seat: 497, name: 'Kolkata', color: '#D85A30' },
  { cx: 262, cy: 132, seat: 485, name: 'Varanasi', color: '#1D9E75' },
  { cx: 248, cy: 118, seat: 467, name: 'Lucknow', color: '#D4537E' },
  { cx: 170, cy: 148, seat: 332, name: 'Jaipur', color: '#D85A30' },
  { cx: 135, cy: 202, seat: 118, name: 'Ahmedabad', color: '#1D9E75' },
  { cx: 188, cy: 70, seat: 84, name: 'Chandigarh', color: '#D4537E' },
  { cx: 170, cy: 75, seat: 313, name: 'Amritsar', color: '#7F77DD' },
  { cx: 350, cy: 118, seat: 33, name: 'Guwahati', color: '#D85A30' },
  { cx: 162, cy: 262, seat: 260, name: 'Pune', color: '#1D9E75' },
  { cx: 190, cy: 35, seat: 149, name: 'Srinagar', color: '#D4537E' },
  { cx: 218, cy: 195, seat: 222, name: 'Indore', color: '#7F77DD' },
  { cx: 210, cy: 175, seat: 221, name: 'Bhopal', color: '#D85A30' },
  { cx: 115, cy: 140, seat: 341, name: 'Jodhpur', color: '#1D9E75' },
  { cx: 200, cy: 355, seat: 203, name: 'Kochi', color: '#D4537E' },
  // 5 additional cities
  { cx: 310, cy: 200, seat: 294, name: 'Bhubaneswar', color: '#D85A30' },
  { cx: 245, cy: 195, seat: 85, name: 'Raipur', color: '#1D9E75' },
  { cx: 132, cy: 258, seat: 260, name: 'Nashik', color: '#7F77DD' },
  { cx: 172, cy: 302, seat: 167, name: 'Mangaluru', color: '#D4537E' },
  { cx: 280, cy: 148, seat: 52, name: 'Patna', color: '#D4A017' },
]

// Pre-compute random animation values to avoid re-renders
const CITY_ANIM = CITIES.map(() => ({
  outerDelay: Math.random(),
  outerDuration: 2 + Math.random(),
  innerDelay: Math.random() * 0.5,
}))

export default function IndiaMap({ className }: { className?: string }) {
  const router = useRouter()
  const [hovered, setHovered] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    city: string
    seat: number
    color: string
    visible: boolean
  }>({ x: 0, y: 0, city: '', seat: 0, color: '', visible: false })

  const navigate = (seat: number) => router.push('/seat/' + seat)

  const isTouchDevice = () =>
    typeof window !== 'undefined' && 'ontouchstart' in window

  return (
    <div className={`relative ${className ?? ''}`} style={{ background: '#0f0b30' }}>
      <p
        style={{
          textAlign: 'center',
          color: '#D4A017',
          fontWeight: 900,
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '12px 0 4px',
        }}
      >
        🗺️ Click Your Constituency
      </p>

      {/* HTML tooltip — absolute over the SVG container */}
      {tooltip.visible && !isTouchDevice() && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -110%)',
            background: '#000',
            color: '#fff',
            borderRadius: '0.5rem',
            border: '2px solid #fde047',
            padding: '0.5rem',
            pointerEvents: 'none',
            zIndex: 50,
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{tooltip.city}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: tooltip.color,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ opacity: 0.8 }}>Constituency #{tooltip.seat}</span>
          </div>
          <div style={{ color: '#fde047', marginTop: 4, fontWeight: 600 }}>
            Click to explore →
          </div>
        </div>
      )}

      <svg
        viewBox="0 0 400 480"
        style={{ width: '100%', maxHeight: '480px', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Pulse keyframes */}
        <style>{`
          @keyframes ping {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
        `}</style>

        {/* Map title overlay */}
        <text
          x="200"
          y="22"
          textAnchor="middle"
          fill="#D4A017"
          fontSize="11"
          fontWeight="900"
          letterSpacing="2"
          fontFamily="Arial Black, Arial"
        >
          CLICK ANY CITY TO CONTEST
        </text>

        {/* India outline */}
        <polygon
          points="155,38 170,22 185,15 205,12 225,15 248,22 268,32 288,45 308,58 328,72 348,88 365,105 375,122 378,140 370,152 358,158 342,155 328,152 318,158 312,172 315,188 312,202 305,215 298,228 292,242 285,258 278,272 270,288 262,305 255,322 248,338 242,355 238,372 235,390 232,408 228,425 225,442 220,452 215,445 205,432 195,418 185,402 175,385 162,365 150,342 140,318 130,295 120,272 112,250 105,228 100,208 97,188 95,170 92,152 88,135 85,118 85,102 88,88 95,76 105,66 118,58 130,52 143,45"
          fill="#1e1560"
          stroke="#4a3fa0"
          strokeWidth="1.5"
        />

        {/* Connection lines between major cities */}
        {/* Delhi → Mumbai */}
        <line x1={182} y1={92} x2={155} y2={248} stroke="#D4A017" strokeWidth={0.5} strokeDasharray="3,4" opacity={0.2} />
        {/* Delhi → Kolkata */}
        <line x1={182} y1={92} x2={320} y2={162} stroke="#D4A017" strokeWidth={0.5} strokeDasharray="3,4" opacity={0.2} />
        {/* Mumbai → Chennai */}
        <line x1={155} y1={248} x2={245} y2={325} stroke="#D4A017" strokeWidth={0.5} strokeDasharray="3,4" opacity={0.2} />
        {/* Chennai → Hyderabad */}
        <line x1={245} y1={325} x2={222} y2={280} stroke="#D4A017" strokeWidth={0.5} strokeDasharray="3,4" opacity={0.2} />

        {/* City dots */}
        {CITIES.map((c, i) => {
          const anim = CITY_ANIM[i]
          const isHovered = hovered === c.seat
          return (
            <g
              key={c.seat}
              onClick={() => navigate(c.seat)}
              onTouchStart={() => navigate(c.seat)}
              onMouseEnter={(e) => {
                setHovered(c.seat)
                if (!isTouchDevice()) {
                  const svg = (e.currentTarget as SVGGElement).closest('svg')!
                  const rect = svg.closest('div')!.getBoundingClientRect()
                  const svgRect = svg.getBoundingClientRect()
                  // Map SVG coords to container-relative pixel coords
                  const scaleX = svgRect.width / 400
                  const scaleY = svgRect.height / 480
                  setTooltip({
                    x: (c.cx * scaleX) + (svgRect.left - rect.left),
                    y: (c.cy * scaleY) + (svgRect.top - rect.top),
                    city: c.name,
                    seat: c.seat,
                    color: c.color,
                    visible: true,
                  })
                }
              }}
              onMouseLeave={() => {
                setHovered(null)
                setTooltip((t) => ({ ...t, visible: false }))
              }}
              style={{
                cursor: 'pointer',
                transform: isHovered ? `translate(${c.cx}px, ${c.cy}px) scale(1.5) translate(${-c.cx}px, ${-c.cy}px)` : 'none',
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transition: 'transform 0.15s ease',
              }}
            >
              {/* Outer slow ring */}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={14}
                fill="none"
                stroke={c.color}
                strokeWidth={2}
                opacity={0.3}
                style={{
                  animation: `ping ${anim.outerDuration}s ease-out infinite`,
                  animationDelay: `${anim.outerDelay}s`,
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              />
              {/* Inner fast ring */}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={9}
                fill="none"
                stroke={c.color}
                strokeWidth={2}
                opacity={0.5}
                style={{
                  animation: `ping 1.5s ease-out infinite`,
                  animationDelay: `${anim.innerDelay}s`,
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              />
              {/* Main dot */}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={5}
                fill={c.color}
                stroke="white"
                strokeWidth={1.5}
                filter={isHovered ? 'url(#glow)' : undefined}
                pointerEvents="all"
              />
              {/* Label */}
              <text
                x={c.cx}
                y={c.cy + 14}
                textAnchor="middle"
                fontSize={7}
                fill="white"
                opacity={0.8}
                pointerEvents="none"
              >
                {c.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
