export interface HotSeat {
  number: number
  name: string        // EXACT name from lok_sabha_seats_543.csv
  state: string
  stateCode: string
  reason: string
  heat: 1 | 2 | 3   // 1=warm, 2=hot, 3=🔥 viral
}

export const HOT_SEATS: HotSeat[] = [
  // ── 🔥🔥🔥 VIRAL (must-contest) ───────────────────────────────────────────
  { number: 406, name: 'Varanasi',                  state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'Ghats mein roach, votes mein chaos',              heat: 3 },
  { number: 393, name: 'Gorakhpur',                 state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'UP ki sabse badi naali starts here',              heat: 3 },
  { number: 196, name: 'Thiruvananthapuram',        state: 'Kerala',         stateCode: 'KL', reason: 'PM-level drains are now up for grabs',            heat: 3 },
  { number: 421, name: 'Krishnanagar',              state: 'West Bengal',    stateCode: 'WB', reason: 'Bengal roaches vote with extreme determination',   heat: 3 },
  { number: 319, name: 'Malkajgiri',                state: 'Telangana',      stateCode: 'TS', reason: 'Largest electorate. Most roaches per sq km.',     heat: 3 },
  { number: 455, name: 'New Delhi',                 state: 'Delhi',          stateCode: 'DL', reason: 'Parliament ka padosi — peak irony guaranteed',     heat: 3 },
  { number: 383, name: 'Faizabad',                  state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'Historic seat. Even more historic roaches.',      heat: 3 },
  { number: 315, name: 'Karimnagar',                state: 'Telangana',      stateCode: 'TS', reason: 'IT corridor naali is prime roach real estate',    heat: 3 },

  // ── 🔥🔥 HOT ──────────────────────────────────────────────────────────────
  { number: 364, name: 'Lucknow',                   state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'Nawabi roaches have impeccable drain manners',    heat: 2 },
  { number: 365, name: 'Rae Bareli',                state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'Dynasty seat. Roach dynasty incoming.',           heat: 2 },
  { number: 366, name: 'Amethi',                    state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'Shock upsets happen here. Be the shock.',         heat: 2 },
  { number: 71,  name: 'Patna Sahib',               state: 'Bihar',          stateCode: 'BR', reason: 'Bihar roaches run on chai and pure belief',       heat: 2 },
  { number: 452, name: 'Chandni Chowk',             state: 'Delhi',          stateCode: 'DL', reason: 'Oldest market. Oldest roaches. Most drama.',      heat: 2 },
  { number: 222, name: 'Indore',                    state: 'Madhya Pradesh', stateCode: 'MP', reason: 'Cleanest city? Not anymore. Vote chaos.',         heat: 2 },
  { number: 341, name: 'Ghaziabad',                 state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'NCR roaches commute 90 min to their naali',      heat: 2 },
  { number: 432, name: 'Kolkata Dakshin',           state: 'West Bengal',    stateCode: 'WB', reason: 'Intellectual roaches quoting Tagore at polls',    heat: 2 },
  { number: 486, name: 'Amritsar',                  state: 'Punjab',         stateCode: 'PB', reason: 'Langar mein cockroach bhi aata hai, warmly',      heat: 2 },
  { number: 509, name: 'Tonk-Sawai Madhopur',       state: 'Rajasthan',      stateCode: 'RJ', reason: 'Tiger reserve roaches — extremely territorial',   heat: 2 },
  { number: 527, name: 'Haridwar',                  state: 'Uttarakhand',    stateCode: 'UK', reason: 'Sacred Ganga. Sacred roaches. Sacred chaos.',     heat: 2 },
  { number: 174, name: 'Bangalore South',           state: 'Karnataka',      stateCode: 'KA', reason: 'Tech bro roaches filing from MacBooks at 2am',    heat: 2 },
  { number: 277, name: 'Chennai Central',           state: 'Tamil Nadu',     stateCode: 'TN', reason: 'Filter coffee + roach = unstoppable alliance',    heat: 2 },
  { number: 332, name: 'Muzaffarnagar',             state: 'Uttar Pradesh',  stateCode: 'UP', reason: 'Sugarcane fields full of sugary roach politics',  heat: 2 },

  // ── 🔥 WARM (sleeper hits) ─────────────────────────────────────────────────
  { number: 526, name: 'Nainital-Udhamsingh Nagar', state: 'Uttarakhand',    stateCode: 'UK', reason: 'Hill station roaches have altitude advantage',    heat: 1 },
  { number: 100, name: 'Gandhinagar',               state: 'Gujarat',        stateCode: 'GJ', reason: 'Sabarmati ke roach — very clean, very stubborn',  heat: 1 },
  { number: 4,   name: 'Visakhapatnam',             state: 'Andhra Pradesh', stateCode: 'AP', reason: 'Port city roaches doing international trade',     heat: 1 },
  { number: 513, name: 'Jodhpur',                   state: 'Rajasthan',      stateCode: 'RJ', reason: 'Blue city. Blue roaches. Very photogenic.',       heat: 1 },
]
