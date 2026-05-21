'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getPinInfo } from '@/lib/pinToSeat';
import { CONSTITUENCIES } from '@/lib/constituencies';

type Tab = 'state' | 'seat' | 'pin' | 'search';

interface SearchResult {
  seatNumber: number;
  label: string;
  secondary: string;
  type: 'seat' | 'candidate';
}

interface SeatFinderProps {
  className?: string;
  mode?: 'explore' | 'file'; // explore = go to /seat/N, file = go to /file/N
}

export default function SeatFinder({ className, mode = 'explore' }: SeatFinderProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('state');

  // --- Tab 0: State → Constituency ---
  const [selectedState, setSelectedState] = useState('');
  const [selectedSeatNum, setSelectedSeatNum] = useState('');
  const stateSeats = CONSTITUENCIES.find(c => c.state === selectedState)?.seats ?? [];

  const handleStateGo = useCallback(() => {
    if (!selectedSeatNum) return;
    const dest = mode === 'file' ? `/file/${selectedSeatNum}` : `/seat/${selectedSeatNum}`;
    router.push(dest);
  }, [selectedSeatNum, mode, router]);

  // reset constituency when state changes
  useEffect(() => { setSelectedSeatNum(''); }, [selectedState]);

  // --- Tab 1: Seat Number ---
  const [seatInput, setSeatInput] = useState('');
  const [seatError, setSeatError] = useState('');

  const handleSeatGo = useCallback(() => {
    const num = parseInt(seatInput, 10);
    if (isNaN(num) || num < 1 || num > 543) {
      setSeatError('Enter a number between 1 and 543');
      return;
    }
    setSeatError('');
    const dest = mode === 'file' ? `/file/${num}` : `/seat/${num}`;
    router.push(dest);
  }, [seatInput, mode, router]);

  const handleSeatKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSeatGo();
    },
    [handleSeatGo],
  );

  // --- Tab 2: PIN Code ---
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [pinLoading, setPinLoading] = useState(false);

  const handlePinFind = useCallback(async () => {
    if (!/^\d{6}$/.test(pinInput)) {
      setPinError('Enter a valid 6-digit PIN code');
      setPinSuccess('');
      return;
    }
    setPinError('');
    setPinSuccess('');
    setPinLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const info = getPinInfo(pinInput);
    setPinLoading(false);
    if (info) {
      setPinSuccess(`Found: ${info.city}, Seat #${info.seat}`);
      await new Promise((resolve) => setTimeout(resolve, 900));
      const dest = mode === 'file' ? `/file/${info.seat}` : `/seat/${info.seat}`;
      router.push(dest);
    } else {
      setPinError('PIN not recognized. Try the State tab.');
    }
  }, [pinInput, mode, router]);

  const handlePinKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handlePinFind();
    },
    [handlePinFind],
  );

  // --- Tab 3: Search ---
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]); setSearchOpen(false); setSearchEmpty(false); setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data: SearchResult[] = await res.json();
      setSearchResults(data.slice(0, 8));
      setSearchEmpty(data.length === 0);
      setSearchOpen(true);
    } catch {
      setSearchResults([]); setSearchEmpty(true); setSearchOpen(true);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchInput(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => doSearch(val), 300);
    },
    [doSearch],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const selectClass =
    'w-full border-4 border-black rounded-xl font-mono bg-white px-3 py-2.5 focus:outline-none focus:border-[#7F77DD] appearance-none cursor-pointer';

  return (
    <div className={className}>
      {/* Tab Switcher */}
      <div className="flex border-4 border-black rounded-xl overflow-hidden mb-4">
        {([ ['state', '🗺️ State'], ['seat', '# No.'], ['pin', '📍 PIN'], ['search', '🔍 Search'] ] as [Tab, string][]).map(([t, label], i) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 font-black text-xs sm:text-sm ${
              tab === t ? 'bg-black text-yellow-300' : 'bg-white text-black hover:bg-yellow-50'
            } ${i > 0 ? 'border-l-4 border-black' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab 0 — State → Constituency */}
      {tab === 'state' && (
        <div className="space-y-3">
          <div className="relative">
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className={selectClass}
            >
              <option value="">— Pick a State / UT —</option>
              {CONSTITUENCIES.map(c => (
                <option key={c.state} value={c.state}>{c.state}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/50">▾</span>
          </div>

          {selectedState && (
            <div className="relative">
              <select
                value={selectedSeatNum}
                onChange={e => setSelectedSeatNum(e.target.value)}
                className={selectClass}
              >
                <option value="">— Pick Constituency ({stateSeats.length} seats) —</option>
                {stateSeats.map(s => (
                  <option key={s.number} value={s.number}>
                    {s.name} (#{s.number})
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/50">▾</span>
            </div>
          )}

          <button
            onClick={handleStateGo}
            disabled={!selectedSeatNum}
            className="w-full py-3 bg-yellow-300 text-black font-black text-base border-4 border-black rounded-xl hover:bg-black hover:text-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0_black]"
          >
            {mode === 'file' ? '🪳 FILE HERE →' : '🗺️ EXPLORE SEAT →'}
          </button>
        </div>
      )}

      {/* Tab 1 — Seat Number */}
      {tab === 'seat' && (
        <div>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={543}
              placeholder="Seat number 1–543"
              value={seatInput}
              onChange={e => { setSeatInput(e.target.value); setSeatError(''); }}
              onKeyDown={handleSeatKeyDown}
              className="flex-1 border-4 border-black rounded-xl font-mono bg-white px-3 py-2 focus:outline-none focus:border-[#7F77DD]"
            />
            <button
              onClick={handleSeatGo}
              className="px-4 py-2 bg-yellow-300 text-black font-black border-4 border-black rounded-xl hover:bg-black hover:text-yellow-300 transition-colors"
            >
              GO 🪳
            </button>
          </div>
          {seatError && <p className="text-red-600 font-bold text-sm mt-2">{seatError}</p>}
        </div>
      )}

      {/* Tab 2 — PIN Code */}
      {tab === 'pin' && (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="6-digit PIN (e.g. 110001)"
              value={pinInput}
              onChange={e => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(''); setPinSuccess(''); }}
              onKeyDown={handlePinKeyDown}
              className="flex-1 border-4 border-black rounded-xl font-mono bg-white px-3 py-2 focus:outline-none focus:border-[#7F77DD]"
            />
            <button
              onClick={handlePinFind}
              disabled={pinLoading}
              className="px-4 py-2 bg-yellow-300 text-black font-black border-4 border-black rounded-xl hover:bg-black hover:text-yellow-300 transition-colors disabled:opacity-60"
            >
              {pinLoading ? <span className="inline-flex items-center gap-1"><Spinner /> Finding...</span> : 'Find Seat'}
            </button>
          </div>
          {pinError && <p className="text-red-600 font-bold text-sm mt-2">{pinError}</p>}
          {pinSuccess && <p className="text-green-600 font-bold text-sm mt-2">{pinSuccess}</p>}
        </div>
      )}

      {/* Tab 3 — Search */}
      {tab === 'search' && (
        <div ref={searchRef} className="relative">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search seat or candidate..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={e => { if (e.key === 'Escape') setSearchOpen(false); }}
              className="flex-1 border-4 border-black rounded-xl font-mono bg-white px-3 py-2 focus:outline-none focus:border-[#7F77DD]"
            />
            {searchLoading && <span className="shrink-0"><Spinner /></span>}
          </div>
          {searchOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0_black] z-50 max-h-64 overflow-y-auto">
              {searchEmpty ? (
                <div className="px-4 py-3 font-mono text-sm text-gray-500">No results found.</div>
              ) : (
                searchResults.map((result, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchOpen(false);
                      const dest = mode === 'file' ? `/file/${result.seatNumber}` : `/seat/${result.seatNumber}`;
                      router.push(dest);
                    }}
                    className="w-full flex items-start gap-2 px-4 py-2 hover:bg-yellow-50 text-left border-b last:border-b-0 border-gray-200"
                  >
                    <span className="text-lg leading-tight mt-0.5">{result.type === 'seat' ? '🗺️' : '🪳'}</span>
                    <span className="flex flex-col">
                      <span className="font-black text-sm text-black">{result.label}</span>
                      <span className="font-mono text-xs text-gray-500">{result.secondary}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
