'use client'

import { useState, useEffect } from 'react'

let cachedFp: string | null = null

export function useFingerprint(): string | null {
  const [fp, setFp] = useState<string | null>(cachedFp)

  useEffect(() => {
    if (cachedFp) { setFp(cachedFp); return }

    const stored = localStorage.getItem('cjp_fp')
    if (stored) { cachedFp = stored; setFp(stored); return }

    import('@fingerprintjs/fingerprintjs').then(FingerprintJS => {
      FingerprintJS.load().then(agent => agent.get()).then(result => {
        cachedFp = result.visitorId
        localStorage.setItem('cjp_fp', result.visitorId)
        setFp(result.visitorId)
      })
    })
  }, [])

  return fp
}
