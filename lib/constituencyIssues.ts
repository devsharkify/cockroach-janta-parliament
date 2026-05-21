/**
 * Constituency → local issue roach-words.
 * Used to generate hyper-local viral candidate names.
 * Format: { issues: string[], roachWords: string[] }
 *
 * issues     = real local problems (used in manifesto context)
 * roachWords = punchy name fragments for the handle
 */

export interface ConstituencyVibe {
  issues: string[]
  roachWords: string[]   // used in name: Party_Constituency_RoachWord
  nicknames: string[]    // alternative short name for constituency in handle
}

const VIBES: Record<string, ConstituencyVibe> = {
  // ── Malkajgiri ────────────────────────────────────────────────────────────
  Malkajgiri: {
    issues: ['dump yard crisis', 'garbage mountain', 'open drainage', 'GHMC apathy'],
    roachWords: ['DumpYard', 'GarbageMafia', 'KachraPrabu', 'NaaliChief', 'DumpSupremo'],
    nicknames: ['Malkajgiri', 'Malka'],
  },
  // ── Varanasi ──────────────────────────────────────────────────────────────
  Varanasi: {
    issues: ['Ganga pollution', 'sewer into river', 'ghat garbage', 'tourism chaos'],
    roachWords: ['GhatKachra', 'GangaNaali', 'GhatRoach', 'MokshaKeeda', 'BanarasKochh'],
    nicknames: ['Varanasi', 'Banaras', 'Kashi'],
  },
  // ── Gorakhpur ─────────────────────────────────────────────────────────────
  Gorakhpur: {
    issues: ['encephalitis history', 'naali overflow', 'power cuts', 'hospital shortage'],
    roachWords: ['NaaliRaja', 'EncRoach', 'BijliChor', 'DrainDon', 'GorakhNeta'],
    nicknames: ['Gorakhpur', 'Gorakh'],
  },
  // ── Thiruvananthapuram ────────────────────────────────────────────────────
  Thiruvananthapuram: {
    issues: ['coastal erosion', 'IT corridor neglect', 'flood', 'smart city delays'],
    roachWords: ['CoastalRoach', 'SmartCityFraud', 'FloodBhai', 'ITNaali', 'TrivanRoach'],
    nicknames: ['Trivandrum', 'Tvm', 'Thiruva'],
  },
  // ── Krishnanagar ──────────────────────────────────────────────────────────
  Krishnanagar: {
    issues: ['border district neglect', 'flood', 'jute industry collapse', 'unemployment'],
    roachWords: ['BorderRoach', 'JuteNaali', 'FloodDada', 'BengaliBhai', 'NadiRoach'],
    nicknames: ['Krishnanagar', 'KNagar'],
  },
  // ── Karimnagar ────────────────────────────────────────────────────────────
  Karimnagar: {
    issues: ['broken IT park promise', 'farmer debt', 'water crisis', 'road quality'],
    roachWords: ['ITFraud', 'KisaanRoach', 'WaterMafia', 'RoadChor', 'KarimNaali'],
    nicknames: ['Karimnagar', 'Karim'],
  },
  // ── New Delhi ─────────────────────────────────────────────────────────────
  'New Delhi': {
    issues: ['smog crisis', 'traffic chaos', 'VIP culture', 'bungalow size competition'],
    roachWords: ['SmogKing', 'VIPRoach', 'TrafficDon', 'LutyensKeeda', 'PowerCorridor'],
    nicknames: ['NewDelhi', 'Dilli', 'NDR'],
  },
  // ── Chandni Chowk ─────────────────────────────────────────────────────────
  'Chandni Chowk': {
    issues: ['overcrowding', 'old building collapse', 'vendor eviction', 'sewer smell'],
    roachWords: ['ChhattaRoach', 'PuranaDilli', 'VendorDon', 'SewerMaster', 'OldDilliBhai'],
    nicknames: ['ChandniChowk', 'OldDilli'],
  },
  // ── Lucknow ───────────────────────────────────────────────────────────────
  Lucknow: {
    issues: ['nawabi decline', 'road digging never ending', 'flyover incomplete', 'corruption'],
    roachWords: ['NawabiRoach', 'FlyoverFraud', 'TehzeebNaali', 'AadabRoach', 'RoadDigger'],
    nicknames: ['Lucknow', 'Nawabganj'],
  },
  // ── Rae Bareli ────────────────────────────────────────────────────────────
  'Rae Bareli': {
    issues: ['development gap despite VIP seat', 'railway factory promises', 'unemployment'],
    roachWords: ['VIPNaali', 'RailwayRoach', 'GandhiGully', 'DevelopmentFraud', 'RaeRoach'],
    nicknames: ['RaeBareli', 'RB'],
  },
  // ── Amethi ────────────────────────────────────────────────────────────────
  Amethi: {
    issues: ['factory shutdown', 'dynasty disappointment', 'AK-47 plant irony'],
    roachWords: ['AKRoach', 'DynastyFail', 'FactoryNaali', 'RaifleRoach', 'AmethiSapu'],
    nicknames: ['Amethi', 'Amethia'],
  },
  // ── Patna Sahib ───────────────────────────────────────────────────────────
  'Patna Sahib': {
    issues: ['flooding every year', 'poor drainage', 'garbage piling up', 'bureaucracy'],
    roachWords: ['GangaFlood', 'PurnaParasit', 'SahebNaali', 'PatnaRoach', 'BiharBhai'],
    nicknames: ['PatnaSahib', 'Patna'],
  },
  // ── Faizabad ──────────────────────────────────────────────────────────────
  Faizabad: {
    issues: ['development lagging despite attention', 'religious tension heat'],
    roachWords: ['MandirRoach', 'AyodhyaKeeda', 'FaizDon', 'DharmaNaali', 'TempleRoach'],
    nicknames: ['Faizabad', 'Ayodhya'],
  },
  // ── Ghaziabad ─────────────────────────────────────────────────────────────
  Ghaziabad: {
    issues: ['smog capital', 'real estate fraud', 'NCR commute hell', 'water crisis'],
    roachWords: ['SmogDon', 'RealtyFraud', 'NCRSurvivor', 'CommuteChor', 'GhaziBhai'],
    nicknames: ['Ghaziabad', 'Ghazi'],
  },
  // ── Kolkata Dakshin ───────────────────────────────────────────────────────
  'Kolkata Dakshin': {
    issues: ['Hooghly pollution', 'broken footpaths', 'political violence'],
    roachWords: ['HooglyRoach', 'BongoDon', 'ChaaTepurRoach', 'DakBhai', 'SourishRoach'],
    nicknames: ['KolkataDakshin', 'SouthCalcutta'],
  },
  // ── Amritsar ──────────────────────────────────────────────────────────────
  Amritsar: {
    issues: ['border tension', 'drug problem', 'tourism bottleneck', 'Attari wait time'],
    roachWords: ['WaheRoach', 'BorderKeeda', 'LangarNaali', 'DrugsWala', 'AmritsarDon'],
    nicknames: ['Amritsar', 'Amby'],
  },
  // ── Tonk-Sawai Madhopur ───────────────────────────────────────────────────
  'Tonk-Sawai Madhopur': {
    issues: ['Ranthambore resort vs locals clash', 'water scarcity', 'tiger menace'],
    roachWords: ['TigerRoach', 'RanthamboreBhai', 'JungleDon', 'WaterChor', 'SawaiRoach'],
    nicknames: ['TonkSawai', 'Tonk'],
  },
  // ── Haridwar ──────────────────────────────────────────────────────────────
  Haridwar: {
    issues: ['Ganga plastic', 'kumbh overcrowding', 'ashram land mafia', 'religious tourism chaos'],
    roachWords: ['GangaPlastic', 'KumbhKeeda', 'AshramRoach', 'DevoNaali', 'HarRoach'],
    nicknames: ['Haridwar', 'Hardwar'],
  },
  // ── Bangalore South ───────────────────────────────────────────────────────
  'Bangalore South': {
    issues: ['traffic worst in India', 'pothole crisis', 'lake encroachment', 'startup vs drain'],
    roachWords: ['PotholeKing', 'StartupNaali', 'LakeKiller', 'TrafficDon', 'BangaloreBug'],
    nicknames: ['BangaloreSouth', 'BSouth'],
  },
  // ── Chennai Central ───────────────────────────────────────────────────────
  'Chennai Central': {
    issues: ['Cooum river pollution', 'slum flooding', 'water scarcity', 'heat wave'],
    roachWords: ['CooumRoach', 'SlumDon', 'HeatWaveBhai', 'WaterMafia', 'ChennaiBug'],
    nicknames: ['ChennaiCentral', 'MadrasRoach'],
  },
  // ── Muzaffarnagar ─────────────────────────────────────────────────────────
  Muzaffarnagar: {
    issues: ['riot aftermath', 'sugarcane price protests', 'farmer agitation'],
    roachWords: ['GannaDon', 'RiotSurvivor', 'SugarcaneRoach', 'KisaanNaali', 'MuzaffarBhai'],
    nicknames: ['Muzaffarnagar', 'Muzzaff'],
  },
  // ── Indore ────────────────────────────────────────────────────────────────
  Indore: {
    issues: ['cleanest city pressure', 'garbage points increasing', 'smart city vs reality'],
    roachWords: ['CleanCityFraud', 'GarbageRoach', 'SmartNaali', 'SaafSafaiDon', 'IndoreBhai'],
    nicknames: ['Indore', 'Ingrain'],
  },
  // ── Visakhapatnam ─────────────────────────────────────────────────────────
  Visakhapatnam: {
    issues: ['steel plant workers protest', 'gas tragedy memory', 'port pollution'],
    roachWords: ['SteelRoach', 'GasBhai', 'PortNaali', 'VizagDon', 'AndhraKeeda'],
    nicknames: ['Vizag', 'Visakha'],
  },
  // ── Nainital-Udhamsingh Nagar ─────────────────────────────────────────────
  'Nainital-Udhamsingh Nagar': {
    issues: ['lake shrinking', 'hill tourism chaos', 'resort encroachment', 'Uttarakhand neglect'],
    roachWords: ['LakeRoach', 'HillDon', 'ResortNaali', 'PahariKeeda', 'NainitalBug'],
    nicknames: ['Nainital', 'NainUdham'],
  },
  // ── Gandhinagar ───────────────────────────────────────────────────────────
  Gandhinagar: {
    issues: ['capital city corruption', 'green city promises unfulfilled', 'DHOLERA delay'],
    roachWords: ['GandhinagarGhost', 'CapitalRoach', 'GiftCityFraud', 'SabarmatiNaali', 'GujDon'],
    nicknames: ['Gandhinagar', 'GNagar'],
  },
  // ── Jodhpur ───────────────────────────────────────────────────────────────
  Jodhpur: {
    issues: ['water crisis in desert', 'tourism congestion', 'heritage neglect'],
    roachWords: ['DesertRoach', 'NilaMehranBhai', 'Waterless', 'JodhpurDon', 'BlueCityBug'],
    nicknames: ['Jodhpur', 'Marwar'],
  },
}

// State-level fallback vibes
const STATE_VIBES: Record<string, ConstituencyVibe> = {
  'Uttar Pradesh': {
    issues: ['UP ka theka', 'naali overflow', 'bijli-sadak-paani'],
    roachWords: ['BhaiSaab', 'UPWala', 'NaaliNeta', 'ThekaRoach', 'BiharinBhai'],
    nicknames: [],
  },
  Maharashtra: {
    issues: ['BMC incompetence', 'pothole deaths', 'builder lobby'],
    roachWords: ['BMCRoach', 'PotholeDon', 'BuilderBhai', 'MaharashtraBug', 'MumbaiBhai'],
    nicknames: [],
  },
  'West Bengal': {
    issues: ['syndicate raj', 'river pollution', 'cut money culture'],
    roachWords: ['SyndicateRoach', 'CutMoneyBhai', 'BongoDon', 'HooglyKeeda', 'BengaliBug'],
    nicknames: [],
  },
  Bihar: {
    issues: ['flood every year', 'LALUISM survival', 'no development drama'],
    roachWords: ['FloodSurvivor', 'NitishBhai', 'JDURoach', 'BiharDon', 'GangaKeeda'],
    nicknames: [],
  },
  Delhi: {
    issues: ['smog champion', 'broken roads', 'VIP culture'],
    roachWords: ['SmogBhai', 'DilliDon', 'PollutionRoach', 'VIPKeeda', 'LutyensRoach'],
    nicknames: [],
  },
  Telangana: {
    issues: ['Kaleshwaram project', 'farmer loans', 'IT city vs rest'],
    roachWords: ['KalesRoach', 'HydBhai', 'TelanganaDon', 'TGNaali', 'ITKeeda'],
    nicknames: [],
  },
  Kerala: {
    issues: ['flood every season', 'gold smuggling drama', 'political violence'],
    roachWords: ['FloodBhai', 'GoldNaali', 'KeralaRoach', 'MalluDon', 'BackwaterBug'],
    nicknames: [],
  },
  Rajasthan: {
    issues: ['water scarcity desert', 'feudal mindset', 'tourism vs locals'],
    roachWords: ['DesertBhai', 'RajputNaali', 'WaterlessDon', 'RajRoach', 'JaipurBug'],
    nicknames: [],
  },
}

// Generic roach words — last resort fallback
export const GENERIC_ROACH_WORDS = [
  'Supremo', 'Parasite', 'Sarkar', 'Neta', 'Don', 'Bhai',
  'NaaliRaj', 'KachraKing', 'GalliDon', 'DrainMaster',
  'MaccharMafia', 'SewerSeth', 'ManholeMafia', 'CobwebKing',
  'GobarGuru', 'GandaGuru', 'NaliNaresh', 'KachraKaant',
]

export function getConstituencyVibe(constituencyName: string, state?: string): ConstituencyVibe {
  // Exact match
  if (VIBES[constituencyName]) return VIBES[constituencyName]
  // State-level fallback
  if (state && STATE_VIBES[state]) return STATE_VIBES[state]
  // Generic
  return {
    issues: ['naali crisis', 'kachra mountain', 'neta drama'],
    roachWords: GENERIC_ROACH_WORDS,
    nicknames: [constituencyName.split(' ')[0]],
  }
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
