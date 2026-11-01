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
  researched: "2026-09-19"
};

/* City colour + photo used by the journey tracker */
const CITIES = {
  "Travel":     { color: "lilac",  img: "d04",             emoji: "✈️" },
  "Antalya":    { color: "aqua",   img: "city_antalya",    emoji: "🌊" },
  "Road trip":  { color: "lime",   img: "drive_road",      emoji: "🚗" },
  "Cappadocia": { color: "orange", img: "city_cappadocia", emoji: "🎈" },
  "Istanbul":   { color: "pink",   img: "city_istanbul",   emoji: "🕌" }
};

/* Trip at a glance: the simple route shown on the Overview tracker.
   Stops are where you sleep (from = check-in, to = check-out date). */
const ROUTE = [
  { type: "leg", date: "2026-11-04", icon: "✈️", text: "Fly to Antalya (change in Istanbul)" },
  { type: "stop", city: "Antalya", from: "2026-11-04", to: "2026-11-08", wx: "antalya", blurb: "Old town, sea cliffs and waterfalls, mountain cable car, Roman ruins" },
  { type: "leg", date: "2026-11-08", icon: "🚗", text: "Drive to Cappadocia, 530 km via Konya" },
  { type: "stop", city: "Cappadocia", from: "2026-11-08", to: "2026-11-11", wx: "goreme", blurb: "Hot-air balloons, cave hotel, horse riding, underground city" },
  { type: "leg", date: "2026-11-11", icon: "🚗", text: "Drive to Istanbul, 730 km (or fly)" },
  { type: "stop", city: "Istanbul", from: "2026-11-11", to: "2026-11-15", wx: "istanbul", blurb: "Palaces and mosques, Bosphorus ferry, bazaar shopping" },
  { type: "leg", date: "2026-11-15", icon: "✈️", text: "Fly home to Mumbai" }
];

/* ---------- ITINERARY ------------------------------------------------
   cost = INR for the whole family (Estimated unless noted)
   priority: must | good | optional
   category: Sightseeing | Food | Adventure | Kids | Driving | Shopping | Transport | Rest
   img = key in PHOTOS (optional)   wx = weather places for the day
--------------------------------------------------------------------- */
const DEFAULT_ITINERARY = [
  {
    date: "2026-11-04", city: "Travel", title: "Mumbai to Istanbul to Antalya", img: "d04", wx: ["istanbul", "antalya"],
    stay: "Antalya apartment (Konyaaltı recommended)", transport: "IndiGo + Turkish Airlines, rental car from AYT",
    drive: { km: 15, hours: "0.3" },
    child: "Long day (about 14 h door to door). Snacks, tablet and a change of clothes in the cabin bag for the 5-year-old.",
    booking: "Flights (confirm times), Turkey visa, car pickup at AYT after 23:30, booster seat on the rental.",
    contingency: "If the IST connection is tight, go straight to the domestic transfer desk. Don't try to store bags.",
    activities: [
      { time: "12:30", title: "Fly Mumbai to Istanbul (IndiGo)", location: "BOM T2", category: "Transport", duration: "about 6 h", cost: 0, priority: "must", transport: "Flight", notes: "Needs confirmation: the published 6E17 schedule is 08:30 to 13:50. Check which IndiGo flight you hold." },
      { time: "18:30", title: "Immigration, collect bags, re-check on Turkish Airlines", location: "Istanbul Airport", category: "Transport", duration: "1-1.5 h", cost: 0, priority: "must", transport: "Walk", notes: "The two flights are on separate tickets, so you collect and re-check. Storing a bag here is optional. Try the Luggage planner in Logistics." },
      { time: "22:00", title: "Fly Istanbul to Antalya (Turkish Airlines)", location: "IST domestic", category: "Transport", duration: "1 h 35 m", cost: 0, priority: "must", transport: "Flight", notes: "TK runs about 12 IST to AYT flights a day. Choose one at least 3 h after you land. Book all 4 on one booking so the bag allowance can be combined (Needs confirmation)." },
      { time: "23:40", title: "Pick up rental car + booster, drive to apartment", location: "Antalya Airport", category: "Driving", duration: "40 min", cost: 0, priority: "must", transport: "Car", notes: "Ask for a C-sedan or mid SUV (about 500 L boot) and a high-back booster. Video the car on all 4 sides.", kids: true }
    ]
  },
  {
    date: "2026-11-05", city: "Antalya", title: "Slow start, Old Town and Düden falls", img: "d05", wx: ["antalya"],
    stay: "Antalya apartment", transport: "Car + walking", drive: { km: 35, hours: "1" },
    child: "Late wake-up after the travel day. Lots of walking time at the harbour and the falls. Kaleiçi cobbles are rough for small legs.",
    booking: "None",
    contingency: "Rain: Antalya Aquarium (Konyaaltı) and the Archaeological Museum.",
    activities: [
      { time: "10:30", title: "Kaleiçi old town: Hadrian's Gate, old harbour, Hıdırlık Tower", location: "Kaleiçi, Antalya", category: "Sightseeing", duration: "2 h", cost: 0, priority: "must", transport: "Car + walk", notes: "Park outside the walls (İSPARK / Karaalioğlu Park). Don't drive into Kaleiçi.", img: "s_kaleici" },
      { time: "13:00", title: "Lunch: Rokka (pizza/falafel) or Parlak (grills)", location: "Kaleiçi", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "See Intel Corner, Restaurants.", kids: true, img: "f_durum" },
      { time: "15:30", title: "Lower Düden Waterfall (falls straight into the sea)", location: "Lara, Antalya", category: "Sightseeing", duration: "1 h", cost: 0, priority: "must", transport: "Car", notes: "Entry fee: Needs confirmation. Scenic cliff park.", kids: true, img: "s_lara" },
      { time: "17:15", title: "Sunset walk on the Konyaaltı promenade", location: "Konyaaltı Beach", category: "Rest", duration: "1 h", cost: 0, priority: "good", transport: "Car", notes: "Sunset around 17:55. Turkey stays on UTC+3 all year, so evenings are light.", kids: true, img: "s_konyaalti" },
      { time: "19:30", title: "Dinner: The Grill House or Paşa Bey Kebap", location: "Konyaaltı / Gençlik", category: "Food", duration: "1.5 h", cost: 4000, priority: "good", transport: "Car", notes: "", img: "f_adana" }
    ]
  },
  {
    date: "2026-11-06", city: "Antalya", title: "Olympos cable car and Phaselis by the sea", img: "d06", wx: ["antalya", "tahtali"],
    stay: "Antalya apartment", transport: "Car", drive: { km: 150, hours: "2.5" },
    child: "The cable car is the highlight for the 5-year-old. The summit is near freezing, so bring jackets. Phaselis has short flat paths.",
    booking: "Olympos Teleferik: buy on the day at the base or online. Only go if the summit forecast is clear.",
    contingency: "Summit in cloud: swap with 5 Nov, or with the Aspendos day (7 Nov). Rain: the Aquarium.",
    activities: [
      { time: "09:30", title: "Drive to Olympos Teleferik (Tahtalı)", location: "Beycik, Kemer", category: "Driving", duration: "1 h 15 m", cost: 0, priority: "must", transport: "Car", notes: "Coastal D400. Check the live summit webcam before you leave." },
      { time: "11:00", title: "Olympos Teleferik to the Tahtalı summit", location: "Olympos Teleferik", category: "Adventure", duration: "2 h", cost: 13500, priority: "must", transport: "Cable car", notes: "About €41 each for 3 people. Under-6 pricing differs by source (Needs confirmation).", kids: true, img: "tahtali" },
      { time: "13:30", title: "Lunch around Tekirova or Kemer", location: "Tekirova", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Car", notes: "", img: "f_gerashi" },
      { time: "15:00", title: "Phaselis ancient city + pine-shaded coves", location: "Phaselis, Kemer", category: "Sightseeing", duration: "1.5 h", cost: 2500, priority: "good", transport: "Car", notes: "Entry fee: Needs confirmation.", kids: true, img: "phaselis" },
      { time: "19:30", title: "Dinner near the apartment", location: "Konyaaltı", category: "Food", duration: "1.5 h", cost: 4000, priority: "good", transport: "Walk", notes: "", img: "f_tavuk2" },
      { time: "Flex", title: "Kaş day trip (instead of the cable car day)", location: "Kaş", category: "Driving", duration: "10 h", cost: 6000, priority: "optional", transport: "Car", notes: "187 km, about 2 h 40 m each way. Beautiful, but a long round trip. Not recommended.", img: "kas" }
    ]
  },
  {
    date: "2026-11-07", city: "Antalya", title: "Aspendos theatre and Perge ruins", img: "aspendos", wx: ["antalya"],
    stay: "Antalya apartment", transport: "Car", drive: { km: 90, hours: "1.5" },
    child: "Big open ruins with room to run. The Aspendos theatre's acoustics are the fun part for a 5-year-old: clap and listen to the echo. Bring hats and water, there's little shade.",
    booking: "None. Buy both tickets at the gate.",
    contingency: "This is also the rain/cloud backup for the Olympos Teleferik day (6 Nov): swap the two if the cable car forecast is bad.",
    activities: [
      { time: "09:30", title: "Drive east to Aspendos", location: "Serik, Antalya", category: "Driving", duration: "45 min", cost: 0, priority: "must", transport: "Car", notes: "D400 then inland, well signed. 47 km from Konyaaltı." },
      { time: "10:30", title: "Aspendos Roman theatre (best-preserved in the world)", location: "Aspendos", category: "Sightseeing", duration: "1 h", cost: 1650, priority: "must", transport: "Car", notes: "About €15 each for 3 (incl. the 13-year-old). Under-8s free. (Traveller-reported)", kids: true, img: "aspendos" },
      { time: "12:00", title: "Perge ancient city: colonnaded street, stadium, theatre", location: "Perge, Aksu", category: "Sightseeing", duration: "1 h", cost: 1200, priority: "good", transport: "Car", notes: "About €11 each for 3. Less shade than Aspendos, so don't linger past midday. (Traveller-reported)", kids: true },
      { time: "13:30", title: "Lunch on the way back into Antalya", location: "Aksu / Lara", category: "Food", duration: "1 h", cost: 3000, priority: "good", transport: "Car", notes: "", img: "f_adana3" },
      { time: "16:00", title: "Relaxed afternoon: Konyaaltı beach and Beach Park", location: "Konyaaltı", category: "Rest", duration: "2.5 h", cost: 0, priority: "good", transport: "Car", notes: "A slower finish before tomorrow's long drive. The Aquarium is here too if anyone wants indoors.", kids: true, img: "s_konyaalti" },
      { time: "19:30", title: "Dinner: Arma Restaurant (harbour) or Parlak Restaurant", location: "Kaleiçi", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Car", notes: "Pack for tomorrow's road trip tonight.", img: "f_fish" }
    ]
  },
  {
    date: "2026-11-08", city: "Road trip", title: "Antalya to Konya to Göreme", img: "drive_road", wx: ["antalya", "konya", "goreme"],
    stay: "Cappadocia cave hotel", transport: "Car", drive: { km: 530, hours: "6.5-7 (+ stops)" },
    child: "Split the drive into chunks of about 2 h. The Konya lunch is the long break. Sunset in Göreme is around 17:33.",
    booking: "None. Check the mountain-pass weather the night before.",
    contingency: "Snow or fog on the Taurus pass: leave later, or stay overnight in Konya if tired.",
    activities: [
      { time: "08:30", title: "Leave Antalya over the Taurus pass towards Konya", location: "Antalya to Konya", category: "Driving", duration: "4 h", cost: 0, priority: "must", transport: "Car", notes: "303 km, about 3 h 55 m. Mountain road with trucks, so overtake only on the dual-carriageway sections." },
      { time: "12:45", title: "Lunch in Konya: Ali Baba Fırın Kebap or Kebapçı Dedeler 1929", location: "Konya", category: "Food", duration: "1.25 h", cost: 3000, priority: "must", transport: "Car", notes: "Konya's fırın kebabı (oven lamb) on fresh bread is kid-friendly and not spicy.", kids: true, img: "f_iskender" },
      { time: "14:00", title: "Mevlana Museum (optional 45-minute stop)", location: "Konya", category: "Sightseeing", duration: "45 min", cost: 0, priority: "optional", transport: "Walk", notes: "Entry and hours: Needs confirmation. Modest dress.", img: "d07" },
      { time: "15:00", title: "Drive Konya to Aksaray to Göreme", location: "D300 / Nevşehir", category: "Driving", duration: "2 h 30 m", cost: 0, priority: "must", transport: "Car", notes: "Traveller-reported average-speed camera sections between Konya and Aksaray. Keep under 110." },
      { time: "19:30", title: "Dinner: CANCAN Cafe (Indian-Turkish) or Cappadocian Cuisine", location: "Göreme", category: "Food", duration: "1.5 h", cost: 4000, priority: "good", transport: "Walk", notes: "", kids: true, img: "f_testi" }
    ]
  },
  {
    date: "2026-11-09", city: "Cappadocia", title: "Balloon try #1, open-air museum, sunset horses", img: "d08", wx: ["goreme"],
    stay: "Cappadocia cave hotel", transport: "Car + operator transfers", drive: { km: 25, hours: "0.5" },
    child: "Kids sleep in while the adults fly (tell reception). Horse riding is at sunset, so no early start for the kids.",
    booking: "BALLOON: book for 9 Nov. If it's cancelled, the operator moves you to 10 or 11 Nov. Horse riding: book 1-2 days ahead.",
    contingency: "Balloon cancelled (25-35% of November mornings): watch the launch from a terrace and rebook for 10 Nov.",
    activities: [
      { time: "05:45", title: "Hot-air balloon (2 adults)", location: "Göreme valleys", category: "Adventure", duration: "3.5 h incl. transfers", cost: 42000, priority: "must", transport: "Operator shuttle", notes: "Sunrise is about 07:14, and pickup is about 1.5 h before. Standard shared basket €150-220 each (Estimated). The 5-year-old can't fly (minimum age 6 at most operators). The 13-year-old CAN.", img: "hero" },
      { time: "10:30", title: "Göreme Open-Air Museum (rock-cut churches)", location: "Göreme", category: "Sightseeing", duration: "1.5 h", cost: 6600, priority: "good", transport: "Car", notes: "€20 per adult or teen. Under-8s free at state museums (Verified). The Dark Church is +€6.", img: "goreme_oam" },
      { time: "13:00", title: "Lunch: Nazar Börek or Aysel'in Mutfağı", location: "Göreme", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "", kids: true, img: "f_tavukdoner" },
      { time: "14:00", title: "Rest at the hotel", location: "Hotel", category: "Rest", duration: "2 h", cost: 0, priority: "must", transport: "Flex", notes: "Very important after the early start." },
      { time: "16:00", title: "Sunset horse riding: Rose / Red Valley (1 h)", location: "Çavuşin / Göreme ranch", category: "Adventure", duration: "1.5 h", cost: 16000, priority: "must", transport: "Operator transfer", notes: "Sunset is about 17:32. The 5-year-old will likely ride a led pony or ride with a guide. Confirm the ranch's minimum age.", kids: true, img: "horse" },
      { time: "19:30", title: "Dinner: Topdeck Cave or Oscar Steak House", location: "Göreme", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "", img: "f_ocakbasi" }
    ]
  },
  {
    date: "2026-11-10", city: "Cappadocia", title: "Underground city, pottery, Uçhisar sunset", img: "d09", wx: ["goreme"],
    stay: "Cappadocia cave hotel", transport: "Car", drive: { km: 70, hours: "1.5" },
    child: "Kaymaklı has low tunnels. Fine for kids, but hold the 5-year-old's hand on the steep steps. Pottery is the 13-year-old's creative hour.",
    booking: "Balloon backup morning (automatic if 9 Nov was cancelled). Pottery class: book the day before.",
    contingency: "Rain or cold: the underground city and pottery are both indoors, so today is weatherproof.",
    activities: [
      { time: "05:45", title: "Balloon backup slot (only if 9 Nov was cancelled)", location: "Göreme", category: "Adventure", duration: "3.5 h", cost: 0, priority: "optional", transport: "Operator shuttle", notes: "Price already counted on 9 Nov.", img: "balloon2" },
      { time: "09:05", title: "10 November: Atatürk memorial siren", location: "En route to Kaymaklı", category: "Driving", duration: "2 min", cost: 0, priority: "must", transport: "Car", notes: "Sirens sound nationwide at 09:05 and many drivers stop. Pull over safely and don't overtake stopped cars." },
      { time: "10:00", title: "Kaymaklı Underground City", location: "Kaymaklı (20 km)", category: "Sightseeing", duration: "1.5 h", cost: 4300, priority: "must", transport: "Car", notes: "About €13 each for 3 people. Derinkuyu is deeper and more cramped. Kaymaklı is easier with a 5-year-old.", kids: true, img: "kaymakli" },
      { time: "12:30", title: "Lunch: Old Cappadocia or Turkish Ravioli (mantı)", location: "Göreme", category: "Food", duration: "1 h", cost: 3000, priority: "good", transport: "Car", notes: "", img: "f_shish2" },
      { time: "14:30", title: "Avanos pottery workshop (hands-on wheel)", location: "Avanos", category: "Kids", duration: "1.5 h", cost: 6000, priority: "good", transport: "Car", notes: "Book a class, not a 'free demo'. Those end in a shop sales pitch (Traveller-reported).", kids: true, img: "pottery" },
      { time: "17:00", title: "Sunset at the Uçhisar Castle area / Pigeon Valley viewpoint", location: "Uçhisar", category: "Sightseeing", duration: "1 h", cost: 0, priority: "must", transport: "Car", notes: "Sunset is about 17:31. The viewpoints are free. The castle climb fee is small (Needs confirmation).", kids: true, img: "s_uchisar" },
      { time: "19:30", title: "Dinner: İnci Cave or Seten", location: "Göreme", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "", img: "f_lambshish2" },
      { time: "Flex", title: "Sunset ATV / quad (13-year-old + adult)", location: "Göreme", category: "Adventure", duration: "2 h", cost: 7000, priority: "optional", transport: "Operator", notes: "Kids ride as passengers. Dusty and cold in November.", img: "atv" }
    ]
  },
  {
    date: "2026-11-11", city: "Road trip", title: "Göreme to Istanbul (the long one)", img: "d10", wx: ["goreme", "ankara", "istanbul"],
    stay: "Istanbul apartment", transport: "Car (or fly: see Drive vs Fly in Logistics)", drive: { km: 730, hours: "8-9 (+ stops)" },
    child: "The hardest day of the trip, and about 9 h in the booster. Tuz Gölü salt lake is a great leg-stretch. Flying instead is compared in Logistics.",
    booking: "Pre-book the car return appointment. If you stored a bag: collect it at IST Left Luggage on the way in.",
    contingency: "Too tired: stop overnight in Ankara (costs one Istanbul night). Fog on the Bolu mountain section: slow down and use dipped lights.",
    activities: [
      { time: "07:15", title: "Watch the balloons launch from the hotel terrace, then check out", location: "Hotel terrace", category: "Sightseeing", duration: "45 min", cost: 0, priority: "good", transport: "Flex", notes: "Free, and the best view of the balloons is from the ground.", kids: true, img: "balloon2" },
      { time: "11:00", title: "Tuz Gölü (Salt Lake) stop", location: "Near Şereflikoçhisar", category: "Kids", duration: "45 min", cost: 0, priority: "good", transport: "Car", notes: "Walk out on the white salt crust. Bring wipes for shoes.", kids: true, img: "d10" },
      { time: "13:30", title: "Lunch on the Ankara ring road / highway services", location: "Ankara", category: "Food", duration: "1 h", cost: 3000, priority: "must", transport: "Car", notes: "", img: "f_doner" },
      { time: "18:30", title: "Collect a stored bag at IST (only if you stored one)", location: "IST Left Luggage", category: "Transport", duration: "45 min", cost: 0, priority: "optional", transport: "Car", notes: "Short-term car park. One adult runs in." },
      { time: "19:15", title: "Return the rental car", location: "Istanbul office / IST", category: "Driving", duration: "45 min", cost: 0, priority: "must", transport: "Car", notes: "Fill the tank first (full-to-full) and keep the receipt. No car trip is planned in Istanbul this time, so there's no reason to keep it longer." },
      { time: "20:00", title: "Dinner: Bayramoğlu Döner (Beykoz, Asian side) or Beyti (Florya)", location: "On route", category: "Food", duration: "1 h", cost: 3500, priority: "optional", transport: "Taxi", notes: "Whichever fits your route. Or order in.", img: "f_beyti" }
    ]
  },
  {
    date: "2026-11-12", city: "Istanbul", title: "Sultanahmet: Hagia Sophia and the Blue Mosque", img: "d11", wx: ["istanbul"],
    stay: "Istanbul apartment", transport: "T1 tram + walking", drive: { km: 0, hours: "0" },
    child: "Morning visit before the crowds. Headscarves for the women, shoes off in mosques. Turkish delight at Hafız Mustafa.",
    booking: "Hagia Sophia: buy the visitor-gallery ticket online. Plan around prayer times.",
    contingency: "Rain: the Basilica Cistern and Hagia Sophia are both indoors.",
    activities: [
      { time: "09:00", title: "Hagia Sophia (visitor gallery)", location: "Sultanahmet", category: "Sightseeing", duration: "1.5 h", cost: 8300, priority: "must", transport: "Tram", notes: "€25 each for 3. Under-8s free with ID (Verified).", img: "d11" },
      { time: "10:45", title: "Blue Mosque + Hippodrome", location: "Sultanahmet", category: "Sightseeing", duration: "1 h", cost: 0, priority: "must", transport: "Walk", notes: "Free. Closed to visitors during prayer times.", kids: true, img: "bluemosque" },
      { time: "12:30", title: "Lunch: Matbah (Ottoman) or Sultanahmet Köftecisi", location: "Sultanahmet", category: "Food", duration: "1 h", cost: 3500, priority: "good", transport: "Walk", notes: "Köfte, rice and bread: ideal for the 5-year-old.", kids: true, img: "f_kofte" },
      { time: "14:00", title: "Basilica Cistern", location: "Sultanahmet", category: "Sightseeing", duration: "45 min", cost: 12600, priority: "optional", transport: "Walk", notes: "About €38 each for 3. Expensive. Skip if the budget is tight.", img: "cistern" },
      { time: "15:00", title: "Rest at the apartment", location: "", category: "Rest", duration: "2 h", cost: 0, priority: "must", transport: "Tram", notes: "" },
      { time: "19:00", title: "Dessert at Hafız Mustafa 1864 + evening stroll", location: "Sirkeci / Sultanahmet", category: "Food", duration: "1 h", cost: 1500, priority: "good", transport: "Tram", notes: "", kids: true, img: "f_baklava" },
      { time: "20:00", title: "Dinner near the apartment", location: "", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Walk", notes: "", img: "f_adana3" }
    ]
  },
  {
    date: "2026-11-13", city: "Istanbul", title: "Topkapı Palace, Spice Bazaar, Bosphorus ferry", img: "d13", wx: ["istanbul"],
    stay: "Istanbul apartment", transport: "T1 tram + ferry", drive: { km: 0, hours: "0" },
    child: "Topkapı is huge, so do the Treasury and the Harem highlights, not everything. Kids love the ferry (simit for the gulls).",
    booking: "Topkapı: buy online (closed on Tuesdays). It's Friday, so avoid mosques around midday prayers.",
    contingency: "Rain: do Topkapı's indoor sections and skip the ferry for the covered bazaars.",
    activities: [
      { time: "09:00", title: "Topkapı Palace incl. Harem", location: "Sultanahmet", category: "Sightseeing", duration: "2.5 h", cost: 18200, priority: "must", transport: "Tram", notes: "About €55 each for 3 (incl. Harem). Compare with the Museum Pass Istanbul.", img: "d13" },
      { time: "12:00", title: "Gülhane Park walk + lunch", location: "Gülhane", category: "Food", duration: "1.25 h", cost: 3500, priority: "good", transport: "Walk", notes: "", kids: true, img: "f_donerspit" },
      { time: "13:30", title: "Spice Bazaar + Eminönü waterfront", location: "Eminönü", category: "Shopping", duration: "1 h", cost: 0, priority: "good", transport: "Walk", notes: "Shopping isn't in the trip budget. Cash gets better prices.", img: "spicebazaar" },
      { time: "14:40", title: "Bosphorus tour on the public ferry (Şehir Hatları)", location: "Eminönü pier", category: "Sightseeing", duration: "2 h", cost: 1600, priority: "must", transport: "Ferry", notes: "Public ferry short tour about ₺120-200 each. A guided cruise (Klook/GYG) is the upgrade.", kids: true, img: "bosphorus" },
      { time: "19:30", title: "Dinner in the Karaköy area", location: "Karaköy", category: "Food", duration: "1.5 h", cost: 4500, priority: "good", transport: "Tram", notes: "", img: "f_mixedgrill" }
    ]
  },
  {
    date: "2026-11-14", city: "Istanbul", title: "Dolmabahçe, Ortaköy and Grand Bazaar shopping", img: "d14", wx: ["istanbul"],
    stay: "Istanbul apartment", transport: "T1 tram + taxi", drive: { km: 0, hours: "0" },
    child: "Ortaköy kumpir (stuffed baked potato) is a guaranteed kid win. Shopping in the afternoon while the kids rest in turns.",
    booking: "Dolmabahçe: buy online (closed on Mondays).",
    contingency: "Rain: the Grand Bazaar and Galataport are covered.",
    activities: [
      { time: "09:30", title: "Dolmabahçe Palace", location: "Beşiktaş", category: "Sightseeing", duration: "2 h", cost: 13200, priority: "must", transport: "Tram to Kabataş", notes: "About €40 each for 3. Children 6 and under free (Verified).", img: "d14" },
      { time: "12:00", title: "Lunch: Ortaköy kumpir by the mosque", location: "Ortaköy", category: "Food", duration: "1 h", cost: 2500, priority: "good", transport: "Taxi / bus", notes: "", kids: true, img: "f_kumpir" },
      { time: "14:00", title: "Grand Bazaar: main shopping window", location: "Beyazıt", category: "Shopping", duration: "3 h", cost: 0, priority: "must", transport: "Tram", notes: "Closed on Sundays, so today is your last chance. Bargain, and pay cash for discounts.", img: "grandbazaar" },
      { time: "17:00", title: "Galata Tower at sunset", location: "Galata", category: "Sightseeing", duration: "1 h", cost: 9900, priority: "optional", transport: "Tram + walk", notes: "About €30 each for 3. Sunset is about 17:46. Long queues, and the view from outside is free.", img: "d15" },
      { time: "20:00", title: "Farewell dinner", location: "", category: "Food", duration: "2 h", cost: 5000, priority: "good", transport: "Walk", notes: "", img: "f_pirzola" }
    ]
  },
  {
    date: "2026-11-15", city: "Istanbul", title: "Pack up and fly home", img: "ortakoy", wx: ["istanbul"],
    stay: "Home", transport: "Minivan transfer to IST", drive: { km: 45, hours: "1" },
    child: "No sightseeing. Pack the shopping bag the night before.",
    booking: "Return flight: Needs confirmation (the published 6E18 leaves IST at 17:55). Book a transfer with space for all bags.",
    contingency: "Traffic to IST: leave 4 h before departure.",
    activities: [
      { time: "09:30", title: "Breakfast + final packing (weigh the bags)", location: "Apartment", category: "Rest", duration: "2 h", cost: 2000, priority: "must", transport: "Flex", notes: "Bring a luggage scale.", img: "f_breakfast" },
      { time: "13:30", title: "Transfer to Istanbul Airport", location: "IST", category: "Transport", duration: "1 h", cost: 0, priority: "must", transport: "Minivan", notes: "A minivan is needed for 4 people and 8+ pieces. Cost is in the budget lines." },
      { time: "17:55", title: "Fly Istanbul to Mumbai", location: "IST", category: "Transport", duration: "about 5 h 40 m", cost: 0, priority: "must", transport: "Flight", notes: "Needs confirmation." }
    ]
  }
];

/* ---------- NON-ACTIVITY BUDGET LINES (INR, whole family) ---------- */
const DEFAULT_BUDGET_LINES = [
  { id: "b1", label: "International flights BOM-IST return x4", group: "Flights", amount: 160000, status: "Estimated", note: "Replace with your actual fare if already booked." },
  { id: "b2", label: "Domestic flight IST-AYT x4", group: "Flights", amount: 28000, status: "Estimated", note: "" },
  { id: "b3", label: "Turkey visas x4 (VFS / e-Visa)", group: "Documents", amount: 25000, status: "Needs confirmation", note: "Indian passports: e-Visa only with a valid US/UK/Schengen/Irish visa or residence permit. Otherwise a sticker visa via VFS." },
  { id: "b4", label: "Travel insurance (family)", group: "Documents", amount: 8000, status: "Estimated", note: "" },
  { id: "b5", label: "Antalya apartment, 4 nights", group: "Stay", amount: 60000, status: "Estimated", note: "About ₹15k/night for a Konyaaltı 2-bedroom." },
  { id: "b6", label: "Cappadocia cave hotel, 3 nights", group: "Stay", amount: 60000, status: "Estimated", note: "About ₹20k/night for a family room with a terrace." },
  { id: "b7", label: "Istanbul apartment, 4 nights", group: "Stay", amount: 70000, status: "Estimated", note: "Your ₹17.5k/night target." },
  { id: "b8", label: "Rental car, 7 days + one-way fee + full cover", group: "Car", amount: 52500, status: "Estimated", note: "The one-way AYT to IST fee is quoted at booking. Compare suppliers. Returned on arrival in Istanbul (no Sapanca day this cut)." },
  { id: "b9", label: "Fuel (about 1,700 km, petrol)", group: "Car", amount: 19000, status: "Estimated", note: "119 L at ₺81 (Kurşunsuz 95, Sep 2026)." },
  { id: "b10", label: "Tolls (HGS, billed by the rental company)", group: "Car", amount: 5000, status: "Estimated", note: "Istanbul-Ankara ₺338, Kuzey Marmara Anadolu ₺600, Yavuz Sultan Selim Bridge ₺110, Kuzey Marmara Avrupa about ₺260." },
  { id: "b11", label: "Parking", group: "Car", amount: 5000, status: "Estimated", note: "" },
  { id: "b12", label: "Luggage storage (from the Luggage planner)", group: "Logistics", amount: 0, status: "Estimated", note: "Updates automatically when you change the Luggage planner." },
  { id: "b13", label: "Istanbul local transport + airport transfer", group: "Transport", amount: 15000, status: "Estimated", note: "Istanbulkart, taxis, a minivan to IST." },
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
    finding: "You're carrying 2 large, 3 small and 2 backpacks. Storing 1 large leaves one large bag for 4 people for 7 nights, including cold Cappadocia, which is too tight. All 7 pieces fit a C-sedan boot (about 510 L) with the backpacks at your feet (Estimated). Bags only get heavier after the Istanbul shopping, which happens at the end anyway.",
    rec: "Carry everything. Book a C-sedan or mid SUV and pack a foldable duffel for the shopping. Use the Luggage planner to test other mixes.",
    why: "No storage fees, no airport detour, and a full wardrobe for Cappadocia. The only real cost is carrying more up hotel stairs."
  },
  {
    topic: "Cappadocia to Istanbul: drive or fly?", img: "drive_motorway",
    mine: "Drive 730 km on 11 Nov, return the car the same evening.",
    finding: "The drive day alone costs about ₹15k (rental ₹4.5k, fuel ₹8.1k, tolls ₹2.6k). Flying NAV/ASR to IST costs about ₹30k (4 TK tickets plus a minivan to the city). With Sapanca dropped from the trip, neither plan needs a car in Istanbul itself, so it's a clean like-for-like comparison (Estimated).",
    rec: "Fly (Plan C): drop the car at Nevşehir or Kayseri airport and fly Turkish Airlines to IST.",
    why: "For a similar premium you swap roughly 9 h of driving (and 9 h of booster time for your 5-year-old) for a 1 h 20 m flight. You arrive fresh with an extra evening in Istanbul. If budget matters most, driving is the cheaper option."
  },
  {
    topic: "Antalya excursions", img: "kas",
    mine: "Try to fit Pamukkale and Kaş.",
    finding: "You land at 23:30, so there are 3 usable days in Antalya. Pamukkale is about 240 km (3-4 h each way) in the wrong direction. Kaş is 187 km (about 2 h 40 m each way). The city's Tünektepe cable car has been closed since the April 2024 accident, with no reopening date (Traveller-reported).",
    rec: "Skip Pamukkale. Kaş is optional. Use Olympos Teleferik for the cable car, Phaselis and Kaleiçi, plus the extra day at Aspendos and Perge.",
    why: "Two 7-hour round trips back to back with a 7-hour drive would break the relaxed pace, but the third day gives room for a quieter ruins-and-beach day instead."
  },
  {
    topic: "Cappadocia balloon", img: "hero",
    mine: "Balloon for 2 adults.",
    finding: "25-35% of November mornings are cancelled (Traveller-reported). Most operators set the minimum age at 6. Your 13-year-old is eligible.",
    rec: "Book the first morning (9 Nov). The operator can move you to 10 or 11 Nov.",
    why: "Three chances bring the odds of at least one flight to about 95% (Estimated)."
  },
  {
    topic: "Istanbul base", img: "s_karakoy",
    mine: "Compare Sultanahmet, Beyoğlu, Taksim, Galata, Karaköy, Şişli, Kadıköy.",
    finding: "The T1 tram joins Kabataş, Karaköy, Eminönü, Sultanahmet and the Grand Bazaar, which covers 80% of your must-dos. Galata and Cihangir are steep, stepped hills.",
    rec: "Stay on the flat T1 strip at Karaköy-Tophane (first choice) or Sultanahmet-Cankurtaran.",
    why: "You can walk or tram to every palace and bazaar, with plenty of evening food options and an easy taxi to IST."
  },
  {
    topic: "Budget", img: "money_lira",
    mine: "₹5-6 lakh all-in.",
    finding: "Researched costs come to about ₹8 lakh for the core plan (Estimated), or about ₹6.2 lakh without international flights and visas. The biggest costs are stays, flights, food, the car and the balloon.",
    rec: "Treat ₹6 lakh as the on-the-ground budget. Levers: skip the Cistern and Galata Tower (-₹22k), or pick a mid-range cave hotel (-₹15k).",
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
    ist: "Neither plan needs a car in Istanbul itself: with Sapanca dropped from this cut of the trip, every remaining sight is on the tram, ferry or on foot."
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
  { city: "Istanbul", name: "Bayramoğlu Döner", area: "Beykoz (Asian side)", cuisine: "Döner specialist", g: [4.5, 30126], ta: [4.5, 753], price: "₹₹", kids: "Döner plate with rice and fries.", alcohol: "Unlikely", why: "30k+ Google reviews. Near the Kuzey Marmara route on 11 Nov.", img: "f_donerspit" },
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
    plan: "Karaköy Güllüoğlu is steps from the recommended Karaköy base. Hafız Mustafa is already in the plan on 12 Nov." },
  { name: "Turkish delight", tr: "lokum", img: "s_lokum",
    what: "Soft, chewy cubes of starch and sugar flavoured with rose, pomegranate, lemon or packed with pistachio. Most shops let you taste first.",
    kids: "The 5-year-old favourite: soft, not too sweet, easy to eat.",
    home: "Best gift to carry home: light and lasts for weeks",
    places: [
      { n: "Ali Muhiddin Hacı Bekir", a: "Eminönü (since 1777)", g: [4.3, 866] },
      { n: "Lokum Atölyesi", a: "Fatih", g: [4.4, 354] },
      { n: "Hafız Mustafa 1864", a: "several branches", g: [4.7, 47271] }
    ],
    plan: "Hacı Bekir is a short walk from the Spice Bazaar, so pair it with 13 Nov. Traditional lokum has no gelatine, but check the label on cheap tourist boxes (Traveller-reported)." },
  { name: "Künefe", tr: "künefe", img: "s_kunefe",
    what: "Crispy shredded pastry baked around melted stretchy cheese, soaked in syrup and topped with pistachio. Served straight from the oven.",
    kids: "Cheesy and sweet, so kids usually love it. It arrives very hot, so let it cool a minute.",
    home: "Eat it fresh, it doesn't travel",
    places: [
      { n: "Keyfeder Künefe Katmer", a: "Beyoğlu", g: [4.6, 1905], ta: [4.5, 29] },
      { n: "Lezzet-i Şark Antep Sofrası", a: "Eminönü, by the Spice Bazaar", g: [4.4, 2132], ta: [4.5, 201] },
      { n: "Gaziantep Közde Künefe", a: "Fatih", g: [4.5, 2475] }
    ],
    plan: "Lezzet-i Şark sits right by the Spice Bazaar, ideal after the 13 Nov bazaar walk. One portion easily serves two." },
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
    { name: "Antalya to Göreme (8 Nov)", km: "about 530", time: "6.5-7 h driving", route: "Over the Taurus mountains to Konya, then D300 to Aksaray and Nevşehir", tolls: "Mostly state roads, no motorway tolls (Estimated)", stops: "Konya lunch (fırın kebabı), fuel before the pass", notes: "The pass reaches about 1,800 m. Snow is rare in early November, but check the forecast the night before." },
    { name: "Göreme to Istanbul (11 Nov)", km: "about 730", time: "8-9 h driving", route: "Aksaray, Tuz Gölü, Ankara ring road, O-4 motorway, Kuzey Marmara motorway", tolls: "About ₺1,300: O-4 ₺338, Kuzey Marmara Anadolu ₺600, YSS Bridge ₺110, Kuzey Marmara Avrupa about ₺260", stops: "Tuz Gölü, Ankara lunch, Bolu mountain services", notes: "Fog is possible on the Bolu mountain section. Return the rental car on arrival." }
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
  people: 4, excessTRYper3kg: 390, packEff: 0.8, nightsBeforeIstanbul: 7
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
  ["Rain in Antalya", "Antalya Aquarium (Konyaaltı), Archaeological Museum, or swap the Aspendos/Perge day earlier."],
  ["Balloon cancelled", "Rebook for 10 or 11 Nov (free). Watch the launch from a terrace. Full refund if every morning is cancelled, so confirm the policy when you book."],
  ["Bad Cappadocia weather", "The underground city and pottery are indoors. Move the horse ride to the clearest afternoon."],
  ["Poor road conditions", "Delay, or stay overnight in Konya (8 Nov) or Ankara (11 Nov). Or fly Cappadocia to Istanbul."],
  ["Rain in Istanbul", "Topkapı interiors, Dolmabahçe, Hagia Sophia, Grand Bazaar, Galataport, Basilica Cistern."]
];

const BOOKINGS = {
  "Book now": ["Turkey visas (VFS lead time)", "International Driving Permits (RTO, India)", "International + IST-AYT flights on ONE booking", "Rental car with a high-back booster (decide Drive vs Fly first)", "Cappadocia cave hotel (terrace family rooms sell out)", "Antalya and Istanbul apartments", "Travel insurance"],
  "Book after research": ["Balloon operator for 9 Nov (compare Klook, GYG, direct)", "Horse-riding ranch", "Topkapı / Hagia Sophia / Dolmabahçe online tickets", "NAV/ASR to IST flight if you fly", "Airport minivan for 15 Nov"],
  "Weather dependent": ["Olympos Teleferik (clear summit)", "Balloon (operator decides at 04:00)", "Bosphorus ferry timing"],
  "Decide locally": ["Restaurants", "Pottery class", "ATV", "Galata Tower / Basilica Cistern", "Kaş (optional)"]
};

const DEFAULT_PACKING = {
  "Documents": ["Passports (6+ months validity)", "Turkey visas / e-Visa printouts", "Indian driving licence + IDP", "Flight + hotel confirmations (offline)", "Travel insurance policy", "Car rental voucher", "Kids' ID copies (free museum entry)"],
  "Adults": ["Down / warm jacket", "Light layers (Antalya is about 24 °C)", "Comfortable walking shoes", "Headscarves (mosques)", "Power bank", "Type C/F plug adapters"],
  "13-year-old": ["Warm jacket", "Phone storage cleared for photos", "Headphones for the long drives", "Riding-friendly trousers"],
  "5-year-old": ["Travel booster (if you bring one)", "Neck pillow for the car", "Warm jacket, gloves, beanie", "Snacks for the car", "Tablet + downloaded shows", "Comfort toy", "Spare clothes in the cabin bag", "Motion-sickness bands"],
  "Balloon": ["Thermal layers (dawn is about 2 °C)", "Gloves and beanie", "Flat, closed shoes", "Phone lanyard"],
  "November weather": ["Waterproof shell", "Compact umbrella", "Thermals for Cappadocia"],
  "Rain": ["Waterproof shoes", "Zip-lock bags for phones"],
  "Road trip": ["Offline maps", "Car phone mount + charger", "Wipes and tissues", "Water bottles", "Small ₺ notes for toilets"],
  "Luggage": ["Luggage scale", "Foldable duffel for shopping", "Luggage tags + AirTags", "Photos of every bag"],
  "Medicines / travel kit": ["Paracetamol (adult + kids' syrup)", "ORS", "Motion-sickness tablets", "Antacid", "Band-aids", "Prescription meds + a copy of the prescription", "Moisturiser / lip balm (dry cold)"]
};
