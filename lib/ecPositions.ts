export interface ECPosition {
  id: string
  title: string
  level: 'national' | 'state'
  state?: string
  shortTitle: string
}

export const NATIONAL_EC_POSITIONS: ECPosition[] = [
  { id: 'cec', title: 'Chief Cockroach Election Commissioner', shortTitle: 'CCEC', level: 'national' },
  { id: 'ec_national', title: 'Cockroach Election Commissioner (National)', shortTitle: 'CEC', level: 'national' },
]

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

export const STATE_EC_POSITIONS: ECPosition[] = STATES_UTS.map(state => ({
  id: `cec_${state.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`,
  title: `Chief Cockroach Election Commissioner — ${state}`,
  shortTitle: 'SCEC',
  level: 'state' as const,
  state,
}))

export const ALL_EC_POSITIONS = [...NATIONAL_EC_POSITIONS, ...STATE_EC_POSITIONS]
