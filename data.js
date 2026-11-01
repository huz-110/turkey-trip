/* =====================================================================
   TURKEY FAMILY TRIP - DATA (single source of truth)
   Edit this file to change defaults. The UI is generated from it.
   In-app changes are saved to localStorage; Export/Import as JSON;
   "Reset" reloads these defaults.

   Companion data files: photos.js (image URLs + credits),
   weather.js (per-date climate normals).

   Evidence labels:
     "Verified"            checked against an official / primary page
     "Estimated"           our calculation or a typical range
     "Traveller-reported"  pattern from reviews / forums / blogs
     "Needs confirmation"  could not verify; check before relying on it
   Research date: 19 Sep 2026
   ===================================================================== */

const TRIP_META = {
  title: "Turkey Family Trip",
  dates: { start: "2026-11-04", end: "2026-11-15" },
  travellers: "2 adults, a 13-year-old and a 5-year-old",
  budget: { min: 500000, max: 600000 },
  fx: { EUR: 110.2, USD: 96.0, TRY: 1.968, asOf: "18-19 Sep 2026 mid-market", status: "Verified" },
  researched: "2026-09-19",
  // Bump when the plan's defaults change: saved browsers rebuild their days and keep ticks
  dataVersion: 3
};

/* City colour + photo used by the journey tracker */
const CITIES = {
  "Travel":     { color: "lilac",  img: "d04",             emoji: "✈️" },
  "Antalya":    { color: "aqua",   img: "city_antalya",    emoji: "🌊" },
  "Road trip":  { color: "lime",   img: "drive_road",      emoji: "🚗" },
  "Cappadocia": { color: "orange", img: "city_cappadocia", emoji: "🎈" },
  "Istanbul":   { color: "pink",   img: "city_istanbul",   emoji: "🕌" }
};

/* Trip shape. Flights are fixed (TRIP_META.dates), so the three stops share the nights in between.
   "booked" is what the hotels are booked for; "default" is what the plan opens with.
   Change nights in the app (Overview > Change nights per city) or share a link with ?nights=4-3-4. */
const SPLIT = {
  order: ["Antalya", "Cappadocia", "Istanbul"],
  default: { Antalya: 4, Cappadocia: 3, Istanbul: 4 },
  booked: { Antalya: 4, Cappadocia: 3, Istanbul: 4 },
  min: 2, max: 6,
  wx: { Antalya: "antalya", Cappadocia: "goreme", Istanbul: "istanbul" },
  hotels: { Antalya: "Vera Suites Arapsuyu (Konyaaltı)", Cappadocia: "Tekkaya Cave Hotel, Göreme", Istanbul: "Elysium Hotel, Taksim" },
  legs: {
    arrive: { icon: "✈️", text: "Fly to Antalya (change in Istanbul)" },
    "rt-cap": { icon: "🚗", text: "Drive to Cappadocia, 530 km via Konya" },
    "rt-ist": { icon: "🚗", text: "Drive to Istanbul, 730 km, car back at IST" },
    depart: { icon: "✈️", text: "Fly home to Mumbai" }
  }
};

/* ---------- ITINERARY BUILDING BLOCKS ---------------------------------
   cost = INR for the whole family (Estimated unless noted)
   priority: must | good | optional
   category: Sightseeing | Food | Adventure | Kids | Driving | Shopping | Transport | Rest
   img = key in PHOTOS (optional)   wx = weather places for the day
   Day text can use {balloon}, {balloonBackup}, {balloonNext}; the app fills in real dates.
   FIXED_DAYS: arrival, the two drive days, departure. Dates follow from the split.
   DAY_BANK: full days per city. A city with N nights gets N-1 full days: the
   lowest "rank" numbers are picked, then laid out by "order". "closed" lists
   weekdays (0 = Sunday) the day can't fall on. "booked" is a date you hold a
   booking for; the app warns if a different split moves the day.
   The app adds date-bound items itself: the 10 Nov 09:05 siren, balloon
   backups, the early night before the balloon and the pack-the-car evenings.
--------------------------------------------------------------------- */
const FIXED_DAYS = {
  arrive:
  {
    key: "arrive",
    title: "Mumbai to Istanbul to Antalya", img: "d04", wx: ["istanbul", "antalya"],
    stay: "Vera Suites Arapsuyu (Konyaaltı)", transport: "IndiGo + Turkish Airlines, rental car from AYT", drive: { km: 25, hours: "0.5" },
    child: "Long day (about 14 h door to door). Snacks, tablet and a change of clothes in the cabin bag for the 5-year-old.",
    booking: "Flights (confirm times), Turkey visa, car pickup at AYT after 23:30 with a high-back booster. Tell Vera Suites you'll check in after midnight.",
    contingency: "If the IST connection is tight, go straight to the domestic transfer desk. Don't try to store bags.",
    activities: [
      { time: "12:30", title: "Fly Mumbai to Istanbul (IndiGo)", location: "BOM T2", category: "Transport", duration: "about 6 h", cost: 0, priority: "must", transport: "Flight", notes: "Needs confirmation: the published 6E17 schedule is 08:30 to 13:50. Check which IndiGo flight you hold." },
      { time: "18:30", title: "Immigration, collect bags, re-check on Turkish Airlines", location: "Istanbul Airport", category: "Transport", duration: "1-1.5 h", cost: 0, priority: "must", transport: "Walk", notes: "The two flights are on separate tickets, so you collect and re-check. Storing a bag here is optional. Try the Luggage planner in Logistics." },
      { time: "22:00", title: "Fly Istanbul to Antalya (Turkish Airlines)", location: "IST domestic", category: "Transport", duration: "1 h 35 m", cost: 0, priority: "must", transport: "Flight", notes: "TK runs about 12 IST to AYT flights a day. Choose one at least 3 h after you land. Book all 4 on one booking so the bag allowance can be combined (Needs confirmation)." },
      { time: "23:40", title: "Pick up rental car + booster, drive to Vera Suites Arapsuyu", location: "Antalya Airport", category: "Driving", duration: "40 min", cost: 0, priority: "must", transport: "Car", notes: "About 25 km, 30 min to Arapsuyu (Estimated). Ask for a C-sedan or mid SUV (about 500 L boot) and a high-back booster. Video the car on all 4 sides.", kids: true }
    ]
  },
  "rt-cap":
  {
    key: "rt-cap",
    title: "Antalya to Konya to Göreme", img: "drive_road", wx: ["antalya", "konya", "goreme"],
    stay: "Tekkaya Cave Hotel, Göreme", transport: "Car", drive: { km: 530, hours: "6.5-7 (+ stops)" },
    child: "Split the drive into chunks of about 2 h. The Konya lunch is the long break. Tekkaya is a cave hotel, so ask for help with the bags on arrival. Sunset in Göreme is around 17:33.",
    booking: "None. Check the mountain-pass weather the night before.",
    contingency: "Snow or fog on the Taurus pass: leave later, or stay overnight in Konya if tired.",
    activities: [
      { time: "08:30", title: "Leave Vera Suites over the Taurus pass towards Konya", location: "Arapsuyu to Konya", category: "Driving", duration: "4 h", cost: 0, priority: "must", transport: "Car", notes: "303 km, about 3 h 55 m. Mountain road with trucks, so overtake only on the dual-carriageway sections." },
      { time: "12:45", title: "Lunch in Konya: Ali Baba Fırın Kebap or Kebapçı Dedeler 1929", location: "Konya", category: "Food", duration: "1.25 h", cost: 3000, priority: "must", transport: "Car", notes: "Konya's fırın kebabı (oven lamb) on fresh bread is kid-friendly and not spicy.", kids: true, img: "f_iskender" },
      { time: "14:00", title: "Mevlana Museum (optional 45-minute stop)", location: "Konya", category: "Sightseeing", duration: "45 min", cost: 0, priority: "optional", transport: "Walk", notes: "Entry and hours: Needs confirmation. Modest dress.", img: "d07" },
      { time: "15:00", title: "Drive Konya to Aksaray to Göreme", location: "D300 / Nevşehir", category: "Driving", duration: "2 h 30 m", cost: 0, priority: "must", transport: "Car", notes: "Traveller-reported average-speed camera sections between Konya and Aksaray. Keep under 110." },
      { time: "19:30", title: "Dinner: CANCAN Cafe (Indian-Turkish) or Cappadocian Cuisine", location: "Göreme", category: "Food", duration: "1.5 h", cost: 4000, priority: "good", transport: "Walk", notes: "", kids: true, img: "f_testi" }
    ]
  },
  "rt-ist":
  {
    key: "rt-ist",
    title: "Göreme to Istanbul (the long one)", img: "d10", wx: ["goreme", "ankara", "istanbul"],
    stay: "Elysium Hotel, Taksim", transport: "Car to IST airport, then minivan taxi to Taksim", drive: { km: 730, hours: "8-9 (+ stops)" },
    child: "The hardest day of the trip, and about 9 h in the booster. Tuz Gölü salt lake is a great leg-stretch. Flying instead is compared in Logistics.",
    booking: "Pre-book the car return at IST and a minivan transfer to Taksim (4 people, 7 bags). Tell Elysium you'll check in around 21:00. If you stored a bag, collect it at IST Left Luggage.",
    contingency: "Too tired: stop overnight in Ankara (costs one Istanbul night). Fog on the Bolu mountain section: slow down and use dipped lights. Running late: message Elysium and the transfer driver.",
    activities: [
      { time: "07:15", title: "Watch the balloons launch from the Tekkaya terrace, then check out", location: "Tekkaya Cave Hotel", category: "Sightseeing", duration: "45 min", cost: 0, priority: "good", transport: "Flex", notes: "Free, and the best view of the balloons is from the ground.", kids: true, img: "balloon2" },
      { time: "09:00", title: "Leave Göreme for Istanbul", location: "Göreme to IST airport", category: "Driving", duration: "8-9 h + stops", cost: 0, priority: "must", transport: "Car", notes: "About 730 km. Leave at 10:00 instead if the balloon moved to this morning. Fuel up in Nevşehir." },
      { time: "10:45", title: "Tuz Gölü (Salt Lake) stop", location: "Near Şereflikoçhisar", category: "Kids", duration: "45 min", cost: 0, priority: "good", transport: "Car", notes: "Walk out on the white salt crust. Bring wipes for shoes.", kids: true, img: "d10" },
      { time: "13:30", title: "Lunch on the Ankara ring road / highway services", location: "Ankara", category: "Food", duration: "1 h", cost: 3000, priority: "must", transport: "Car", notes: "", img: "f_doner" },
      { time: "18:30", title: "Collect a stored bag at IST (only if you stored one)", location: "IST Left Luggage", category: "Transport", duration: "45 min", cost: 0, priority: "optional", transport: "Car", notes: "Short-term car park. One adult runs in." },
      { time: "19:00", title: "Return the rental car", location: "IST airport car-rental return", category: "Driving", duration: "45 min", cost: 0, priority: "must", transport: "Car", notes: "Fill the tank first (full-to-full), keep the receipt, and video the car at drop-off. The Kuzey Marmara motorway runs straight to the airport, so you never drive into the city." },
      { time: "19:45", title: "Minivan taxi from IST to Elysium Hotel, Taksim", location: "IST to Taksim", category: "Transport", duration: "about 1 h", cost: 0, priority: "must", transport: "Minivan", notes: "A normal yellow taxi won't fit 4 people and 7 bags. Pre-book a minivan, or ask for a large taxi at the rank. Cost is in the budget lines (Estimated)." },
      { time: "21:00", title: "Late dinner near the hotel or room service", location: "Taksim", category: "Food", duration: "1 h", cost: 3000, priority: "good", transport: "Walk", notes: "Döner and wet burgers on Taksim Square are open late (Traveller-reported).", img: "f_donerspit" }
    ]
  },
  depart:
  {
    key: "depart",
    title: "Pack up and fly home", img: "ortakoy", wx: ["istanbul"],
    stay: "Home", transport: "Minivan transfer from Taksim to IST", drive: { km: 45, hours: "1" },
    child: "No big sightseeing. Pack the shopping bag the night before. Weigh every bag.",
    booking: "Return flight: Needs confirmation (the published 6E18 leaves IST at 17:55). Book a minivan with space for all bags. Ask Elysium for a late check-out or to hold the bags.",
    contingency: "Traffic to IST: leave 4 h before departure. Sunday traffic is usually lighter (Traveller-reported).",
    activities: [
      { time: "09:30", title: "Breakfast + final packing (weigh the bags)", location: "Elysium Hotel, Taksim", category: "Rest", duration: "2 h", cost: 2000, priority: "must", transport: "Flex", notes: "Bring a luggage scale.", img: "f_breakfast" },
      { time: "11:30", title: "Last simit and çay on İstiklal Avenue", location: "İstiklal Avenue", category: "Food", duration: "1 h", cost: 800, priority: "optional", transport: "Walk", notes: "The nostalgic red tram runs the length of the avenue.", kids: true },
      { time: "13:30", title: "Transfer to Istanbul Airport", location: "Elysium Taksim to IST", category: "Transport", duration: "1 h", cost: 0, priority: "must", transport: "Minivan", notes: "About 45-60 min (Estimated). A minivan is needed for 4 people and 8+ pieces. Cost is in the budget lines." },
      { time: "17:55", title: "Fly Istanbul to Mumbai", location: "IST", category: "Transport", duration: "about 5 h 40 m", cost: 0, priority: "must", transport: "Flight", notes: "Needs confirmation." }
    ]
  }
};

const DAY_BANK = {
  Antalya: [
    {
      key: "ant-legends", rank: 1, order: 1, tag: "Land of Legends",
      title: "Land of Legends theme park day", img: "legends", wx: ["antalya"],
      stay: "Vera Suites Arapsuyu (Konyaaltı)", transport: "Car", drive: { km: 115, hours: "2" },
      child: "A slow morning after the midnight landing, then a kids-first day. Many rides have height limits, so check which ones a 5-year-old (about 110 cm) can ride. Home by 18:00 for an early night before Pamukkale.",
      booking: "Land of Legends: buy online in advance, and check November opening days, hours and which areas are open (Needs confirmation). The outdoor water park is usually summer-only (Traveller-reported).",
      contingency: "Rain: much of the park is outdoor. Swap with the Old Town day and use the Aquarium (Konyaaltı) instead.",
      activities: [
        { time: "09:00", title: "Slow breakfast at Vera Suites", location: "Arapsuyu, Konyaaltı", category: "Food", duration: "1 h", cost: 2000, priority: "good", transport: "Walk", notes: "You landed after midnight, so no alarms.", kids: true, img: "f_breakfast" },
        { time: "10:15", title: "Drive to Land of Legends (Belek)", location: "Arapsuyu to Belek", category: "Driving", duration: "about 50 min", cost: 0, priority: "must", transport: "Car", notes: "About 55 km east along the coast road (Estimated). Paid parking at the park (Needs confirmation)." },
        { time: "11:00", title: "Land of Legends theme park: rides and kids' areas", location: "The Land of Legends, Kadriye, Belek", category: "Kids", duration: "5 h", cost: 22000, priority: "must", transport: "Walk", notes: "Family ticket price: Needs confirmation (the cost here is Estimated for 4). Check the height chart first and plan the 5-year-old's rides.", kids: true, img: "legends" },
        { time: "13:30", title: "Lunch inside the park", location: "Land of Legends", category: "Food", duration: "1 h", cost: 4000, priority: "good", transport: "Walk", notes: "Theme-park prices. Carry water and snacks for the queues.", kids: true, img: "f_durum" },
        { time: "16:45", title: "Drive back to Vera Suites", location: "Belek to Arapsuyu", category: "Driving", duration: "about 1 h", cost: 0, priority: "must", transport: "Car", notes: "Leave by 16:45 to be home by 18:00 and miss the worst city traffic." },
        { time: "19:00", title: "Dinner: The Grill House (Kuşkavağı)", location: "Konyaaltı seafront, near Vera Suites", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk / short drive", notes: "Grilled chicken and fries for the kids. Serves alcohol (Traveller-reported).", kids: true, img: "f_pirzola" },
        { time: "20:45", title: "Early night: 06:30 start for Pamukkale", location: "Vera Suites", category: "Rest", duration: "", cost: 0, priority: "must", transport: "Flex", notes: "Pack breakfast boxes, swimwear, towels, flip-flops and a bag for shoes tonight.", onlyIf: "ant-pamukkale" }
      ]
    },
    {
      key: "ant-pamukkale", rank: 2, order: 2, tag: "Salda Lake and Pamukkale",
      title: "Salda Lake and the Pamukkale travertines", img: "pamukkale", wx: ["antalya"],
      stay: "Vera Suites Arapsuyu (Konyaaltı)", transport: "Car", drive: { km: 515, hours: "7" },
      child: "The longest Antalya day: about 7 h of driving. Booster breaks every 90 min, tablets and snacks ready. At Pamukkale everyone walks the terraces barefoot, which kids love. Bring towels and a change of clothes.",
      booking: "Pamukkale-Hierapolis: tickets at the gate (or a Museum Pass, Needs confirmation). Salda Lake: free.",
      contingency: "Running late or a tired 5-year-old: skip Salda and drive straight to Pamukkale and back. Rain: the terraces are still open but slippery.",
      activities: [
        { time: "06:30", title: "Leave Vera Suites with breakfast boxes", location: "Arapsuyu to Salda Lake", category: "Driving", duration: "about 2 h 15 m", cost: 0, priority: "must", transport: "Car", notes: "About 165 km north via Burdur (Estimated). Fuel up before you leave the city." },
        { time: "08:50", title: "Salda Lake: turquoise water and white shores", location: "Salda Gölü, Yeşilova", category: "Sightseeing", duration: "45 min", cost: 0, priority: "good", transport: "Walk", notes: "Called 'Turkey's Maldives'. Parts of the shore are protected, so use the signed public beach area (Traveller-reported). About 1,100 m up, so it's cold in the morning.", kids: true },
        { time: "09:45", title: "Drive Salda to Pamukkale", location: "Yeşilova to Pamukkale", category: "Driving", duration: "about 1 h 30 m", cost: 0, priority: "must", transport: "Car", notes: "About 105 km (Estimated)." },
        { time: "11:15", title: "Pamukkale travertines: barefoot walk up the white terraces", location: "Pamukkale (south gate)", category: "Sightseeing", duration: "2 h", cost: 9900, priority: "must", transport: "Walk", notes: "Shoes off on the terraces (carry them in a bag). Entry about €30 per adult or teen (Needs confirmation). Under-8s free at state sites (Verified). Hierapolis is at the top on the same ticket if anyone has energy.", kids: true, img: "pamukkale" },
        { time: "13:30", title: "Lunch in Pamukkale village", location: "Pamukkale", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Car", notes: "", img: "f_kofte" },
        { time: "14:30", title: "Drive back to Antalya", location: "Pamukkale to Arapsuyu", category: "Driving", duration: "about 3 h 15 m", cost: 0, priority: "must", transport: "Car", notes: "About 245 km (Estimated). Leaving at 14:30 keeps most of the mountain road in daylight (sunset about 17:50)." },
        { time: "19:00", title: "Easy dinner near Vera Suites", location: "Konyaaltı", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "", img: "f_adana" }
      ]
    },
    {
      key: "ant-oldtown", rank: 3, order: 4, tag: "old town and waterfalls",
      title: "Old Town, Düden falls and a Konyaaltı sunset", img: "d05", wx: ["antalya"],
      stay: "Vera Suites Arapsuyu (Konyaaltı)", transport: "Car + walking", drive: { km: 35, hours: "1" },
      child: "An easy, close-to-home day after two big outings, before tomorrow's long drive. Kaleiçi cobbles are rough for small legs.",
      booking: "None",
      contingency: "Rain: the Antalya Aquarium and the Archaeological Museum are both a few minutes from Vera Suites.",
      activities: [
        { time: "10:30", title: "Kaleiçi old town: Hadrian's Gate, old harbour, Hıdırlık Tower", location: "Kaleiçi, Antalya", category: "Sightseeing", duration: "2 h", cost: 0, priority: "must", transport: "Car + walk", notes: "Park outside the walls (İSPARK / Karaalioğlu Park). Don't drive into Kaleiçi.", img: "s_kaleici" },
        { time: "13:00", title: "Lunch: Rokka (pizza/falafel) or Parlak (grills)", location: "Kaleiçi", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "See Intel Corner, Restaurants.", kids: true, img: "f_durum" },
        { time: "15:30", title: "Lower Düden Waterfall (falls straight into the sea)", location: "Lara, Antalya", category: "Sightseeing", duration: "1 h", cost: 0, priority: "must", transport: "Car", notes: "Entry fee: Needs confirmation. Scenic cliff park.", kids: true, img: "s_lara" },
        { time: "17:15", title: "Sunset walk on the Konyaaltı promenade", location: "Konyaaltı Beach", category: "Rest", duration: "1 h", cost: 0, priority: "good", transport: "Car", notes: "Sunset around 17:55. Turkey stays on UTC+3 all year, so evenings are light.", kids: true, img: "s_konyaalti" },
        { time: "19:30", title: "Dinner: Paşa Bey Kebap or Arma Restaurant (harbour)", location: "Gençlik / Kaleiçi", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Car", notes: "", img: "f_adana3" },
        { time: "Flex", title: "Antalya Archaeological Museum (13-year-old pick)", location: "Konyaaltı Cd., Antalya", category: "Sightseeing", duration: "1.5 h", cost: 3300, priority: "optional", transport: "Car", notes: "2 km from Vera Suites. The Perge statues live here. Under-8s free at state museums (Verified). Adult fee: Needs confirmation." }
      ]
    },
    {
      key: "ant-olympos", rank: 4, order: 3, tag: "mountain cable car",
      title: "Olympos cable car and Phaselis by the sea", img: "d06", wx: ["antalya", "tahtali"],
      stay: "Vera Suites Arapsuyu (Konyaaltı)", transport: "Car", drive: { km: 150, hours: "2.5" },
      child: "The cable car is the highlight for the 5-year-old. The summit is near freezing, so bring jackets. Phaselis has short flat paths.",
      booking: "Olympos Teleferik: buy on the day at the base or online. Only go if the summit forecast is clear.",
      contingency: "Summit in cloud: swap with another Antalya day and go when the webcam is clear. Rain: the Aquarium or the Archaeological Museum.",
      activities: [
        { time: "09:30", title: "Drive to Olympos Teleferik (Tahtalı)", location: "Beycik, Kemer", category: "Driving", duration: "1 h 15 m", cost: 0, priority: "must", transport: "Car", notes: "Coastal D400. Check the live summit webcam before you leave." },
        { time: "11:00", title: "Olympos Teleferik to the Tahtalı summit", location: "Olympos Teleferik", category: "Adventure", duration: "2 h", cost: 13500, priority: "must", transport: "Cable car", notes: "About €41 each for 3 people. Under-6 pricing differs by source (Needs confirmation).", kids: true, img: "tahtali" },
        { time: "13:30", title: "Lunch around Tekirova or Kemer", location: "Tekirova", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Car", notes: "", img: "f_gerashi" },
        { time: "15:00", title: "Phaselis ancient city + pine-shaded coves", location: "Phaselis, Kemer", category: "Sightseeing", duration: "1.5 h", cost: 2500, priority: "good", transport: "Car", notes: "Entry fee: Needs confirmation.", kids: true, img: "phaselis" },
        { time: "19:30", title: "Dinner near Vera Suites", location: "Konyaaltı", category: "Food", duration: "1.5 h", cost: 4000, priority: "good", transport: "Walk", notes: "", img: "f_tavuk2" }
      ]
    },
    {
      key: "ant-aspendos", rank: 5, order: 3.5, tag: "Roman ruins",
      title: "Aspendos theatre and Perge ruins", img: "aspendos", wx: ["antalya"],
      stay: "Vera Suites Arapsuyu (Konyaaltı)", transport: "Car", drive: { km: 90, hours: "1.5" },
      child: "Big open ruins with room to run. The Aspendos theatre's acoustics are the fun part for a 5-year-old: clap and listen to the echo. Bring hats and water, there's little shade.",
      booking: "None. Buy both tickets at the gate.",
      contingency: "This is also the rain/cloud backup for the Olympos day: swap the two if the cable car forecast is bad.",
      activities: [
        { time: "09:30", title: "Drive east to Aspendos", location: "Serik, Antalya", category: "Driving", duration: "45 min", cost: 0, priority: "must", transport: "Car", notes: "D400 then inland, well signed. 47 km from Konyaaltı." },
        { time: "10:30", title: "Aspendos Roman theatre (best-preserved in the world)", location: "Aspendos", category: "Sightseeing", duration: "1 h", cost: 1650, priority: "must", transport: "Car", notes: "About €15 each for 3 (incl. the 13-year-old). Under-8s free. (Traveller-reported)", kids: true, img: "aspendos" },
        { time: "12:00", title: "Perge ancient city: colonnaded street, stadium, theatre", location: "Perge, Aksu", category: "Sightseeing", duration: "1 h", cost: 1200, priority: "good", transport: "Car", notes: "About €11 each for 3. Less shade than Aspendos, so don't linger past midday. (Traveller-reported)", kids: true },
        { time: "13:30", title: "Lunch on the way back into Antalya", location: "Aksu / Lara", category: "Food", duration: "1 h", cost: 3000, priority: "good", transport: "Car", notes: "", img: "f_adana3" },
        { time: "16:00", title: "Relaxed afternoon: Konyaaltı beach and Beach Park", location: "Konyaaltı", category: "Rest", duration: "2.5 h", cost: 0, priority: "good", transport: "Car", notes: "A slower finish after the ruins. The Aquarium is here too if anyone wants indoors.", kids: true, img: "s_konyaalti" },
        { time: "19:30", title: "Dinner: Arma Restaurant (harbour) or Parlak Restaurant", location: "Kaleiçi", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Car", notes: "", img: "f_fish" }
      ]
    }
  ],
  Cappadocia: [
    {
      key: "cap-underground", rank: 2, order: 1, tag: "the underground city and fairy chimneys",
      title: "Underground city, fairy chimneys and Uçhisar sunset", img: "kaymakli", wx: ["goreme"],
      stay: "Tekkaya Cave Hotel, Göreme", transport: "Car", drive: { km: 75, hours: "1.5" },
      child: "Kaymaklı has low tunnels: fine for kids, but hold the 5-year-old's hand on the steep steps. Short, flat walks among the fairy chimneys in the afternoon.",
      booking: "None. Pay at the gates. Kaymaklı is about €13 per adult or teen (Traveller-reported).",
      contingency: "Rain: Kaymaklı is underground, so keep it, and swap the valleys for a cave-café afternoon.",
      activities: [
        { time: "10:00", title: "Kaymaklı Underground City", location: "Kaymaklı (20 km)", category: "Sightseeing", duration: "1.5 h", cost: 4300, priority: "must", transport: "Car", notes: "20 km south of Göreme. About €13 each for 3 people. Derinkuyu is deeper and more cramped; Kaymaklı is easier with a 5-year-old.", kids: true, img: "kaymakli" },
        { time: "12:00", title: "Pigeon Valley viewpoint", location: "Pigeon Valley, Uçhisar", category: "Sightseeing", duration: "30 min", cost: 0, priority: "good", transport: "Car", notes: "Free roadside viewpoint on the way back.", kids: true, img: "s_uchisar" },
        { time: "12:45", title: "Lunch: Old Cappadocia or Turkish Ravioli (mantı)", location: "Göreme", category: "Food", duration: "1 h", cost: 3000, priority: "good", transport: "Car", notes: "", img: "f_shish2" },
        { time: "14:00", title: "Rest at Tekkaya", location: "Tekkaya Cave Hotel", category: "Rest", duration: "1.5 h", cost: 0, priority: "good", transport: "Flex", notes: "" },
        { time: "15:30", title: "Paşabağ (Monks Valley) and Devrent's camel rock", location: "Paşabağ / Devrent Valley", category: "Sightseeing", duration: "1.25 h", cost: 0, priority: "must", transport: "Car", notes: "The classic mushroom-shaped fairy chimneys. Devrent is roadside and free; Paşabağ entry: Needs confirmation.", kids: true, img: "s_cavusin" },
        { time: "17:00", title: "Sunset at the Uçhisar Castle viewpoint", location: "Uçhisar", category: "Sightseeing", duration: "1 h", cost: 0, priority: "must", transport: "Car", notes: "Sunset is about 17:31. The viewpoints are free. The castle climb fee is small (Needs confirmation).", kids: true, img: "s_uchisar" },
        { time: "18:30", title: "Early dinner: CANCAN Cafe (Indian-Turkish) or Cappadocian Cuisine", location: "Göreme", category: "Food", duration: "1.25 h", cost: 4000, priority: "good", transport: "Walk", notes: "Familiar flavours, and close to Tekkaya.", kids: true, img: "f_tavuk2" }
      ]
    },
    {
      key: "cap-balloon", rank: 1, order: 2, booked: "2026-11-10", tag: "a sunrise balloon flight and horse riding",
      title: "Sunrise balloon, open-air museum, sunset horses", img: "d08", wx: ["goreme"],
      stay: "Tekkaya Cave Hotel, Göreme", transport: "Operator transfers + car", drive: { km: 25, hours: "0.5" },
      child: "Your operator confirmed the 5-year-old for the basket. Dress everyone in layers, gloves and beanies: dawn is about 2 °C. Nap after breakfast, because horse riding is at sunset.",
      booking: "BALLOON: booked for 10 Nov, all 4 of you (confirmed). If it's cancelled, ask the operator to move you to {balloonBackup}. Horse riding: book 1-2 days ahead.",
      contingency: "Balloon cancelled (25-35% of November mornings): watch the launch from the Tekkaya terrace and rebook for {balloonNext}.",
      activities: [
        { time: "05:30", title: "Sunrise hot-air balloon flight (all 4, booked)", location: "Göreme valleys", category: "Adventure", duration: "3.5 h incl. transfers", cost: 84000, priority: "must", transport: "Operator shuttle", notes: "Booked and confirmed for all 4, including the 5-year-old. The cost here is Estimated at €150-220 each, so replace it with what you paid. Pickup is usually 1-1.5 h before the 07:16 sunrise; check your confirmation.", img: "hero", kids: true },
        { time: "09:15", title: "Breakfast at Tekkaya + nap", location: "Tekkaya Cave Hotel", category: "Rest", duration: "2 h", cost: 0, priority: "must", transport: "Flex", notes: "Very important after the early start.", kids: true, img: "f_breakfast" },
        { time: "11:30", title: "Göreme Open-Air Museum (rock-cut churches)", location: "Göreme", category: "Sightseeing", duration: "1.5 h", cost: 6600, priority: "good", transport: "Car", notes: "€20 per adult or teen. Under-8s free at state museums (Verified). The Dark Church is +€6.", img: "goreme_oam" },
        { time: "13:15", title: "Lunch: Nazar Börek or Aysel'in Mutfağı", location: "Göreme", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "", kids: true, img: "f_tavukdoner" },
        { time: "14:15", title: "Rest at the hotel", location: "Hotel", category: "Rest", duration: "1.5 h", cost: 0, priority: "must", transport: "Flex", notes: "" },
        { time: "16:00", title: "Sunset horse riding: Rose / Red Valley (1 h)", location: "Çavuşin / Göreme ranch", category: "Adventure", duration: "1.5 h", cost: 16000, priority: "must", transport: "Operator transfer", notes: "Sunset is about 17:32. The 5-year-old will likely ride a led pony or ride with a guide. Confirm the ranch's minimum age.", kids: true, img: "horse" },
        { time: "19:00", title: "Dinner: Topdeck Cave or Oscar Steak House", location: "Göreme", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "", img: "f_ocakbasi" }
      ]
    },
    {
      key: "cap-valleys", rank: 3, order: 3, tag: "Zelve and an Avanos pottery class",
      title: "Zelve, Çavuşin and an Avanos pottery class", img: "s_cavusin", wx: ["goreme"],
      stay: "Tekkaya Cave Hotel, Göreme", transport: "Car", drive: { km: 40, hours: "1" },
      child: "A gentle valleys day with a hands-on pottery class in the afternoon, the 13-year-old's creative hour.",
      booking: "Pottery class: book the day before (a real class, not a free shop 'demo').",
      contingency: "Rain: skip Zelve and add the Avanos riverside cafés.",
      activities: [
        { time: "10:00", title: "Zelve Open-Air Museum (abandoned cave village)", location: "Zelve", category: "Sightseeing", duration: "1.25 h", cost: 4500, priority: "good", transport: "Car", notes: "Entry for 3: Needs confirmation (the cost here is Estimated). Under-8s free at state sites (Verified).", kids: true },
        { time: "11:45", title: "Çavuşin old village and cliff church", location: "Çavuşin", category: "Sightseeing", duration: "45 min", cost: 0, priority: "good", transport: "Car", notes: "Free to wander the lower village. Church entry: Needs confirmation.", kids: true, img: "s_cavusin" },
        { time: "13:00", title: "Riverside lunch in Avanos", location: "Avanos", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Car", notes: "", img: "f_testi" },
        { time: "14:30", title: "Avanos pottery workshop (hands-on wheel)", location: "Avanos", category: "Kids", duration: "1.5 h", cost: 6000, priority: "good", transport: "Car", notes: "Book a class, not a 'free demo'. Those end in a shop sales pitch (Traveller-reported).", kids: true, img: "pottery" },
        { time: "16:45", title: "Sunset over Love Valley / Rose Valley viewpoints", location: "Göreme", category: "Sightseeing", duration: "1 h", cost: 0, priority: "good", transport: "Car", notes: "Free viewpoints. Sunset is about 17:30.", kids: true, img: "s_goreme" },
        { time: "19:30", title: "Dinner: Pumpkin Göreme or Cappadocian Cuisine", location: "Göreme", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "Pumpkin is small, so book ahead.", img: "f_copkebab" }
      ]
    },
    {
      key: "cap-ihlara", rank: 4, order: 3.5, tag: "the Ihlara Valley walk",
      title: "Ihlara Valley riverside walk and Selime Monastery", img: "ihlara", wx: ["goreme"],
      stay: "Tekkaya Cave Hotel, Göreme", transport: "Car", drive: { km: 190, hours: "3" },
      child: "The valley path is flat and shaded along a stream, but entering from the Ihlara end means about 360 steps down and back up (Traveller-reported). Start at Belisırma instead for an easy out-and-back with the 5-year-old.",
      booking: "None. Pay at the gate. Whether the Museum Pass Cappadocia covers it: Needs confirmation.",
      contingency: "Rain: skip Ihlara and visit Derinkuyu underground city (indoors) instead.",
      activities: [
        { time: "09:00", title: "Drive to the Ihlara Valley", location: "Göreme to Ihlara", category: "Driving", duration: "1 h 20 m", cost: 0, priority: "must", transport: "Car", notes: "About 90 km via Nevşehir and Aksaray (Estimated)." },
        { time: "10:30", title: "Ihlara Valley walk: Belisırma section and rock-cut churches", location: "Belisırma, Ihlara Valley", category: "Sightseeing", duration: "2 h", cost: 4000, priority: "must", transport: "Walk", notes: "Entry for 3: Needs confirmation (the cost here is Estimated). Under-8s free at state sites (Verified).", kids: true, img: "ihlara" },
        { time: "12:45", title: "Lunch on the river platforms at Belisırma (trout or grills)", location: "Belisırma", category: "Food", duration: "1.25 h", cost: 3500, priority: "good", transport: "Walk", notes: "Tables sit right over the stream, a kid favourite (Traveller-reported).", kids: true, img: "f_shish" },
        { time: "14:30", title: "Selime Monastery (huge rock-cut complex)", location: "Selime", category: "Sightseeing", duration: "1 h", cost: 2500, priority: "good", transport: "Car", notes: "Some steep scrambles, so hold hands. Entry: Needs confirmation.", kids: true },
        { time: "15:45", title: "Drive back to Göreme", location: "Selime to Göreme", category: "Driving", duration: "1 h 30 m", cost: 0, priority: "must", transport: "Car", notes: "" },
        { time: "19:30", title: "Dinner: Millocal (Uçhisar) or Topdeck Cave", location: "Uçhisar / Göreme", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Car", notes: "Topdeck is small, so reserve.", img: "f_pirzola2" }
      ]
    },
    {
      key: "cap-slow", rank: 5, order: 4, tag: "a slow Göreme day",
      title: "Slow day: Ortahisar, hammam and Sunset Point", img: "s_ortahisar", wx: ["goreme"],
      stay: "Tekkaya Cave Hotel, Göreme", transport: "Walking + short drives", drive: { km: 20, hours: "0.5" },
      child: "A breather before the long drive. Late breakfast, no alarms, and an early night.",
      booking: "Hammam: book the morning of. Many have family or private slots (Traveller-reported).",
      contingency: "Rain: the hammam and a cave-restaurant lunch are both indoors.",
      activities: [
        { time: "10:00", title: "Long Turkish breakfast on the Tekkaya terrace", location: "Tekkaya Cave Hotel", category: "Food", duration: "1.5 h", cost: 0, priority: "good", transport: "Flex", notes: "Usually included in cave-hotel rates.", kids: true, img: "f_breakfast" },
        { time: "12:00", title: "Ortahisar castle village and viewpoint", location: "Ortahisar", category: "Sightseeing", duration: "1.5 h", cost: 1500, priority: "good", transport: "Car", notes: "Castle climb fee: Needs confirmation.", kids: true, img: "s_ortahisar" },
        { time: "13:30", title: "Lunch: Nazar Börek (gözleme for the kids)", location: "Göreme", category: "Food", duration: "1 h", cost: 3000, priority: "good", transport: "Walk", notes: "", kids: true, img: "f_tavukdoner" },
        { time: "15:00", title: "Turkish bath (hammam), adults in turns", location: "Göreme", category: "Rest", duration: "1.5 h", cost: 7000, priority: "optional", transport: "Walk", notes: "About ₹3,500 per adult (Estimated). Check the kids' policy before booking." },
        { time: "17:00", title: "Sunset from Göreme Sunset Point", location: "Göreme", category: "Sightseeing", duration: "45 min", cost: 0, priority: "good", transport: "Walk", notes: "Some viewpoints charge a small fee: Needs confirmation.", kids: true, img: "s_goreme" },
        { time: "19:30", title: "Dinner: CANCAN Cafe (Indian-Turkish)", location: "Göreme", category: "Food", duration: "1.5 h", cost: 4000, priority: "good", transport: "Walk", notes: "Familiar flavours before a long road day.", kids: true, img: "f_tavuk2" }
      ]
    }
  ],
  Istanbul: [
    {
      key: "ist-sultanahmet", rank: 1, order: 1, closed: [0], tag: "Hagia Sophia, the Blue Mosque and the Grand Bazaar",
      title: "Hagia Sophia, Blue Mosque and the Grand Bazaar", img: "d11", wx: ["istanbul"],
      stay: "Elysium Hotel, Taksim", transport: "F1 funicular + T1 tram + walking", drive: { km: 0, hours: "0" },
      child: "Morning visits before the crowds. Headscarves for the women, shoes off in mosques. The Grand Bazaar is a maze, so agree a meeting point and keep the 5-year-old's hand.",
      booking: "Hagia Sophia: buy the visitor-gallery ticket online. Plan around prayer times. The Grand Bazaar is closed on Sundays.",
      contingency: "Rain: Hagia Sophia, the Basilica Cistern and the Grand Bazaar are all indoors.",
      activities: [
        { time: "08:15", title: "Taksim to the old city: F1 funicular + T1 tram", location: "Taksim to Sultanahmet", category: "Transport", duration: "about 35 min", cost: 0, priority: "must", transport: "Funicular + tram", notes: "Walk to Taksim Square, ride the F1 funicular down to Kabataş (about 3 min), then the T1 tram to Sultanahmet. One Istanbulkart can be tapped for each person (Traveller-reported). Fares are in the budget lines." },
        { time: "09:00", title: "Hagia Sophia (visitor gallery)", location: "Sultanahmet", category: "Sightseeing", duration: "1.5 h", cost: 8300, priority: "must", transport: "Tram", notes: "€25 each for 3. Under-8s free with ID (Verified).", img: "d11" },
        { time: "10:45", title: "Blue Mosque + Hippodrome", location: "Sultanahmet", category: "Sightseeing", duration: "1 h", cost: 0, priority: "must", transport: "Walk", notes: "Free. Closed to visitors during prayer times.", kids: true, img: "bluemosque" },
        { time: "12:30", title: "Lunch: Matbah (Ottoman) or Sultanahmet Köftecisi", location: "Sultanahmet", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "Köfte, rice and bread: ideal for the 5-year-old.", kids: true, img: "f_kofte" },
        { time: "14:00", title: "Grand Bazaar: main shopping window", location: "Beyazıt", category: "Shopping", duration: "2.5 h", cost: 0, priority: "must", transport: "Walk / tram", notes: "10 minutes' walk along Divanyolu, or one T1 stop to Beyazıt. Closed on Sundays, and you fly home on Sunday 15 Nov, so this is your big shopping window. Bargain, and pay cash for discounts.", img: "grandbazaar" },
        { time: "16:45", title: "Dessert at Hafız Mustafa 1864", location: "Sirkeci / Sultanahmet", category: "Food", duration: "45 min", cost: 1500, priority: "good", transport: "Tram", notes: "", kids: true, img: "f_baklava" },
        { time: "17:30", title: "Back to Taksim: T1 tram + F1 funicular", location: "Sultanahmet to Taksim", category: "Transport", duration: "about 40 min", cost: 0, priority: "must", transport: "Tram + funicular", notes: "Rush hour, so take a BiTaksi if the kids are done." },
        { time: "19:30", title: "Dinner near the hotel: Hacı Abdullah (Ottoman lokanta, since 1888)", location: "Off İstiklal Avenue, Beyoğlu", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "Classic home-style Ottoman dishes and no alcohol on the menu (Traveller-reported). Opening hours: Needs confirmation.", kids: true, img: "f_islim" },
        { time: "Flex", title: "Basilica Cistern", location: "Sultanahmet", category: "Sightseeing", duration: "45 min", cost: 12600, priority: "optional", transport: "Walk", notes: "About €38 each for 3. Expensive. Skip if the budget is tight.", img: "cistern" }
      ]
    },
    {
      key: "ist-topkapi", rank: 2, order: 3, closed: [2], tag: "Topkapı, a Bosphorus ferry, Galata Tower and İstiklal",
      title: "Topkapı, Bosphorus ferry, Galata Tower and İstiklal", img: "d13", wx: ["istanbul"],
      stay: "Elysium Hotel, Taksim", transport: "F1 funicular + T1 tram + ferry + Tünel", drive: { km: 0, hours: "0" },
      child: "Topkapı is huge, so do the Treasury and Harem highlights, not everything. Kids love the ferry (simit for the gulls). The day ends walking home along flat İstiklal Avenue with ice-cream shows.",
      booking: "Topkapı: buy online (closed on Tuesdays). Galata Tower: long queues, and the view from outside is free.",
      contingency: "Rain: do Topkapı's indoor rooms and the Spice Bazaar, skip the ferry, and take the Tünel straight up to İstiklal.",
      activities: [
        { time: "08:20", title: "Taksim to the old city: F1 funicular + T1 tram", location: "Taksim to Sultanahmet", category: "Transport", duration: "about 35 min", cost: 0, priority: "must", transport: "Funicular + tram", notes: "Walk to Taksim Square, ride the F1 funicular down to Kabataş (about 3 min), then the T1 tram to Sultanahmet. One Istanbulkart can be tapped for each person (Traveller-reported). Fares are in the budget lines." },
        { time: "09:00", title: "Topkapı Palace incl. Harem", location: "Sultanahmet", category: "Sightseeing", duration: "2.5 h", cost: 18200, priority: "must", transport: "Tram", notes: "About €55 each for 3 (incl. Harem). Compare with the Museum Pass Istanbul.", img: "d13" },
        { time: "12:00", title: "Gülhane Park walk + lunch", location: "Gülhane", category: "Food", duration: "1.25 h", cost: 3500, priority: "good", transport: "Walk", notes: "", kids: true, img: "f_donerspit" },
        { time: "13:30", title: "Spice Bazaar + Eminönü waterfront", location: "Eminönü", category: "Shopping", duration: "1 h", cost: 0, priority: "good", transport: "Walk", notes: "Shopping isn't in the trip budget. Cash gets better prices.", img: "spicebazaar" },
        { time: "14:40", title: "Bosphorus tour on the public ferry (Şehir Hatları)", location: "Eminönü pier", category: "Sightseeing", duration: "2 h", cost: 1600, priority: "must", transport: "Ferry", notes: "Public ferry short tour about ₺120-200 each. A guided cruise (Klook/GYG) is the upgrade.", kids: true, img: "bosphorus" },
        { time: "17:00", title: "Galata Tower at sunset", location: "Galata", category: "Sightseeing", duration: "1 h", cost: 9900, priority: "good", transport: "Walk + Tünel", notes: "Cross Galata Bridge to Karaköy, then take the 1875 Tünel funicular up and walk down to the tower. About €30 each for 3 to go up; the view from outside is free. Sunset is about 17:45.", img: "d15" },
        { time: "18:15", title: "İstiklal Avenue walk back to Taksim", location: "İstiklal Avenue", category: "Sightseeing", duration: "1 h", cost: 800, priority: "good", transport: "Walk", notes: "1.5 km and mostly flat from Tünel to Taksim. Nostalgic red tram, Maraş ice-cream shows and Hafız Mustafa for the sweet tooth.", kids: true, img: "s_dondurma" },
        { time: "19:30", title: "Farewell dinner: Aheste (Pera) or Yeni Lokanta", location: "Beyoğlu", category: "Food", duration: "2 h", cost: 6000, priority: "good", transport: "Walk", notes: "Both are walkable from Elysium. Yeni Lokanta is the top-rated splurge; Aheste does sharing plates. Both serve alcohol.", img: "f_pirzola" }
      ]
    },
    {
      key: "ist-islands", rank: 3, order: 2, tag: "the Princes' Islands",
      title: "Princes' Islands: ferry to Büyükada", img: "buyukada", wx: ["istanbul"],
      stay: "Elysium Hotel, Taksim", transport: "Public ferry + walking", drive: { km: 0, hours: "0" },
      child: "No private cars on the island, so the kids can roam. The ferry ride is half the fun. Skip the steep climb to Aya Yorgi with the 5-year-old.",
      booking: "None. Tap Istanbulkart on the Şehir Hatları ferry. Check the morning Adalar sailings from Kabataş, the F1 funicular stop below Taksim.",
      contingency: "Strong wind or rain can cancel ferries. Swap in Dolmabahçe Palace, a 10-minute walk from Kabataş (closed Mondays).",
      activities: [
        { time: "09:00", title: "F1 funicular down to Kabataş pier", location: "Taksim to Kabataş", category: "Transport", duration: "15 min", cost: 0, priority: "must", transport: "Funicular", notes: "About 3 min on the funicular, then a short walk to the ferry piers." },
        { time: "09:30", title: "Ferry to Büyükada (Şehir Hatları)", location: "Kabataş pier", category: "Transport", duration: "about 1.5 h", cost: 800, priority: "must", transport: "Ferry", notes: "Istanbulkart fare per person: Needs confirmation (the cost here is Estimated for 4). Sit outside on the top deck.", kids: true, img: "bosphorus" },
        { time: "11:15", title: "Explore Büyükada: wooden mansions, bike or electric-cart tour", location: "Büyükada", category: "Sightseeing", duration: "2 h", cost: 3000, priority: "must", transport: "Walk / bike", notes: "Horse carriages were replaced by electric vehicles in 2020 (Traveller-reported). Bike and cart prices: Needs confirmation.", kids: true, img: "buyukada" },
        { time: "13:30", title: "Seafood or köfte lunch by the pier", location: "Büyükada", category: "Food", duration: "1.25 h", cost: 4500, priority: "good", transport: "Walk", notes: "", img: "f_fish" },
        { time: "15:00", title: "Ice cream by the water, then the ferry back", location: "Büyükada pier", category: "Rest", duration: "2.5 h", cost: 600, priority: "good", transport: "Ferry", notes: "Aim for a ferry back around 16:00 to beat the evening crowds (Traveller-reported).", kids: true },
        { time: "17:45", title: "Back to the hotel, rest", location: "Elysium Hotel, Taksim", category: "Rest", duration: "1.5 h", cost: 0, priority: "good", transport: "Funicular", notes: "" },
        { time: "19:30", title: "Dinner near the hotel: Zübeyir Ocakbaşı (grills)", location: "Taksim", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "Popular grill near Taksim. Below our 4.3 rating bar (4.2), but a reliable grill (Traveller-reported).", img: "f_ocakbasi" }
      ]
    },
    {
      key: "ist-asian", rank: 4, order: 2.5, tag: "the Asian side",
      title: "Asian side: Kadıköy market, Moda and Üsküdar", img: "s_uskudar", wx: ["istanbul"],
      stay: "Elysium Hotel, Taksim", transport: "Ferry + walking", drive: { km: 0, hours: "0" },
      child: "A local-life day with short ferry rides and lots of snacking. Moda's seafront park has space to run.",
      booking: "None.",
      contingency: "Rain: Kadıköy's market lanes still work. Skip the Moda walk.",
      activities: [
        { time: "10:00", title: "F1 to Kabataş, then the ferry to Kadıköy", location: "Kabataş pier", category: "Transport", duration: "40 min", cost: 400, priority: "must", transport: "Ferry", notes: "Istanbulkart. Simit for the gulls.", kids: true, img: "bosphorus" },
        { time: "10:30", title: "Kadıköy market lanes (fish, pickles, sweets)", location: "Kadıköy Çarşı", category: "Shopping", duration: "1.5 h", cost: 1500, priority: "good", transport: "Walk", notes: "Carry cash for small stalls.", kids: true, img: "s_lokum" },
        { time: "12:15", title: "Lunch: Çiya Sofrası or a döner canteen", location: "Kadıköy", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "Çiya is loved by food writers but mixed on Google (see Intel Corner).", img: "f_doner" },
        { time: "13:30", title: "Moda seafront walk + Maraş ice cream show", location: "Moda", category: "Rest", duration: "1.5 h", cost: 800, priority: "good", transport: "Walk", notes: "Ali Usta (since 1969) is in Moda. Below our rating bar, but you go for the show.", kids: true, img: "s_dondurma" },
        { time: "16:00", title: "Üsküdar shore at sunset: Maiden's Tower view", location: "Üsküdar", category: "Sightseeing", duration: "1.5 h", cost: 0, priority: "good", transport: "Taxi / Marmaray", notes: "The view from the shore is free. Boats out to the tower and entry: Needs confirmation. Sunset is about 17:45.", kids: true, img: "s_uskudar" },
        { time: "18:30", title: "Ferry Üsküdar to Eminönü, then dinner", location: "Üsküdar pier", category: "Food", duration: "2 h", cost: 4500, priority: "good", transport: "Ferry", notes: "", img: "f_mixedgrill" }
      ]
    },
    {
      key: "ist-dolmabahce", rank: 5, order: 2.7, closed: [1], tag: "Dolmabahçe and Ortaköy",
      title: "Dolmabahçe Palace and Ortaköy", img: "d14", wx: ["istanbul"],
      stay: "Elysium Hotel, Taksim", transport: "F1 funicular + walking + taxi", drive: { km: 0, hours: "0" },
      child: "Ortaköy kumpir (stuffed baked potato) is a guaranteed kid win. An easy half day with an afternoon rest.",
      booking: "Dolmabahçe: buy online (closed on Mondays).",
      contingency: "Rain: Dolmabahçe is indoors. Skip the Ortaköy waterfront.",
      activities: [
        { time: "09:30", title: "Dolmabahçe Palace", location: "Beşiktaş", category: "Sightseeing", duration: "2 h", cost: 13200, priority: "must", transport: "F1 + walk", notes: "F1 funicular down to Kabataş, then a 10-minute walk. About €40 each for 3. Children 6 and under free (Verified).", img: "d14" },
        { time: "12:00", title: "Lunch: Ortaköy kumpir by the mosque", location: "Ortaköy", category: "Food", duration: "1 h", cost: 2500, priority: "good", transport: "Taxi / bus", notes: "", kids: true, img: "f_kumpir" },
        { time: "13:15", title: "Ortaköy Mosque and the waterfront", location: "Ortaköy", category: "Sightseeing", duration: "45 min", cost: 0, priority: "good", transport: "Walk", notes: "Under the Bosphorus Bridge. Free.", kids: true, img: "ortakoy" },
        { time: "14:30", title: "Back to the hotel, rest", location: "Elysium Hotel, Taksim", category: "Rest", duration: "2 h", cost: 0, priority: "good", transport: "Taxi", notes: "" },
        { time: "19:30", title: "Dinner near the hotel", location: "Taksim", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "", img: "f_copkebab" }
      ]
    }
  ]
};

/* ---------- NON-ACTIVITY BUDGET LINES (INR, whole family) ---------- */
const DEFAULT_BUDGET_LINES = [
  { id: "b1", label: "International flights BOM-IST return x4", group: "Flights", amount: 160000, status: "Estimated", note: "Replace with your actual fare if already booked." },
  { id: "b2", label: "Domestic flight IST-AYT x4", group: "Flights", amount: 28000, status: "Estimated", note: "" },
  { id: "b3", label: "Turkey visas x4 (VFS / e-Visa)", group: "Documents", amount: 25000, status: "Needs confirmation", note: "Indian passports: e-Visa only with a valid US/UK/Schengen/Irish visa or residence permit. Otherwise a sticker visa via VFS." },
  { id: "b4", label: "Travel insurance (family)", group: "Documents", amount: 8000, status: "Estimated", note: "" },
  /* basis lines scale with the plan: amount = rate × units, and editing the amount re-derives the rate */
  { id: "b5", label: "Vera Suites Arapsuyu, 4 nights", labelTpl: "Vera Suites Arapsuyu, {n} nights", basis: "nights:Antalya", rate: 15000, group: "Stay", amount: 60000, status: "Estimated", note: "Booked. ₹15k/night is our estimate, so type in what you actually pay." },
  { id: "b6", label: "Tekkaya Cave Hotel, 3 nights", labelTpl: "Tekkaya Cave Hotel, {n} nights", basis: "nights:Cappadocia", rate: 20000, group: "Stay", amount: 60000, status: "Estimated", note: "Booked. ₹20k/night is our estimate, so type in what you actually pay." },
  { id: "b7", label: "Elysium Hotel Taksim, 4 nights", labelTpl: "Elysium Hotel Taksim, {n} nights", basis: "nights:Istanbul", rate: 17500, group: "Stay", amount: 70000, status: "Estimated", note: "Booked. ₹17.5k/night is your target, so type in what you actually pay." },
  { id: "b8", label: "Rental car, 7 days + one-way fee + full cover", labelTpl: "Rental car, {n} days + one-way fee + full cover", basis: "rentalDays", rate: 7500, group: "Car", amount: 52500, status: "Estimated", note: "Picked up at AYT on arrival night, returned the evening you reach Istanbul. The one-way AYT to IST fee is quoted at booking. Compare suppliers." },
  { id: "b9", label: "Fuel (about 1,690 km, petrol)", labelTpl: "Fuel (about {n} km, petrol)", basis: "km", rate: 11.16, group: "Car", amount: 18900, status: "Estimated", note: "118 L at ₺81 (Kurşunsuz 95, Sep 2026).", noteTpl: "{litres} L at ₺81 (Kurşunsuz 95, Sep 2026), at 7 L/100 km." },
  { id: "b10", label: "Tolls (HGS, billed by the rental company)", group: "Car", amount: 5000, status: "Estimated", note: "Istanbul-Ankara ₺338, Kuzey Marmara Anadolu ₺600, Yavuz Sultan Selim Bridge ₺110, Kuzey Marmara Avrupa about ₺260." },
  { id: "b11", label: "Parking", group: "Car", amount: 5000, status: "Estimated", note: "" },
  { id: "b12", label: "Luggage storage (from the Luggage planner)", group: "Logistics", amount: 0, status: "Estimated", note: "Updates automatically when you change the Luggage planner." },
  { id: "b13", label: "Istanbul transport: Istanbulkart, taxis, 2 minivan transfers", group: "Transport", amount: 15000, status: "Estimated", note: "Minivans IST to Taksim (11 Nov) and Taksim to IST (15 Nov), plus Istanbulkart rides and a few BiTaksi trips." },
  { id: "b14", label: "Breakfasts, snacks, water, tea", group: "Food", amount: 20000, status: "Estimated", note: "" },
  { id: "b15", label: "eSIM / data", group: "Misc", amount: 4000, status: "Estimated", note: "" },
  { id: "b16", label: "Tips", group: "Misc", amount: 6000, status: "Estimated", note: "" },
  { id: "b17", label: "Emergency buffer", group: "Misc", amount: 40000, status: "Estimated", note: "" }
];

/* ---------- KEY DECISIONS (My plan / Finding / Recommended / Why) ---------- */
const DECISIONS = [
  {
    topic: "Luggage (revised after your note)", img: "money_bazaar",
    mine: "Store 1-2 large bags in Istanbul on arrival and travel light.",
    finding: "You're carrying 2 large, 3 small and 2 backpacks. Storing 1 large leaves one large bag for 4 people for {preIstNights} nights, including cold Cappadocia, which is too tight. All 7 pieces fit a C-sedan boot (about 510 L) with the backpacks at your feet (Estimated). Bags only get heavier after the Istanbul shopping, which happens at the end anyway.",
    rec: "Carry everything. Book a C-sedan or mid SUV and pack a foldable duffel for the shopping. Use the Luggage planner to test other mixes.",
    why: "No storage fees, no airport detour, and a full wardrobe for Cappadocia. The only real cost is carrying more up hotel stairs."
  },
  {
    topic: "Cappadocia to Istanbul: driving it", img: "drive_motorway",
    mine: "Drive 730 km on {driveIst}, leaving Tekkaya at 09:00, and return the car at IST.",
    finding: "The drive day costs about ₹15k (rental ₹4.5k, fuel ₹8.1k, tolls ₹2.6k). Flying NAV/ASR to IST would cost about ₹30k for 4 plus a minivan. The Kuzey Marmara motorway ends at IST airport, so dropping the car there means you never drive into the city (Estimated).",
    rec: "Drive, as planned. Break at Tuz Gölü and Ankara, return the car at IST around 19:00, then a pre-booked minivan to Elysium. If the balloon moves to that morning, leave at 10:00.",
    why: "Cheaper than flying, no airport check-in with 7 bags, and the motorway runs straight to the drop-off. The cost is about 9 h in the booster for your 5-year-old, so stop every 90 min."
  },
  {
    topic: "Antalya: Land of Legends and Pamukkale", img: "pamukkale",
    mine: "Land of Legends one day, Pamukkale the next, then the best of the rest.",
    finding: "You land at 23:30, so {antDays} full days in Antalya. Land of Legends is about 55 km east in Belek. Pamukkale is about 245 km away (3 h 15 m each way), and Salda Lake is a short detour on the way (Estimated). The city's Tünektepe cable car has been closed since the April 2024 accident (Traveller-reported).",
    rec: "Land of Legends on {day:ant-legends} (a late start suits the midnight landing), Salda Lake and Pamukkale on {day:ant-pamukkale} with a 06:30 start, then an easy Old Town day before the {driveCap} drive.",
    why: "Putting the 7-hour Pamukkale day in the middle keeps a light day between it and the 7-hour drive to Cappadocia."
  },
  {
    topic: "Cappadocia balloon", img: "hero",
    mine: "Balloon booked for 10 Nov, all 4 of us.",
    finding: "25-35% of November mornings are cancelled (Traveller-reported). Most operators set the minimum age at 6, but yours has confirmed the 5-year-old.",
    rec: "Keep {balloon}. If it's cancelled, rebook for {balloonBackup} and leave for Istanbul at 10:00 instead of 09:00.",
    why: "{balloonChances} the odds of at least one flight to about {balloonOdds} (Estimated, at a 35% cancellation rate)."
  },
  {
    topic: "Istanbul base: Elysium, Taksim", img: "city_istanbul",
    mine: "Elysium Hotel in Taksim (booked), no car.",
    finding: "From Taksim Square the F1 funicular drops to Kabataş in about 3 min. The T1 tram (Sultanahmet, Grand Bazaar, Eminönü) and the ferries (Princes' Islands, Bosphorus) start there. İstiklal Avenue runs flat from Taksim to Galata, but streets south and west of the square are steep.",
    rec: "Buy an Istanbulkart on day one and use the F1, T1 and ferries for the sights. BiTaksi for tired evenings. Taxis rarely have child seats.",
    why: "Every sight in the plan is within about 40 min by public transport, with no parking or traffic stress."
  },
  {
    topic: "Budget", img: "money_lira",
    mine: "₹5-6 lakh all-in.",
    finding: "Researched costs come to about ₹8.5 lakh for the core plan (Estimated), or about ₹6.7 lakh without international flights and visas. The biggest costs are flights, stays, the balloon for all 4, food and the car.",
    rec: "Your hotels and balloon are booked, so type what you actually paid into the budget lines and the numbers firm up. Levers: skip the Basilica Cistern and the Galata Tower ascent (-₹22k), and the optional extras.",
    why: "Numbers are shown as they are, not forced to fit."
  }
];

/* ---------- CAPPADOCIA -> ISTANBUL: DRIVE vs FLY ----------
   Inputs are editable in the app. INR unless noted.
------------------------------------------------------------ */
const DRIVE_VS_FLY = {
  inputs: {
    km: 730, cons: 7.0, fuelTRY: 81, rentalDayINR: 4500,
    tollsTRY: 1308,
    ticketINR: 6500, people: 4, bagFeeINR: 2300, airportDriveKm: 60, transferINR: 3500
  },
  notes: {
    tolls: "O-4 Istanbul-Ankara ₺338 + Kuzey Marmara Anadolu ₺600 + Yavuz Sultan Selim Bridge ₺110 + Kuzey Marmara Avrupa to IST about ₺260 (2026 tariffs, route-dependent).",
    ticket: "TK Nevşehir (NAV) or Kayseri (ASR) to IST one-way, about $55-80 per person (Estimated). AJet/Pegasus from about $30, but they land at SAW (Asian side) and charge for bags.",
    bags: "TK domestic EcoFly allows 15 kg checked per person. Excess costs ₺390 per 3 kg. Pooling on one booking: Needs confirmation.",
    ist: "You stay in Taksim without a car, so on both plans the car is gone before Istanbul: dropped at IST (drive) or at NAV/ASR (fly)."
  },
  time: { drive: "8-9 h driving, about 10.5 h door to door", fly: "About 6 h door to door, 1 h 20 m in the air" }
};

/* ---------- INTELLIGENCE CORNER: RESTAURANTS ----------
   Bar: Google >= 4.3 with >= 300 reviews. Ratings via Wanderlog's
   aggregation of Google + TripAdvisor, checked 19 Sep 2026.
------------------------------------------------------ */
const HALAL_NOTE = "Turkey is mostly Muslim, and meat in mainstream restaurants is generally halal-slaughtered. Few places hold formal certification, though, and many serve alcohol. Unless marked, every place here is \"Traveller-reported\" halal-suitable, not certified. Ask \"Helal mi?\" or look for a HAK / GİMDES certificate.";

const RESTAURANTS = [
  { city: "Antalya", name: "Rokka Pizza Falafel", area: "Kaleiçi (Haşimişcan)", cuisine: "Pizza, falafel, Mediterranean", g: [4.7, 3780], ta: [4.5, 397], price: "₹₹", kids: "Plain pizza, falafel wraps, fries. The easiest meal for the 5-year-old.", alcohol: "Needs confirmation", why: "The best-rated casual spot inside the old town.", img: "f_durum" },
  { city: "Antalya", name: "Paşa Bey Kebap", area: "Gençlik (central)", cuisine: "Kebab, lahmacun, pide", g: [4.6, 2956], ta: [4.5, 192], price: "₹₹", kids: "Chicken şiş, plain pide, rice.", alcohol: "Needs confirmation", why: "Great value. A local favourite.", img: "f_adana" },
  { city: "Antalya", name: "Sıralı Kebap", area: "Lara Cd., Çağlayan", cuisine: "Premium kebab", g: [4.4, 11232], ta: [3.5, 472], price: "₹₹₹", kids: "Non-spicy şiş and köfte (ask for 'acısız').", alcohol: "Needs confirmation", why: "Huge Google volume. Weaker TripAdvisor score (tourists find it pricey).", img: "f_adana3" },
  { city: "Antalya", name: "The Grill House", area: "Kuşkavağı, Konyaaltı seafront", cuisine: "Steaks, grills", g: [4.4, 2112], ta: [4.5, 520], price: "₹₹₹", kids: "Grilled chicken, fries.", alcohol: "Serves alcohol (Traveller-reported)", why: "Walkable from the Konyaaltı base.", img: "f_pirzola" },
  { city: "Antalya", name: "Arma Restaurant", area: "Kaleiçi old harbour", cuisine: "Seafood, Mediterranean", g: [4.4, 1789], ta: [4.0, 652], price: "₹₹₹", kids: "Grilled fish, bread.", alcohol: "Serves alcohol (Traveller-reported)", why: "Harbour-view sunset dinner.", img: "f_fish" },
  { city: "Antalya", name: "Parlak Restaurant", area: "Kaleiçi edge (Zincirli Han)", cuisine: "Charcoal chicken and grills", g: [4.3, 1890], ta: [4.0, 67], price: "₹₹", kids: "Rotisserie chicken, rice.", alcohol: "Needs confirmation", why: "A long-running local institution.", img: "f_tavuk" },
  { city: "Antalya", name: "Seraser Fine Dining", area: "Kaleiçi", cuisine: "Fine dining", g: [4.3, 973], ta: [4.5, 963], price: "₹₹₹₹", kids: "Formal. Better as a couples' treat.", alcohol: "Serves alcohol", why: "Splurge option in an Ottoman mansion.", img: "f_lambshish" },
  { city: "Road trip", name: "Ali Baba Fırın Kebap", area: "Konya, Şemsitebrizi", cuisine: "Konya oven lamb (fırın kebabı)", g: [4.7, 4203], ta: [4.6, 377], price: "₹₹", kids: "Soft lamb on fresh bread. Not spicy.", alcohol: "Unlikely (Konya is conservative)", why: "The top-rated classic, close to the Mevlana Museum.", img: "f_iskender" },
  { city: "Road trip", name: "Kebapçı Dedeler 1929", area: "Konya, Şükran (bazaar)", cuisine: "Oven kebab", g: [4.7, 1066], ta: [4.7, 442], price: "₹₹", kids: "Same dish, cosy bazaar setting.", alcohol: "Unlikely", why: "Strong on both platforms.", img: "f_cag" },
  { city: "Road trip", name: "Sultan Somatı", area: "Konya, Selçuklu", cuisine: "Seljuk and Ottoman set menus", g: [4.8, 7179], ta: [4.9, 1202], price: "₹₹₹", kids: "Big menu, rice dishes.", alcohol: "Needs confirmation", why: "The best-rated in Konya, but a long sit-down.", img: "f_mixedgrill" },
  { city: "Road trip", name: "Celalbey Etliekmek 1985", area: "Konya, Gaziosmanpaşa", cuisine: "Etli ekmek (long meat flatbread)", g: [4.6, 964], ta: [4.9, 379], price: "₹", kids: "Kids love the long crispy flatbread.", alcohol: "Unlikely", why: "A quick, cheap, very local lunch.", img: "f_adana2" },
  { city: "Road trip", name: "Tarihi Mithat Tirit", area: "Konya, Aziziye", cuisine: "Tirit (meat, bread, yoghurt)", g: [4.4, 6344], ta: [4.2, 771], price: "₹", kids: "Mild yoghurt dish.", alcohol: "Unlikely", why: "Family-run specialist since 1988.", img: "f_alinazik" },
  { city: "Road trip", name: "Hacı Şükrü 1907", area: "Konya, Ferhuniye", cuisine: "Oven kebab, pide", g: [4.3, 2007], ta: [4.5, 717], price: "₹₹", kids: "Plain pide.", alcohol: "Unlikely", why: "Historic, run by the 4th generation.", img: "f_shish" },
  { city: "Cappadocia", name: "CANCAN Cafe & Restaurant", area: "Göreme", cuisine: "Indian-Turkish fusion, home-style", g: [4.8, 2382], ta: [5.0, 582], price: "₹₹", kids: "Familiar Indian flavours after days of kebab.", alcohol: "Needs confirmation", why: "Rare Indian-friendly option with excellent ratings.", img: "f_tavuk2" },
  { city: "Cappadocia", name: "Nazar Börek & Cafe", area: "Göreme", cuisine: "Börek, gözleme, lahmacun", g: [4.8, 1468], ta: [4.6, 847], price: "₹", kids: "Cheese börek and gözleme (like a Turkish paratha).", alcohol: "Needs confirmation", why: "Best cheap lunch. Family-run.", img: "f_tavukdoner" },
  { city: "Cappadocia", name: "Oscar Steak House", area: "Göreme (rooftop)", cuisine: "Steaks, grills", g: [4.8, 4142], ta: [5.0, 3519], price: "₹₹₹", kids: "Grilled chicken. The live music can be loud.", alcohol: "Serves alcohol (Traveller-reported)", why: "Rooftop views of the fairy chimneys.", img: "f_ocakbasi" },
  { city: "Cappadocia", name: "Cappadocian Cuisine", area: "Göreme, Uzundere Cd.", cuisine: "Regional, pottery kebab", g: [4.7, 2923], ta: [4.5, 2456], price: "₹₹", kids: "Pottery kebab with rice.", alcohol: "Needs confirmation", why: "Best-value testi (pottery) kebab, served by the family.", img: "f_testi" },
  { city: "Cappadocia", name: "İnci Cave Restaurant", area: "Göreme, Orta Mh.", cuisine: "Refined Turkish, lamb testi kebab", g: [4.7, 1991], ta: [4.5, 881], price: "₹₹₹", kids: "Quieter cave setting.", alcohol: "Serves alcohol (Traveller-reported)", why: "The special-dinner pick.", img: "f_shish2" },
  { city: "Cappadocia", name: "Pumpkin Göreme", area: "Göreme", cuisine: "Seasonal set menu", g: [4.7, 895], ta: [4.5, 2042], price: "₹₹₹", kids: "Fixed menu, so ask about a kids' plate.", alcohol: "Needs confirmation", why: "Small, so book ahead.", img: "f_copkebab" },
  { city: "Cappadocia", name: "Topdeck Cave", area: "Göreme, Aydınlı", cuisine: "Home-style cave restaurant", g: [4.6, 2000], ta: [4.5, 2779], price: "₹₹", kids: "Warm, relaxed service.", alcohol: "Serves alcohol (Traveller-reported)", why: "Consistently loved and small, so reserve.", img: "f_gerashi" },
  { city: "Cappadocia", name: "Turkish Ravioli Restaurant", area: "Göreme, Aydınlı", cuisine: "Mantı dumplings", g: [4.6, 1461], ta: [4.5, 979], price: "₹₹", kids: "Mantı without garlic yoghurt for the little one.", alcohol: "Needs confirmation", why: "A different dish from the kebabs.", img: "f_testi" },
  { city: "Cappadocia", name: "Seten Restaurant", area: "Göreme (Anatolian Houses)", cuisine: "Anatolian, Michelin-listed", g: [4.5, 4543], ta: [4.5, 2452], price: "₹₹₹", kids: "Panoramic terrace.", alcohol: "Serves alcohol (Traveller-reported)", why: "The views and the Michelin mention.", img: "f_lambshish2" },
  { city: "Cappadocia", name: "Aysel'in Mutfağı", area: "Göreme, Müze Sk.", cuisine: "Home cooking, pottery beef", g: [4.5, 3191], ta: [4.5, 804], price: "₹₹", kids: "Generous bread, clay-grilled köfte.", alcohol: "Needs confirmation", why: "A warm, family-style place.", img: "f_kofte" },
  { city: "Cappadocia", name: "Old Cappadocia", area: "Göreme, İçeridere", cuisine: "Regional, beef pottery kebab", g: [4.5, 3230], ta: [4.5, 2070], price: "₹₹", kids: "Has a vegetarian testi kebab too.", alcohol: "Needs confirmation", why: "Reliable.", img: "f_testi" },
  { city: "Cappadocia", name: "Millocal", area: "Uçhisar", cuisine: "Modern Turkish", g: [4.3, 2812], ta: [4.4, 662], price: "₹₹₹", kids: "Elegant setting.", alcohol: "Serves alcohol (Traveller-reported)", why: "If you stay in Uçhisar.", img: "f_pirzola2" },
  { city: "Istanbul", name: "Beyti", area: "Florya (airport side)", cuisine: "Legendary kebab house", g: [4.6, 5054], ta: [4.5, 813], price: "₹₹₹", kids: "Grilled chicken, pilav.", alcohol: "Needs confirmation", why: "Birthplace of the Beyti kebab. Handy on an airport day.", img: "f_beyti" },
  { city: "Istanbul", name: "Bayramoğlu Döner", area: "Beykoz (Asian side)", cuisine: "Döner specialist", g: [4.5, 30126], ta: [4.5, 753], price: "₹₹", kids: "Döner plate with rice and fries.", alcohol: "Unlikely", why: "30k+ Google reviews. Near the Kuzey Marmara route on the drive into Istanbul.", img: "f_donerspit" },
  { city: "Istanbul", name: "Matbah", area: "Sultanahmet", cuisine: "Ottoman palace cuisine", g: [4.5, 1377], ta: [4.5, 1896], price: "₹₹₹", kids: "Mild rice and meat dishes.", alcohol: "Needs confirmation", why: "Best-rated sit-down on the Hagia Sophia day.", img: "f_islim" },
  { city: "Istanbul", name: "Cafe Privato", area: "Galata", cuisine: "Turkish breakfast, home cooking", g: [4.4, 2596], ta: [4.5, 987], price: "₹₹", kids: "Big village breakfast spread.", alcohol: "Needs confirmation", why: "A great breakfast before Galata.", img: "f_breakfast" },
  { city: "Istanbul", name: "Yeni Lokanta", area: "Beyoğlu", cuisine: "Modern Anatolian", g: [4.8, 2528], ta: [4.5, 568], price: "₹₹₹₹", kids: "Upscale, better for adults.", alcohol: "Serves alcohol", why: "Top-rated farewell splurge.", img: "f_pirzola3" },
  { city: "Istanbul", name: "Aheste", area: "Pera, Beyoğlu", cuisine: "Meze, Turkish / Middle Eastern", g: [4.6, 1998], ta: [4.5, 590], price: "₹₹₹", kids: "Sharing plates.", alcohol: "Serves alcohol", why: "", img: "f_shawarma" },
  { city: "Istanbul", name: "Tatar Salim", area: "Ataşehir (Asian side)", cuisine: "Döner, lentil soup, rice pudding", g: [4.3, 9144], ta: [4.0, 438], price: "₹₹", kids: "Soup, rice pudding, simple döner.", alcohol: "Unlikely", why: "A local family canteen.", img: "f_doner" },
  { city: "Istanbul", name: "Karaköy Lokantası", area: "Karaköy", cuisine: "Meze, Ottoman home cooking", g: [4.3, 3105], ta: null, price: "₹₹₹", kids: "Lunch is the family-friendly canteen service.", alcohol: "Serves alcohol in the evenings", why: "Near the recommended Karaköy base.", img: "f_mixedgrill" }
];

/* Sweets & Turkish delicacies (ratings via Wanderlog's Google/TripAdvisor aggregation, 20 Sep 2026) */
const SWEETS = [
  { name: "Baklava", tr: "baklava", img: "s_baklava",
    what: "Paper-thin pastry layers with pistachio or walnut, soaked in syrup. Order by weight and try the 'havuç dilimi' (carrot-slice) cut.",
    kids: "Very sweet and nutty. Share a small plate, and check for nut allergies.",
    home: "Travels well (ask for a sealed box)",
    places: [
      { n: "Karaköy Güllüoğlu", a: "Karaköy", g: [4.4, 27954], ta: [4.5, 1820] },
      { n: "Hafız Mustafa 1864", a: "Sirkeci / Sultanahmet", g: [4.7, 47271], ta: [4.5, 7407] },
      { n: "Baklavacı Diyar Usta", a: "Sirkeci", g: [4.8, 1285] }
    ],
    plan: "Karaköy Güllüoğlu is steps from the recommended Karaköy base. Hafız Mustafa is already in the plan on the Sultanahmet day." },
  { name: "Turkish delight", tr: "lokum", img: "s_lokum",
    what: "Soft, chewy cubes of starch and sugar flavoured with rose, pomegranate, lemon or packed with pistachio. Most shops let you taste first.",
    kids: "The 5-year-old favourite: soft, not too sweet, easy to eat.",
    home: "Best gift to carry home: light and lasts for weeks",
    places: [
      { n: "Ali Muhiddin Hacı Bekir", a: "Eminönü (since 1777)", g: [4.3, 866] },
      { n: "Lokum Atölyesi", a: "Fatih", g: [4.4, 354] },
      { n: "Hafız Mustafa 1864", a: "several branches", g: [4.7, 47271] }
    ],
    plan: "Hacı Bekir is a short walk from the Spice Bazaar, so pair it with the Topkapı and Spice Bazaar day. Traditional lokum has no gelatine, but check the label on cheap tourist boxes (Traveller-reported)." },
  { name: "Künefe", tr: "künefe", img: "s_kunefe",
    what: "Crispy shredded pastry baked around melted stretchy cheese, soaked in syrup and topped with pistachio. Served straight from the oven.",
    kids: "Cheesy and sweet, so kids usually love it. It arrives very hot, so let it cool a minute.",
    home: "Eat it fresh, it doesn't travel",
    places: [
      { n: "Keyfeder Künefe Katmer", a: "Beyoğlu", g: [4.6, 1905], ta: [4.5, 29] },
      { n: "Lezzet-i Şark Antep Sofrası", a: "Eminönü, by the Spice Bazaar", g: [4.4, 2132], ta: [4.5, 201] },
      { n: "Gaziantep Közde Künefe", a: "Fatih", g: [4.5, 2475] }
    ],
    plan: "Lezzet-i Şark sits right by the Spice Bazaar, ideal after the Spice Bazaar walk. One portion easily serves two." },
  { name: "Turkish ice cream", tr: "Maraş dondurma", img: "s_dondurma",
    what: "Thick, stretchy ice cream made with salep and mastic, so it barely melts. Vendors put on a trick show, snatching the cone back again and again.",
    kids: "Peak entertainment for a 5-year-old, and the 13-year-old will film it.",
    home: "Eat it on the spot",
    places: [
      { n: "Mado", a: "Sultanahmet and other branches", g: [4.0, 4787] },
      { n: "Meşhur Dondurmacı Ali Usta", a: "Moda, Kadıköy (since 1969)", g: [4.0, 8233], ta: [3.5, 158] },
      { n: "Street vendors", a: "İstiklal Avenue, Sultanahmet", g: null }
    ],
    plan: "Ratings sit below our 4.3 bar because you come for the show, not a gourmet scoop. Catch a vendor on İstiklal or in Sultanahmet." }
];

const RESTAURANTS_BELOW_BAR = [
  { city: "Antalya", name: "7 Mehmet", g: [4.1, 10607], note: "An icon with a great Konyaaltı view, but ratings slipped." },
  { city: "Antalya", name: "Günaydın Kebap & Steakhouse", g: [4.1, 2141], note: "Has a kids' play area. That may still be worth it." },
  { city: "Antalya", name: "Topçu Kebap (since 1885)", g: [4.2, 2821], note: "Historic döner." },
  { city: "Road trip", name: "Bolu Lokantası (Konya)", g: null, note: "Recent sources say it's closed. Don't go without checking." },
  { city: "Cappadocia", name: "Dibek", g: [3.9, 1263], note: "Marked permanently closed on Wanderlog (Needs confirmation)." },
  { city: "Cappadocia", name: "Fat Boys", g: [4.1, 1117], note: "Backpacker comfort food." },
  { city: "Istanbul", name: "Hamdi (Eminönü)", g: [3.9, 8239], note: "Famous view. Reviews say overpriced and rushed." },
  { city: "Istanbul", name: "Tarihi Sultanahmet Köftecisi Selim Usta", g: [4.1, 10124], note: "Still the easiest kid meal in Sultanahmet." },
  { city: "Istanbul", name: "Şehzade Cağ Kebap", g: [4.2, 10212], note: "Authentic wood-fire cağ kebab, TripAdvisor 4.5." },
  { city: "Istanbul", name: "Zübeyir Ocakbaşı", g: [4.2, 4456], note: "Popular grill near Taksim." },
  { city: "Istanbul", name: "Çiya Sofrası (Kadıköy)", g: [4.0, 13618], note: "Loved by food writers, mixed on Google." }
];

/* ---------- INTELLIGENCE CORNER: ACTIVITIES ---------- */
const ACTIVITIES = [
  {
    name: "Hot-air balloon (standard shared basket)", city: "Cappadocia", img: "hero", who: "2 adults (13-year-old eligible, 5-year-old not)",
    age: "Minimum age 6 at most operators (Traveller-reported). The child must see over the basket (about 120 cm).",
    best: "Direct or BalloonScanner for price. Klook if you want INR billing and reward points.",
    tip: "November runs 10-25% below peak prices. Book the first morning to keep two backup mornings.",
    rows: [
      { p: "Klook", inr: "about ₹24,000", note: "Transfers, breakfast, certificate", status: "Traveller-reported", url: "https://www.klook.com/en-IN/activity/11336-hot-air-balloon-flight-cappadocia/" },
      { p: "GetYourGuide", inr: "₹16,500-24,000", note: "€150-220 shared basket", status: "Estimated", url: "https://www.getyourguide.com/cappadocia-l1400/hot-air-balloon-rides-tc81/" },
      { p: "Viator", inr: "₹16,500-26,000", note: "Watch for 'from' prices that exclude fees", status: "Estimated", url: "https://www.viator.com/en-IN/Cappadocia-tours/Balloon-Rides/d5609-g1-c3" },
      { p: "Direct / BalloonScanner", inr: "₹16,000-24,000", note: "Comfort baskets (12-16 pax) run ₹27k-50k", status: "Estimated", url: "https://balloonscanner.com/en" }
    ]
  },
  {
    name: "Sunset horse riding (Rose / Red Valley)", city: "Cappadocia", img: "horse", who: "Whole family",
    age: "The 5-year-old will likely ride a led pony or ride with a guide. Confirm with the ranch.",
    best: "GetYourGuide (clear 1 h / 2 h options, free cancellation).",
    tip: "Pick 1 h, not 2 h, with a 5-year-old. Sunset in November is about 17:30.",
    rows: [
      { p: "Klook", inr: "₹3,300-6,600", note: "Sunrise or daytime ride, transfers included", status: "Estimated", url: "https://www.klook.com/en-CA/activity/132453-sunrise-or-daytime-horse-riding-tour-in-cappadocia/" },
      { p: "GetYourGuide", inr: "₹3,300-6,600", note: "1 or 2 h, sunset option", status: "Estimated", url: "https://www.getyourguide.com/cavusin-l120995/cappadocia-sunset-horse-riding-tour-t403933/" },
      { p: "Viator", inr: "₹3,300-6,600", note: "Sunrise / sunset / daytime", status: "Estimated", url: "https://www.viator.com/tours/Goreme/Cappadocia-Horse-Riding-Experience-Sunrise-Sunset-Daytime/d23271-360280P140" },
      { p: "Direct (ranch)", inr: "₹2,500-5,000", note: "Walk in the day before. Often cash.", status: "Traveller-reported", url: "https://www.google.com/maps/search/?api=1&query=horse+ranch+Goreme" }
    ]
  },
  {
    name: "Kaymaklı / Derinkuyu Underground City", city: "Cappadocia", img: "kaymakli", who: "Whole family",
    age: "All ages. Under-8s free at state museums (Verified).",
    best: "Direct at the gate, self-drive. Museum Card accepted.",
    tip: "A 'Green Tour' (Klook/GYG) bundles Derinkuyu with Ihlara Valley and lunch. It's a very long day for a 5-year-old.",
    rows: [
      { p: "Direct (gate)", inr: "about ₹1,430", note: "About €13 per adult or teen", status: "Traveller-reported", url: "https://muze.gen.tr/" },
      { p: "Klook / GYG Green Tour", inr: "₹4,400-6,600", note: "Full day incl. ticket and lunch", status: "Estimated", url: "https://www.getyourguide.com/kaymakli-underground-city-l93416/" }
    ]
  },
  {
    name: "Göreme Open-Air Museum", city: "Cappadocia", img: "goreme_oam", who: "Adults + 13-year-old",
    age: "Under-8s free.", best: "Direct.", tip: "Go at 10:30 after the balloon rush. The Dark Church is +€6.",
    rows: [ { p: "Direct (gate / muze.gen.tr)", inr: "about ₹2,200", note: "€20", status: "Traveller-reported", url: "https://muze.gen.tr/" } ]
  },
  {
    name: "Avanos pottery class", city: "Cappadocia", img: "pottery", who: "Kids + adults",
    age: "All ages.", best: "GetYourGuide or Viator for a real hands-on class.",
    tip: "Free 'workshop demos' at big shops end in a hard sell (Traveller-reported).",
    rows: [
      { p: "GetYourGuide", inr: "₹2,000-4,000", note: "Hands-on class with transfers", status: "Estimated", url: "https://www.getyourguide.com/avanos-l983/cappadocia-historical-pottery-making-class-with-transfers-t686386/" },
      { p: "Viator", inr: "from about ₹900", note: "'From' price, so check what's included", status: "Traveller-reported", url: "https://www.viator.com/Cappadocia-tours/Pottery-Classes/d5609-g26051-c32012" }
    ]
  },
  {
    name: "ATV / quad at sunset", city: "Cappadocia", img: "atv", who: "13-year-old + adult",
    age: "Kids ride as passengers only. Around 6+ at many operators (Traveller-reported).",
    best: "GetYourGuide.", tip: "Dusty and cold in November. Bring a buff or scarf.",
    rows: [ { p: "GetYourGuide", inr: "₹3,300-5,500 per ATV", note: "1-2 h", status: "Estimated", url: "https://www.getyourguide.com/cappadocia-l1400/quad-atv-tours-tc38/" } ]
  },
  {
    name: "Olympos Teleferik (Tahtalı summit cable car)", city: "Antalya", img: "tahtali", who: "Whole family",
    age: "Child discount for ages 6-11. Reports differ on under-6s (Needs confirmation).",
    best: "Direct at the base (self-drive).",
    tip: "Only go if the summit is clear, so check the webcam. The city's Tünektepe cable car is CLOSED.",
    rows: [
      { p: "Direct", inr: "about ₹4,500", note: "About €41 per adult", status: "Traveller-reported", url: "https://www.google.com/maps/search/?api=1&query=Olympos+Teleferik" },
      { p: "GetYourGuide / Viator", inr: "about ₹6,000+", note: "€55+ with hotel transfer", status: "Estimated", url: "https://www.getyourguide.com/olympos-teleferik-cable-car-l177712/" }
    ]
  },
  {
    name: "Aspendos theatre / Perge ruins", city: "Antalya", img: "aspendos", who: "Adults + 13-year-old",
    age: "Under-8s free.", best: "Direct (self-drive, east of Antalya).", tip: "The backup for a rainy or cloudy Olympos day.",
    rows: [ { p: "Direct", inr: "₹1,650 / ₹1,200", note: "Aspendos €15, Perge €11", status: "Traveller-reported", url: "https://muze.gen.tr/" } ]
  },
  {
    name: "Hagia Sophia (visitor gallery)", city: "Istanbul", img: "d11", who: "Whole family",
    age: "Under-8s free with ID (Verified).", best: "Direct. Book a guide only if you want the story told.",
    tip: "Go at 09:00. Closed to visitors during prayers, and Friday midday is the worst.",
    rows: [
      { p: "Direct", inr: "about ₹2,750", note: "€25", status: "Verified", url: "https://muze.gen.tr/" },
      { p: "Klook", inr: "about ₹3,400 (combo)", note: "Blue Mosque + Hagia Sophia + Topkapı guided with lunch, US$35 (tickets may be extra)", status: "Needs confirmation", url: "https://www.klook.com/en-US/activity/112214-hagia-sophia-guided-tour-with-optional-ticket/" }
    ]
  },
  {
    name: "Topkapı Palace (incl. Harem)", city: "Istanbul", img: "d13", who: "Whole family",
    age: "Under-8s free.", best: "Direct. Klook's guided skip-the-line is worth it for the 13-year-old.",
    tip: "Closed on Tuesdays. Do the Treasury, Harem and Bosphorus terrace, not everything.",
    rows: [
      { p: "Direct", inr: "about ₹6,050", note: "About €55 incl. Harem", status: "Traveller-reported", url: "https://muze.gen.tr/" },
      { p: "Klook", inr: "about ₹5,900", note: "Skip-the-line + guide, US$61.75 (sale)", status: "Traveller-reported", url: "https://www.klook.com/en-IN/search/result/?query=topkapi" },
      { p: "GetYourGuide", inr: "₹6,000-8,000", note: "Guided tours", status: "Estimated", url: "https://www.getyourguide.com/topkapi-palace-l3534/" }
    ]
  },
  {
    name: "Dolmabahçe Palace", city: "Istanbul", img: "d14", who: "Whole family",
    age: "6 and under free (Verified).", best: "Direct.", tip: "Closed on Mondays. Timed, guided flow inside.",
    rows: [
      { p: "Direct", inr: "about ₹4,400", note: "About €40", status: "Verified", url: "https://www.google.com/maps/search/?api=1&query=Dolmabahce+Palace" },
      { p: "Klook", inr: "about ₹4,600", note: "US$47.99 ticket", status: "Traveller-reported", url: "https://www.klook.com/en-IN/search/result/?query=dolmabahce" }
    ]
  },
  {
    name: "Bosphorus cruise", city: "Istanbul", img: "bosphorus", who: "Whole family",
    age: "All ages.", best: "The Şehir Hatları public ferry is the best value. Klook or GYG for a guided or sunset upgrade.",
    tip: "Sit on the right (European side) heading north for the palaces.",
    rows: [
      { p: "Şehir Hatları (public)", inr: "₹240-400", note: "₺120-200, short or long tour", status: "Traveller-reported", url: "https://sehirhatlari.istanbul/en/price-list/bosphorus-tours-78" },
      { p: "Klook", inr: "₹600-2,500", note: "2 h guided cruise, audio guide", status: "Estimated", url: "https://www.klook.com/en-US/activity/123626-bosphorus-guided-sightseeing-cruise/" },
      { p: "GetYourGuide", inr: "₹580-4,100", note: "US$6-43 incl. sunset yacht", status: "Traveller-reported", url: "https://www.getyourguide.com/bosphorus-strait-l25615/" }
    ]
  },
  {
    name: "Galata Tower / Basilica Cistern", city: "Istanbul", img: "cistern", who: "Optional",
    age: "", best: "Direct.", tip: "The two together cost about ₹22k for the family. The first cut if you're over budget.",
    rows: [ { p: "Direct", inr: "₹3,300 / ₹4,200", note: "Galata €30, Cistern €38", status: "Traveller-reported", url: "https://www.google.com/maps/search/?api=1&query=Galata+Tower" } ]
  }
];

/* ---------- INTELLIGENCE CORNER: STAYS & LOCATION ---------- */
const LOCATION_DIMENSIONS = [
  ["walk", "Walk to sights"], ["transit", "Transit"], ["flat", "Flat for kids"], ["parking", "Parking"],
  ["food", "Food nearby"], ["quiet", "Quiet nights"], ["access", "Road / airport"], ["view", "Views"]
];

const MICRO_LOCATIONS = [
  { city: "Antalya", name: "Konyaaltı: Arapsuyu / Altınkum beach strip", verdict: "best", img: "s_konyaalti",
    s: { walk: 3, transit: 3, flat: 5, parking: 5, food: 4, quiet: 4, access: 5, view: 5 },
    good: "Flat promenade, 7 km beach, Beach Park and the Aquarium (rain plan). The D400 to Olympos and Phaselis is on your doorstep. Buildings usually have parking.",
    bad: "15 min drive to Kaleiçi. Parts of the beachfront are quiet in November.",
    tips: "Look for 'otopark' (parking) in the listing and a sea-view balcony. Stay within 300 m of the promenade." },
  { city: "Antalya", name: "Kaleiçi edge: Haşimişcan / Selçuk / Barbaros", verdict: "good", img: "city_antalya",
    s: { walk: 5, transit: 4, flat: 3, parking: 3, food: 5, quiet: 3, access: 3, view: 4 },
    good: "Walk into the old town and harbour. The most restaurants.",
    bad: "Limited parking. Some cobbles and steps.",
    tips: "Confirm a dedicated parking space in writing." },
  { city: "Antalya", name: "Kaleiçi (inside the walls)", verdict: "avoid", img: "s_kaleici",
    s: { walk: 5, transit: 3, flat: 2, parking: 1, food: 5, quiet: 2, access: 1, view: 4 },
    good: "Atmospheric boutique houses (e.g. Ottoman House, Airbnb 4.9).",
    bad: "Cars restricted, no parking, cobbles, stairs, bar noise. Wrong for a car trip with 7 bags.",
    tips: "Only if the host guarantees parking and luggage help." },
  { city: "Antalya", name: "Lara: Güzeloba / Çağlayan", verdict: "good", img: "s_lara",
    s: { walk: 2, transit: 3, flat: 5, parking: 5, food: 4, quiet: 4, access: 5, view: 3 },
    good: "10-15 min from the airport, near the Lower Düden falls, Sıralı Kebap and the beaches.",
    bad: "On the wrong side for Olympos and Kemer (+30 min each way). Resort-hotel feel.",
    tips: "Good if you'd rather be near the airport." },
  { city: "Cappadocia", name: "Göreme: upper slopes (Aydınlı / Orta Mahalle)", verdict: "best", img: "s_goreme",
    s: { walk: 5, transit: 4, flat: 2, parking: 3, food: 5, quiet: 4, access: 4, view: 5 },
    good: "Balloons launch right over the village. Walk to 20+ restaurants. Horse ranches nearby.",
    bad: "Steep lanes. Parking on slopes can be tight.",
    tips: "Ask for a 'family cave room/suite with private terrace'. Confirm parking and luggage help." },
  { city: "Cappadocia", name: "Uçhisar", verdict: "good", img: "s_uchisar",
    s: { walk: 3, transit: 3, flat: 3, parking: 4, food: 3, quiet: 5, access: 4, view: 5 },
    good: "Quiet and upscale, with sunset views of Pigeon Valley and the castle.",
    bad: "Balloons are further away. Fewer casual kid-friendly places. 7 min drive to Göreme.",
    tips: "Great with a car." },
  { city: "Cappadocia", name: "Ortahisar", verdict: "good", img: "s_ortahisar",
    s: { walk: 3, transit: 2, flat: 3, parking: 4, food: 3, quiet: 5, access: 4, view: 4 },
    good: "Authentic and central, often under the balloons. Whole cave houses for families.",
    bad: "Fewer restaurants, so you'll drive for dinner.",
    tips: "Patisca Cave House (below) sleeps 9 and has 634 reviews." },
  { city: "Cappadocia", name: "Çavuşin", verdict: "ok", img: "s_cavusin",
    s: { walk: 2, transit: 2, flat: 3, parking: 4, food: 2, quiet: 5, access: 4, view: 4 },
    good: "Next to the Rose and Red Valley horse trails.", bad: "Very few places to eat.", tips: "" },
  { city: "Istanbul", name: "Karaköy-Tophane (flat strip on the T1 tram)", verdict: "best", img: "s_karakoy",
    s: { walk: 4, transit: 5, flat: 4, parking: 2, food: 5, quiet: 3, access: 4, view: 4 },
    good: "T1 to Sultanahmet in about 12 min and to the Grand Bazaar. Walk to Galataport and the ferries. Huge food choice.",
    bad: "Parking is scarce and pricey (car days), and some streets are lively late.",
    tips: "Stay downhill of Galata. Ask about İSPARK or a garage for the car nights." },
  { city: "Istanbul", name: "Sultanahmet / Cankurtaran", verdict: "good", img: "s_sultanahmet",
    s: { walk: 5, transit: 5, flat: 4, parking: 2, food: 3, quiet: 4, access: 3, view: 4 },
    good: "Walk to Hagia Sophia, the Blue Mosque and Topkapı. Quiet at night.",
    bad: "Touristy, weaker restaurants, quiet evenings. Driving in is painful.", tips: "" },
  { city: "Istanbul", name: "Üsküdar (Asian side)", verdict: "ok", img: "s_uskudar",
    s: { walk: 2, transit: 5, flat: 3, parking: 3, food: 4, quiet: 4, access: 4, view: 5 },
    good: "Marmaray to Sirkeci is about 4 min. Ferries, Bosphorus views and local life.",
    bad: "You cross the water every sightseeing day.", tips: "E.g. 'Top 1% Home, Wake Up by the Bosphorus' (5.0, 136 reviews)." },
  { city: "Istanbul", name: "Cihangir / Galata hill", verdict: "avoid", img: "s_cihangir",
    s: { walk: 4, transit: 4, flat: 1, parking: 1, food: 5, quiet: 3, access: 3, view: 5 },
    good: "Stunning Bosphorus views, charming.",
    bad: "Very steep stepped streets. Hard with a 5-year-old and shopping bags. No parking.",
    tips: "Many top-rated Istanbul listings are here, so filter them out." },
  { city: "Istanbul", name: "Zeytinburnu (sea side)", verdict: "ok", img: "s_zeytinburnu",
    s: { walk: 1, transit: 4, flat: 5, parking: 5, food: 3, quiet: 4, access: 5, view: 4 },
    good: "Free parking, seafront, on the same T1 line (about 30 min to Sultanahmet). Easy for car days.",
    bad: "Far from the evening buzz.", tips: "Practical if you keep the car." }
];

const LISTINGS = [
  { city: "Antalya", name: "Los Suites, Deluxe Suite", platform: "Airbnb", area: "Muratpaşa", rating: "4.95", reviews: 184, beds: "2 BR, 2 bath, 85 m², balcony", micro: "Check the exact street (Muratpaşa is big)", fit: "Good. Aparthotel with 24/7 reception, which helps with a midnight check-in." },
  { city: "Antalya", name: "Downtown Oasis", platform: "Airbnb", area: "Near Konyaaltı Beach Park", rating: "4.97", reviews: 113, beds: "3 BR, 145 m²", micro: "2 km from Beach Park, close to the recommended area", fit: "Strong. Confirm parking." },
  { city: "Antalya", name: "Ultra Lux Home", platform: "Airbnb", area: "Muratpaşa (airport side)", rating: "4.92", reviews: 101, beds: "3 BR, 160 m²", micro: "15 min from the airport, 5 min walk to the sea (likely Lara)", fit: "Good for the late arrival. Further from Olympos." },
  { city: "Antalya", name: "Ottoman House", platform: "Airbnb", area: "Kaleiçi (Hadrian's Gate)", rating: "4.9", reviews: 298, beds: "3 BR, terrace, BBQ", micro: "Inside the walls, so parking is a problem", fit: "Beautiful but impractical with a car and 7 bags." },
  { city: "Antalya", name: "Apartment 8 (2+1)", platform: "Airbnb", area: "Konyaaltı", rating: "4.57", reviews: 7, beds: "2 BR, sleeps 6, 50 m from the beach", micro: "Right location", fit: "Too few reviews to trust. Verify carefully." },
  { city: "Cappadocia", name: "Kelebek Cave Hotel", platform: "Booking", area: "Göreme upper slope", rating: "9.4/10", reviews: null, beds: "Family cave rooms, multiple terraces", micro: "The best balloon-view zone", fit: "Top pick (luxury tier). Shares terraces with Sultan Cave Suites." },
  { city: "Cappadocia", name: "Sultan Cave Suites", platform: "Direct / Booking", area: "Göreme upper slope", rating: "Superb (Booking band)", reviews: null, beds: "Suites for 4", micro: "The famous rooftop photo terrace", fit: "Premium price. The rooftop gets crowded at dawn." },
  { city: "Cappadocia", name: "Balloons View @ VCH (Village Cave House)", platform: "Airbnb", area: "Göreme", rating: "4.98", reviews: 579, beds: "Arched stone suites, family-friendly", micro: "Göreme centre", fit: "Excellent mid-range value." },
  { city: "Cappadocia", name: "Patisca Cave House", platform: "Airbnb", area: "Ortahisar", rating: "4.91", reviews: 634, beds: "Whole villa, 4 rooms, sleeps 9, terrace", micro: "Central, quiet, under the balloons", fit: "Best for privacy and space. Has a kitchen." },
  { city: "Cappadocia", name: "Simple House", platform: "Airbnb", area: "Uçhisar", rating: "4.97", reviews: 254, beds: "2 BR, fireplace, terrace + BBQ", micro: "Valley views", fit: "Cosy and homely. You'll drive to dinner." },
  { city: "Cappadocia", name: "Luvi / Zara / Hera Cave Hotels", platform: "Booking", area: "Göreme", rating: "Exceptional / Superb", reviews: null, beds: "Family rooms available", micro: "Göreme", fit: "Mid-range alternatives to compare prices." },
  { city: "Istanbul", name: "Heart of Cihangir, 2 BR charming apartment", platform: "Airbnb", area: "Cihangir", rating: "4.88", reviews: 133, beds: "2 BR", micro: "Steep hill (see scorecard)", fit: "Great reviews, poor terrain for your family." },
  { city: "Istanbul", name: "Deluxe Duplex w/ 210° Bosphorus View", platform: "Airbnb", area: "Cihangir, near Galataport", rating: "4.98", reviews: 249, beds: "Duplex", micro: "Hill, but close to Galataport and the T1", fit: "Check the stairs inside the duplex and the walk to Tophane." },
  { city: "Istanbul", name: "Luxury Balcony Apt. opposite Galata Tower", platform: "Airbnb", area: "Galata", rating: "4.96", reviews: 163, beds: "Historic building", micro: "Busy, noisy lanes", fit: "Photogenic. Check the noise reviews." },
  { city: "Istanbul", name: "Top 1% Home, Wake Up by the Bosphorus", platform: "Airbnb", area: "Üsküdar", rating: "5.0", reviews: 136, beds: "Check the bedroom count", micro: "Asian side, Marmaray", fit: "Serene, with a longer daily commute." },
  { city: "Istanbul", name: "Ottomare Luxury Suite, sea view", platform: "Airbnb", area: "Zeytinburnu", rating: "4.99", reviews: 102, beds: "Suite, jacuzzi, free parking", micro: "Seafront, metro/tram", fit: "Practical for car nights. Far from the evening buzz." }
];

/* ---------- INTELLIGENCE CORNER: DRIVING ---------- */
const DRIVING = {
  fuel: {
    grade: "Kurşunsuz Benzin 95 (unleaded 95), usually just 'Kurşunsuz' or 'Benzin'",
    avoid: "NEVER Motorin / Dizel (diesel) or LPG / Otogaz. Pump colours vary by brand, so read the label, not the colour.",
    priceTRY: 81, priceNote: "Kurşunsuz 95 averages about ₺80-82/L (Sep 2026). Diesel about ₺81-91/L. Prices change weekly.",
    status: "Traveller-reported",
    howto: [
      "Stations are full-service. Say \"Kurşunsuz, full lütfen\" (unleaded, full please), or name an amount in lira.",
      "Pay by card at the pump terminal. Choose TRY if you're offered your home currency (DCC).",
      "Big brands (Opet, Shell, Petrol Ofisi, BP, TP) have clean toilets, a market and a café. Good kid stops.",
      "Fill up before the Taurus pass (Antalya to Konya) and before Tuz Gölü, where stations thin out."
    ]
  },
  booster: {
    verdict: "Yes. It's the law, and it applies to your car.",
    law: [
      { h: "The rule", t: "Karayolları Trafik Yönetmeliği (Highway Traffic Regulation) Article 150: in cars, children under 150 cm AND under 36 kg must use a child restraint suited to their weight.", s: "Verified" },
      { h: "The only exception", t: "Children taller than 135 cm may use the normal adult belt, and only in the back seat. A typical 5-year-old is about 110 cm and 18-19 kg (WHO growth charts), nowhere near 135 cm.", s: "Verified" },
      { h: "On mum's lap", t: "Not allowed. A lap isn't a restraint, and one adult belt can't hold two people. RoSPA (UK road-safety body): in a crash at about 50 km/h, an unrestrained child is thrown forward with a force 30-60 times their body weight. The child can be crushed between the adult and the seat in front.", s: "Verified" },
      { h: "Sleeping across the back seat", t: "Also illegal. Every occupant must be belted, and an unbelted sleeping child is the most exposed person in the car.", s: "Verified" },
      { h: "Front seat", t: "Keep him in the back. Turkish legal guides say young children can't ride in front. Some cite under-10, others under 150 cm.", s: "Needs confirmation" },
      { h: "Rental cars and tourists", t: "A self-drive rental is a private car, so the full rule applies to foreign drivers too. Jandarma checkpoints on intercity roads are routine.", s: "Traveller-reported" }
    ],
    fine: "Fine under KTK 78/1-a (seatbelt / child restraint): ₺1,246 per violation (₺934.50 if paid within 15 days), plus 15 penalty points for the driver. Several 2026 articles quote ₺2,500-5,000 after this year's amendments.",
    fineStatus: "Needs confirmation",
    comfort: [
      { h: "Get a high-back booster, not a flat cushion", t: "Side wings and a headrest hold his head when he dozes, which is far comfier than a flat booster cushion or a slumped belt. Ask the rental for 'yükseltici, kafa destekli' and check for an ECE R44/04 or R129 label." },
      { h: "Practise at home first", t: "Two or three weeks of short rides in Mumbai in a booster turns 'new and annoying' into 'my seat'." },
      { h: "Bring his own travel booster", t: "Compact R44/R129-approved travel boosters (e.g. mifold, BubbleBum) fit in a backpack. Kids accept a seat they've already used." },
      { h: "Mum sits next to him in the back", t: "That's allowed and it helps. Neck pillow, blanket, tablet, snacks." },
      { h: "Drive at nap time, stop every 90-120 min", t: "Start the long legs when he usually sleeps. Fuel stations make natural breaks." },
      { h: "Cut the booster hours", t: "Flying Cappadocia to Istanbul (see Drive vs Fly) removes about 9 h of booster time in one go." }
    ],
    taxis: "Taxis and transfers: taxis are supposed to carry a child seat but rarely do (Traveller-reported). Ask for a booster when you book an airport minivan."
  },
  speed: [
    ["Towns and villages (yerleşim yeri)", "50", "Often 30-40 near schools. Most urban fines happen here."],
    ["Two-way rural road", "90", "Trucks and tractors. Overtake only on the broken line."],
    ["Divided highway (bölünmüş yol)", "110", "Antalya-Konya-Aksaray-Nevşehir is mostly this. Average-speed sections are common."],
    ["State motorway (Otoyol, KGM)", "120-130", "Istanbul-Ankara O-4. Follow the signs."],
    ["Private (BOT) motorways", "up to 140 where signed", "Kuzey Marmara motorway. Don't copy local drivers."]
  ],
  fines: [
    ["Speeding 6-10 km/h over (in town)", "₺2,000", "Rises in steps to ₺30,000. 30/60/90-day licence confiscation for big excesses."],
    ["Speeding (outside town), top band", "up to ₺30,000", "New graduated system from 2026."],
    ["Red light, 1st offence", "₺5,000", "Then ₺10,000 and escalating."],
    ["Driving without a valid licence", "₺40,000", "An Indian licence without an IDP may be treated as invalid."],
    ["Failing to yield to an ambulance or police", "₺46,000", "+ 30-day confiscation."],
    ["Alcohol above the limit / refusing a test", "₺150,000", "Limit 0.05% BAC. Just don't drink and drive."],
    ["Child not in a proper seat / no seatbelt", "₺1,246 per person*", "*Some sources say ₺2,500-5,000 in 2026. See the booster section."],
    ["Phone in hand, parking", "Needs confirmation", "2026 amounts not verified. Assume several thousand ₺."]
  ],
  finesStatus: "From 2026 legal summaries (Esenyel Partners, Turkish Living, TyreMap, Avis TR). Amounts change every January.",
  fineReasons: [
    { t: "Average-speed (section) cameras", d: "Cameras between two points work out your average speed. Tourists slow down for one camera, then speed up. Signs say 'Ortalama Hız Koridoru'." },
    { t: "Red-light cameras in cities (EDS)", d: "Antalya and Istanbul junctions are camera-enforced. Amber means stop, not hurry." },
    { t: "Rental admin fee on every ticket", d: "Fines reach the rental company weeks later and are charged to your card, plus a ₺200-500 admin fee each." },
    { t: "HGS toll problems", d: "Don't remove or cover the HGS sticker. A missed toll becomes a penalty worth several times the fare. There are no cash toll booths any more." },
    { t: "Kids without a proper seat", d: "Checkpoints look into back seats. A child on a lap or lying across the seat means an on-the-spot fine." },
    { t: "Parking / towing in Istanbul", d: "Towing (çekici) is common in Beyoğlu and Beşiktaş. Use İSPARK car parks." },
    { t: "Speeding on empty Anatolian roads", d: "Long straight 110 roads tempt you to 130. Radar vans and the gendarmerie are regular." }
  ],
  signs: [
    ["DUR", "Stop (red octagon)"], ["Yavaş", "Slow"], ["Dikkat", "Caution"], ["Radar Denetimi", "Speed enforcement ahead"],
    ["Ortalama Hız Koridoru", "Average-speed section"], ["Park Yapılmaz", "No parking"], ["Çekici ile çekilir", "Vehicles towed"],
    ["Giremez", "No entry"], ["Tek Yön", "One way"], ["Yol Kapalı", "Road closed"], ["Yol Çalışması", "Roadworks"],
    ["Bozuk Satıh", "Rough surface"], ["Heyelan", "Landslide zone"], ["Yaya Geçidi", "Pedestrian crossing"],
    ["Okul", "School zone"], ["Gişeler / HGS", "Toll plaza, use the HGS lane"], ["Otoyol", "Motorway"],
    ["Çıkış", "Exit"], ["Buzlanma", "Icy road"], ["Sis", "Fog"], ["Jandarma", "Gendarmerie (rural police)"]
  ],
  checklist: [
    "International Driving Permit + Indian licence + passport. The IDP is mandatory for an Indian licence. Get it in India BEFORE the trip.",
    "Credit card in the MAIN DRIVER's name for the deposit hold (about ₺4,000-6,000, released about 10 working days later). Debit cards usually aren't accepted.",
    "Book a high-back booster for the 5-year-old and check it's fitted properly.",
    "Video the car at pickup: every panel, wheels, windscreen, fuel gauge, odometer.",
    "Choose a full-to-full fuel policy and keep the last fuel receipt.",
    "Confirm the HGS sticker is active and ask how tolls and fines are billed.",
    "Ask about the one-way fee and the exact drop-off address and hours.",
    "Check the kit: warning triangle, reflective vest, first-aid kit, extinguisher.",
    "Headlights on in rain, fog and tunnels.",
    "Download offline Google Maps for all 3 regions. Yandex Maps is popular locally for traffic.",
    "Sunset is about 17:30-17:55 (Turkey stays on UTC+3). Plan to be off mountain roads by then."
  ],
  legs: [
    { name: "Pamukkale day via Salda Lake ({day:ant-pamukkale})", km: "about 515 round trip", time: "about 7 h driving", route: "North via Burdur to Salda Lake (Yeşilova), on to Pamukkale, then back on the direct road (Estimated)", tolls: "State roads, no motorway tolls (Estimated)", stops: "Salda Lake, Pamukkale village, fuel in Burdur", notes: "Mountain stretches north of Antalya: leave Pamukkale by 14:30 to be off them by sunset (about 17:50)." },
    { name: "Antalya to Göreme ({driveCap})", km: "about 530", time: "6.5-7 h driving", route: "Over the Taurus mountains to Konya, then D300 to Aksaray and Nevşehir", tolls: "Mostly state roads, no motorway tolls (Estimated)", stops: "Konya lunch (fırın kebabı), fuel before the pass", notes: "The pass reaches about 1,800 m. Snow is rare in early November, but check the forecast the night before." },
    { name: "Göreme to Istanbul ({driveIst})", km: "about 730", time: "8-9 h driving", route: "Aksaray, Tuz Gölü, Ankara ring road, O-4 motorway, Kuzey Marmara motorway straight to IST airport", tolls: "About ₺1,300: O-4 ₺338, Kuzey Marmara Anadolu ₺600, YSS Bridge ₺110, Kuzey Marmara Avrupa about ₺260", stops: "Tuz Gölü, Ankara lunch, Bolu mountain services", notes: "Leave Tekkaya at 09:00. Fog is possible on the Bolu mountain section. Return the car at IST, then a minivan to Taksim." }
  ]
};

/* ---------- LUGGAGE PLANNER (all volumes/weights Estimated) ---------- */
const LUGGAGE_MODEL = {
  types: [
    { key: "large",    label: "Large check-in (28\")", litres: 100, kg: 23, storeTRY: 600, where: "hold" },
    { key: "medium",   label: "Medium (24\")",          litres: 70,  kg: 18, storeTRY: 500, where: "hold" },
    { key: "cabin",    label: "Small / cabin (20-22\")", litres: 40,  kg: 8,  storeTRY: 400, where: "cabin" },
    { key: "backpack", label: "Backpack / laptop bag / purse", litres: 22, kg: 5, storeTRY: 300, where: "feet" }
  ],
  defaults: { have: { large: 2, medium: 0, cabin: 3, backpack: 2 }, store: { large: 0, medium: 0, cabin: 0, backpack: 0 }, car: "csedan", fare: "ecofly", days: 7, shopping: 1, pooled: true },
  presets: [
    { name: "Carry everything (recommended)", store: { large: 0, medium: 0, cabin: 0, backpack: 0 } },
    { name: "Store 1 large (original plan)", store: { large: 1, medium: 0, cabin: 0, backpack: 0 } },
    { name: "Store 1 large + 1 cabin", store: { large: 1, medium: 0, cabin: 1, backpack: 0 } }
  ],
  cars: [
    { key: "hatch",  label: "Economy hatch (Clio / i20)",   boot: 390 },
    { key: "csedan", label: "C-sedan (Fiat Egea / Corolla)", boot: 510 },
    { key: "csuv",   label: "Compact SUV (C-HR / 2008)",     boot: 420 },
    { key: "msuv",   label: "Mid SUV (Qashqai / Austral)",   boot: 500 },
    { key: "estate", label: "Estate / wagon",                 boot: 600 },
    { key: "van",    label: "Minivan (Vito / Transporter)",   boot: 900 }
  ],
  fares: [
    { key: "ecofly",   label: "TK EcoFly, 15 kg checked each",   kg: 15 },
    { key: "extrafly", label: "TK ExtraFly, 20 kg checked each", kg: 20 },
    { key: "primefly", label: "TK PrimeFly, 25 kg checked each", kg: 25 }
  ],
  people: 4, excessTRYper3kg: 390, packEff: 0.8
};

/* ---------- MONEY ---------- */
const MONEY = {
  cards: [
    { role: "Primary for purchases", card: "Scapia (Federal Bank) Visa", why: "0% forex markup on international purchases (Verified, Visa variant only). Use it for hotels, restaurants, fuel and museums.", warn: "Don't use it at ATMs: 2.5% or ₹500 minimum per withdrawal (Verified), plus credit-card cash-advance interest." },
    { role: "Backup card", card: "Your other 0-forex Visa or Mastercard", why: "A different network from the primary, in case a terminal declines Visa.", warn: "Check its current markup terms before travelling." },
    { role: "ATM card", card: "A debit or forex card with a low ATM fee", why: "Cash from a debit account doesn't attract cash-advance interest.", warn: "Check the per-withdrawal fee and daily limit." },
    { role: "Car-rental deposit", card: "Credit card in the main driver's name", why: "The hold is about ₺4,000-6,000 (Traveller-reported).", warn: "Debit cards are usually refused for the deposit." }
  ],
  atm: [
    "Reported no operator fee on foreign cards (mid-2026): Halkbank, ING, PTT (Traveller-reported).",
    "Ziraat now reportedly charges a flat ₺30-100. VakıfBank is often cheaper than private banks.",
    "Avoid standalone machines away from bank branches. Always read the fee screen before confirming.",
    "Withdraw fewer, larger amounts (e.g. ₺8,000-10,000) to spread the fixed fees."
  ],
  dcc: "If the ATM or card machine asks \"Charge in INR or TRY?\", ALWAYS choose TRY. Picking INR lets the machine set its own rate (Dynamic Currency Conversion), usually 3-8% worse. Your 0-forex card only saves you money when the charge is in TRY.",
  cashPlaces: [
    "Taxis (many still prefer cash, so ask first)",
    "Grand Bazaar and Spice Bazaar stalls (cash often gets 10%+ off)",
    "Street food: simit, kumpir, corn, chestnuts",
    "Public toilets (₺10-20), small car parks, village stalls",
    "Rural lunch stops, small Cappadocia cafés",
    "Tips: restaurants 5-10%, balloon crew, drivers",
    "Horse ranches booked on a walk-in (often cash)"
  ],
  perDay: [
    ["Istanbul day", 2500], ["Cappadocia day", 2000], ["Antalya day", 1500], ["Road-trip day", 1000], ["Emergency reserve (carry all trip)", 5000]
  ],
  plan: "Bring about €200 cash from India as an emergency backup (exchange it only if cards fail, at city döviz offices, not the airport). Withdraw about ₺10,000 at an IST or AYT bank ATM on arrival, then top up once in Cappadocia and once in Istanbul.",
  table: [
    ["Hotel / big Airbnb deposit", "0-forex credit card", "Backup card"],
    ["Sit-down restaurant", "0-forex card (tap)", "Cash"],
    ["Small café / börek shop", "Cash or card", "Cash"],
    ["Taxi", "Cash (BiTaksi app for card)", "Cash"],
    ["Museums / palaces", "Card (online or gate)", "Backup card"],
    ["Bazaar stalls", "Cash", "Card at larger shops"],
    ["Rural stops / village cafés", "Cash", "Card if accepted"],
    ["Fuel", "0-forex card at the pump", "Cash"],
    ["Parking", "Card at İSPARK, cash at small lots", "Cash"],
    ["Balloon / tours", "Card when booking", "Cash for tips"],
    ["ATM", "Debit / forex card, choose TRY", "Second card"]
  ]
};

const CONTINGENCIES = [
  ["Rain in Antalya", "Antalya Aquarium and the Archaeological Museum are both a few minutes from Vera Suites. Land of Legends is mostly outdoor: swap it with the Old Town day."],
  ["Pamukkale day running long", "Skip Salda Lake and drive straight there and back, or leave Pamukkale by 14:00."],
  ["Balloon cancelled", "Rebook for {balloonBackup} (free) and leave for Istanbul an hour later. Watch the launch from the Tekkaya terrace. Confirm your operator's refund policy if every morning is cancelled."],
  ["Bad Cappadocia weather", "Kaymaklı underground city is indoors. Move the horse ride to the clearest afternoon."],
  ["Poor road conditions", "Delay, or stay overnight in Konya ({driveCap}) or Ankara ({driveIst})."],
  ["Princes' Islands ferries cancelled", "Swap in Dolmabahçe Palace (10 min from Kabataş, closed Mondays) and try the islands another day if the wind drops."],
  ["Rain in Istanbul", "Hagia Sophia, Topkapı's rooms, the Grand Bazaar, the Spice Bazaar and the Basilica Cistern are all indoors."]
];

const BOOKINGS = {
  "Booked ✓": ["Vera Suites Arapsuyu, 4-8 Nov", "Tekkaya Cave Hotel, Göreme, 8-11 Nov", "Elysium Hotel, Taksim, 11-15 Nov", "Balloon, 10 Nov, all 4 (confirmed)"],
  "Still to book": ["Rental car: AYT pickup 4 Nov night, IST airport return 11 Nov, high-back booster", "Land of Legends tickets (online, check November hours)", "Hagia Sophia + Topkapı online tickets", "Minivans: IST to Taksim on 11 Nov, Taksim to IST on 15 Nov", "Visas, IDP and travel insurance, if not done"],
  "Day before / on the spot": ["Horse ride (1-2 days ahead)", "Kaymaklı, Pamukkale, Göreme Open-Air Museum (at the gate)", "Galata Tower (or enjoy the free view from outside)", "Restaurants"],
  "Weather dependent": ["Balloon (operator decides at about 04:00)", "Princes' Islands ferries (wind)", "Salda Lake stop", "Bosphorus ferry timing"]
};

const DEFAULT_PACKING = {
  "Documents": ["Passports (6+ months validity)", "Turkey visas / e-Visa printouts", "Indian driving licence + IDP", "Flight + hotel confirmations (offline)", "Travel insurance policy", "Car rental voucher", "Kids' ID copies (free museum entry)"],
  "Adults": ["Down / warm jacket", "Light layers (Antalya is about 24 °C)", "Comfortable walking shoes", "Headscarves (mosques)", "Power bank", "Type C/F plug adapters"],
  "13-year-old": ["Warm jacket", "Phone storage cleared for photos", "Headphones for the long drives", "Riding-friendly trousers"],
  "5-year-old": ["Travel booster (if you bring one)", "Neck pillow for the car", "Warm jacket, gloves, beanie", "Snacks for the car", "Tablet + downloaded shows", "Comfort toy", "Spare clothes in the cabin bag", "Motion-sickness bands"],
  "Balloon": ["Thermal layers (dawn is about 2 °C)", "Gloves and beanie", "Flat, closed shoes", "Phone lanyard", "Layers, gloves and beanie for the 5-year-old too", "Snacks for the wait"],
  "Pamukkale day": ["Swimwear", "Quick-dry towels", "Flip-flops + a bag for shoes (the terraces are barefoot)", "Sunscreen and hats", "Breakfast boxes for the 06:30 start"],
  "November weather": ["Waterproof shell", "Compact umbrella", "Thermals for Cappadocia"],
  "Rain": ["Waterproof shoes", "Zip-lock bags for phones"],
  "Road trip": ["Offline maps", "Car phone mount + charger", "Wipes and tissues", "Water bottles", "Small ₺ notes for toilets"],
  "Luggage": ["Luggage scale", "Foldable duffel for shopping", "Luggage tags + AirTags", "Photos of every bag"],
  "Medicines / travel kit": ["Paracetamol (adult + kids' syrup)", "ORS", "Motion-sickness tablets", "Antacid", "Band-aids", "Prescription meds + a copy of the prescription", "Moisturiser / lip balm (dry cold)"]
};
