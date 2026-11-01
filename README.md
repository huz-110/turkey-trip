# turkey.trip: family planner, 4-15 Nov 2026

An editable trip planner for 2 adults, a 13-year-old and a 5-year-old: Mumbai, Antalya (Vera Suites Arapsuyu, 4-8 Nov), Cappadocia (Tekkaya Cave Hotel, 8-11 Nov), Istanbul (Elysium Hotel Taksim, 11-15 Nov), Mumbai.

**Open `index.html` in any browser.** No frameworks, no build step, no API keys. The planner works offline. Photos, fonts and the live forecast need an internet connection, and it falls back cleanly without one.

## Files

```text
turkey-trip/
├── index.html   page shell, toolbar, journey bar
├── styles.css   Gen Z sticker look (light/dark, mobile, print)
├── app.js       UI: renders everything from the data files, handles edits
├── data.js      single source of truth: nights split, fixed travel days, a ranked day bank per city, budget, research
├── photos.js    89 Wikimedia Commons photos (URLs + credits)
├── weather.js   per-date weather normals for every stop (10-year averages)
└── README.md
```

## What's inside

| Tab | What it does |
|---|---|
| **Overview** | Hero, then **trip at a glance**, written so anyone can follow it: a plain-English status ("Trip starts in 45 days" / "Day 5 of 12, in Cappadocia, 7 days to go"), a labelled progress bar, and 3 stop cards (photo, dates, nights, hotel, typical weather, highlights) joined by the flight and drive legs. **Change nights per city** rebalances the 11 nights (2-6 per city) and rebuilds the whole plan, and **Copy link** shares that split (`?nights=4-3-4`). A tucked-away date picker previews any day. Then stat tiles, an editable budget, the key decisions and "check before you book". |
| **The plan** | 12 photo day cards. Each shows **that day's weather for each city you're in** (high/low, how often it rained on that date in the last 10 years, sunset, what to wear). Add, edit, delete, reorder and tick activities. Filter by city and focus. |
| **Intel Corner** | Food (Google 4.3+ with 300+ reviews, kebab and grill photos, plus 4 **sweets tiles**: baklava, lokum, künefe and Maraş ice cream, each with rated places, a kid verdict and whether it travels home), Activities (Klook / GYG / Viator / direct, in INR), Stays (micro-areas scored on 8 factors, listings, "score a listing"), **Driving + booster law**. |
| **Logistics** | **Drive vs fly** calculator for Cappadocia to Istanbul, the **Luggage planner**, road legs, city weather, plan B and booking priority. |
| **Money** | The TRY rule (DCC), which card to use for what, a cash estimate driven by the itinerary, ATM tips. |
| **Pack** | Checklists by person and situation. You can add your own items. |

The **journey bar** under the header is on every tab: it's colour-coded by city, and a pin shows where you are in the trip.

## Your questions, answered in the app

- **Booster seat:** yes, it's mandatory. Turkish traffic regulation Art. 150 requires a child seat for children under 150 cm and under 36 kg in cars. The adult belt is only allowed over 135 cm, and only in the back. Riding on a lap or lying across the seat is not allowed. The fine is ₺1,246 per violation under KTK 78/1-a, and some 2026 sources say ₺2,500-5,000. The Intel Corner has comfort tips for a booster-hating 5-year-old.
- **Cappadocia to Istanbul:** you're driving on 11 Nov (leave Tekkaya 09:00, car back at IST, minivan to Taksim). The drive day costs about ₹15k (rental, fuel, tolls); flying would be about ₹30k for 4. The calculator keeps every input editable.
- **Luggage:** reworked. Carrying all 7 pieces (2 large, 3 small, 2 backpacks) fits a C-sedan boot (about 78% full) and gives about 86 L of clothes space per person. Storing one large bag drops that to about 61 L, which is tight for cold Cappadocia. The planner lets you try any mix and pushes the storage cost into the budget.
- **Weather:** Turkey stays on UTC+3 all year, so November sunsets are about 17:30-17:55. Every timing in the plan now uses the real sunrise and sunset.

## How edits are saved

- Everything you change is saved to **browser localStorage** (key `turkeyTrip.v2`). Ticks and budget edits from the first version carry over automatically.
- To move to another device, **Export** there and **Import** here. **Reset** reloads the researched defaults.
- To change the defaults, edit `data.js`, then press Reset in the app.

## How the plan is built

- `SPLIT` holds the nights per city (booked: 4-3-4). The app lays out the arrival day, each city's full days, the two drive days and the departure day from it.
- Each city's `DAY_BANK` lists researched days. A city with N nights gets its N-1 best-ranked days, in a sensible order. Days avoid weekdays they're closed, and a booked day (the 10 Nov balloon) stays on its date when the split allows.
- Date-bound items are added automatically: the 10 Nov 09:05 Atatürk siren, the early night before the balloon, balloon backup mornings and the pack-the-car evenings before each drive.
- Stay, rental-car and fuel budget lines scale with the plan.

## Publishing a change

- Bump `dataVersion` in `TRIP_META` when the default plan changes. Every browser then rebuilds its days on the next visit and keeps ticks, packing, typed budget amounts and added activities.
- Bump the `?v=` number on the five files in `index.html` so browsers fetch the new files instead of cached copies.

## Evidence labels

**Verified** (official or primary page), **Estimated** (our calculation), **Traveller-reported** (a pattern across reviews and forums), **Needs confirmation** (couldn't verify, so check it). Research dates: 19-20 Sep 2026. FX: €1 = ₹110.2, US$1 = ₹96.0, ₺1 = ₹1.968.

## Photos

All 85 photos come from **Wikimedia Commons** under free licences (CC BY, CC BY-SA, CC0 or public domain). The app footer credits each photographer. Google Images wasn't used: it's a search engine, not a licence, and most of what it shows is copyrighted.

- **Food photos are kebabs, grills and shawarma** (şiş, Adana, Beyti, tavuk şiş, lamb chops, cağ kebab, döner, dürüm, pottery kebab, mixed grill). They're dish inspiration, not each restaurant's own plate. Three stops keep their own food because that's the point of the stop: the breakfast café, Hafız Mustafa baklava and Ortaköy kumpir.
- **Hover any photo to enlarge it** (mouse or trackpad). Card photos and activity thumbnails pop out into a large preview with the photo credit. Day banners and the hero collage zoom in place. On touch screens photos stay as they are.

## Sources (main)

Child seats: [Türk Ehliyet](https://turkehliyet.com/blog/cocuk-oto-koltugu-zorunlulugu-yasi-cezasi), [Avis TR](https://www.avis.com.tr/trafik-ve-surus-kurallari/emniyet-kemeri-cezasi-2026-guncel-tutarlar-kurallar-ve-istisnalar), [RoSPA via Irish Times](https://www.irishtimes.com/life-and-style/motors/parents-unsure-of-law-on-child-car-seats-1.1205087) · Weather: [Open-Meteo archive](https://open-meteo.com/en/docs/historical-weather-api) · Flights: [TK Istanbul-Nevşehir](https://www.turkishairlines.com/en/flights-from-istanbul-to-nevsehir), [Skyscanner ASR-IST](https://www.skyscanner.net/routes/asr/ista/kayseri-to-istanbul.html), [TK baggage](https://www.turkishairlines.com/en-us/any-questions/checked-baggage/) · Tolls: [KGM Kuzey Marmara tariff](https://www.kgm.gov.tr/SiteCollectionDocuments/KGMdocuments/Otoyollar/OtoyolKopruUcret/2026Gecis_Ucret/15-KMOAnadoluKurtkoy-Akyazi.pdf), [Vignetim](https://vignetim.com/blog/cost-of-driving-in-turkey) · Car rental: [KAYAK Antalya](https://www.kayak.com/Antalya-Airport-Car-Rentals.AYT.cap.ksp), [Backpacking Is Life](https://backpackingislife.com/renting-a-car-in-turkey/) · Fuel: [GlobalPetrolPrices](https://www.globalpetrolprices.com/Turkey/gasoline_prices/) · Fines: [Esenyel Partners](https://www.esenyelpartners.com/2026-turkey-traffic-law-fines-sanctions/), [TyreMap](https://tyremap.com/driving/turkey/) · Luggage: [Bounce](https://bounce.com/luggage-storage/istanbul), [IST guide](https://istanbul-ist-international-airport.com/istanbul-international-airport-luggage-storage/) · Balloon: [BalloonScanner](https://balloonscanner.com/en), [cancellations](https://epicturkeytravel.com/cappadocia-hot-air-balloon-cancellation/) · Ratings: [Wanderlog](https://wanderlog.com/list/geoCategory/553172/best-family-restaurants-in-uchisar) · Cards: [Scapia (Paisabazaar)](https://www.paisabazaar.com/federal-bank/scapia-credit-card/) · FX: [Wise](https://wise.com/in/currency-converter/inr-to-try-rate/history)
