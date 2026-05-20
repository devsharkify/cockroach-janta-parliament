import { candidates } from '@/lib/mongodb/collections'

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' }

  if (!process.env.MONGODB_URI) {
    return Response.json(
      [
        { id: '1', displayName: 'Mumbai_Kachra_official', seatName: 'Varanasi', state: 'Uttar Pradesh', stateCode: 'UP', partyCode: 'CJP', partyColor: '#7F77DD', seatNumber: 485, isIndependent: false, createdAt: new Date(Date.now() - 3 * 60000).toISOString() },
        { id: '2', displayName: 'Macchar_Raja', seatName: 'Patna Sahib', state: 'Bihar', stateCode: 'BR', partyCode: 'ACP', partyColor: '#1D9E75', seatNumber: 52, isIndependent: false, createdAt: new Date(Date.now() - 8 * 60000).toISOString() },
        { id: '3', displayName: 'Naali_Sardar', seatName: 'Bengaluru Central', state: 'Karnataka', stateCode: 'KA', partyCode: 'CCP', partyColor: '#D85A30', seatNumber: 173, isIndependent: false, createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
        { id: '4', displayName: 'Khatmal_OG', seatName: 'Mumbai North', state: 'Maharashtra', stateCode: 'MH', partyCode: 'RCP', partyColor: '#D4537E', seatNumber: 254, isIndependent: false, createdAt: new Date(Date.now() - 22 * 60000).toISOString() },
        { id: '5', displayName: 'Gobar_da_real', seatName: 'Lucknow', state: 'Uttar Pradesh', stateCode: 'UP', partyCode: 'CJP', partyColor: '#7F77DD', seatNumber: 467, isIndependent: false, createdAt: new Date(Date.now() - 35 * 60000).toISOString() },
        { id: '6', displayName: 'Netagiri_OFF', seatName: 'Hyderabad', state: 'Telangana', stateCode: 'TG', partyCode: null, partyColor: null, seatNumber: 393, isIndependent: true, createdAt: new Date(Date.now() - 48 * 60000).toISOString() },
        { id: '7', displayName: 'Ghoos_Free_Zindagi', seatName: 'Chennai Central', state: 'Tamil Nadu', stateCode: 'TN', partyCode: 'ACP', partyColor: '#1D9E75', seatNumber: 357, isIndependent: false, createdAt: new Date(Date.now() - 62 * 60000).toISOString() },
        { id: '8', displayName: 'Roach_Mafia_88', seatName: 'New Delhi', state: 'Delhi', stateCode: 'DL', partyCode: 'CJP', partyColor: '#7F77DD', seatNumber: 101, isIndependent: false, createdAt: new Date(Date.now() - 75 * 60000).toISOString() },
      ],
      { headers }
    )
  }

  const candidatesCol = await candidates()
  const pipeline = [
    { $match: { withdrawn: false } },
    { $sort: { created_at: -1 } },
    { $limit: 8 },
    {
      $lookup: {
        from: 'parties',
        localField: 'party_id',
        foreignField: 'id',
        as: 'partyArr',
      },
    },
    {
      $lookup: {
        from: 'seats',
        localField: 'seat_number',
        foreignField: 'number',
        as: 'seatArr',
      },
    },
    {
      $project: {
        id: 1,
        display_name: 1,
        created_at: 1,
        is_independent: 1,
        seat_number: 1,
        party_name: { $arrayElemAt: ['$partyArr.name', 0] },
        party_color: { $arrayElemAt: ['$partyArr.color', 0] },
        party_code: { $arrayElemAt: ['$partyArr.code', 0] },
        seat_name: { $arrayElemAt: ['$seatArr.name', 0] },
        state: { $arrayElemAt: ['$seatArr.state', 0] },
        state_code: { $arrayElemAt: ['$seatArr.state_code', 0] },
      },
    },
  ]

  const docs = await candidatesCol.aggregate(pipeline).toArray()

  return Response.json(
    docs.map(d => ({
      id: String(d.id),
      displayName: d.display_name,
      seatName: d.seat_name ?? `Seat ${d.seat_number}`,
      state: d.state ?? 'India',
      stateCode: d.state_code ?? 'IN',
      partyCode: d.party_code ?? null,
      partyColor: d.party_color ?? null,
      seatNumber: d.seat_number,
      isIndependent: d.is_independent,
      createdAt: d.created_at instanceof Date ? d.created_at.toISOString() : String(d.created_at),
    })),
    { headers }
  )
}
