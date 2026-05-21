export type NewsCategory =
  | 'BREAKING'
  | 'EXCLUSIVE'
  | 'OPINION'
  | 'INVESTIGATION'
  | 'POLITICS'
  | 'COURT'
  | 'EC'
  | 'INTERNATIONAL'

export interface NewsArticle {
  id: string
  category: NewsCategory
  headline: string
  subheadline: string
  excerpt: string
  body: string[]
  author: string
  authorRole: string
  publishedAt: string
  readMinutes: number
  tags: string[]
  isHot?: boolean
  isFeatured?: boolean
}

// minutes ago helper
const m = (minutesAgo: number) =>
  new Date(Date.now() - minutesAgo * 60000).toISOString()

export const CATEGORY_COLORS: Record<NewsCategory, string> = {
  BREAKING:      '#E53E3E',
  EXCLUSIVE:     '#7F77DD',
  OPINION:       '#D97706',
  INVESTIGATION: '#C05621',
  POLITICS:      '#2B6CB0',
  COURT:         '#276749',
  EC:            '#553C9A',
  INTERNATIONAL: '#2C7A7B',
}

// ─── ALL 30 ARTICLES ────────────────────────────────────────────────────────
export const ALL_ARTICLES: NewsArticle[] = [

  // ── 1 ──
  {
    id: 'cjtv-n01',
    category: 'BREAKING',
    headline: 'Onion Hits ₹130/kg — CJP MP Proposes Onion as New National Reserve Currency',
    subheadline: 'Finance Committee says "gold is outdated, onions make you cry, same emotional response"',
    excerpt: 'As retail onion prices crossed ₹130 per kilogram in Delhi markets, the Cockroach Janta Parliament fast-tracked a bill to designate onion as India\'s official reserve currency, citing its ability to "make everyone cry equally regardless of class."',
    body: [
      'NEW DELHI (CJTV) — In an emergency session called at 2AM, CJP MP Naali_Raja_42 tabled the Pyaaz Suraksha Bill 2026, proposing that one kilogram of onion replace the rupee as India\'s base monetary unit. "The rupee inflates. The onion also inflates — but it makes people feel something," he said, wiping his eyes (he was peeling one for emphasis).',
      '"₹130 per kilo means one onion costs more than a vote in this parliament. And we give votes for free. This is an economic crisis," said ACP leader Naali_Chadha in a press conference held outside a vegetable market.',
      'The EC swiftly clarified that accepting onions as campaign donations is still illegal under the Model Code of Conduct, though it acknowledged that "several prior candidates did smell strongly of allium." No charges were filed.',
      'Markets closed 3% down. Dhabas across the country switched to "onion optional" menus. The bill is currently in committee. Results announced Sunday 11PM IST.',
    ],
    author: 'Khatmal_OG',
    authorRole: 'Chief Political Correspondent, CJTV',
    publishedAt: m(8),
    readMinutes: 3,
    tags: ['onion', 'economy', 'inflation', 'CJP', 'breaking'],
    isFeatured: true,
    isHot: true,
  },

  // ── 2 ──
  {
    id: 'cjtv-n02',
    category: 'POLITICS',
    headline: 'Dog "Motu_Bhai" Files from Mumbai North — Manifesto: 3 Biscuits Per Day Guaranteed to All',
    subheadline: 'Independent candidate promises free biscuit scheme, clean water bowls, and end to fireworks',
    excerpt: 'Motu_Bhai, a 4-year-old Labrador from Andheri, has become the first canine to officially contest from Mumbai North, submitting a manifesto that promises a Universal Biscuit Income and a ban on loud firecrackers.',
    body: [
      'MUMBAI (CJTV) — Motu_Bhai filed his nomination at the CJTV-recognised virtual EC office yesterday, submitting a 200-word manifesto that has since gone viral. "Three biscuits per citizen per day. Clean water in every galli. No more Diwali bombs. I am the change," reads the document, paw-printed and notarised.',
      '"I have been loyal for 4 years and asked for nothing but a walk," Motu_Bhai\'s human spokesperson told CJTV. "Name one human politician who can say that." The crowd outside agreed.',
      'ACP has reached out for a coalition. CJP has countered by promising Motu_Bhai a cabinet post (Minister of Snacks and Cuddle Policy) if he switches sides. He has not responded, but his tail was reportedly "lukewarm."',
      'Motu_Bhai currently leads Mumbai North with 4,712 votes. Sunday results will decide if the biscuit economy gets its first minister.',
    ],
    author: 'Viral_Sewak_13',
    authorRole: 'Field Reporter, CJTV Mumbai',
    publishedAt: m(25),
    readMinutes: 3,
    tags: ['animal candidates', 'dog', 'mumbai', 'independent', 'politics'],
    isHot: true,
  },

  // ── 3 ──
  {
    id: 'cjtv-n03',
    category: 'INVESTIGATION',
    headline: 'Train 14 Hours Late — Station Master Files Counter-FIR Against Passengers for "Expecting Punctuality"',
    subheadline: 'Indian Railways clarifies that schedule is "approximate by design" and passengers should "adjust mentality"',
    excerpt: 'In an unprecedented legal move, a station master at Bhopal Junction filed a police complaint against 847 passengers for "creating public nuisance by expecting a train to arrive on time," escalating what began as a 14-hour delay into a constitutional question.',
    body: [
      'BHOPAL (CJTV) — The Shatabdi Express arrived 14 hours and 23 minutes behind schedule on Tuesday, prompting passengers to crowd the station master\'s office demanding an explanation. The station master, speaking exclusively to CJTV, said he had "no explanation but several counter-arguments."',
      '"The train arrived. That is the guarantee. When it arrives is a philosophical question," he told our reporter while filing a 12-page FIR accusing passengers of "unreasonable optimism about state infrastructure."',
      'CJP MP Gobar_Mantri tabled a bill in the cockroach parliament to add "right to expect punctuality" to the Fundamental Rights section. CCP said the delay was the fault of the previous CJP government. CJP said it was the drain\'s fault. The drain declined to comment.',
      'The cockroach parliament\'s Rail Committee announced a special session, to be held on a train that may or may not arrive. Results every Sunday 11PM IST.',
    ],
    author: 'Sewage_Scoops_71',
    authorRole: 'Infrastructure Correspondent, CJTV',
    publishedAt: m(47),
    readMinutes: 4,
    tags: ['railways', 'delay', 'infrastructure', 'investigation'],
    isHot: true,
  },

  // ── 4 ──
  {
    id: 'cjtv-n04',
    category: 'BREAKING',
    headline: 'Petrol at ₹115/Litre — ACP Introduces Bill to Run Parliament Vehicles on Naali Water',
    subheadline: '"Drains are free, petrol is not. The math is simple," says ACP floor leader',
    excerpt: 'As petrol prices crossed ₹115 per litre in metro cities, the Aam Cockroach Party tabled an emergency bill to retrofit all parliamentary vehicles to run on "naali water extract," claiming the technology exists and "has been suppressed by oil lobbies for decades."',
    body: [
      'NEW DELHI (CJTV) — The Naali Vahaan Bill 2026 was introduced at 4PM on Wednesday by ACP floor leader Kachra_Seth, who arrived for the session on a bicycle to make a point. "We have 543 drains. We have 0 oil wells. Connect the two," he said, presenting a diagram that appears to have been drawn on a napkin.',
      '"The technology is simple," explained ACP\'s technical advisor, who declined to be named and requested we describe him only as "someone who definitely knows science." "You run the water through a filter, then another filter, then a third filter, and then you get fuel. Probably."',
      'The Ministry of Petroleum called the bill "optimistic." The petroleum lobby called it "a threat to our bottom line." Seven petrol pump owners filed a joint petition in the Cockroach Supreme Court. The drain had no comment but appeared to bubble supportively.',
      'Petrol stocks fell 2.3%. Naali futures were up 0.0% because they do not exist. The bill goes to committee next week. Vote for who handles this crisis best. Results Sunday 11PM.',
    ],
    author: 'GhantaWatcher_44',
    authorRole: 'Energy Reporter, CJTV',
    publishedAt: m(72),
    readMinutes: 3,
    tags: ['petrol', 'fuel', 'ACP', 'economy', 'breaking'],
    isHot: true,
  },

  // ── 5 ──
  {
    id: 'cjtv-n05',
    category: 'EC',
    headline: 'EC Officially Shifts Results to Sunday 11PM IST — "Saturday Belongs to the Working Cockroach"',
    subheadline: 'Election Commission cites "drain maintenance schedules" and "chai vendor lobby pressure" for the shift',
    excerpt: 'The Cockroach Election Commission made the historic announcement that all results will henceforth be declared on Sunday nights at 11PM IST, moving away from the previous Saturday schedule after intense lobbying from drain workers and chai vendors.',
    body: [
      'NEW DELHI (CJTV) — In a 47-page order, the CEC wrote: "Saturday is the sacred weekly holiday of the working cockroach. It shall not be consumed by election anxiety. Henceforth, the people shall spend Saturday resting, and Sunday screaming at results."',
      '"We consulted 3,847 naali workers, 1,200 chai vendors, and 47 independent cockroaches. 99.3% said Saturday should be for chai and rest. The remaining 0.7% were asleep and could not be reached," the order noted.',
      'Opposition parties called it "a transparent attempt to let people forget their anger by Monday morning." The ruling CJP celebrated, noting that "Sunday results means we have Saturday night to count votes at leisure."',
      'The new Sunday 11PM IST schedule takes effect immediately. Set your alarms. Inform your drain. Democracy does not pause — it just shifts one day to the right.',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Election Desk, CJTV',
    publishedAt: m(95),
    readMinutes: 2,
    tags: ['EC', 'results', 'Sunday', 'schedule', 'election'],
    isHot: true,
  },

  // ── 6 ──
  {
    id: 'cjtv-n06',
    category: 'POLITICS',
    headline: 'Monkey "Bander_Singh_Yadav" Wins Shimla Primary — Banana Import Duty to Be Scrapped',
    subheadline: 'First primate MP since 1857; manifesto includes "free rooftop access" and "no solar panel ban"',
    excerpt: 'Bander_Singh_Yadav, a 7-year-old rhesus macaque from Shimla\'s Mall Road, has swept the Cockroach Parliament primary with 8,941 votes, running on a platform of zero banana tariffs and unrestricted rooftop access for all non-human species.',
    body: [
      'SHIMLA (CJTV) — "The people of Shimla have spoken. The monkeys of Shimla have also spoken, more loudly, and from higher elevation," Bander_Singh\'s campaign manager (also a monkey) told CJTV in what may be our most challenging interview to date.',
      'His manifesto has three points: 1) Abolish the 47% import duty on bananas. 2) Make all government rooftops public commons. 3) Solar panel installation to require no-objection certificates from resident monkeys.',
      '"His banana policy alone would save the average Himachal household ₹340 per month," said an independent economist who asked to remain unnamed "because my colleagues will not take this seriously." We feel that deeply.',
      'The Tourist Department has raised concerns about the "rooftop commons" clause. Shimla Hotel Association filed an objection. Bander_Singh responded by stealing their press conference snacks, which the media widely interpreted as a policy statement.',
    ],
    author: 'Naali_Observer_5',
    authorRole: 'Wildlife & Politics Desk, CJTV',
    publishedAt: m(130),
    readMinutes: 3,
    tags: ['animal candidates', 'monkey', 'shimla', 'banana', 'politics'],
  },

  // ── 7 ──
  {
    id: 'cjtv-n07',
    category: 'INVESTIGATION',
    headline: 'CJTV Probe: Parliament Floor at 49°C — CJP MPs Voted Via WhatsApp From Air-Conditioned Dhabas',
    subheadline: 'Attendance records show 198 MPs marked "present" while CCTV shows them at Chandni Chowk',
    excerpt: 'A CJTV investigation has uncovered that during last week\'s 49°C heat session, at least 198 ruling CJP MPs voted on critical legislation via WhatsApp forward while physically seated in air-conditioned restaurants, dhabas, and one confirmed "high-end naali resort."',
    body: [
      'NEW DELHI (CJTV) — The evidence is damning: attendance rolls show 198 MPs as "present" during the Drain Infrastructure Vote, while CJTV cameras captured them ordering lassi at Jalebi Wala, Chandni Chowk. The vote passed 312-87. The air conditioning worked perfectly.',
      '"This is digital participation. Parliament is not a building, it is a concept," said CJP spokesperson Ghoos_Gazette in a statement released from what appeared to be a poolside location.',
      'Opposition leader Naali_Chadha called for a floor test to be conducted "on the actual floor, with the actual heat, for a real test of democratic commitment." The motion was voted down 312-87 via WhatsApp.',
      'The Supreme Court has agreed to hear a PIL asking whether "voting from a dhaba constitutes presence in Parliament." The petitioner also wants reimbursement for the dhaba bill. The court said it would "consider both questions equally seriously."',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Investigative Journalist, CJTV Special Unit',
    publishedAt: m(165),
    readMinutes: 4,
    tags: ['parliament', 'heatwave', 'CJP', 'investigation', 'attendance'],
    isHot: true,
  },

  // ── 8 ──
  {
    id: 'cjtv-n08',
    category: 'POLITICS',
    headline: 'Unemployment at 9.2% — Parliament Creates 543 New "Honorary Drain Inspector" Positions (Unpaid)',
    subheadline: 'Government says these "prestigious roles" will look excellent on CVs and reduce the official figure',
    excerpt: 'Responding to a 9.2% unemployment rate, the Cockroach Janta Parliament created 543 new positions for "Honorary Drain Inspector," one per constituency. The roles carry no salary, no authority, and no defined duties — but do come with a laminated ID card.',
    body: [
      'NEW DELHI (CJTV) — "We have 543 drains. We have 9.2% unemployment. The solution writes itself," said Finance Cockroach Gobar_Seth at a press conference where he unveiled the laminated ID card design (yellow, features a cockroach in a hard hat).',
      'The opposition immediately pointed out that unpaid voluntary roles do not count as employment. The government said the opposition was "being very technical about employment, almost suspiciously so." The unemployment rate was officially revised to 8.1% pending further discussion.',
      '"I have a degree in drain engineering," said Ravi, 27, one of 4,847 applicants for the 543 positions. "The ID card does say \'Honorary Expert\' which might help at interviews." He has not had a callback.',
      'The PM Cockroach announced the scheme from a stage shaped like a drain pipe. The backdrop read "ROZGAR NAALI YOJANA." Background music was "Jai Ho." Six ministers clapped for 47 seconds. No drains were inspected.',
    ],
    author: 'Khatmal_OG',
    authorRole: 'Chief Political Correspondent, CJTV',
    publishedAt: m(200),
    readMinutes: 3,
    tags: ['unemployment', 'economy', 'drain inspector', 'politics'],
  },

  // ── 9 ──
  {
    id: 'cjtv-n09',
    category: 'BREAKING',
    headline: 'Budget 2026: ₹4.7 Lakh Crore Allocated to "Strategic Naali Reserve" — Opposition States Get ₹0',
    subheadline: 'Finance minister says funds will "trickle down through natural drain gravity" to all states eventually',
    excerpt: 'The Cockroach Parliament Budget 2026 has allocated a record ₹4.7 lakh crore to the newly created Strategic Naali Reserve Fund, while allocating ₹0 to the five states currently governed by the opposition, citing "drain misalignment."',
    body: [
      'NEW DELHI (CJTV) — "The drain naturally flows toward productive constituencies," Finance Cockroach Seth told Parliament while presenting a budget document that is 847 pages long and entirely in Comic Sans. "Opposition states can apply for funds once they demonstrate drain alignment with national naali policy."',
      '"Our state has 2.4 crore people," said Telangana CM at a press conference. "We received ₹0 in the central allocation. We did, however, receive a very motivating letter from the Finance Ministry saying we should \'try harder.\'"',
      'The Strategic Naali Reserve Fund has no defined objective, no disbursement criteria, and no oversight committee. The Finance Ministry clarified it is "strategic" because it is reserved, and "reserved" because it is strategic.',
      'Markets rallied 1.2% on news of the budget. Drain futures hit an all-time high. Five opposition CMs filed a joint petition in the Supreme Court. The petition fee was ₹500. They are awaiting reimbursement. Sunday 11PM results will decide who controls the drain.',
    ],
    author: 'GhantaWatcher_44',
    authorRole: 'Budget Desk, CJTV',
    publishedAt: m(240),
    readMinutes: 4,
    tags: ['budget', 'economy', 'naali', 'breaking', 'finance'],
    isHot: true,
  },

  // ── 10 ──
  {
    id: 'cjtv-n10',
    category: 'POLITICS',
    headline: 'Cow "Gauri_Mata" Files from Mathura — Manifesto Opposes Leather Briefcases in Parliament',
    subheadline: 'Also demands: free grazing rights on parliamentary lawns, ban on plastic bags near sacred ponds',
    excerpt: 'Gauri_Mata, a 6-year-old desi cow from Vrindavan, has filed her nomination from Mathura constituency with a three-point manifesto that has earned her 12,400 votes and the open endorsement of three sitting CJP MPs.',
    body: [
      'MATHURA (CJTV) — Gauri_Mata\'s manifesto, submitted via her legal representative (a retired IAS officer who has "had enough of human politics"), demands: zero leather briefcases in parliament, unrestricted grazing on central vista lawns, and a ban on plastic bags within 500 metres of any sacred pond.',
      '"Her policies are more coherent than 70% of sitting human MPs," said political scientist Dr. Roach_Kumar, who declined to name the 70% "for legal reasons but you know who they are."',
      'BJP — we mean, CJP — initially welcomed Gauri_Mata\'s candidacy before realising her second demand involves "digging up the new parliament lawns for grazing." Three endorsements were quietly withdrawn. One remains.',
      'Gauri_Mata leads Mathura with 12,400 votes. She has not given any interviews. Her campaign manager says she is "letting her presence speak." Her presence has been at a dhaba on the Yamuna bank. The dhaba is doing record business.',
    ],
    author: 'Viral_Sewak_13',
    authorRole: 'Field Reporter, CJTV Mathura',
    publishedAt: m(290),
    readMinutes: 3,
    tags: ['animal candidates', 'cow', 'mathura', 'politics', 'independent'],
  },

  // ── 11 ──
  {
    id: 'cjtv-n11',
    category: 'OPINION',
    headline: 'Opinion: Inflation at 7.4% But Cockroach Parliament Runs on ₹0 Budget — What Is Humans\' Excuse?',
    subheadline: 'By Naali_Naresh_42, CJP MP-elect, Constituency #485',
    excerpt: 'The human government spent ₹47 lakh crore last year. The Cockroach Janta Parliament spent nothing, filed 12,847 candidates, conducted unlimited voting, and still managed better transparency scores. I am simply asking the question.',
    body: [
      'I want to be clear: I am not saying human politicians are worse than cockroaches. I am saying that cockroaches operate on zero salary, zero allowances, zero pension, zero perks, and zero TA/DA. And yet they contest all 543 seats. Every week. Without complaint.',
      'Meanwhile, a human MP earns ₹1 lakh per month salary, ₹70,000 constituency allowance, ₹60,000 office expenses, free air travel, free accommodation in Lutyens\' Delhi, and still requires an additional ₹10 crore campaign fund to get elected. I am not saying this is wrong. I am saying the drain does it cheaper.',
      'Inflation at 7.4% means everything costs more. Except cockroach candidacy. That costs ₹0. You contest for free. You vote unlimited times. You win on Sunday. No EC deposit. No party fund. No corporate donor. Just pure democratic chaos.',
      'If cockroaches can run the world\'s largest satirical democracy on ₹0, human governments running on ₹47 lakh crore should frankly be embarrassed. This is my opinion. I will not be taking questions. Results Sunday 11PM IST.',
    ],
    author: 'Naali_Naresh_42',
    authorRole: 'CJP MP-elect, Constituency #485',
    publishedAt: m(340),
    readMinutes: 3,
    tags: ['opinion', 'inflation', 'economy', 'satire', 'CJP'],
  },

  // ── 12 ──
  {
    id: 'cjtv-n12',
    category: 'INVESTIGATION',
    headline: 'CJTV Investigation: 87% of All Political Promises Delivered via WhatsApp Voice Note, Never Fulfilled',
    subheadline: 'Of 4,847 pre-election promises tracked, 4,207 remain "in the forward chain" with no delivery date',
    excerpt: 'A six-month CJTV investigation tracking 4,847 campaign promises made during the Cockroach Janta Parliament elections found that 87% were delivered exclusively as WhatsApp voice notes, with no corresponding legislation, allocation, or action.',
    body: [
      'CJTV\'s Promise Tracker collected 4,847 distinct campaign commitments made by candidates across all 543 constituencies. Investigators found that 4,207 (87%) exist only as WhatsApp voice notes, many of which have been forwarded so many times that the original promise has evolved significantly.',
      '"We promised to clean the naali. By the time the forward chain reached the 847th group, the promise had become: abolish naalis entirely, build a space programme, and give everyone a free refrigerator," said one candidate who agreed to speak anonymously.',
      '"A voice note is a promise. A forward is a promise amplified. And an undelivered promise is simply a promise pending," said CJP spokesperson Ghoos_Gazette_12 with the confidence of someone who has never once been held accountable.',
      'Of the remaining 640 promises (13%): 200 were delivered partially, 89 were delivered incorrectly, 47 were delivered to the wrong constituency, and 304 are "under review." The CJTV Promise Tracker continues. Sunday results will show whose promises won votes.',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Investigative Journalist, CJTV',
    publishedAt: m(390),
    readMinutes: 5,
    tags: ['promises', 'whatsapp', 'accountability', 'investigation'],
    isHot: true,
  },

  // ── 13 ──
  {
    id: 'cjtv-n13',
    category: 'COURT',
    headline: 'Supreme Court Rules Calling Someone a Cockroach Is "No Longer an Insult — It Is an Aspiration"',
    subheadline: 'Landmark 5-judge bench judgment recognises cockroach parliament as legitimate democratic institution',
    excerpt: 'In a unanimous 5-0 judgment, the Cockroach Supreme Court ruled that calling a person a "cockroach" in a political context constitutes "the highest form of democratic aspiration," reversing 70 years of legal precedent.',
    body: [
      'NEW DELHI (CJTV) — Chief Justice Gobar_Dada_1 delivered the historic 238-page verdict, stating: "A cockroach survives nuclear war, adapts to any environment, and contests elections without salary. These are qualities every citizen should aspire to. The word is henceforth a compliment."',
      '"The court took note of 12,847 candidates, unlimited voter participation, and a transparency index score of 98/100. By these metrics, the Cockroach Janta Parliament outperforms every human legislature on record," the judgment read.',
      'The decision was immediately tested when a CJP MP called an opposition MP a "cockroach" on the floor. The opposition MP thanked him. The CJP MP, confused, sat down.',
      'Opposition lawyers have filed a review petition arguing that "while the word is now aspirational, calling someone a cockroach in a naali context still carries negative connotation." The court has agreed to define naali-specific usage by next term.',
    ],
    author: 'Khatmal_OG',
    authorRole: 'Legal Correspondent, CJTV',
    publishedAt: m(440),
    readMinutes: 3,
    tags: ['supreme court', 'judgment', 'cockroach', 'legal', 'court'],
  },

  // ── 14 ──
  {
    id: 'cjtv-n14',
    category: 'POLITICS',
    headline: 'Cat "WhatsApp_Forward_420" Files Independent — Will Fact-Check Every Parliamentary Statement',
    subheadline: 'Manifesto: "I will stare at politicians until they feel judged. That is governance."',
    excerpt: 'A Persian cat identified only as "WhatsApp_Forward_420" has filed her candidacy from Pune West as an Independent, with a manifesto that consists entirely of cat staring, strategic silence, and the promise to knock governmental papers off desks.',
    body: [
      'PUNE (CJTV) — WhatsApp_Forward_420\'s manifesto, as translated by her campaign team, reads: "I will attend all sessions. I will sit on the Finance Minister\'s budget papers. I will stare at every MP until they feel judged. If they are lying, I will knock something over. Democracy is accountability."',
      '"She has filed 47 motions in the past week, all of which consist of knocking things off tables," her campaign manager told CJTV. "This is, we believe, a more effective form of parliamentary disruption than the current methods."',
      'She currently leads Pune West with 9,847 votes. The Pune BJP — sorry, CJP — unit said she would "be welcomed into the NDA alliance if she stops sitting on the defence minister\'s laptop." She has not responded and has been sitting on the laptop for three days.',
      'The Election Commission noted her candidacy is valid. "There is no height requirement, no species requirement, and no requirement to have attended school. She qualifies on all counts," the EC stated with what may have been resignation.',
    ],
    author: 'Viral_Sewak_13',
    authorRole: 'Field Reporter, CJTV Pune',
    publishedAt: m(490),
    readMinutes: 3,
    tags: ['animal candidates', 'cat', 'pune', 'independent', 'satire'],
  },

  // ── 15 ──
  {
    id: 'cjtv-n15',
    category: 'BREAKING',
    headline: 'GST on Chapati? Finance Ministry Clarifies "Only Chapatis With Fillings" — Nation Confused',
    subheadline: 'Plain roti still tax-free; stuffed paratha taxed at 5%; "fancy" roti definition pending committee',
    excerpt: 'A Finance Ministry circular proposing a tiered GST structure on Indian breads has triggered national confusion, with tax authorities now required to determine in real time whether a bread item qualifies as "plain," "stuffed," or "fancy."',
    body: [
      'NEW DELHI (CJTV) — The circular, released at 11PM on a Friday (always on a Friday), distinguishes between: Plain roti (0% GST), Stuffed paratha (5% GST), "Restaurant-grade fancy roti" (12% GST), and "Artisanal sourdough claiming to be a chapati for brunch" (18% GST).',
      '"We need a definition of fancy," said a GST inspector from Jaipur who has been standing outside a dhaba for four hours trying to determine if the aloo paratha qualifies as "stuffed" or "stuffed with artisanal intent." He has not eaten.',
      'The cockroach parliament moved swiftly: ACP tabled the Roti Sovereignty Bill demanding all breads be exempt "as a fundamental right to not die of hunger." CJP countered with the "Fancy Roti Regulation Bill" which clarifies nothing but uses the word "fancy" 47 times.',
      'A PIL was filed in the Supreme Court by 1,200 dhaba owners within 6 hours. The court issued notice. The Finance Ministry issued a clarification of the circular. The clarification requires its own clarification. Sunday results decide who fixes the roti.',
    ],
    author: 'GhantaWatcher_44',
    authorRole: 'Economy Desk, CJTV',
    publishedAt: m(25),
    readMinutes: 3,
    tags: ['GST', 'roti', 'chapati', 'economy', 'breaking'],
    isHot: true,
  },

  // ── 16 ──
  {
    id: 'cjtv-n16',
    category: 'POLITICS',
    headline: 'Donkey "Gadha_Sahab" Wins Bikaner North — First Equid in Cockroach Parliament History',
    subheadline: 'Platform: "I carry your burdens daily. Now I carry your votes." Coalition talks with Motu_Bhai underway.',
    excerpt: 'Gadha_Sahab, a 9-year-old donkey from Bikaner\'s camel territory, has made Cockroach Parliament history by leading Bikaner North with 11,200 votes, running on a platform of "burden-bearer solidarity" and lower transportation costs.',
    body: [
      'BIKANER (CJTV) — "I carry bricks. I carry sand. I carry cement. I carry the weight of your broken roads and ask for nothing but a bucket of water and the occasional pat," Gadha_Sahab\'s manifesto reads, in what CJTV editorial staff unanimously called "the most relatable candidate statement of the election cycle."',
      '"His infrastructure policy is literally embodied. He has done more road testing than the entire National Highways Authority," said one voter from Bikaner North who also requested we note that the roads are indeed terrible.',
      'CJP offered Gadha_Sahab a coalition seat as Minister of Transport (Non-Motorised Division). He declined, or rather did not respond to emails. His team says he is "considering all options while hauling sand in the interim."',
      'Coalition talks with Motu_Bhai (Mumbai North, Labrador, biscuit platform) and Bander_Singh_Yadav (Shimla, rhesus macaque, banana platform) are reportedly ongoing. If successful, the Animal Front could hold 34,000 combined votes. Sunday results.',
    ],
    author: 'Naali_Observer_5',
    authorRole: 'Rural Correspondent, CJTV',
    publishedAt: m(580),
    readMinutes: 3,
    tags: ['animal candidates', 'donkey', 'bikaner', 'politics', 'coalition'],
  },

  // ── 17 ──
  {
    id: 'cjtv-n17',
    category: 'EC',
    headline: 'EC Bans Roti Bribery; Issues Clarification That Bhatura Is "Still Legal Campaign Material"',
    subheadline: 'Order follows viral footage of 3 rotis being exchanged for a vote at a Haryana polling station',
    excerpt: 'The Cockroach Election Commission has issued a formal ban on roti-based voter inducement following a CJTV investigation, while simultaneously clarifying that bhatura, poori, and "most fried breads" remain outside the scope of the prohibition.',
    body: [
      'NEW DELHI (CJTV) — The EC\'s 12-page order distinguishes sharply between "roti as currency" (banned) and "deep-fried alternatives as hospitality" (permitted). "A voter receiving a roti has been bribed. A voter receiving a bhatura has received traditional hospitality. The distinction is the oil content," the order states.',
      '"We investigated 47 instances of suspected roti bribery. In 39 cases, the roti was actually a misidentified roomali. We are not yet confident in our roomali-roti taxonomy," EC spokesperson Viral_Sewak confirmed.',
      'The CJP welcomed the order, noting that "we have always campaigned on bhatura" (unverified). ACP has demanded the EC clarify whether dal-with-roti constitutes "enhanced bribery" or if the dal is treated separately. The EC said it will issue a supplement order.',
      'CJTV has learned that three CJP candidates have already switched their voter outreach from "roti distribution" to "complementary bhatura camps." Legal. Democratic. Oily.',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Election Desk, CJTV',
    publishedAt: m(630),
    readMinutes: 3,
    tags: ['EC', 'roti', 'bribery', 'election', 'food'],
  },

  // ── 18 ──
  {
    id: 'cjtv-n18',
    category: 'INTERNATIONAL',
    headline: 'Pakistan Cockroach Parliament Requests "Drain Corridor" With India — EC Says It\'s Investigating',
    subheadline: 'Proposal includes shared drain infrastructure, cockroach-free border crossings, and a joint naali committee',
    excerpt: 'In an unprecedented diplomatic move, the newly constituted Pakistan Cockroach Parliament has formally requested India to establish a cross-border "Drain Corridor" for free roach movement, shared naali infrastructure, and a joint drain management committee.',
    body: [
      'ISLAMABAD / NEW DELHI (CJTV) — The request, delivered via a formal letter written on what appears to be a drain pipe cross-section, proposes: a bilateral Drain Sovereignty Agreement, a Joint Naali Technical Committee (JNTC), and reciprocal cockroach visa waivers.',
      '"Drains do not respect borders. Water does not check passports. Why should cockroaches?" read the letter, which has been described by Indian diplomatic sources as "hard to argue with on a purely hydrological basis."',
      'The Indian Cockroach EC said it was "studying the proposal carefully," while the Ministry of External Affairs (human) said it was "unaware of this correspondence and not sure which ministry handles cockroach diplomacy." The Prime Minister\'s Office issued no comment.',
      'ACP supports the corridor in principle but wants a "drain parity clause." CJP says it supports "strategic drain sovereignty" which means nothing specific. Three opposition parties have called it a "naali sellout." The drain has reportedly been flowing both ways already.',
    ],
    author: 'GhantaWatcher_44',
    authorRole: 'International Desk, CJTV',
    publishedAt: m(680),
    readMinutes: 4,
    tags: ['international', 'Pakistan', 'drain corridor', 'diplomacy'],
  },

  // ── 19 ──
  {
    id: 'cjtv-n19',
    category: 'BREAKING',
    headline: 'Rat "Chuha_Bhai_Sarkar" Contests from Surat — Entire Manifesto Is "Cheese. All of It."',
    subheadline: '"I have said what needs to be said. I will not be elaborating. The cheese speaks for itself." — Chuha_Bhai',
    excerpt: 'Chuha_Bhai_Sarkar, a rat of unknown age and confirmed determination, has submitted his candidacy from Surat East with a 3-word manifesto that has generated more press coverage than any 200-page document filed this election cycle.',
    body: [
      'SURAT (CJTV) — The manifesto reads, in its entirety: "Cheese. All of it." The filing was accepted by the EC after a 20-minute consultation about whether this constitutes a "policy platform." The EC concluded that "cheese redistribution could, technically, be considered an economic policy."',
      '"His clarity is refreshing," said Surat East voter Ritu Shah, 34, who has voted for Chuha_Bhai_Sarkar four times in the past two hours. "Every other candidate has a 15-point plan. He has one point. And it is cheese. I trust him."',
      'Financial analysts have attempted to model a "cheese-for-all" economy. Early projections suggest GDP growth of 0.02% and a significant increase in dairy imports from New Zealand. The Finance Ministry called it "an incomplete economic model." Chuha_Bhai declined to respond.',
      'He currently leads Surat East with 7,841 votes. Coalition partners are reportedly being offered cheese. Results Sunday 11PM IST. CJTV recommends investing in dairy.',
    ],
    author: 'Viral_Sewak_13',
    authorRole: 'Field Reporter, CJTV Surat',
    publishedAt: m(730),
    readMinutes: 2,
    tags: ['animal candidates', 'rat', 'surat', 'cheese', 'independent'],
    isHot: true,
  },

  // ── 20 ──
  {
    id: 'cjtv-n20',
    category: 'COURT',
    headline: 'PIL Filed Against Mosquito Infiltration in Cockroach Parliament — "Blood-Sucking Conflict of Interest"',
    subheadline: 'Petitioner claims 47 mosquitoes have filed from AIMIM strongholds; EC denies conflict despite obvious irony',
    excerpt: 'A public interest litigation filed in the Cockroach Supreme Court demands disqualification of all mosquito candidates, citing an "inherent and unresolvable conflict of interest" between mosquitoes\' biological imperative to draw blood and their parliamentary duty to serve.',
    body: [
      'NEW DELHI (CJTV) — The PIL was filed by Roach_Rights_Foundation, whose petition states: "The mosquito\'s constitutional purpose is blood extraction. Parliament\'s purpose is resource allocation. These are the same thing, but mosquitoes are more honest about it, which paradoxically makes it worse."',
      '"We do not deny that mosquitoes draw blood," said AIMIM (All India Machar Influence Movement) spokesperson. "But we argue this is a transferable skill. Understanding how to extract resources from unwilling hosts is exactly the competency gap Indian politics needs addressed."',
      'The CJP called the petition "anti-minority." The ACP said it was "philosophically valid but legally flawed." The Supreme Court issued notice to all 47 mosquito candidates, the EC, the Health Ministry, and the WHO (Worldwide Hum Organisation, cockroach chapter).',
      'Hearing is listed for next Monday. Two of the 47 respondent mosquitoes did not appear in court, citing "busy season." The court has issued non-bailable warrants. The mosquitoes are considered to be in their constituency.',
    ],
    author: 'Khatmal_OG',
    authorRole: 'Legal Correspondent, CJTV',
    publishedAt: m(790),
    readMinutes: 4,
    tags: ['court', 'mosquito', 'AIMIM', 'PIL', 'conflict of interest'],
  },

  // ── 21 ──
  {
    id: 'cjtv-n21',
    category: 'POLITICS',
    headline: 'Viral Video: Goat "Bakra_Neta" Chews Opposition\'s Campaign Posters — "Strategic Destruction" Says Party',
    subheadline: 'CJP denies any coordination; 7,000 posters consumed; goat has no comment but appears satisfied',
    excerpt: 'A video of Bakra_Neta, a goat from Ajmer who is also an active candidate, systematically eating ACP campaign posters has gone viral with 4.7 crore views, raising questions about whether this constitutes a campaign activity, vandalism, or just breakfast.',
    body: [
      'AJMER (CJTV) — The footage, captured on a CCTV camera near Ajmer Dargah Road, shows Bakra_Neta methodically consuming 12 ACP posters, 3 CCP banners, and one laminated cut-out of a rival candidate\'s face. He left all CJP materials untouched. This has been noted.',
      '"It is simply his diet," said his campaign team. "He is not politically motivated. He just finds ACP posters more digestible. We cannot explain the flavor preferences of our candidate." CJP denied coordination. Their denial lasted 4 minutes before a WhatsApp group called "Bakra Strategy 2026" was screenshotted.',
      '"The EC has received our complaint," said ACP. "We have also ordered laminated posters coated with bitter gourd extract. Let us see how \'unpolitical\' his digestion is then."',
      'Bakra_Neta leads Ajmer Central with 8,200 votes. He has not eaten any CJTV press passes. We consider this a sign of respect and will be covering his campaign closely going forward.',
    ],
    author: 'Naali_Observer_5',
    authorRole: 'Field Reporter, CJTV Ajmer',
    publishedAt: m(850),
    readMinutes: 3,
    tags: ['animal candidates', 'goat', 'ajmer', 'viral', 'poster'],
    isHot: true,
  },

  // ── 22 ──
  {
    id: 'cjtv-n22',
    category: 'INVESTIGATION',
    headline: '2.4 Crore Fake Voter IDs Found in Haryana — All Belong to Real Cockroaches, EC Defends Decision',
    subheadline: '"They are real voters with fake IDs. This is the reverse of the usual problem," EC clarifies',
    excerpt: 'Election authorities in Haryana discovered 2.4 crore voter IDs that were found to be technically fraudulent but belong to verified, living cockroaches who are confirmed residents of their stated constituencies.',
    body: [
      'CHANDIGARH (CJTV) — The discovery came during routine voter roll verification when officials noticed that 2.4 crore voter cards featured names like "Naali_Ka_Naseeban" and "Sewer_Singh_Sarpanch" alongside photos that were clearly insects.',
      '"The IDs are fake in the sense that they were not issued by the official process. But the voters are real. They exist. They live in the drains listed on the card. This is, technically, more accurate than many human voter rolls," the EC spokesperson said.',
      'Opposition demanded an FIR against "whoever made 2.4 crore fake IDs for cockroaches." The government pointed out that the same opposition had previously demanded "100% voter registration" without specifying species. The opposition called this "a very unfair point."',
      'The 2.4 crore cockroaches have been granted provisional voting rights pending a Supreme Court ruling on insect franchise. They have already voted 47 times each. The EC says this is within the unlimited voting policy and therefore fine.',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Investigative Journalist, CJTV',
    publishedAt: m(910),
    readMinutes: 4,
    tags: ['voter ID', 'Haryana', 'EC', 'investigation', 'fraud'],
  },

  // ── 23 ──
  {
    id: 'cjtv-n23',
    category: 'BREAKING',
    headline: 'Pigeon "Kabootar_Lal" Files from Delhi — Demands All Parliament Statues Be "Fair Game"',
    subheadline: 'Also requests: wifi at Connaught Place, removal of anti-perch spikes from government buildings',
    excerpt: 'Kabootar_Lal, a common rock pigeon who has been commuting between Parliament Street and India Gate for 3 years, has filed his candidacy from New Delhi constituency with a manifesto focused on urban infrastructure, statue accessibility, and broadband coverage.',
    body: [
      'NEW DELHI (CJTV) — "The spikes are discriminatory. The statues are public property. The wifi at CP drops every 4 minutes. I pay property tax via my constituency impact (citations available). I deserve representation," reads Kabootar_Lal\'s manifesto, as delivered verbally to his human transcriber.',
      '"He has done more constituency visits than any human candidate in New Delhi history," said his campaign manager. "He has landed on every building, statue, bus shelter, and government vehicle in this constituency. His ground-level intelligence is unmatched."',
      'The Delhi government called the anti-pigeon spike issue "a law and order matter, not a parliamentary one." Kabootar_Lal responded by landing on the Lt. Governor\'s car for 45 minutes. No spikes were installed that day.',
      'He currently leads New Delhi with 14,200 votes — the highest in the capital region. The Animal Front coalition has extended a formal invitation. He will confirm once the parliament building wifi improves enough to send the reply.',
    ],
    author: 'GhantaWatcher_44',
    authorRole: 'Delhi Correspondent, CJTV',
    publishedAt: m(970),
    readMinutes: 3,
    tags: ['animal candidates', 'pigeon', 'delhi', 'urban', 'infrastructure'],
  },

  // ── 24 ──
  {
    id: 'cjtv-n24',
    category: 'OPINION',
    headline: 'Opinion: I Voted 847 Times Today and My Democracy Has Never Felt More Alive',
    subheadline: 'By Naali_Chadha_Jr, Voter, Constituency #421, Drain B-47',
    excerpt: 'They said vote once and it counts. They were wrong — or at least, they were boring. I voted 847 times today. My finger is tired. My heart is full. This is what democracy feels like when it stops being a ceremony and becomes a lifestyle.',
    body: [
      'I woke up at 6AM. I voted for the first time at 6:03AM. I voted for the last time — so far — at 11:47PM. In between, I voted 845 more times. I used three different browsers, one incognito mode, and the dedication of someone who has genuinely run out of other things to do.',
      'Each vote felt meaningful. Not in a "my vote changes the world" way. More in a "I clicked a button and something registered" way. Which is, if you think about it, exactly how human democracy works too, just with more paperwork.',
      'People ask: does it matter if you vote once or 847 times? In this parliament, yes. More votes means more cockroach democracy. And more cockroach democracy means the one system in the world that is 100% transparent about being absurd. I respect that.',
      'Results announced Sunday 11PM IST. I will be voting until Sunday. I will also be voting on Sunday. My candidate is Naali_Chadha_Jr. I am Naali_Chadha_Jr. Democracy is beautiful.',
    ],
    author: 'Naali_Chadha_Jr',
    authorRole: 'Voter & Candidate, Constituency #421',
    publishedAt: m(1030),
    readMinutes: 3,
    tags: ['opinion', 'voting', 'democracy', 'satire', 'unlimited votes'],
  },

  // ── 25 ──
  {
    id: 'cjtv-n25',
    category: 'POLITICS',
    headline: 'Central Vista 2.0 Cockroach Wing Announced — ₹47,000 Crore Budget, No Toilets',
    subheadline: 'Architecture firm reveals all 543 offices will face the drain; no humans allowed in the wing',
    excerpt: 'The government has announced a dedicated "Cockroach Parliamentary Wing" as part of Central Vista Phase 2, with a ₹47,000 crore budget, drain-facing orientation for all offices, and a strict no-humans policy in the main chambers.',
    body: [
      '"We have built a parliament for cockroaches, by cockroaches," said the lead architect, who asked CJTV not to identify him "because my human colleagues don\'t know I took this commission." The building features 543 micro-offices, 12 drain-access points, and zero toilet facilities ("they are cockroaches").',
      '"₹47,000 crore for a building with no toilets seems high," said the opposition finance spokesperson. The government clarified that ₹46,900 crore is for the "strategic naali infrastructure integration" and ₹100 crore is for the actual building.',
      'The EC has demanded the wing include a designated voting area, accessible 24/7, with no time limit. The architect confirmed this is "just the entire building." The EC said this is acceptable.',
      'Construction begins when the previous Central Vista project completes. That project is 3 years behind schedule. The cockroach wing groundbreaking is therefore expected in 2031. Cockroaches, having survived 300 million years, have confirmed they can wait.',
    ],
    author: 'Khatmal_OG',
    authorRole: 'Chief Political Correspondent, CJTV',
    publishedAt: m(1090),
    readMinutes: 3,
    tags: ['central vista', 'infrastructure', 'budget', 'parliament building'],
  },

  // ── 26 ──
  {
    id: 'cjtv-n26',
    category: 'EC',
    headline: 'EC Issues New Rule: All Candidate Names Must Be "Pronounceable by a Six-Year-Old"',
    subheadline: 'Rule targets names like "Naali_Chori_Khatam_Karo_2026_Official" that require three breaths to say',
    excerpt: 'The Cockroach Election Commission has issued new candidate name guidelines requiring all display names to be pronounceable "in a single breath by a child aged 6," citing concerns that long names "slow down the counting process and confuse voice assistants."',
    body: [
      '"We received a candidacy filed under the name \'Corruption_Hatao_Naali_Bachao_CJP_Official_Verified_TM_2026\'. This name is 56 characters, requires 4 pauses, and caused our voice assistant to give up and play Himesh Reshammiya," the EC order states.',
      '"Short names win more easily. Look at Modi. Look at Motu. Look at Gadha. Six letters. Easy. Effective. Democratic," the EC commissioner told CJTV, counting on his fingers.',
      'Under the new guidelines, names must be under 20 characters, contain no more than two underscores, and "not include the words \'official,\' \'verified,\' \'real,\' or \'original\' as these are impossible to verify."',
      'Several candidates have been asked to refile. "Sarkari_Naali_Drainage_Policy_Exclusive_Senior_Leader_Bhai_Ji_2026" has become "Bhai_Ji_2026." He is leading his constituency.',
    ],
    author: 'Viral_Sewak_13',
    authorRole: 'EC Reporter, CJTV',
    publishedAt: m(1150),
    readMinutes: 2,
    tags: ['EC', 'candidate names', 'rules', 'election'],
  },

  // ── 27 ──
  {
    id: 'cjtv-n27',
    category: 'BREAKING',
    headline: 'IPL Becomes "Insect Premier League" — 3 Cockroach Franchises Investigated for Pheromone Fixing',
    subheadline: 'BCCI (Board of Cockroach Cricket in India) denies all allegations; smells suspicious',
    excerpt: 'The newly rebranded Insect Premier League has launched its first season to massive fanfare, immediately followed by a CJTV investigation revealing that three cockroach franchises may have used biological pheromone signals to fix match outcomes.',
    body: [
      'The IPL\'s rebranding to "Insect Premier League" was unanimous after 12,847 cockroach candidates objected to playing cricket for entertainment while contesting 543 seats for governance. "We cannot do both. We are busy," said a CJP MP who is now also a Naali Royals team owner.',
      '"Pheromone match-fixing is undetectable by current technology," admitted the BCCI spokesperson. "A cockroach can signal to a teammate using chemical communication invisible to humans. The umpires are human. This is a regulatory gap we are... aware of."',
      'Three teams — Naali Riders, Sewer Strikers, and Mumbai Khatmal XI — are under investigation. All three denied fixing via pheromone. They then immediately scurried under a refrigerator, which investigators noted is "consistent with guilty behaviour."',
      '"Cricket has always had match-fixing. At least cockroaches are being original about it," said former cricketer Aakash Bhosle, speaking exclusively to CJTV. His quote will not get him in trouble because we will not say which Aakash Bhosle.',
    ],
    author: 'GhantaWatcher_44',
    authorRole: 'Sports & Politics Desk, CJTV',
    publishedAt: m(1210),
    readMinutes: 3,
    tags: ['IPL', 'cricket', 'sports', 'fixing', 'pheromone'],
    isHot: true,
  },

  // ── 28 ──
  {
    id: 'cjtv-n28',
    category: 'COURT',
    headline: 'High Court: "Calling Someone a Cockroach in a Drain Context Still Carries Negative Connotation"',
    subheadline: 'Judgment clarifies Supreme Court\'s earlier "aspiration" ruling does not apply inside naalis',
    excerpt: 'The Delhi High Court has issued a supplementary judgment clarifying that while calling someone a "cockroach" in a political or aspirational context is now a compliment (per Supreme Court precedent), the same phrase used "inside or near a drain" retains its original negative valence.',
    body: [
      '"Context is everything," wrote the bench. "A cockroach in Parliament is an aspiration. A cockroach in your kitchen is a problem. The same creature, different setting, entirely different legal treatment. Law is consistent; reality is complicated."',
      'The case arose after a CJP MP called an ACP MP a "naali cockroach" during a floor debate. The ACP MP took offense. The CJP MP cited the Supreme Court ruling. The High Court ruled the modifier "naali" changes everything.',
      '"The word \'naali\' adds a spatial qualifier that reinstates the negative connotation," the judgment explains in 347 pages. "We acknowledge this is confusing. We regret this is necessary. We do not regret the detailed discussion of naali semantics that occupies pages 200-280."',
      'The Supreme Court has been asked to define "naali-adjacent speech." A three-judge bench has been constituted. The bench meets Thursday. All three judges have reportedly googled "naali."',
    ],
    author: 'Khatmal_OG',
    authorRole: 'Legal Correspondent, CJTV',
    publishedAt: m(1270),
    readMinutes: 3,
    tags: ['court', 'high court', 'defamation', 'naali', 'legal'],
  },

  // ── 29 ──
  {
    id: 'cjtv-n29',
    category: 'INVESTIGATION',
    headline: 'EXCLUSIVE: Who Is Funding the Animal Front? Follow the Cheese, Biscuits and Bananas',
    subheadline: 'CJTV traces ₹47 lakh in "campaign donations" from anonymous donors listed only as "The Provider"',
    excerpt: 'A CJTV investigation into the Animal Front coalition — comprising Motu_Bhai (dog), Bander_Singh_Yadav (monkey), Gadha_Sahab (donkey), Gauri_Mata (cow), and Chuha_Bhai_Sarkar (rat) — has uncovered ₹47 lakh in unexplained campaign funding from a donor registered only as "The Provider."',
    body: [
      'The trail begins with Motu_Bhai\'s unusually well-funded campaign: professional banners, WhatsApp broadcast lists, and a catering arrangement at campaign events that provided — according to one witness — "premium cheese and imported biscuits, not the local stuff." For a first-time candidate without declared income, this raised flags.',
      'Following the money: ₹12 lakh traced to "Snack Supplies Mumbai Pvt Ltd." Director: Unknown. Registered address: Under Juhu refrigerator. The company has been operating since 2019 and has filed zero income tax returns. This is suspicious even by cockroach standards.',
      '"The cheese is clean money," said Chuha_Bhai_Sarkar\'s campaign team. "We received it legally. In a bag. Under a bridge. At night. From someone we did not see. This is transparent funding."',
      'The EC has launched an investigation. The probe is led by a panel that has been offered cheese. Two of the three panellists have accepted. The third is vegan. He is running the investigation alone.',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Investigative Journalist, CJTV Special Unit',
    publishedAt: m(1330),
    readMinutes: 5,
    tags: ['animal front', 'funding', 'investigation', 'exclusive', 'coalition'],
    isHot: true,
  },

  // ── 30 ──
  {
    id: 'cjtv-n30',
    category: 'BREAKING',
    headline: 'Cockroach Parliament Hits 12,847 Candidates — Breaks All-Time Record With 11 Days to Sunday Results',
    subheadline: 'EC confirms no upper limit on candidates; server capacity described as "fine, probably, we think"',
    excerpt: 'With 11 days remaining before Sunday night\'s results announcement, the Cockroach Janta Parliament has crossed 12,847 total candidates across all 543 constituencies, breaking every previous record and triggering what EC officials describe as "excited concern."',
    body: [
      '"12,847 candidates. 543 seats. Unlimited votes. This is either the greatest democracy ever created or proof that democracy is a concept we have collectively hallucinated," said CEC Kachra_Queen at a press conference where 200 journalists and at least 4 actual cockroaches attended.',
      '"Server capacity is stable," said the CJTV tech correspondent, speaking from outside a data centre that smelled like burning. "I mean it is probably fine. The error rate is only 2.3%. That is well within normal parameters for this kind of chaos."',
      'Every constituency now has at least one candidate. 47 constituencies have over 100 candidates each. Constituency #421 has 847 candidates, which is the most in CJP Parliament history and also exactly the number of times one voter voted today.',
      'Results Sunday 11PM IST. If you have not filed yet, you have 11 days. It is free. It takes 4 minutes. You will win nothing tangible. You will gain everything philosophical. CJTV reports live from the drain.',
    ],
    author: 'Viral_Sewak_13',
    authorRole: 'Data Correspondent, CJTV',
    publishedAt: m(12),
    readMinutes: 3,
    tags: ['record', 'candidates', 'breaking', 'election', 'EC'],
    isHot: true,
    isFeatured: false,
  },
]

// ── Time-based rotation: 20 articles per 30-min window ───────────────────────
export function getRotatedArticles(): NewsArticle[] {
  const windowIndex = Math.floor(Date.now() / (30 * 60 * 1000))
  const offset = (windowIndex * 7) % ALL_ARTICLES.length
  const pool = [...ALL_ARTICLES.slice(offset), ...ALL_ARTICLES.slice(0, offset)]
  return pool
}

// Featured = most recent hot article
export function getFeaturedArticle(): NewsArticle {
  return ALL_ARTICLES.find(a => a.isFeatured) ?? ALL_ARTICLES[0]
}

// Helpers for backward compat
export const NEWS_ARTICLES = ALL_ARTICLES
export function getFeaturedArticles() { return ALL_ARTICLES.filter(a => a.isFeatured) }
export function getHotArticles()      { return ALL_ARTICLES.filter(a => a.isHot) }
export function getArticleById(id: string) { return ALL_ARTICLES.find(a => a.id === id) }
