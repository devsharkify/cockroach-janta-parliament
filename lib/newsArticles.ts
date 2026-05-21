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
  body: string[]          // paragraphs
  author: string
  authorRole: string
  publishedAt: string     // ISO date string
  readMinutes: number
  tags: string[]
  isHot?: boolean
  isFeatured?: boolean
}

const d = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86400000).toISOString()

export const NEWS_ARTICLES: NewsArticle[] = [
  // ─── FEATURED ───────────────────────────────────────────────────────────
  {
    id: 'cjtv-001',
    category: 'BREAKING',
    headline: 'Cockroach Democracy Tops Global Drain Transparency Index for Third Year Running',
    subheadline: 'India\'s cockroach parliament scores 98/100 — human governments average 39',
    excerpt:
      'While human democracies struggle with corruption rankings, the Cockroach Janta Parliament has once again topped the Global Drain Transparency Index, with experts crediting "total shamelessness" as the key policy driver.',
    body: [
      'NEW DELHI (CJTV) — In a stunning rebuke to conventional governance, the Cockroach Janta Parliament has clinched the top spot on the 2026 Global Drain Transparency Index (GDTI), posting a near-perfect score of 98/100 while human democracies averaged a dismal 39.',
      '"The secret is simple," said Chief Cockroach Election Commissioner Kachra_Queen in an exclusive interview with CJTV. "We never pretended to be clean. Transparency begins with admitting you live in a drain."',
      'The Index, published annually by the International Naali Watchdog Organization (INWO), evaluates governments on metrics including drain accessibility, bribe-to-policy ratio, and manifesto delivery speed. Cockroach Janta Parliament scored full marks on all three.',
      'Human governments, by contrast, were docked points for "claiming to be clean while building drains." India\'s human government scored 39, an improvement the ruling party celebrated with a 4-hour press conference.',
      'Opposition cockroach parties were quick to claim credit. "We demanded drain transparency since 2024," said Naali_Chadha of the ACP. "They called us radicals. Now look."',
      'The parliament is scheduled to debate the findings on Saturday at 11PM IST, immediately after vote results are announced. Attendance is optional but spiritually mandatory.',
    ],
    author: 'Khatmal_OG',
    authorRole: 'Chief Political Correspondent, CJTV',
    publishedAt: d(0),
    readMinutes: 4,
    tags: ['transparency', 'corruption', 'index', 'breaking'],
    isFeatured: true,
    isHot: true,
  },
  {
    id: 'cjtv-002',
    category: 'INVESTIGATION',
    headline: 'Exclusive Investigation: 95% of Cockroach EC Raids Target ACP, CCP Candidates — Data',
    subheadline: 'CJP leaders face zero investigations despite running on "Naali Chori" platform',
    excerpt:
      'A CJTV data investigation reveals the Cockroach Election Commission has filed 95% of its enforcement cases against opposition parties since 2024, while CJP candidates — who openly campaign on stolen drain funds — walk free.',
    body: [
      'A CJTV investigation spanning 3,847 EC case files has uncovered a startling pattern: 95% of all Cockroach Election Commission enforcement actions since the 2024 general elections have targeted opposition parties ACP and CCP, while ruling CJP candidates face virtually zero scrutiny.',
      '"It\'s not bias," EC spokesperson Viral_Sewak_13 told CJTV. "CJP candidates are simply more talented at not getting caught." He then scurried under a refrigerator before further questions could be asked.',
      'The data shows that 847 ACP candidates were investigated for "unauthorized naali access" while simultaneously, CJP\'s Naali_Raja_42 was photographed bathing in the very drain in question. No case was filed.',
      'Most egregiously, three CCP leaders who ran on "Clean Drain, Clean Government" were raided for "excessive cleanliness" — a violation, the EC clarified, because "overly clean drains create unrealistic expectations among cockroach voters."',
      'Opposition leader Gobar_Sardar called the findings "deeply un-surprising." "We filed a complaint. EC said our complaint form was filled in the wrong shade of black ink. The investigation into our complaint is ongoing."',
      'The EC denied all allegations via press release, then immediately announced a new investigation into whichever party you support.',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Investigative Journalist, CJTV Special Unit',
    publishedAt: d(1),
    readMinutes: 6,
    tags: ['EC', 'investigation', 'corruption', 'ACP', 'CJP'],
    isHot: true,
  },
  {
    id: 'cjtv-003',
    category: 'POLITICS',
    headline: 'Naali_Chadha Leads 7 ACP MPs to CJP; Anti-Defection Roach Petition Filed in Supreme Court',
    subheadline: 'Defection comes hours after ED raid on Naali_Chadha\'s drain was mysteriously dropped',
    excerpt:
      'In a stunning overnight betrayal, ACP\'s star MP Naali_Chadha crossed over to CJP, bringing six colleagues and an entire drain network. The ED investigation against him was dropped at 3AM — six hours before the defection press conference.',
    body: [
      'In a political earthquake that has sent shockwaves through the Cockroach Janta Parliament, ACP\'s most prominent Rajya Sabha MP Naali_Chadha led a seven-roach defection to the ruling CJP party on Tuesday night.',
      'The timing raised immediate questions. At 3:17 AM, the Cockroach Enforcement Directorate quietly dropped a six-month investigation into Naali_Chadha\'s alleged unauthorized occupation of 14 premium drains in Patna Sahib. By 9 AM, he was holding a CJP flag.',
      '"This is purely ideological," Naali_Chadha told reporters. "I believe in CJP\'s vision of free naali for all. The ED thing is a coincidence. Please don\'t report the ED thing."',
      'ACP filed a petition in the Cockroach Supreme Court under anti-defection rules. Chief Cockroach Justice Gobar_Dada_1 admitted the petition, noting it was "the 47th such case this month" and scheduling hearings for "sometime before the drain dries."',
      'Under cockroach anti-defection law, a party switch is legal only if at least two-thirds of the parliamentary group defects together. With 7 of ACP\'s 11 MPs jumping ship, CJP lawyers argued this qualifies as a "merger." ACP lawyers argued this qualifies as "highway robbery."',
      'The Supreme Court has asked both sides to submit written arguments on what constitutes a "drain" for jurisdictional purposes. The case continues.',
    ],
    author: 'Sewage_Scoops_71',
    authorRole: 'Parliamentary Correspondent',
    publishedAt: d(1),
    readMinutes: 5,
    tags: ['defection', 'ACP', 'CJP', 'Supreme Court', 'ED'],
    isFeatured: true,
  },
  {
    id: 'cjtv-004',
    category: 'BREAKING',
    headline: 'CJP Introduces Constitutional Amendment: Cockroaches Jailed for Broom Ownership Lose Seat in 30 Days',
    subheadline: 'Opposition calls it \'weapon to topple non-CJP drain networks\'; CJP says it\'s \'hygiene reform\'',
    excerpt:
      'The ruling Cockroach Janta Party has tabled the Constitution 130th Amendment Bill 2026, automatically stripping any elected cockroach of their seat if they are found in possession of a broom for more than 30 days.',
    body: [
      'The Cockroach Janta Parliament descended into chaos on Wednesday as CJP introduced the Constitution 130th Amendment Bill 2026, which would strip elected cockroaches of office if found owning a broom for more than 30 consecutive days.',
      '"A cockroach with a broom is a cockroach with divided loyalties," CJP floor leader Sarkari_Babu_7 told a packed Parliament. "You cannot serve the drain AND cleanliness. Choose."',
      'Opposition parties erupted. ACP\'s Aam_Candidate_404 called the bill "a surgical weapon to topple non-CJP drain networks." "Three of our state-level leaders were just arrested with suspiciously clean antennae. Now we know why."',
      'Legal experts point out a troubling precedent: Naali_Sardar_77, the only cockroach currently running all 543 constituencies simultaneously, was recently photographed near a broom. His lawyers clarified he was "inspecting it adversarially."',
      'The bill passed its first reading 287–142, with 14 MPs absent and 3 technically still hiding under the Speaker\'s podium from last session\'s chaos.',
      'The opposition has vowed to challenge the bill in the Cockroach Supreme Court, which has helpfully announced it will hear the case sometime "after the drain monsoon season, whenever that is."',
    ],
    author: 'Ghoos_Gazette_12',
    authorRole: 'Legal & Constitutional Affairs Desk',
    publishedAt: d(2),
    readMinutes: 4,
    tags: ['constitution', 'amendment', 'broom-ban', 'CJP', 'opposition'],
    isHot: true,
  },
  {
    id: 'cjtv-005',
    category: 'POLITICS',
    headline: 'TVKP Wins 47 Seats; Trending Roach Sena Obliterates Dravidian Drain Duopoly in South',
    subheadline: 'Superstar roach Vijay_Khatmal\'s party TVK sweeps in Tamil Nadu, shocking pollsters',
    excerpt:
      'In the biggest political earthquake of the cockroach election cycle, freshly formed TVKP has emerged as the parliament\'s fourth-largest party, with superstar candidate Vijay_Khatmal personally winning Coimbatore by 89,000 naali-votes.',
    body: [
      'CHENNAI (CJTV) — The Cockroach Janta Parliament received its most dramatic new entrant in history as TVKP (Trending Virak Karo Party), formed just 6 weeks before elections, swept 47 seats — primarily in south India — shattering the TRS-DMK duopoly that had controlled southern drains for decades.',
      'TVKP\'s founder and face, Vijay_Khatmal, a cockroach who went viral after a 47-second reel of him running through a government building without getting sprayed, personally won Coimbatore by 89,000 votes.',
      '"The system tried to fumigate us. We survived," Vijay_Khatmal told cheering crowds, before doing a backflip off a drain pipe that was live-streamed to 4.3 million cockroaches.',
      'DMK\'s veteran candidate Drainage_Stalin_3 conceded defeat, saying "I have been in this drain for 40 years. I did not expect to be outvoted by a reel." He has since started his own Instagram account.',
      'Political analysts were stunned. "Our polls showed TVKP at 3 seats," said pollster Sewer_Research_Institute. "We regret the error. Our methodology assumed cockroaches vote rationally."',
      'CJP has already reached out to TVKP for coalition talks, offering "two premium drains in Mumbai and a YouTube monetization deal." Negotiations are ongoing.',
    ],
    author: 'Viral_Neta_Reporter',
    authorRole: 'South India Bureau Chief, CJTV',
    publishedAt: d(2),
    readMinutes: 5,
    tags: ['TVKP', 'south India', 'election results', 'trending'],
    isFeatured: true,
  },
  {
    id: 'cjtv-006',
    category: 'COURT',
    headline: 'Cockroach Supreme Court Issues Landmark Ruling: All Drains Henceforth Sacred Infrastructure',
    subheadline: 'CJI Gobar_Dada_1 delivers 847-page judgment; government appeals calling drains \'secular\'',
    excerpt:
      'In a historic 5-4 judgment, the Cockroach Supreme Court ruled that all drains across 543 constituencies shall be classified as "sacred infrastructure," granting them protection equivalent to heritage monuments.',
    body: [
      'The Cockroach Supreme Court delivered its most consequential ruling since independence on Thursday, declaring in a 5-4 majority judgment that all drains, naalis, and sewage systems across the 543 parliamentary constituencies are "sacred infrastructure" protected under Article 🪳 of the Cockroach Constitution.',
      'Chief Cockroach Justice Gobar_Dada_1, writing for the majority, held that "the drain is not merely a channel for waste. It is a home, a sanctuary, a democracy, a civilization." The 847-page judgment took 6 hours to read aloud, during which three junior justices fell asleep.',
      'The ruling has immediate legal implications. Municipal authorities can no longer "clean, cover, or civilize" any drain without prior approval from the Cockroach Heritage Authority, a body that does not yet exist but will be "formed shortly."',
      'The government announced it would appeal. "Drains are secular," argued the Solicitor General. "They belong to everyone — humans, cockroaches, mosquitoes. Calling them sacred privileges one insect group over another."',
      'Civil society celebrated. "This is the most important judgment since cockroaches gained the right to contest elections," said drain rights activist Naali_Sarkar_Activist_9. "Now try cleaning our homes. Go ahead. Try."',
      'The Supreme Court has scheduled the appeal for next Tuesday at 10AM, immediately after hearing a petition about whether the Speaker can mute opposition microphones during drain-related debates.',
    ],
    author: 'Khandaani_Roach_Law',
    authorRole: 'Supreme Court Correspondent, CJTV',
    publishedAt: d(3),
    readMinutes: 5,
    tags: ['Supreme Court', 'drain rights', 'judgment', 'landmark'],
  },
  {
    id: 'cjtv-007',
    category: 'OPINION',
    headline: 'Opinion: Cockroaches Are Simply Better Politicians Than Humans, and the Data Proves It',
    subheadline: 'By Gobar_Sarkar, Independent MP, Constituency #393',
    excerpt:
      'Before you dismiss this as self-serving — consider that 94% of cockroach candidates have stronger drain policy positions than actual sitting MPs, we show up to vote (multiple times), and we have survived every government that ever tried to eliminate us.',
    body: [
      'I won\'t pretend to be unbiased. I am a cockroach. I am also an elected official. These two facts are related.',
      'But consider the evidence. A 2026 CJTV-commissioned poll found that 94% of Cockroach Janta Parliament candidates have more specific, detailed policy positions on drainage infrastructure than their human counterparts. Our manifestos cite actual drain coordinates. Human manifestos say "development."',
      'We also have a better attendance record. In the last Cockroach Parliament session, 97% of elected members were present. The remaining 3% were technically present but had gone through the drain pipe during a heated debate and couldn\'t get back in time.',
      'On accountability: every cockroach candidate gets a 6-character claim code. Every human candidate gets a 5-year term and a government bungalow. You tell me which system incentivizes performance.',
      'The counterargument, usually made by humans, is that cockroaches are "not serious." To which I say: we have survived 300 million years, five mass extinctions, and 23 government fumigation campaigns. How serious do you need us to be?',
      'Vote for cockroaches. Or don\'t. We\'ll be here either way.',
    ],
    author: 'Gobar_Sarkar',
    authorRole: 'Independent MP, Constituency #393 · CJTV Guest Columnist',
    publishedAt: d(3),
    readMinutes: 3,
    tags: ['opinion', 'politics', 'cockroach vs human', 'manifesto'],
  },
  {
    id: 'cjtv-008',
    category: 'EC',
    headline: 'Election Commission Bars 3 Parties for "Excessive Constituency Cleanliness" — Unprecedented Action',
    subheadline: 'BSS, ARP, and SKCP disqualified after drains in their seats were found "suspiciously unclogged"',
    excerpt:
      'The Cockroach Election Commission has taken unprecedented action, barring three parties from the upcoming election cycle after finding that drains in their constituencies were "disgracefully clean" — a violation of Section 47(b) of the Cockroach Representation of Peoples Act.',
    body: [
      'The Cockroach Election Commission dropped a bombshell on Wednesday, barring BSS, ARP, and SKCP from the upcoming election cycle after surprise inspections found "aggressively clean" conditions in constituencies they represent.',
      '"Section 47(b) is clear," Chief EC Commissioner Viral_Sewak_99 announced at a press conference. "A cockroach representative who maintains excessively clean drains is either not living in them or is working against his constituents\' interests. Either way: disqualification."',
      'BSS (Bharatiya Sewer Sangh), whose tagline is "Sewer is Sacred," released a statement saying their drain was clean because it was "sacred, not unhygienic — there is a difference that the EC clearly doesn\'t understand."',
      'ARP (Aam Roach Party) alleged the inspection was politically motivated. "Our drain is clean because we actually fixed the drainage issue our constituents elected us to fix. Is that now a crime?" Party leader Aam_Roach_7 said through an antenna he described as "impeccably groomed."',
      'SKCP simply released a statement saying "Bas Bahut Hogaya" and declined further comment.',
      'Legal challenges have already been filed in the Cockroach High Court. The EC says it will defend its position "vigorously and with full confidence in its own very specific interpretation of the law."',
    ],
    author: 'Kachra_Legal_Beat',
    authorRole: 'Election Commission Desk, CJTV',
    publishedAt: d(4),
    readMinutes: 4,
    tags: ['EC', 'disqualification', 'BSS', 'ARP', 'SKCP'],
    isHot: true,
  },
  {
    id: 'cjtv-009',
    category: 'BREAKING',
    headline: 'Opposition Files No-Confidence Motion Against Cockroach Lok Sabha Speaker — First in 40 Years',
    subheadline: 'Speaker Naali_Birla accused of muting 47 opposition microphones, suspending record 198 MPs',
    excerpt:
      'In a historic parliamentary manoeuvre, 118 opposition MPs filed a no-confidence motion against Cockroach Lok Sabha Speaker Naali_Birla, citing systematic microphone muting, unprecedented suspensions, and "leaving the Deputy Speaker post vacant for 847 days."',
    body: [
      'In the first such move in 40 years of Cockroach parliamentary history, 118 opposition MPs led by ACP, CCP, and RCP filed a formal no-confidence motion against Lok Sabha Speaker Naali_Birla on Tuesday, triggering a 13-hour debate that ended with the motion being defeated 287–118.',
      '"This Speaker has muted 47 microphones during drain-related debates," ACP\'s floor leader told the house. "He suspended 198 MPs for \'excessive antennae movement.\' The Deputy Speaker post has been vacant for 847 days. Enough is enough."',
      'Speaker Naali_Birla denied all charges from the chair, which he refused to vacate during the debate about whether he should vacate the chair. "My rulings are constitutional," he said, then suspended the MP who asked him to define constitutional.',
      'CJP rallied around the Speaker. "The opposition is disrupting Parliament because they cannot accept democratic outcomes," said CJP\'s JP_Naadu_Cockroach. "Their constant scurrying under desks every time a vote is called is the real disruption."',
      'After the 13-hour session — the longest in recent cockroach parliamentary history — the motion failed by 169 votes. Opposition parties vowed to continue the fight "through constitutional means, including additional no-confidence motions, petitions, and very loud antenna vibrations."',
      'The Deputy Speaker post remains vacant. No explanation has been offered.',
    ],
    author: 'Parliament_Beats_CJTV',
    authorRole: 'Parliamentary Affairs Correspondent',
    publishedAt: d(5),
    readMinutes: 5,
    tags: ['parliament', 'speaker', 'no-confidence', 'opposition'],
  },
  {
    id: 'cjtv-010',
    category: 'INVESTIGATION',
    headline: 'CJTV Investigation: Naali_Neta_77 Accepted 3 Rotis as Bribe — Documents, WhatsApp Chats Revealed',
    subheadline: 'Former drain minister denies receiving rotis; admits only to receiving "unlabelled flatbreads"',
    excerpt:
      'CJTV has obtained WhatsApp messages, 14 WhatsApp stickers, and a receipt from "Mohalla Dhaba #4" showing that former Drain Minister Naali_Neta_77 accepted 3 rotis — estimated market value ₹6 — in exchange for drain cleaning contracts worth ₹47 crore.',
    body: [
      'In what legal experts are calling "the most well-documented roti bribery case in cockroach parliamentary history," CJTV can reveal that former Drain Minister Naali_Neta_77 accepted three rotis — current market value ₹6 — in exchange for awarding drain cleaning contracts worth ₹47 crore.',
      'The evidence includes: 14 WhatsApp messages, 9 of which are just stickers of cockroaches giving thumbs up; a receipt from "Mohalla Dhaba #4" timestamped the same night the contract was signed; and a photograph of Naali_Neta_77 carrying what appears to be a roti in a government bag marked "NOT ROTI."',
      'In an exclusive CJTV interview, Naali_Neta_77 denied receiving rotis. "What I received were unlabelled flatbreads. Completely different food category. My lawyers are reviewing whether flatbreads fall under the Prevention of Bribery Act Section 12(B)(roti)."',
      'The Cockroach ED registered a case at 2AM last Thursday, simultaneously dropping a separate investigation into opposition MP Kachra_Singh_9 who had actually stolen 400 drains. No explanation was given for the timing.',
      'The drain cleaning contractor, Sewage_Infra_Pvt_Ltd, says they paid in rotis because "cash leaves traces. Rotis leave crumbs. We felt crumbs were less detectable." Their logic appears legally untested.',
      'A parliamentary inquiry committee has been formed. It consists entirely of CJP members. It has announced its conclusion — "no wrongdoing" — before holding its first meeting.',
    ],
    author: 'Macchar_Reporter_99',
    authorRole: 'Investigative Journalist, CJTV Special Unit',
    publishedAt: d(5),
    readMinutes: 6,
    tags: ['corruption', 'bribery', 'investigation', 'drain ministry'],
    isHot: true,
  },
  {
    id: 'cjtv-011',
    category: 'POLITICS',
    headline: '"Naali Chori" Campaign: ACP Alleges 25 Lakh Votes Stolen from Haryana Drain Constituencies',
    subheadline: 'EC demands proof under oath; ACP leader files oath, then withdraws it, then re-files it in Hindi',
    excerpt:
      'ACP has launched its "Naali Chori Se Azaadi" campaign, alleging CJP used centralized drain-control software to manipulate 25 lakh votes across Haryana constituencies. The EC has demanded sworn affidavits. ACP has provided what it calls "vibrational evidence."',
    body: [
      'ACP launched its "Naali Chori Se Azaadi" campaign on Monday, alleging that CJP deployed a sophisticated drain-control software that manipulated 25 lakh votes across 47 Haryana constituencies by accessing the Electoral Drain Roll and marking occupied drains as vacant.',
      '"We have evidence," ACP leader Rahul_Khatmal said at a press conference. "We have antenna readings. We have drain moisture levels that don\'t match reported occupancy. We have a very compelling PowerPoint."',
      'The Cockroach Election Commission demanded proof under oath within 7 days. ACP leader filed a sworn affidavit on Day 3, withdrew it on Day 4 citing "a typo in the word drain," re-filed it in Hindi on Day 5, then launched a press campaign about how the EC was "suppressing the Hindi affidavit."',
      'CJP called the allegations "baseless, dangerous, and frankly very creative." "If we could control drains with software," CJP spokesperson said, "we would have fixed the Bengaluru flooding by now. We haven\'t. QED."',
      '"Naali Chori" merchandise has now outsold CJP\'s "Har Ghar Naali" merchandise. Both are selling on the same website. The website is operated by a cockroach who belongs to neither party and is "just in it for the vibes."',
      'The campaign continues. The affidavit investigation continues. The drain manipulation, if real, also presumably continues. Results every Saturday at 11PM IST.',
    ],
    author: 'Galli_Ground_Reporter',
    authorRole: 'Political Reporter, CJTV',
    publishedAt: d(6),
    readMinutes: 4,
    tags: ['vote chori', 'ACP', 'Haryana', 'election fraud', 'naali'],
  },
  {
    id: 'cjtv-012',
    category: 'INTERNATIONAL',
    headline: 'Cockroach Janta Parliament Signs Historic Drain Treaty with International Sewer Alliance — 47 Nations',
    subheadline: 'First cross-border drain corridor opens; roaches can now migrate freely between 47 sewage systems',
    excerpt:
      'In a diplomatic landmark, Cockroach Janta Parliament has signed a mutual drain access treaty with the International Sewer Alliance, granting free migration rights to cockroaches across 47 nations\' sewage infrastructure.',
    body: [
      'NAALI NAGAR (CJTV) — The Cockroach Janta Parliament achieved a historic diplomatic breakthrough on Tuesday, signing the International Drain Access Treaty (IDAT) with 47 member nations of the International Sewer Alliance (ISA), creating the world\'s first cross-border cockroach migration corridor.',
      '"Drains know no borders," Foreign Minister Sewage_Singh_External said at the signing ceremony held inside a very large drain in Geneva. "From today, a cockroach from Varanasi can freely access the sewers of Paris, Tokyo, and Nairobi. This is globalization done right."',
      'The treaty includes provisions for mutual drain maintenance, extradition of cockroaches who commit crimes in foreign sewage systems, and a cultural exchange program where cockroach parliamentarians will spend 3 months in foreign drains learning "international governance best practices."',
      'China\'s Cockroach Communist Party signed a separate bilateral addendum granting access to their 47-tier sewage network in exchange for CJP sharing its "unlimited voting technology." Privacy advocates raised concerns. Both governments said privacy does not apply underground.',
      'Critics questioned whether the treaty was necessary. "Indian cockroaches were already migrating to foreign sewers without any treaty," noted Naali_Economist_3. "What this treaty does is make it official, which means we can now charge them an airport tax. That\'s the real agenda."',
      'The Parliament ratified the treaty 341–82. The 82 dissenting votes came from RCP (Regional Cockroach Party), who objected to "foreign drains diluting local sewer culture."',
    ],
    author: 'Bindaas_Foreign_Desk',
    authorRole: 'International Affairs, CJTV',
    publishedAt: d(7),
    readMinutes: 4,
    tags: ['international', 'treaty', 'ISA', 'diplomacy', 'drain'],
  },
  {
    id: 'cjtv-013',
    category: 'POLITICS',
    headline: 'Budget Session 2026: 4 MPs Escape Through Drain Mid-Debate; Speaker Says "Noted"',
    subheadline: 'Opposition accuses government of opening drain escape hatch to avoid quorum; government says it\'s "ventilation"',
    excerpt:
      'The Cockroach Janta Parliament\'s Budget Session hit a new low when 4 ruling party MPs disappeared through a drain pipe during a critical vote on the Naali Allocation Bill. Quorum collapsed. The Speaker suspended the 3 opposition MPs who stayed.',
    body: [
      'The 2026 Budget Session of the Cockroach Janta Parliament has produced what political scientists are already calling "the most honest expression of parliamentary democracy in living memory" — four ruling party MPs exiting through a drain pipe during the Naali Allocation Bill vote, collapsing quorum, and the Speaker immediately suspending the three opposition members who remained.',
      '"The MPs were exercising their constitutional right to drain access," CJP spokesperson Sarkari_Spin_Doctor_4 said. "There is no provision in the rules that says MPs must be present during a vote. The rules merely say they must be in the building. We interpret \'building\' broadly to include the pipe network beneath it."',
      'Opposition leader ACP\'s Aam_Candidate_404 called it "the single most blatant abuse of parliamentary procedure since the Deputy Speaker post was vacated 847 days ago." He was then suspended for "using the phrase \'847 days\' in a provocative tone."',
      'The Naali Allocation Bill — which determines which constituencies receive government drain maintenance funds — was subsequently passed by voice vote among the 12 MPs who remained, all of whom were from CJP.',
      'The Budget Session has now broken records: most MPs suspended in one session (198), most drain-related escapes (4), and lowest average attendance (12 MPs for the final vote on a ₹47,000 crore bill).',
      'The next session is scheduled for monsoon season, "when drain access is most meaningful," per the parliamentary calendar.',
    ],
    author: 'Parliament_Beats_CJTV',
    authorRole: 'Parliamentary Affairs Correspondent',
    publishedAt: d(8),
    readMinutes: 5,
    tags: ['budget session', 'parliament', 'quorum', 'drain escape'],
  },
  {
    id: 'cjtv-014',
    category: 'OPINION',
    headline: 'Opinion: The Varanasi Naali Should Be a UNESCO World Heritage Drain — And I Will Not Be Taking Questions',
    subheadline: 'By Naali_Naresh_42, CJP MP-elect, Constituency #485',
    excerpt:
      'I won Varanasi by 47,000 votes. My mandate is clear. The Varanasi Ganga naali system is more culturally significant than the Eiffel Tower, the Great Wall, and the Internet combined. UNESCO must act.',
    body: [
      'Let me be clear about my mandate. The people of Varanasi Constituency #485 gave me 47,293 naali-votes. That is not a suggestion. That is a directive. And the directive says: UNESCO World Heritage status for the Varanasi Naali.',
      'Consider the facts. The Varanasi naali network is over 2,000 years old. It has survived Mughals, British colonialism, 74 governments, and 14 municipal corporation tenders that promised to \'modernize\' it. It survived all of them by staying exactly as it was. That is not decay. That is resilience.',
      'UNESCO recognizes heritage sites for "outstanding universal value." What is more universally outstanding than a drain that has housed continuous cockroach civilization for two millennia? Nothing. Literally nothing.',
      'My opponents say I should focus on development — roads, hospitals, schools. Fine. I will build those too. But I will build them AROUND the naali. The drain is the axis of civilization. Everything else is peripheral infrastructure.',
      'I have submitted a formal application to UNESCO. It is 847 pages long. Appendix C alone is a 200-page love letter to the eastern tributary. I stand by every word.',
      'UNESCO has 90 days to respond. If they don\'t, I am filing a petition in the Cockroach Supreme Court to have them declared in contempt of drain heritage.',
    ],
    author: 'Naali_Naresh_42',
    authorRole: 'CJP MP-elect, Varanasi · Guest Columnist, CJTV',
    publishedAt: d(9),
    readMinutes: 3,
    tags: ['opinion', 'Varanasi', 'UNESCO', 'heritage', 'naali'],
  },
  {
    id: 'cjtv-015',
    category: 'EC',
    headline: 'CJP Enters Northeast Cockroach Drain for First Time Since Independence; RCP Calls it "Drain Imperialism"',
    subheadline: 'CJP wins 14 seats across Assam, Meghalaya and Manipur; regional parties vow resistance',
    excerpt:
      'In a seismic shift in cockroach political geography, CJP has won 14 seats across northeast constituencies in the most recent cycle, marking its first-ever foothold in the region and triggering a fierce backlash from regional parties.',
    body: [
      'The Cockroach Janta Parliament\'s latest results have produced a political earthquake in the northeast: CJP has won 14 seats across Assam, Meghalaya, and Manipur constituencies — its first victories in the region since the Parliament was founded.',
      '"The northeast drain belongs to northeast cockroaches," RCP (Regional Cockroach Party) president Galli_Sardar_Northeast said in an emergency press conference. "CJP cockroaches from Delhi drains do not understand our local sewage culture. This is drain imperialism and we will not stand for it."',
      'CJP, for its part, dispatched 47 "drain integration officers" to the northeast with instruction to "learn the local drainage system and respect regional naali sensitivities while explaining the benefits of national drain integration."',
      'The winning CJP candidates in the northeast were all recently relocated from mainland drains as part of CJP\'s "New Drainage Frontier" program, in which cockroaches from overpopulated southern drains are incentivized to contest in "emerging northeast markets."',
      'Indigenous cockroach communities have filed a petition in the Guwahati Cockroach High Court, arguing that CJP\'s northeast expansion violates the "Drain Domicile Rights Act" that guarantees constituency seats to cockroaches born within 50 metres of the local drain.',
      'The High Court has issued notice. CJP says it is "confident in the legal position." RCP says it is "confident in the local cockroach population\'s memory of which party actually fixed their drain pipe in 2023." Elections, as always, will clarify.',
    ],
    author: 'Northeast_Drain_Desk',
    authorRole: 'Regional Political Correspondent, CJTV',
    publishedAt: d(10),
    readMinutes: 4,
    tags: ['northeast', 'CJP', 'RCP', 'regional', 'results'],
  },
]

export function getFeaturedArticles(): NewsArticle[] {
  return NEWS_ARTICLES.filter(a => a.isFeatured)
}

export function getHotArticles(): NewsArticle[] {
  return NEWS_ARTICLES.filter(a => a.isHot)
}

export function getArticleById(id: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find(a => a.id === id)
}

export const CATEGORY_COLORS: Record<NewsCategory, string> = {
  BREAKING:      '#ef4444',
  EXCLUSIVE:     '#7c3aed',
  OPINION:       '#2563eb',
  INVESTIGATION: '#d97706',
  POLITICS:      '#1D9E75',
  COURT:         '#7F77DD',
  EC:            '#D85A30',
  INTERNATIONAL: '#D4537E',
}
