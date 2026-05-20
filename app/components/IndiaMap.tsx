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
  { cx: 290, cy: 125, seat: 52, name: 'Patna', color: '#7F77DD' },
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
]

export default function IndiaMap({ className }: { className?: string }) {
  const router = useRouter()
  const [hovered, setHovered] = useState<number | null>(null)

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

        {/* India outline */}
        <polygon
          points="155,38 170,22 185,15 205,12 225,15 248,22 268,32 288,45 308,58 328,72 348,88 365,105 375,122 378,140 370,152 358,158 342,155 328,152 318,158 312,172 315,188 312,202 305,215 298,228 292,242 285,258 278,272 270,288 262,305 255,322 248,338 242,355 238,372 235,390 232,408 228,425 225,442 220,452 215,445 205,432 195,418 185,402 175,385 162,365 150,342 140,318 130,295 120,272 112,250 105,228 100,208 97,188 95,170 92,152 88,135 85,118 85,102 88,88 95,76 105,66 118,58 130,52 143,45"
          fill="#1e1560"
          stroke="#4a3fa0"
          strokeWidth="1.5"
        />

        {/* City dots */}
        {CITIES.map((city) => (
          <g
            key={city.seat}
            onClick={() => router.push('/seat/' + city.seat)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulsing ring */}
            <circle
              cx={city.cx}
              cy={city.cy}
              r={8}
              fill={city.color}
              opacity={0.3}
              className="city-pulse"
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            />
            {/* Dot */}
            <circle
              cx={city.cx}
              cy={city.cy}
              r={hovered === city.seat ? 7 : 5}
              fill={city.color}
              onMouseEnter={() => setHovered(city.seat)}
              onMouseLeave={() => setHovered(null)}
              filter={hovered === city.seat ? 'url(#glow)' : undefined}
            />
            {/* Label */}
            <text
              x={city.cx}
              y={city.cy + 14}
              textAnchor="middle"
              fontSize={7}
              fill="white"
              opacity={0.8}
              pointerEvents="none"
            >
              {city.name}
            </text>
            {/* Hover tooltip */}
            {hovered === city.seat && (
              <g>
                <rect
                  x={city.cx - 40}
                  y={city.cy - 28}
                  width={80}
                  height={20}
                  rx={4}
                  fill="#000"
                  opacity={0.85}
                />
                <text
                  x={city.cx}
                  y={city.cy - 14}
                  textAnchor="middle"
                  fontSize={8}
                  fill={city.color}
                  fontWeight="bold"
                >
                  {city.name} #{city.seat}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Pulse keyframes */}
        <style>{`
          @keyframes ping {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .city-pulse {
            animation: ping 2s ease-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
        `}</style>
      </svg>
    </div>
  )
}
