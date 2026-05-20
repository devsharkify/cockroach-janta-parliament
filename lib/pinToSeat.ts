type PinEntry = { seat: number; city: string; state: string };

const PIN_TABLE: Record<string, PinEntry> = {
  "110001": { seat: 101, city: "New Delhi", state: "Delhi" },
  "110002": { seat: 102, city: "Delhi East", state: "Delhi" },
  "110003": { seat: 103, city: "Delhi South", state: "Delhi" },
  "110011": { seat: 100, city: "Delhi North West", state: "Delhi" },
  "110034": { seat: 99, city: "Delhi North East", state: "Delhi" },
  "110044": { seat: 104, city: "Delhi South East", state: "Delhi" },

  "400001": { seat: 259, city: "Mumbai South", state: "Maharashtra" },
  "400050": { seat: 254, city: "Mumbai North", state: "Maharashtra" },
  "400055": { seat: 255, city: "Mumbai North West", state: "Maharashtra" },
  "400076": { seat: 257, city: "Mumbai North East", state: "Maharashtra" },
  "411001": { seat: 260, city: "Pune", state: "Maharashtra" },
  "411028": { seat: 261, city: "Pune", state: "Maharashtra" },

  "560001": { seat: 173, city: "Bengaluru Central", state: "Karnataka" },
  "560003": { seat: 172, city: "Bengaluru North", state: "Karnataka" },
  "560025": { seat: 174, city: "Bengaluru South", state: "Karnataka" },
  "580001": { seat: 167, city: "Dharwad", state: "Karnataka" },

  "600001": { seat: 357, city: "Chennai Central", state: "Tamil Nadu" },
  "600002": { seat: 356, city: "Chennai North", state: "Tamil Nadu" },
  "600006": { seat: 358, city: "Chennai South", state: "Tamil Nadu" },
  "600040": { seat: 359, city: "Chennai South", state: "Tamil Nadu" },
  "641001": { seat: 367, city: "Coimbatore", state: "Tamil Nadu" },
  "625001": { seat: 377, city: "Madurai", state: "Tamil Nadu" },
  "632001": { seat: 364, city: "Vellore", state: "Tamil Nadu" },

  "500001": { seat: 393, city: "Hyderabad", state: "Telangana" },
  "500003": { seat: 394, city: "Secunderabad", state: "Telangana" },
  "500072": { seat: 395, city: "Malkajgiri", state: "Telangana" },

  "700001": { seat: 497, city: "Kolkata North", state: "West Bengal" },
  "700020": { seat: 498, city: "Kolkata South", state: "West Bengal" },
  "700032": { seat: 503, city: "Howrah", state: "West Bengal" },

  "221001": { seat: 485, city: "Varanasi", state: "Uttar Pradesh" },
  "226001": { seat: 467, city: "Lucknow", state: "Uttar Pradesh" },
  "282001": { seat: 411, city: "Agra", state: "Uttar Pradesh" },
  "208001": { seat: 445, city: "Kanpur", state: "Uttar Pradesh" },
  "243001": { seat: 423, city: "Bareilly", state: "Uttar Pradesh" },
  "250001": { seat: 413, city: "Meerut", state: "Uttar Pradesh" },

  "800001": { seat: 52, city: "Patna Sahib", state: "Bihar" },
  "800004": { seat: 51, city: "Patna Sahib", state: "Bihar" },
  "800020": { seat: 53, city: "Pataliputra", state: "Bihar" },
  "842001": { seat: 44, city: "Sitamarhi", state: "Bihar" },

  "302001": { seat: 332, city: "Jaipur", state: "Rajasthan" },
  "342001": { seat: 341, city: "Jodhpur", state: "Rajasthan" },
  "313001": { seat: 340, city: "Udaipur", state: "Rajasthan" },
  "324001": { seat: 329, city: "Kota", state: "Rajasthan" },

  "380001": { seat: 118, city: "Ahmedabad West", state: "Gujarat" },
  "380009": { seat: 117, city: "Ahmedabad East", state: "Gujarat" },
  "395001": { seat: 130, city: "Surat", state: "Gujarat" },
  "390001": { seat: 125, city: "Vadodara", state: "Gujarat" },
  "360001": { seat: 113, city: "Rajkot", state: "Gujarat" },

  "462001": { seat: 221, city: "Bhopal", state: "Madhya Pradesh" },
  "452001": { seat: 222, city: "Indore", state: "Madhya Pradesh" },
  "474001": { seat: 216, city: "Gwalior", state: "Madhya Pradesh" },
  "492001": { seat: 85, city: "Raipur", state: "Chhattisgarh" },

  "143001": { seat: 313, city: "Amritsar", state: "Punjab" },
  "141001": { seat: 314, city: "Ludhiana", state: "Punjab" },
  "151001": { seat: 321, city: "Bathinda", state: "Punjab" },

  "160001": { seat: 84, city: "Chandigarh", state: "Chandigarh" },
  "160017": { seat: 84, city: "Chandigarh", state: "Chandigarh" },

  "190001": { seat: 149, city: "Srinagar", state: "Jammu & Kashmir" },
  "180001": { seat: 147, city: "Jammu", state: "Jammu & Kashmir" },

  "781001": { seat: 33, city: "Guwahati", state: "Assam" },
  "781005": { seat: 33, city: "Guwahati", state: "Assam" },
  "786001": { seat: 37, city: "Dibrugarh", state: "Assam" },

  "122001": { seat: 133, city: "Gurgaon", state: "Haryana" },
  "121001": { seat: 135, city: "Faridabad", state: "Haryana" },
  "132001": { seat: 136, city: "Ambala", state: "Haryana" },

  "682001": { seat: 203, city: "Ernakulam (Kochi)", state: "Kerala" },
  "695001": { seat: 195, city: "Thiruvananthapuram", state: "Kerala" },
  "680001": { seat: 205, city: "Thrissur", state: "Kerala" },
  "673001": { seat: 209, city: "Kozhikode", state: "Kerala" },

  "751001": { seat: 294, city: "Bhubaneswar", state: "Odisha" },
  "769001": { seat: 289, city: "Sundargarh", state: "Odisha" },

  "171001": { seat: 143, city: "Shimla", state: "Himachal Pradesh" },

  "248001": { seat: 492, city: "Dehradun", state: "Uttarakhand" },
  "263001": { seat: 494, city: "Nainital-Udhamsingh Nagar", state: "Uttarakhand" },

  "520001": { seat: 12, city: "Vijayawada", state: "Andhra Pradesh" },
  "530001": { seat: 2, city: "Vizag", state: "Andhra Pradesh" },
  "522001": { seat: 13, city: "Guntur", state: "Andhra Pradesh" },

  "834001": { seat: 153, city: "Ranchi", state: "Jharkhand" },

  "403001": { seat: 105, city: "North Goa", state: "Goa" },
  "403601": { seat: 106, city: "South Goa", state: "Goa" },

  "1100": { seat: 98, city: "Delhi", state: "Delhi" },
  "1101": { seat: 99, city: "Delhi North East", state: "Delhi" },
  "1103": { seat: 100, city: "Delhi North West", state: "Delhi" },

  "4000": { seat: 256, city: "Mumbai", state: "Maharashtra" },
  "4001": { seat: 256, city: "Mumbai North Central", state: "Maharashtra" },
  "4110": { seat: 260, city: "Pune", state: "Maharashtra" },

  "5600": { seat: 172, city: "Bengaluru", state: "Karnataka" },
  "5800": { seat: 167, city: "Dharwad", state: "Karnataka" },
  "5750": { seat: 178, city: "Mysore", state: "Karnataka" },
  "5770": { seat: 179, city: "Chamarajanagar", state: "Karnataka" },

  "6000": { seat: 357, city: "Chennai", state: "Tamil Nadu" },
  "6010": { seat: 361, city: "Sriperumbudur", state: "Tamil Nadu" },
  "6020": { seat: 362, city: "Arakkonam", state: "Tamil Nadu" },
  "6250": { seat: 377, city: "Madurai", state: "Tamil Nadu" },
  "6320": { seat: 364, city: "Vellore", state: "Tamil Nadu" },
  "6410": { seat: 367, city: "Coimbatore", state: "Tamil Nadu" },

  "5000": { seat: 393, city: "Hyderabad", state: "Telangana" },
  "5010": { seat: 396, city: "Chevella", state: "Telangana" },
  "5060": { seat: 400, city: "Medak", state: "Telangana" },

  "7000": { seat: 497, city: "Kolkata", state: "West Bengal" },
  "7001": { seat: 500, city: "Dum Dum", state: "West Bengal" },
  "7110": { seat: 508, city: "Bardhaman", state: "West Bengal" },

  "2210": { seat: 485, city: "Varanasi", state: "Uttar Pradesh" },
  "2260": { seat: 467, city: "Lucknow", state: "Uttar Pradesh" },
  "2080": { seat: 445, city: "Kanpur", state: "Uttar Pradesh" },
  "2010": { seat: 449, city: "Allahabad", state: "Uttar Pradesh" },
  "2020": { seat: 451, city: "Phulpur", state: "Uttar Pradesh" },
  "2430": { seat: 423, city: "Bareilly", state: "Uttar Pradesh" },
  "2500": { seat: 413, city: "Meerut", state: "Uttar Pradesh" },
  "2820": { seat: 411, city: "Agra", state: "Uttar Pradesh" },

  "8000": { seat: 51, city: "Patna", state: "Bihar" },
  "8010": { seat: 54, city: "Nalanda", state: "Bihar" },
  "8420": { seat: 44, city: "Sitamarhi", state: "Bihar" },
  "8450": { seat: 47, city: "Darbhanga", state: "Bihar" },

  "3020": { seat: 332, city: "Jaipur", state: "Rajasthan" },
  "3030": { seat: 334, city: "Alwar", state: "Rajasthan" },
  "3130": { seat: 340, city: "Udaipur", state: "Rajasthan" },
  "3240": { seat: 329, city: "Kota", state: "Rajasthan" },
  "3420": { seat: 341, city: "Jodhpur", state: "Rajasthan" },

  "3800": { seat: 117, city: "Ahmedabad", state: "Gujarat" },
  "3820": { seat: 119, city: "Gandhinagar", state: "Gujarat" },
  "3600": { seat: 113, city: "Rajkot", state: "Gujarat" },
  "3650": { seat: 108, city: "Junagadh", state: "Gujarat" },
  "3900": { seat: 125, city: "Vadodara", state: "Gujarat" },
  "3950": { seat: 130, city: "Surat", state: "Gujarat" },

  "4620": { seat: 221, city: "Bhopal", state: "Madhya Pradesh" },
  "4520": { seat: 222, city: "Indore", state: "Madhya Pradesh" },
  "4740": { seat: 216, city: "Gwalior", state: "Madhya Pradesh" },
  "4830": { seat: 226, city: "Jabalpur", state: "Madhya Pradesh" },
  "4920": { seat: 85, city: "Raipur", state: "Chhattisgarh" },
  "4950": { seat: 86, city: "Durg", state: "Chhattisgarh" },

  "1430": { seat: 313, city: "Amritsar", state: "Punjab" },
  "1410": { seat: 314, city: "Ludhiana", state: "Punjab" },
  "1440": { seat: 315, city: "Jalandhar", state: "Punjab" },
  "1510": { seat: 321, city: "Bathinda", state: "Punjab" },
  "1600": { seat: 84, city: "Chandigarh", state: "Chandigarh" },

  "1900": { seat: 149, city: "Srinagar", state: "Jammu & Kashmir" },
  "1800": { seat: 147, city: "Jammu", state: "Jammu & Kashmir" },

  "7810": { seat: 33, city: "Guwahati", state: "Assam" },
  "7860": { seat: 37, city: "Dibrugarh", state: "Assam" },
  "7820": { seat: 34, city: "Mangaldoi", state: "Assam" },

  "1220": { seat: 133, city: "Gurgaon", state: "Haryana" },
  "1210": { seat: 135, city: "Faridabad", state: "Haryana" },
  "1260": { seat: 138, city: "Rohtak", state: "Haryana" },
  "1320": { seat: 136, city: "Ambala", state: "Haryana" },

  "6820": { seat: 203, city: "Ernakulam (Kochi)", state: "Kerala" },
  "6950": { seat: 195, city: "Thiruvananthapuram", state: "Kerala" },
  "6800": { seat: 205, city: "Thrissur", state: "Kerala" },
  "6730": { seat: 209, city: "Kozhikode", state: "Kerala" },
  "6760": { seat: 211, city: "Malappuram", state: "Kerala" },

  "7510": { seat: 294, city: "Bhubaneswar", state: "Odisha" },
  "7530": { seat: 295, city: "Cuttack", state: "Odisha" },
  "7690": { seat: 289, city: "Sundargarh", state: "Odisha" },

  "1710": { seat: 143, city: "Shimla", state: "Himachal Pradesh" },
  "1760": { seat: 144, city: "Mandi", state: "Himachal Pradesh" },

  "2480": { seat: 492, city: "Dehradun", state: "Uttarakhand" },
  "2630": { seat: 494, city: "Nainital-Udhamsingh Nagar", state: "Uttarakhand" },

  "5200": { seat: 12, city: "Vijayawada", state: "Andhra Pradesh" },
  "5300": { seat: 2, city: "Vizag", state: "Andhra Pradesh" },
  "5220": { seat: 13, city: "Guntur", state: "Andhra Pradesh" },
  "5160": { seat: 8, city: "Kurnool", state: "Andhra Pradesh" },
  "5150": { seat: 6, city: "Nellore", state: "Andhra Pradesh" },

  "8340": { seat: 153, city: "Ranchi", state: "Jharkhand" },
  "8310": { seat: 157, city: "Dhanbad", state: "Jharkhand" },

  "4030": { seat: 105, city: "North Goa", state: "Goa" },

  "110": { seat: 98, city: "Delhi", state: "Delhi" },
  "400": { seat: 256, city: "Mumbai", state: "Maharashtra" },
  "411": { seat: 260, city: "Pune", state: "Maharashtra" },
  "560": { seat: 172, city: "Bengaluru", state: "Karnataka" },
  "600": { seat: 357, city: "Chennai", state: "Tamil Nadu" },
  "500": { seat: 393, city: "Hyderabad", state: "Telangana" },
  "700": { seat: 497, city: "Kolkata", state: "West Bengal" },
  "800": { seat: 51, city: "Patna", state: "Bihar" },
  "302": { seat: 332, city: "Jaipur", state: "Rajasthan" },
  "380": { seat: 117, city: "Ahmedabad", state: "Gujarat" },
  "462": { seat: 221, city: "Bhopal", state: "Madhya Pradesh" },
  "143": { seat: 313, city: "Amritsar", state: "Punjab" },
  "160": { seat: 84, city: "Chandigarh", state: "Chandigarh" },
  "190": { seat: 149, city: "Srinagar", state: "Jammu & Kashmir" },
  "781": { seat: 33, city: "Guwahati", state: "Assam" },
  "122": { seat: 133, city: "Gurgaon", state: "Haryana" },
  "682": { seat: 203, city: "Ernakulam (Kochi)", state: "Kerala" },
  "695": { seat: 195, city: "Thiruvananthapuram", state: "Kerala" },
  "751": { seat: 294, city: "Bhubaneswar", state: "Odisha" },
  "171": { seat: 143, city: "Shimla", state: "Himachal Pradesh" },
  "248": { seat: 492, city: "Dehradun", state: "Uttarakhand" },
  "520": { seat: 12, city: "Vijayawada", state: "Andhra Pradesh" },
  "530": { seat: 2, city: "Vizag", state: "Andhra Pradesh" },
  "834": { seat: 153, city: "Ranchi", state: "Jharkhand" },
  "403": { seat: 105, city: "North Goa", state: "Goa" },
  "221": { seat: 485, city: "Varanasi", state: "Uttar Pradesh" },
  "226": { seat: 467, city: "Lucknow", state: "Uttar Pradesh" },
  "282": { seat: 411, city: "Agra", state: "Uttar Pradesh" },
  "208": { seat: 445, city: "Kanpur", state: "Uttar Pradesh" },
  "342": { seat: 341, city: "Jodhpur", state: "Rajasthan" },
  "313": { seat: 340, city: "Udaipur", state: "Rajasthan" },
  "395": { seat: 130, city: "Surat", state: "Gujarat" },
  "390": { seat: 125, city: "Vadodara", state: "Gujarat" },
  "360": { seat: 113, city: "Rajkot", state: "Gujarat" },
  "452": { seat: 222, city: "Indore", state: "Madhya Pradesh" },
  "474": { seat: 216, city: "Gwalior", state: "Madhya Pradesh" },
  "492": { seat: 85, city: "Raipur", state: "Chhattisgarh" },
  "141": { seat: 314, city: "Ludhiana", state: "Punjab" },
  "151": { seat: 321, city: "Bathinda", state: "Punjab" },
  "180": { seat: 147, city: "Jammu", state: "Jammu & Kashmir" },
  "786": { seat: 37, city: "Dibrugarh", state: "Assam" },
  "121": { seat: 135, city: "Faridabad", state: "Haryana" },
  "132": { seat: 136, city: "Ambala", state: "Haryana" },
  "680": { seat: 205, city: "Thrissur", state: "Kerala" },
  "673": { seat: 209, city: "Kozhikode", state: "Kerala" },
  "769": { seat: 289, city: "Sundargarh", state: "Odisha" },
  "263": { seat: 494, city: "Nainital-Udhamsingh Nagar", state: "Uttarakhand" },
  "522": { seat: 13, city: "Guntur", state: "Andhra Pradesh" },
};

export function getPinInfo(
  pin: string
): { seat: number; city: string; state: string } | null {
  if (!/^\d{6}$/.test(pin)) return null;

  const exact = PIN_TABLE[pin];
  if (exact) return exact;

  const fourDigit = PIN_TABLE[pin.slice(0, 4)];
  if (fourDigit) return fourDigit;

  const threeDigit = PIN_TABLE[pin.slice(0, 3)];
  if (threeDigit) return threeDigit;

  return null;
}

export function pinToSeat(pin: string): number | null {
  const info = getPinInfo(pin);
  return info ? info.seat : null;
}
