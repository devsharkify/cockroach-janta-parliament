export interface CourtPosition {
  id: string
  title: string
  level: 'national' | 'state'
  state?: string
  shortTitle: string
}

// 2 national positions
export const NATIONAL_COURT_POSITIONS: CourtPosition[] = [
  { id: 'cji', title: 'Chief Cockroach Justice of India', shortTitle: 'CJI', level: 'national' },
  { id: 'judge_national', title: 'Senior Cockroach Justice (National Bench)', shortTitle: 'SCJ', level: 'national' },
]

// 36 state/UT positions (one Chief per state)
const STATES_UTS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export const STATE_COURT_POSITIONS: CourtPosition[] = STATES_UTS.map(state => ({
  id: `chief_${state.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
  title: `Chief Cockroach Judge — ${state} High Court`,
  shortTitle: 'CCJ',
  level: 'state' as const,
  state,
}))

export const ALL_COURT_POSITIONS = [...NATIONAL_COURT_POSITIONS, ...STATE_COURT_POSITIONS]
