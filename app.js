/* =====================================================================
   TURKEY FAMILY TRIP - UI
   Renders everything from data.js / photos.js / weather.js.
   User edits live in `state`, persisted to localStorage. No frameworks.
   ===================================================================== */
(function () {
  "use strict";

  const STORE_KEY = "turkeyTrip.v2";
  const OLD_KEY = "turkeyTrip.v1";
  const WX_KEY = "turkeyTrip.wxLive";
  const FX = TRIP_META.fx;
  const PRIORITIES = { must: "Must do", good: "Good to do", optional: "Optional" };
  const CATEGORIES = ["Sightseeing", "Food", "Adventure", "Kids", "Driving", "Shopping", "Transport", "Rest"];
  const FOCUS = ["All", "Must do", "Optional", "Food", "Sightseeing", "Adventure", "Kids", "Driving", "Shopping"];
  const CITY_ORDER = ["Travel", "Antalya", "Road trip", "Cappadocia", "Istanbul"];
  const DAY_MS = 86400000;

  /* ---------------- state ---------------- */
  const ui = {
    tab: "overview", intel: "restaurants",
    city: "All", focus: "All", hideDone: false,
    restCity: "All", actCity: "All", stayCity: "All",
    editing: null, showAdd: false, fuelKm: 530,
    today: new URLSearchParams(location.search).get("today") || null
  };

  function uid() { return "a" + Math.random().toString(36).slice(2, 9); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function defaults() {
    const itinerary = clone(DEFAULT_ITINERARY).map(d => ({
      ...d, activities: d.activities.map(a => ({ id: uid(), done: false, kids: false, ...a }))
    }));
    const packing = {};
    Object.entries(DEFAULT_PACKING).forEach(([g, items]) => { packing[g] = items.map(t => ({ id: uid(), text: t, done: false })); });
    return {
      version: 2, itinerary, budgetLines: clone(DEFAULT_BUDGET_LINES), packing, driveChecks: {}, userListings: [],
      luggage: clone(LUGGAGE_MODEL.defaults), dvf: clone(DRIVE_VS_FLY.inputs)
    };
  }

  function migrate(old) {
    // Carry over the useful bits of a v1 save onto the new v2 defaults
    const s = defaults();
    const doneTitles = new Set((old.itinerary || []).flatMap(d => d.activities || []).filter(a => a.done).map(a => a.title));
    s.itinerary.forEach(d => d.activities.forEach(a => { if (doneTitles.has(a.title)) a.done = true; }));
    const packedTexts = new Set(Object.values(old.packing || {}).flat().filter(i => i.done).map(i => i.text));
    Object.values(s.packing).flat().forEach(i => { if (packedTexts.has(i.text)) i.done = true; });
    (old.budgetLines || []).forEach(l => { const n = s.budgetLines.find(x => x.id === l.id); if (n && l.id !== "b12") n.amount = l.amount; });
    s.driveChecks = old.driveChecks || {};
    s.userListings = old.userListings || [];
    return s;
  }

  // Photos aren't user-editable, so saved plans always pick up the latest default images
  function syncImages(s) {
    const byTitle = {}, byDate = {};
    DEFAULT_ITINERARY.forEach(d => { byDate[d.date] = d.img; d.activities.forEach(a => { if (a.img) byTitle[a.title] = a.img; }); });
    s.itinerary.forEach(d => { if (byDate[d.date]) d.img = byDate[d.date]; d.activities.forEach(a => { if (byTitle[a.title]) a.img = byTitle[a.title]; }); });
    return s;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.itinerary)) return syncImages({ ...defaults(), ...s });
      }
      const old = localStorage.getItem(OLD_KEY);
      if (old) return migrate(JSON.parse(old));
    } catch (e) { /* storage blocked or corrupt: fall back to defaults */ }
    return defaults();
  }
  let state = load();

  function save(quiet) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); if (!quiet) flash("Saved ✓"); }
    catch (e) { flash("Couldn't save (browser storage blocked)"); }
  }

  /* ---------------- helpers ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const inr = n => "₹" + Math.round(n || 0).toLocaleString("en-IN");
  const tl = n => "₺" + Math.round(n || 0).toLocaleString("en-IN");
  const tryOf = n => tl((n || 0) / FX.TRY);
  const lakh = n => "₹" + (n / 100000).toFixed(2) + " L";
  const maps = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const cityKey = c => (c || "").replace(/\s/g, "");
  function fmtDate(iso, opts) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("en-GB", opts || { weekday: "short", day: "numeric", month: "short" });
  }
  function statusBadge(s) {
    if (!s) return "";
    const cls = { "Verified": "ok", "Estimated": "est", "Traveller-reported": "tr", "Needs confirmation": "nc" }[s] || "est";
    return `<span class="ev ev-${cls}">${esc(s)}</span>`;
  }
  function evidenceIn(text) {
    return ["Verified", "Estimated", "Traveller-reported", "Needs confirmation"].filter(t => (text || "").includes(t)).map(statusBadge).join(" ");
  }
  function photo(key, cls = "", alt = "", big = false) {
    const p = typeof PHOTOS !== "undefined" && PHOTOS[key];
    if (!p) return `<figure class="ph ph-fail ${cls}" aria-hidden="true"></figure>`;
    return `<figure class="ph ${cls}" data-k="${esc(key)}"><img src="${esc(big ? p.big : p.src)}" alt="${esc(alt || p.title.replace(/\.\w+$/, ""))}" loading="lazy" decoding="async"></figure>`;
  }

  /* Hover to enlarge: a floating preview next to the photo (mouse devices only).
     Big banners (.no-peek) just zoom in place via CSS. */
  const canHover = matchMedia("(hover: hover) and (pointer: fine)");
  const peek = document.createElement("div");
  peek.id = "peek"; peek.setAttribute("aria-hidden", "true");
  peek.innerHTML = '<img alt=""><div class="pk-cap"></div>';
  document.body.appendChild(peek);
  let peekFor = null, peekTimer;
  function hidePeek() { peekFor = null; clearTimeout(peekTimer); peek.classList.remove("show"); }
  function showPeek(f) {
    const p = PHOTOS[f.dataset.k]; if (!p || f !== peekFor) return;
    // Same 960px file the card already loaded, so it's usually instant from cache
    const pimg = peek.querySelector("img");
    if (pimg.getAttribute("src") !== p.src) {
      peek.classList.add("loading");
      pimg.onload = pimg.onerror = () => peek.classList.remove("loading");
      pimg.src = p.src;
      if (pimg.complete) peek.classList.remove("loading");
    }
    peek.querySelector(".pk-cap").textContent = `${p.title.replace(/\.\w+$/, "")} · ${p.by} · ${p.lic}`;
    const r = f.getBoundingClientRect(), own = f.querySelector("img");
    const ratio = own && own.naturalWidth ? own.naturalWidth / own.naturalHeight : 4 / 3;
    pimg.style.aspectRatio = String(ratio);
    const topBar = $(".journeybar").getBoundingClientRect().bottom;
    let w = Math.min(520, innerWidth * .44), h = w / ratio + 34;
    const maxH = innerHeight - topBar - 24;
    if (h > maxH) { w = (maxH - 34) * ratio; h = maxH; }
    let left = r.right + 18, side = "r";
    if (left + w > innerWidth - 10) { left = r.left - 18 - w; side = "l"; }
    if (left < 10) { left = Math.min(Math.max(10, r.left + r.width / 2 - w / 2), innerWidth - w - 10); side = "c"; }
    const top = Math.min(Math.max(topBar + 12, r.top + r.height / 2 - h / 2), innerHeight - h - 12);
    Object.assign(peek.style, { width: w + "px", left: left + "px", top: top + "px" });
    peek.dataset.side = side;
    peek.classList.add("show");
  }
  document.addEventListener("mouseover", e => {
    if (!canHover.matches) return;
    const f = e.target.closest && e.target.closest(".ph[data-k]");
    if (!f || f.classList.contains("no-peek") || f.classList.contains("ph-fail") || f === peekFor) return;
    peekFor = f; clearTimeout(peekTimer);
    peekTimer = setTimeout(() => showPeek(f), 80);
  });
  document.addEventListener("mouseout", e => {
    const f = e.target.closest && e.target.closest(".ph[data-k]");
    if (f && f === peekFor && !f.contains(e.relatedTarget)) hidePeek();
  });
  addEventListener("scroll", hidePeek, { passive: true });
  let flashTimer;
  function flash(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(flashTimer); flashTimer = setTimeout(() => el.classList.remove("show"), 1400);
  }
  // Image load failures (offline) fall back to a coloured tile
  document.addEventListener("error", e => {
    if (e.target && e.target.tagName === "IMG") { const f = e.target.closest(".ph"); if (f) f.classList.add("ph-fail"); }
  }, true);

  /* ---------------- dates / journey ---------------- */
  function todayISO() {
    if (ui.today) return ui.today;
    const d = new Date(); const off = d.getTimezoneOffset();
    return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
  }
  function journey() {
    const days = state.itinerary.map(d => d.date);
    const start = days[0], end = days[days.length - 1];
    const t = todayISO();
    const n = days.length;
    const toStart = Math.round((new Date(start) - new Date(t)) / DAY_MS);
    if (t < start) return { phase: "before", n, toStart, pct: 0, idx: -1 };
    if (t > end) return { phase: "after", n, pct: 100, idx: n };
    const idx = days.indexOf(t) > -1 ? days.indexOf(t) : days.findIndex(d => d > t) - 1;
    const now = new Date(); const frac = ui.today ? 0.5 : (now.getHours() * 60 + now.getMinutes()) / 1440;
    const day = state.itinerary[idx];
    const cityLeft = state.itinerary.slice(idx + 1).filter(d => d.city === day.city).length;
    return { phase: "during", n, idx, day, left: n - idx - 1, cityLeft, pct: Math.min(100, ((idx + frac) / n) * 100) };
  }
  function nextUp(j) {
    if (j.phase === "before") { const d = state.itinerary[0]; return { when: fmtDate(d.date), a: d.activities[0] }; }
    if (j.phase !== "during") return null;
    const hm = ui.today ? "00:00" : new Date().toTimeString().slice(0, 5);
    const pending = j.day.activities.find(a => !a.done && /^\d/.test(a.time) && a.time >= hm) || j.day.activities.find(a => !a.done);
    if (pending) return { when: "Today", a: pending };
    const tomorrow = state.itinerary[j.idx + 1];
    return tomorrow ? { when: "Tomorrow", a: tomorrow.activities[0] } : null;
  }
  function segments() {
    const segs = [];
    state.itinerary.forEach(d => {
      const last = segs[segs.length - 1];
      if (last && last.city === d.city) last.n++; else segs.push({ city: d.city, n: 1 });
    });
    return segs;
  }

  function journeyBar() {
    const j = journey();
    const label = j.phase === "before" ? `<b>${j.toStart}</b> days to takeoff ✈️`
      : j.phase === "during" ? `Day <b>${j.idx + 1}</b>/${j.n} · ${CITIES[j.day.city]?.emoji || ""} ${esc(j.day.city)}`
      : `Trip complete 🎉`;
    const right = j.phase === "during" ? `<b>${j.left}</b> ${j.left === 1 ? "day" : "days"} left` : j.phase === "before" ? `${fmtDate(TRIP_META.dates.start, { day: "numeric", month: "short" })} to ${fmtDate(TRIP_META.dates.end, { day: "numeric", month: "short" })}` : "Welcome home";
    return `
      <button class="jb-label" data-tab="overview" title="Open the journey tracker">${label}</button>
      <div class="jb-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(j.pct)}" aria-label="Trip progress">
        ${segments().map(s => `<span class="jb-seg c-${CITIES[s.city]?.color}" style="flex:${s.n}" title="${esc(s.city)}: ${s.n} ${s.n > 1 ? "days" : "day"}"></span>`).join("")}
        <span class="jb-pin" style="left:${j.pct}%"></span>
      </div>
      <span class="jb-right">${right}</span>`;
  }

  /* ---------------- weather ---------------- */
  function liveWx() { try { const c = JSON.parse(localStorage.getItem(WX_KEY) || "null"); return c && c.data ? c : null; } catch (e) { return null; } }
  const WMO = c => c === 0 ? "☀️" : c <= 2 ? "🌤️" : c === 3 ? "☁️" : c <= 48 ? "🌫️" : c <= 67 ? "🌧️" : c <= 77 ? "🌨️" : c <= 82 ? "🌦️" : "⛈️";
  function wxFor(date, place) {
    const live = liveWx()?.data?.[place]?.[date];
    const norm = WX_NORMALS[place]?.[date];
    if (live) return { live: true, hi: live.hi, lo: live.lo, rain: live.rain, icon: WMO(live.code), set: norm?.set, rise: norm?.rise };
    if (!norm) return null;
    const icon = norm.rain >= 40 ? "🌧️" : norm.rain >= 25 ? "🌦️" : norm.cloud >= 55 ? "☁️" : norm.cloud >= 35 ? "⛅" : "☀️";
    return { live: false, ...norm, icon };
  }
  function vibe(w) {
    if (!w) return "";
    if (w.lo <= 1) return "🥶 frosty dawn";
    if (w.rain >= 40) return "☔ umbrella day";
    if (w.hi >= 23) return "🩳 T-shirt weather";
    if (w.lo <= 5) return "🧥 layer up";
    if (w.hi <= 15) return "🧣 jacket day";
    return "😎 comfy";
  }
  function wxChips(d, compact) {
    return (d.wx || []).map(p => {
      const w = wxFor(d.date, p); if (!w) return "";
      return `<div class="wx ${w.live ? "live" : ""}">
        <span class="wx-ic">${w.icon}</span>
        <span class="wx-main"><b>${esc(WX_PLACES[p].name)}</b> ${w.hi}° / ${w.lo}°</span>
        <span class="wx-sub">${w.live ? `${w.rain}% rain chance` : `rained ${Math.round(w.rain / 10)} of 10 yrs`}${!compact && w.set ? ` · sunset ${w.set}` : ""}</span>
        ${!compact ? `<span class="wx-vibe">${vibe(w)}</span>` : ""}
      </div>`;
    }).join("");
  }
  async function refreshLiveWx() {
    const start = new Date(TRIP_META.dates.start), end = new Date(TRIP_META.dates.end), now = new Date();
    if (ui.today || !navigator.onLine || (start - now) / DAY_MS > 16 || now - end > DAY_MS) return;
    const cached = liveWx(); if (cached && Date.now() - cached.ts < 3 * 3600 * 1000) return;
    const data = {};
    try {
      await Promise.all(Object.entries(WX_PLACES).map(async ([k, p]) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}${p.elev ? "&elevation=" + p.elev : ""}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=Europe%2FIstanbul&forecast_days=16`;
        const r = await fetch(url); if (!r.ok) return; const j = await r.json();
        data[k] = {};
        j.daily.time.forEach((t, i) => { data[k][t] = { hi: Math.round(j.daily.temperature_2m_max[i]), lo: Math.round(j.daily.temperature_2m_min[i]), rain: j.daily.precipitation_probability_max[i] ?? 0, code: j.daily.weather_code[i] }; });
      }));
      localStorage.setItem(WX_KEY, JSON.stringify({ ts: Date.now(), data }));
      render();
    } catch (e) { /* offline or blocked: normals stay */ }
  }

  /* ---------------- budget maths ---------------- */
  function activityCosts() {
    let core = 0, optional = 0; const byDay = {}, byCity = {};
    state.itinerary.forEach(d => d.activities.forEach(a => {
      const c = Number(a.cost) || 0;
      if (a.priority === "optional") optional += c; else core += c;
      byDay[d.date] = (byDay[d.date] || 0) + c;
      byCity[d.city] = (byCity[d.city] || 0) + c;
    }));
    return { core, optional, all: core + optional, byDay, byCity };
  }
  function linesTotal() { return state.budgetLines.reduce((s, l) => s + (Number(l.amount) || 0), 0); }
  function budgetSummary() { const a = activityCosts(), l = linesTotal(); return { a, l, core: a.core + l, all: a.all + l }; }
  const sumIds = ids => state.budgetLines.filter(l => ids.includes(l.id)).reduce((s, l) => s + (Number(l.amount) || 0), 0);

  /* ---------------- chrome ---------------- */
  const TABS = [["overview", "Overview"], ["itinerary", "The plan"], ["intel", "Intel Corner"], ["logistics", "Logistics"], ["money", "Money"], ["packing", "Pack"]];

  function render() {
    $("#nav").innerHTML = TABS.map(([k, v]) => `<button class="tab ${ui.tab === k ? "on" : ""}" data-tab="${k}" ${ui.tab === k ? 'aria-current="page"' : ""}>${v}</button>`).join("");
    $("#journeybar").innerHTML = journeyBar();
    const view = { overview: vOverview, itinerary: vItinerary, intel: vIntel, logistics: vLogistics, money: vMoney, packing: vPacking }[ui.tab];
    $("#view").innerHTML = view();
    if (ui.tab === "intel" && ui.intel === "driving") updateFuel();
    reveal();
  }
  function go(tab, sub) {
    ui.tab = tab; if (sub) ui.intel = sub;
    history.replaceState(null, "", location.search + "#" + tab + (tab === "intel" ? "/" + ui.intel : ""));
    render(); window.scrollTo({ top: 0 });
  }
  let io;
  function reveal() {
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".reveal").forEach(e => e.classList.add("in")); return; }
    io && io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal:not(.in)").forEach(e => io.observe(e));
  }

  /* ================= OVERVIEW ================= */
  function vOverview() {
    const b = budgetSummary();
    const pct = Math.min(100, (b.core / TRIP_META.budget.max) * 100);
    const over = b.core - TRIP_META.budget.max;
    const km = state.itinerary.reduce((s, d) => s + (Number(d.drive?.km) || 0), 0);
    const acts = state.itinerary.flatMap(d => d.activities);
    const done = acts.filter(a => a.done).length;
    const exFlights = b.core - sumIds(["b1", "b3"]);

    return `
    <section class="hero">
      <div class="hero-copy">
        <h1>Our Turkey era starts <span class="hl">4 Nov</span>.</h1>
        <p class="lede">11 nights, 3 cities, 1 balloon. Everything planned, priced and fact-checked in one place.</p>
        <div class="cta-row">
          <button class="btn primary big" data-tab="itinerary">See the plan →</button>
          <button class="btn big" data-intel="restaurants" data-go="intel">Intel Corner</button>
        </div>
      </div>
      <div class="collage" aria-hidden="true">
        ${photo("hero", "c1 no-peek", "", true)}${photo("city_antalya", "c2 no-peek")}${photo("city_istanbul", "c3 no-peek")}
        <span class="sticker s1">🎈 balloon szn</span><span class="sticker s2">kid-approved ✓</span>
      </div>
    </section>

    <div class="marquee" aria-hidden="true"><div class="mq-track">${Array(2).fill("<span>ANTALYA</span><i>✦</i><span>CAPPADOCIA</span><i>✦</i><span>ISTANBUL</span><i>✦</i><span>11 NIGHTS</span><i>✦</i><span>1 BALLOON</span><i>✦</i><span>0 STRESS</span><i>✦</i>").join("")}</div></div>

    ${trackerPanel()}

    <section class="bento reveal">
      <div class="tile t-nights">${photo("city_cappadocia", "tile-bg no-peek")}<div class="tile-in"><small>Nights</small><b>11</b><span>Antalya 3 · Cappadocia 3 · Istanbul 5</span></div></div>
      <div class="tile t-drive c-lime"><small>Driving</small><b>${km.toLocaleString("en-IN")} km</b><span>Big days: 7 &amp; 10 Nov</span></div>
      <div class="tile t-cost c-pink"><small>Core cost</small><b>${lakh(b.core)}</b><span>${lakh(b.all)} with optional extras</span></div>
      <div class="tile t-done c-aqua"><small>Done</small><b>${done}/${acts.length}</b><span>Tick things off in The plan</span></div>
    </section>

    <section class="panel reveal">
      <div class="panel-h"><h2>The money talk 💸</h2><span class="muted">Target ${lakh(TRIP_META.budget.min)} to ${lakh(TRIP_META.budget.max)}</span></div>
      <div class="meter"><div class="fill ${over > 0 ? "over" : ""}" style="width:${pct}%"></div><span class="tick" style="left:${(TRIP_META.budget.min / TRIP_META.budget.max) * 100}%"></span></div>
      <p class="meter-note">${over > 0 ? `<b class="neg">${inr(over)} over</b> the ₹6 L ceiling on the core plan. Without international flights and visas: <b>${lakh(exFlights)}</b>.` : `<b class="pos">${inr(-over)} left</b> under the ₹6 L ceiling.`}</p>
      <div class="budget-grid">
        <div>
          <h3>Fixed costs <span class="muted">(tap a number to edit)</span></h3>
          <div class="lines">${state.budgetLines.map(l => `<div class="line">
            <div><span class="l-lab">${esc(l.label)}</span> ${statusBadge(l.status)}${l.note ? `<div class="sub">${esc(l.note)}</div>` : ""}</div>
            <input class="amt" type="number" min="0" step="500" data-line="${l.id}" value="${l.amount}" aria-label="${esc(l.label)} amount"></div>`).join("")}</div>
        </div>
        <div>
          <h3>Activities &amp; meals <span class="muted">(from the plan)</span></h3>
          <div class="bars">${state.itinerary.map(d => {
            const v = b.a.byDay[d.date] || 0, max = Math.max(...Object.values(b.a.byDay), 1);
            return `<div class="bar-row"><span>${fmtDate(d.date, { day: "numeric", month: "short" })}</span><div class="bar"><i class="c-${CITIES[d.city]?.color}" style="width:${(v / max) * 100}%"></i></div><span class="num">${inr(v)}</span></div>`;
          }).join("")}</div>
          <div class="totals">
            <div><span>Fixed</span><b>${inr(b.l)}</b></div>
            <div><span>Core activities</span><b>${inr(b.a.core)}</b></div>
            <div><span>Optional extras</span><b>${inr(b.a.optional)}</b></div>
            <div class="grand"><span>Grand total (core)</span><b>${inr(b.core)}</b><small>${tryOf(b.core)}</small></div>
            <div><span>Left vs ₹6 L</span><b class="${over > 0 ? "neg" : "pos"}">${inr(TRIP_META.budget.max - b.core)}</b></div>
          </div>
          <p class="muted small">Shopping excluded. €1 = ₹${FX.EUR}, US$1 = ₹${FX.USD}, ₺1 = ₹${FX.TRY} (${esc(FX.asOf)}).</p>
        </div>
      </div>
    </section>

    <section class="reveal">
      <h2 class="sec-h">Big calls we made</h2>
      <div class="decisions">${DECISIONS.map(d => `
        <article class="decision">
          ${photo(d.img, "d-img")}
          <div class="d-body">
            <h3>${esc(d.topic)}</h3>
            <dl>
              <dt>My plan</dt><dd>${esc(d.mine)}</dd>
              <dt>Finding</dt><dd>${esc(d.finding)} ${evidenceIn(d.finding)}</dd>
              <dt class="rec">Do this</dt><dd class="rec">${esc(d.rec)}</dd>
              <dt>Why</dt><dd>${esc(d.why)}</dd>
            </dl>
          </div>
        </article>`).join("")}</div>
    </section>

    <section class="panel alerts reveal">
      <h2>Check before you book ⚠️</h2>
      <div class="checks">
        <div>${statusBadge("Needs confirmation")} <b>Outbound flight time.</b> You noted 12:30 to 18:30. IndiGo's published 6E17 is 08:30 to 13:50.</div>
        <div>${statusBadge("Needs confirmation")} <b>Return flight.</b> The published 6E18 leaves IST at 17:55. The 15 Nov plan assumes this.</div>
        <div>${statusBadge("Verified")} <b>Booster seat is the law.</b> Under 150 cm and 36 kg means a child seat. No laps. <a href="#" data-go="intel" data-intel="driving">Read the rule →</a></div>
        <div>${statusBadge("Traveller-reported")} <b>IDP is mandatory</b> for an Indian licence. Get it at your RTO before you fly.</div>
        <div>${statusBadge("Needs confirmation")} <b>Visa.</b> Indian passports get an e-Visa only with a valid US/UK/Schengen/Irish visa or residence permit. Otherwise VFS.</div>
        <div>${statusBadge("Verified")} <b>10 Nov is Atatürk Memorial Day.</b> Sirens sound at 09:05 while you're driving.</div>
      </div>
    </section>`;
  }

  function trackerPanel() {
    const j = journey(), nu = nextUp(j), t = todayISO();
    const stops = ROUTE.filter(r => r.type === "stop"), legs = ROUTE.filter(r => r.type === "leg");
    const noon = d => new Date(d + "T12:00:00");
    const nights = s => Math.round((noon(s.to) - noon(s.from)) / DAY_MS);
    const span = s => `${noon(s.from).getDate()}-${noon(s.to).getDate()} ${noon(s.to).toLocaleDateString("en-GB", { month: "short" })}`;
    const stayWx = s => {
      const ws = [];
      for (let d = noon(s.from); d < noon(s.to); d = new Date(d.getTime() + DAY_MS)) { const w = wxFor(d.toISOString().slice(0, 10), s.wx); if (w) ws.push(w); }
      if (!ws.length) return null;
      const avg = k => Math.round(ws.reduce((a, w) => a + w[k], 0) / ws.length);
      const hi = avg("hi"), lo = avg("lo"), rain = avg("rain");
      return { hi, lo, icon: rain >= 30 ? "🌦️" : hi >= 22 ? "☀️" : "⛅" };
    };
    const stopState = s => t >= s.to ? "done" : t >= s.from ? "now" : "future";
    const nextStop = stops.find(s => stopState(s) === "future");
    const legToday = legs.find(l => l.date === t);
    const cur = stops.find(s => stopState(s) === "now");
    const total = state.itinerary.length, nightsTotal = total - 1;

    let title, sub;
    if (j.phase === "before") {
      title = `Trip starts in <span class="hl">${j.toStart} ${j.toStart === 1 ? "day" : "days"}</span>`;
      sub = `Leaves Mumbai ${fmtDate(TRIP_META.dates.start, { weekday: "short", day: "numeric", month: "short" })}, back home ${fmtDate(TRIP_META.dates.end, { weekday: "short", day: "numeric", month: "short" })}. ${total} days, ${nightsTotal} nights, 3 stops.`;
    } else if (j.phase === "during") {
      title = `Day ${j.idx + 1} of ${total}`;
      sub = legToday ? `${legToday.icon} Travel day: ${esc(legToday.text)}. ` : `${CITIES[cur?.city]?.emoji || ""} In ${esc(cur?.city || j.day.city)}. `;
      sub += `${j.left} ${j.left === 1 ? "day" : "days"} to go.`;
    } else {
      title = "Trip complete. Welcome home! 🎉"; sub = "Every stop done.";
    }

    const leg = l => `<div class="rt-leg ${l.date === t ? "now" : t > l.date ? "done" : ""}"><span class="rt-ic">${l.icon}</span><small>${fmtDate(l.date, { day: "numeric", month: "short" })}</small><span>${esc(l.text)}</span></div>`;
    const stop = s => {
      const st = stopState(s), w = stayWx(s), c = CITIES[s.city] || {};
      const badge = st === "done" ? '<span class="rt-badge done">✓ Done</span>' : st === "now" ? '<span class="rt-badge now">📍 You are here</span>' : s === nextStop ? '<span class="rt-badge next">Next stop</span>' : "";
      return `<article class="rt-stop c-${c.color} ${st}">${photo(c.img, "rt-img", s.city)}
        <div class="rt-body">${badge}<h3>${c.emoji || ""} ${esc(s.city)}</h3>
          <p class="rt-dates">${span(s)} · ${nights(s)} nights</p>
          ${w ? `<p class="rt-wx">${w.icon} About ${w.hi}° by day, ${w.lo}° at night</p>` : ""}
          <p class="rt-blurb">${esc(s.blurb)}</p></div></article>`;
    };

    return `
    <section class="tracker panel reveal">
      <div class="tr-head"><h2>${title}</h2><p class="lede">${sub}</p></div>
      <div class="tr-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(j.pct)}" aria-label="Trip progress">
        <div class="tr-segs">${segments().map(sg => `<span class="c-${CITIES[sg.city]?.color}" style="flex:${sg.n}">${sg.city === "Travel" ? "✈️" : sg.city === "Road trip" ? "🚗" : `<b class="full">${esc(sg.city)}</b><b class="short">${CITIES[sg.city]?.emoji || ""}</b>`}</span>`).join("")}</div>
        <div class="tr-fill" style="width:${j.pct}%"></div>
        ${j.phase === "during" ? `<span class="tr-pin" style="left:${j.pct}%"><i>Today</i></span>` : ""}
      </div>
      <div class="tr-ends"><span>${fmtDate(TRIP_META.dates.start, { day: "numeric", month: "short" })} · leave Mumbai</span><span>${fmtDate(TRIP_META.dates.end, { day: "numeric", month: "short" })} · home</span></div>
      <div class="route">${ROUTE.map(r => r.type === "leg" ? leg(r) : stop(r)).join("")}</div>
      ${nu && nu.a ? `<div class="tr-next"><small>${j.phase === "before" ? "First up" : "Next up"}</small><b>${esc(nu.when)}, ${esc(nu.a.time)}: ${esc(nu.a.title)}</b></div>` : ""}
      <details class="tr-preview" ${ui.today ? "open" : ""}><summary>Preview how this looks on another date</summary>
        <input type="date" id="previewDate" min="2026-10-01" max="2026-11-20" value="${ui.today || ""}" aria-label="Preview date">
        ${ui.today ? '<button class="btn sm" data-act="clear-preview">Back to today</button>' : ""}</details>
    </section>`;
  }

  /* ================= ITINERARY ================= */
  function matchesFocus(a) {
    switch (ui.focus) {
      case "All": return true;
      case "Must do": return a.priority === "must";
      case "Optional": return a.priority === "optional";
      case "Kids": return a.kids || a.category === "Kids";
      default: return a.category === ui.focus;
    }
  }

  function vItinerary() {
    const costs = activityCosts(); const j = journey();
    return `
    <section class="page-head"><h1>The plan, day by day.</h1><p class="lede">Weather on each card is the 10-year average for that exact date. It switches to the live forecast 16 days out.</p></section>
    <div class="toolbar-row">
      <div class="chips" role="group" aria-label="City">${["All", ...CITY_ORDER].map(c => `<button class="chip ${ui.city === c ? "on" : ""}" data-city="${c}">${c}</button>`).join("")}</div>
      <div class="chips" role="group" aria-label="Focus">${FOCUS.map(f => `<button class="chip ${ui.focus === f ? "on" : ""}" data-focus="${f}">${f}</button>`).join("")}</div>
      <div class="row-actions">
        <label class="toggle"><input type="checkbox" id="hideDone" ${ui.hideDone ? "checked" : ""}> Hide completed</label>
        <button class="btn primary" data-act="toggle-add">${ui.showAdd ? "Close" : "+ Add activity"}</button>
      </div>
    </div>
    ${ui.showAdd ? addForm() : ""}
    <div class="timeline">
      ${state.itinerary.map((d, di) => {
        if (ui.city !== "All" && d.city !== ui.city) return "";
        const list = d.activities.map((a, ai) => ({ a, ai })).filter(({ a }) => matchesFocus(a) && !(ui.hideDone && a.done));
        if (!list.length && (ui.focus !== "All" || ui.hideDone)) return "";
        const dayCost = costs.byDay[d.date] || 0;
        const isNow = j.phase === "during" && j.idx === di;
        return `
        <article class="day c-${CITIES[d.city]?.color} ${isNow ? "is-now" : ""} reveal" id="day-${d.date}">
          <div class="day-banner">${photo(d.img, "banner no-peek", d.title, true)}
            <div class="day-stamp"><b>${fmtDate(d.date, { day: "numeric" })}</b><span>${fmtDate(d.date, { weekday: "short", month: "short" })}</span></div>
            ${isNow ? '<span class="now-flag">📍 today</span>' : ""}
          </div>
          <header class="day-h">
            <div class="day-title">
              <span class="city">${CITIES[d.city]?.emoji || ""} ${esc(d.city)} · Day ${di + 1}</span>
              <h3>${esc(d.title)}</h3>
              <p class="meta">🛏 ${esc(d.stay)} · 🚗 ${esc(d.transport)}${Number(d.drive?.km) ? ` · <b>${d.drive.km} km / ${esc(d.drive.hours)} h</b>` : ""}</p>
            </div>
            <div class="day-cost"><b>${inr(dayCost)}</b><span>${tryOf(dayCost)}</span></div>
          </header>
          <div class="wx-row">${wxChips(d)}</div>
          <ol class="acts">${list.map(({ a, ai }) => ui.editing === a.id ? editRow(a, di) : actRow(a, ai, d.activities.length)).join("")}</ol>
          <details class="day-more">
            <summary>Kids · bookings · plan B</summary>
            <div class="more-grid">
              <div><h4>👶 Kids</h4><p>${esc(d.child)}</p></div>
              <div><h4>🎟 Bookings</h4><p>${esc(d.booking)}</p></div>
              <div><h4>☔ Plan B</h4><p>${esc(d.contingency)}</p></div>
            </div>
          </details>
        </article>`;
      }).join("")}
    </div>`;
  }

  function actRow(a, ai, n) {
    return `
    <li class="act ${a.done ? "done" : ""} p-${a.priority}">
      <label class="chk"><input type="checkbox" data-done="${a.id}" ${a.done ? "checked" : ""} aria-label="Mark done"></label>
      ${a.img ? photo(a.img, "thumb") : `<span class="time-only">${esc(a.time)}</span>`}
      <div class="act-body">
        <div class="act-title">${a.img ? `<span class="time">${esc(a.time)}</span>` : ""}${esc(a.title)}</div>
        <div class="act-meta">
          <span class="pri pri-${a.priority}">${PRIORITIES[a.priority] || a.priority}</span>
          <span class="cat">${esc(a.category)}</span>
          ${a.kids ? '<span class="cat kid">👶 kid-friendly</span>' : ""}
          ${a.duration ? `<span>⏱ ${esc(a.duration)}</span>` : ""}
          ${a.location ? `<a href="${maps(a.location + ", Turkey")}" target="_blank" rel="noopener">📍 ${esc(a.location)}</a>` : ""}
        </div>
        ${a.notes ? `<p class="note">${esc(a.notes)} ${evidenceIn(a.notes)}</p>` : ""}
      </div>
      <span class="cost">${a.cost ? inr(a.cost) : "free"}</span>
      <div class="act-tools">
        <button class="icon" title="Move up" data-move="${a.id}" data-dir="-1" ${ai === 0 ? "disabled" : ""}>↑</button>
        <button class="icon" title="Move down" data-move="${a.id}" data-dir="1" ${ai === n - 1 ? "disabled" : ""}>↓</button>
        <button class="icon" title="Edit" data-edit="${a.id}">✎</button>
        <button class="icon danger" title="Delete" data-del="${a.id}">✕</button>
      </div>
    </li>`;
  }

  function fields(a, dateSel) {
    const opt = (arr, v) => arr.map(x => { const [val, lab] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(val)}" ${val === v ? "selected" : ""}>${esc(lab)}</option>`; }).join("");
    return `
      ${dateSel ? `<label>Date<select name="date">${state.itinerary.map(d => `<option value="${d.date}" ${d.date === dateSel ? "selected" : ""}>${fmtDate(d.date)} · ${esc(d.city)}</option>`).join("")}</select></label>` : ""}
      <label>Time<input name="time" value="${esc(a.time || "")}" placeholder="10:00"></label>
      <label class="wide">Activity<input name="title" required value="${esc(a.title || "")}"></label>
      <label>Location<input name="location" value="${esc(a.location || "")}"></label>
      <label>Category<select name="category">${opt(CATEGORIES, a.category || "Sightseeing")}</select></label>
      <label>Duration<input name="duration" value="${esc(a.duration || "")}" placeholder="2 h"></label>
      <label>Cost (₹, family)<input name="cost" type="number" min="0" step="100" value="${a.cost ?? 0}"></label>
      <label>Priority<select name="priority">${opt(Object.entries(PRIORITIES), a.priority || "good")}</select></label>
      <label class="check"><input type="checkbox" name="kids" ${a.kids ? "checked" : ""}> Kid-friendly</label>
      <label class="wide">Notes<input name="notes" value="${esc(a.notes || "")}"></label>`;
  }
  function addForm() {
    const def = ui.city !== "All" ? (state.itinerary.find(d => d.city === ui.city)?.date || state.itinerary[0].date) : state.itinerary[1].date;
    return `<form class="card-form" id="addForm"><h3>Add an activity</h3><div class="form-grid">${fields({}, def)}</div>
      <div class="form-actions"><button class="btn primary" type="submit">Add to the plan</button></div></form>`;
  }
  function editRow(a, di) {
    return `<li class="act editing"><form class="card-form inline" data-editform="${a.id}"><div class="form-grid">${fields(a, state.itinerary[di].date)}</div>
      <div class="form-actions"><button class="btn primary" type="submit">Save</button><button class="btn" type="button" data-act="cancel-edit">Cancel</button></div></form></li>`;
  }
  function readForm(form) {
    const f = new FormData(form);
    return {
      date: f.get("date"), time: (f.get("time") || "").trim(), title: (f.get("title") || "").trim(),
      location: (f.get("location") || "").trim(), category: f.get("category"), duration: (f.get("duration") || "").trim(),
      cost: Number(f.get("cost")) || 0, priority: f.get("priority"), kids: f.get("kids") === "on", notes: (f.get("notes") || "").trim()
    };
  }
  function findAct(id) {
    for (const d of state.itinerary) { const i = d.activities.findIndex(a => a.id === id); if (i > -1) return { d, i, a: d.activities[i] }; }
    return null;
  }

  /* ================= INTEL CORNER ================= */
  function vIntel() {
    const subs = [["restaurants", "🍽 Food"], ["activities", "🎟 Activities"], ["stays", "🏠 Stays"], ["driving", "🚗 Driving + booster law"]];
    const body = { restaurants: () => iRestaurants() + sweetsPanel(), activities: iActivities, stays: iStays, driving: iDriving }[ui.intel]();
    return `
      <section class="page-head intel-head">
        <h1>Intel Corner: the real tea ☕</h1>
        <p class="lede">What reviews, rules and receipts actually say. Every fact is tagged ${statusBadge("Verified")} ${statusBadge("Estimated")} ${statusBadge("Traveller-reported")} ${statusBadge("Needs confirmation")}</p>
        <nav class="subnav">${subs.map(([k, v]) => `<button class="subtab ${ui.intel === k ? "on" : ""}" data-intel="${k}">${v}</button>`).join("")}</nav>
      </section>
      ${body}`;
  }
  function cityChips(key, cities) {
    return `<div class="chips">${["All", ...cities].map(c => `<button class="chip ${ui[key] === c ? "on" : ""}" data-filter="${key}" data-val="${c}">${c}</button>`).join("")}</div>`;
  }
  function rating(label, r) {
    if (!r) return `<span class="rt none">${label} n/a</span>`;
    return `<span class="rt"><b>${label}</b> ${r[0].toFixed(1)}★<small> (${r[1].toLocaleString("en-IN")})</small></span>`;
  }

  function iRestaurants() {
    const list = RESTAURANTS.filter(r => ui.restCity === "All" || r.city === ui.restCity);
    const below = RESTAURANTS_BELOW_BAR.filter(r => ui.restCity === "All" || r.city === ui.restCity);
    return `
      <section class="panel">
        <div class="panel-h"><h2>Rated Google 4.3+ with 300+ reviews</h2>${cityChips("restCity", ["Antalya", "Road trip", "Cappadocia", "Istanbul"])}</div>
        <p class="callout">${statusBadge("Traveller-reported")} <b>Halal:</b> ${esc(HALAL_NOTE)}</p>
        <p class="muted small">Ratings from Wanderlog's aggregation of Google Maps and TripAdvisor, checked 19 Sep 2026. Photos are kebab and grill inspiration from Wikimedia Commons, not the restaurant's own plates. Hover a photo to enlarge it. Cards are widely accepted at sit-down places, but carry ₺ for cafés and tips.</p>
        <div class="grid cards">${list.map(r => `
          <article class="rcard reveal">
            ${photo(r.img, "rc-img")}
            <div class="rc-body">
              <div class="rc-top"><span class="city c-${CITIES[r.city]?.color}">${esc(r.city)}</span><span class="price">${esc(r.price)}</span></div>
              <h3>${esc(r.name)}</h3>
              <p class="muted small">${esc(r.cuisine)} · ${esc(r.area)}</p>
              <div class="ratings">${rating("G", r.g)}${rating("TA", r.ta)}</div>
              ${r.ta && r.g && r.g[0] - r.ta[0] >= 0.8 ? `<p class="warn-line">Google and TripAdvisor disagree. Read recent reviews first.</p>` : ""}
              <p class="small"><b>For the kids:</b> ${esc(r.kids)}</p>
              <p class="small"><b>Halal:</b> Traveller-reported · <b>Alcohol:</b> ${esc(r.alcohol)}</p>
              ${r.why ? `<p class="why">${esc(r.why)}</p>` : ""}
              <a class="link" href="${maps(r.name + " " + r.area)}" target="_blank" rel="noopener">Open in Maps →</a>
            </div>
          </article>`).join("")}</div>
        ${below.length ? `<details class="below"><summary>Famous but below the bar, or with issues (${below.length})</summary>
          <div class="below-grid">${below.map(r => `<div><b>${esc(r.name)}</b> <span class="muted">· ${esc(r.city)} · ${r.g ? `G ${r.g[0]} (${r.g[1].toLocaleString("en-IN")})` : "no rating"}</span><p class="small">${esc(r.note)}</p></div>`).join("")}</div></details>` : ""}
      </section>`;
  }

  function sweetsPanel() {
    return `
      <section class="panel sweets reveal">
        <div class="panel-h"><h2>Sweets &amp; Turkish delights 🍬</h2><span class="muted">Mostly Istanbul. Any pastane (patisserie) in Antalya or Göreme sells baklava and lokum too.</span></div>
        <div class="sweet-grid">${SWEETS.map(sw => `
          <article class="sweet">
            ${photo(sw.img, "sw-img", sw.name)}
            <div class="sw-body">
              <h3>${esc(sw.name)} <small>${esc(sw.tr)}</small></h3>
              <p class="small">${esc(sw.what)}</p>
              <p class="small"><b>For the kids:</b> ${esc(sw.kids)}</p>
              <span class="sw-home">🎁 ${esc(sw.home)}</span>
              <div class="sw-places"><small>Try it at</small>${sw.places.map(p => `<a href="${maps(p.n + " " + p.a + " Istanbul")}" target="_blank" rel="noopener"><b>${esc(p.n)}</b><span>${esc(p.a)}</span>${p.g ? `<em>G ${p.g[0]}★ (${p.g[1].toLocaleString("en-IN")})</em>` : "<em>no rating</em>"}</a>`).join("")}</div>
              <p class="tip">💡 ${esc(sw.plan)}</p>
            </div>
          </article>`).join("")}</div>
      </section>`;
  }

  function iActivities() {
    const list = ACTIVITIES.filter(a => ui.actCity === "All" || a.city === ui.actCity);
    return `
      <section class="panel">
        <div class="panel-h"><h2>Providers &amp; price ranges (INR)</h2>${cityChips("actCity", ["Antalya", "Cappadocia", "Istanbul"])}</div>
        <p class="muted small">Per person unless noted. €1 = ₹${FX.EUR}, US$1 = ₹${FX.USD}. Viator and GetYourGuide "from" prices often exclude fees.</p>
        <div class="acts-intel">${list.map(a => `
          <article class="actcard reveal">
            ${photo(a.img, "ac-img", a.name)}
            <div class="ac-body">
              <span class="city c-${CITIES[a.city]?.color}">${esc(a.city)}</span>
              <h3>${esc(a.name)}</h3>
              <div class="ac-meta"><p><b>Who:</b> ${esc(a.who)}</p>${a.age ? `<p><b>Age:</b> ${esc(a.age)}</p>` : ""}<p><b>Best route:</b> ${esc(a.best)}</p></div>
              <div class="prov">${a.rows.map(r => `<a class="prov-row" href="${esc(r.url)}" target="_blank" rel="noopener"><b>${esc(r.p)}</b><span class="num">${esc(r.inr)}</span><small>${esc(r.note)} ${statusBadge(r.status)}</small></a>`).join("")}</div>
              ${a.tip ? `<p class="tip">💡 ${esc(a.tip)}</p>` : ""}
            </div>
          </article>`).join("")}</div>
      </section>`;
  }

  function avgScore(s) { const v = Object.values(s); return v.reduce((x, y) => x + y, 0) / v.length; }
  const VERDICT = { best: "Top pick", good: "Good", ok: "Workable", avoid: "Skip for this trip" };

  function iStays() {
    const micro = MICRO_LOCATIONS.filter(m => ui.stayCity === "All" || m.city === ui.stayCity);
    const lst = LISTINGS.filter(l => ui.stayCity === "All" || l.city === ui.stayCity);
    const mine = state.userListings.filter(l => ui.stayCity === "All" || l.city === ui.stayCity);
    return `
      <section class="panel">
        <div class="panel-h"><h2>Micro-areas scored for your family</h2>${cityChips("stayCity", ["Antalya", "Cappadocia", "Istanbul"])}</div>
        <p class="muted small">Scored 1-5 for this trip: a car, 7 bags, a 5-year-old, relaxed pace ${statusBadge("Estimated")}.</p>
        <div class="micro">${micro.map(m => `
          <article class="mcard v-${m.verdict} reveal">
            ${photo(m.img, "mc-img", m.name)}
            <div class="mc-body">
              <header><span class="city c-${CITIES[m.city]?.color}">${esc(m.city)}</span><span class="verdict">${VERDICT[m.verdict]}</span></header>
              <h3>${esc(m.name)}</h3>
              <div class="score-big">${avgScore(m.s).toFixed(1)}<small>/5</small></div>
              <div class="scores">${LOCATION_DIMENSIONS.map(([k, lab]) => `<div class="sc"><span>${lab}</span><span class="pips">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= m.s[k] ? "on" : ""}"></i>`).join("")}</span></div>`).join("")}</div>
              <p class="small"><b>👍</b> ${esc(m.good)}</p>
              <p class="small"><b>👎</b> ${esc(m.bad)}</p>
              ${m.tips ? `<p class="tip">💡 ${esc(m.tips)}</p>` : ""}
              <a class="link" href="${maps(m.name.split(":")[0].split("(")[0] + " " + m.city)}" target="_blank" rel="noopener">Map →</a>
            </div>
          </article>`).join("")}</div>
      </section>

      <section class="panel">
        <div class="panel-h"><h2>Listings spotted, with ratings</h2>${statusBadge("Needs confirmation")}</div>
        <p class="muted small">From public Airbnb and Booking pages on 19 Sep 2026. Availability and prices for 4-15 Nov were <b>not</b> checked. Search the title on the platform. Fewer than 20 reviews is unproven.</p>
        <div class="listing-grid">${lst.map(l => `
          <div class="listing">
            <div class="li-top"><b>${esc(l.name)}</b><span class="li-rate">${esc(l.rating)}${l.reviews != null ? `<small class="${l.reviews < 20 ? "neg" : ""}">${l.reviews} reviews</small>` : ""}</span></div>
            <div class="sub">${esc(l.platform)} · ${esc(l.area)}</div>
            <p class="small">${esc(l.beds)}</p>
            <p class="small"><b>Location:</b> ${esc(l.micro)}</p>
            <p class="small why">${esc(l.fit)}</p>
          </div>`).join("")}</div>
      </section>

      <section class="panel">
        <div class="panel-h"><h2>Score a listing you found</h2><span class="muted">Saved in this browser</span></div>
        <form class="card-form" id="listingForm"><div class="form-grid">
          <label>City<select name="city">${["Antalya", "Cappadocia", "Istanbul"].map(c => `<option>${c}</option>`).join("")}</select></label>
          <label class="wide">Listing name<input name="name" required placeholder="e.g. Sea-view 2BR, Konyaaltı"></label>
          <label>Link<input name="url" type="url" placeholder="https://"></label>
          <label>Rating<input name="rating" type="number" step="0.01" min="0" max="10" placeholder="4.9"></label>
          <label>Reviews<input name="reviews" type="number" min="0" placeholder="120"></label>
          <label>Price / night (₹)<input name="price" type="number" min="0" step="500"></label>
          <label class="wide">Micro-area<select name="micro">${MICRO_LOCATIONS.map((m, i) => `<option value="${i}">${esc(m.city)}: ${esc(m.name)}</option>`).join("")}</select></label>
          <label class="check"><input type="checkbox" name="parking"> Parking confirmed</label>
          <label class="check"><input type="checkbox" name="twobr"> 2+ bedrooms</label>
        </div><div class="form-actions"><button class="btn primary">Score it</button></div></form>
        ${mine.length ? `<div class="listing-grid">${mine.map(l => { const v = judgeListing(l); return `<div class="listing mine">
            <div class="li-top"><b>${l.url ? `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a>` : esc(l.name)}</b><span class="verdict-chip ${v.cls}">${v.text}</span></div>
            <div class="sub">${esc(l.city)} · ${esc(MICRO_LOCATIONS[l.micro]?.name || "")}${l.price ? " · " + inr(l.price) + "/night" : ""}</div>
            <p class="small">Rating ${esc(l.rating || "n/a")} · ${esc(l.reviews || 0)} reviews · Area score ${v.area.toFixed(1)}/5</p>
            ${v.notes.length ? `<p class="small warn-line">${v.notes.join(" · ")}</p>` : ""}
            <button class="btn sm danger" data-dellisting="${l.id}">Remove</button></div>`; }).join("")}</div>` : `<p class="empty">Nothing scored yet. Paste an Airbnb you like above and see how its area stacks up.</p>`}
      </section>`;
  }
  function judgeListing(l) {
    const m = MICRO_LOCATIONS[l.micro]; const area = m ? avgScore(m.s) : 0; const notes = [];
    const r = Number(l.rating) || 0, n = Number(l.reviews) || 0; const scale = r > 5 ? r / 2 : r;
    if (n < 20) notes.push("Few reviews");
    if (scale && scale < 4.7) notes.push("Rating below 4.7");
    if (!l.parking && l.city !== "Istanbul") notes.push("Confirm parking");
    if (!l.twobr) notes.push("Check 2 bedrooms");
    if (m?.verdict === "avoid") notes.push("Area flagged");
    if (l.price && l.price > 18000) notes.push("Above ₹18k target");
    let cls = "good", text = "Strong";
    if (m?.verdict === "avoid" || n < 10 || (scale && scale < 4.5)) { cls = "bad"; text = "Risky"; }
    else if (notes.length >= 2) { cls = "mid"; text = "Check details"; }
    return { area, cls, text, notes };
  }

  function iDriving() {
    const D = DRIVING, B = D.booster;
    return `
      <section class="panel booster reveal">
        <div class="booster-head">
          <div><h2>Is the booster seat mandatory?</h2><p class="verdict-big">${esc(B.verdict)}</p></div>
          <span class="sticker-lg">👶 150 cm / 36 kg rule</span>
        </div>
        <div class="law-grid">${B.law.map(l => `<div class="law"><h4>${esc(l.h)} ${statusBadge(l.s)}</h4><p>${esc(l.t)}</p></div>`).join("")}</div>
        <p class="callout fine-call">💸 ${esc(B.fine)} ${statusBadge(B.fineStatus)}</p>
        <h3 class="mt">Make it bearable for him</h3>
        <div class="comfort">${B.comfort.map((c, i) => `<div class="cf"><span class="cf-n">${i + 1}</span><div><b>${esc(c.h)}</b><p>${esc(c.t)}</p></div></div>`).join("")}</div>
        <p class="muted small">${esc(B.taxis)} Sources: Karayolları Trafik Yönetmeliği Art. 150 via Turkish legal guides (Türk Ehliyet, Avis TR), KTK 78/1-a, WHO growth standards, RoSPA via The Irish Times.</p>
      </section>

      <section class="panel fuel reveal">
        ${photo("drive_road", "banner-sm", "Taurus mountains road")}
        <div class="panel-h"><h2>Fuel: what goes in a petrol car</h2>${statusBadge(D.fuel.status)}</div>
        <div class="fuel-grid">
          <div class="fuel-card ok"><small>Fill with</small><b>${esc(D.fuel.grade)}</b></div>
          <div class="fuel-card bad"><small>Never</small><b>${esc(D.fuel.avoid)}</b></div>
        </div>
        <p class="muted">${esc(D.fuel.priceNote)}</p>
        <ul class="bullets">${D.fuel.howto.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
        <div class="calc">
          <h3>Fuel cost calculator</h3>
          <div class="calc-row">
            <label>Distance (km)<input id="fKm" type="number" min="0" value="${ui.fuelKm}"></label>
            <label>L / 100 km<input id="fCons" type="number" min="3" step="0.1" value="7"></label>
            <label>₺ / litre<input id="fPrice" type="number" min="1" step="0.5" value="${D.fuel.priceTRY}"></label>
            <div class="calc-out" id="fOut"></div>
          </div>
          <div class="chips">${[["Antalya to Göreme", 530], ["Göreme to Istanbul", 730], ["Sapanca day", 300], ["Whole trip", 2000]].map(([l, k]) => `<button class="chip" data-km="${k}">${l} · ${k} km</button>`).join("")}</div>
        </div>
      </section>

      <section class="panel reveal">
        <div class="panel-h"><h2>Speed limits (cars)</h2>${statusBadge("Verified")}</div>
        <div class="limits">${D.speed.map(r => `<div class="lim"><span class="limit">${esc(r[1])}</span><div><b>${esc(r[0])}</b><p class="small muted">${esc(r[2])}</p></div></div>`).join("")}</div>
        <p class="muted small">Always follow the posted sign. Cameras enforce the sign, not the general rule.</p>
      </section>

      <section class="panel reveal">
        <div class="panel-h"><h2>Why tourists get fined</h2>${statusBadge("Traveller-reported")}</div>
        <div class="reasons">${D.fineReasons.map((r, i) => `<div class="reason"><span class="r-n">${i + 1}</span><div><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div></div>`).join("")}</div>
      </section>

      <section class="panel reveal">
        <div class="panel-h"><h2>2026 fine amounts</h2></div>
        <div class="fines">${D.fines.map(r => `<div class="fine"><b class="f-amt">${esc(r[1])}</b><span>${esc(r[0])}</span><small>${esc(r[2])}</small></div>`).join("")}</div>
        <p class="muted small">${esc(D.finesStatus)} Only pay an on-the-spot fine against an official receipt.</p>
      </section>

      <section class="panel reveal">
        <div class="panel-h"><h2>Road words to recognise</h2></div>
        <div class="signs">${D.signs.map(([w, m]) => `<div class="sign"><b>${esc(w)}</b><span>${esc(m)}</span></div>`).join("")}</div>
      </section>

      <section class="panel reveal">
        <div class="panel-h"><h2>Before you turn the key</h2><span class="muted">Tick as you go</span></div>
        <ul class="checklist">${D.checklist.map((c, i) => `<li><label><input type="checkbox" data-dcheck="${i}" ${state.driveChecks[i] ? "checked" : ""}> ${esc(c)}</label></li>`).join("")}</ul>
      </section>`;
  }
  function updateFuel() {
    const km = Number($("#fKm")?.value) || 0, cons = Number($("#fCons")?.value) || 0, price = Number($("#fPrice")?.value) || 0;
    const litres = km * cons / 100, tryCost = litres * price;
    const out = $("#fOut");
    if (out) out.innerHTML = `<b>${Math.round(litres)} L</b><span>${tl(tryCost)} ≈ ${inr(tryCost * FX.TRY)}</span>`;
  }

  /* ================= LOGISTICS ================= */
  function dvfCalc() {
    const i = state.dvf;
    const fuelTRY = i.km * i.cons / 100 * i.fuelTRY;
    const drive = [
      ["Rental day (10 Nov)", i.rentalDayINR],
      [`Fuel ${i.km} km at ${i.cons} L/100 km`, fuelTRY * FX.TRY],
      ["Tolls (HGS)", i.tollsTRY * FX.TRY],
      ["Car idle on 11 Nov + parking", i.idleExtraINR],
      ["Car for the Sapanca day (same car)", i.rentalDayINR]
    ];
    const airFuelTRY = i.airportDriveKm * i.cons / 100 * i.fuelTRY;
    const fly = [
      [`${i.people} tickets NAV/ASR to IST`, i.ticketINR * i.people],
      ["Excess bags (if allowances aren't pooled)", i.bagFeeINR],
      [`Fuel to the airport (${i.airportDriveKm} km)`, airFuelTRY * FX.TRY],
      ["IST to apartment minivan", i.transferINR],
      ["1-day Istanbul rental for Sapanca", i.istRentalDayINR]
    ];
    const tot = a => a.reduce((s, [, v]) => s + v, 0);
    return { drive, fly, d: tot(drive), f: tot(fly), dayOnly: drive.slice(0, 3).reduce((s, [, v]) => s + v, 0) };
  }
  function vDvf() {
    const c = dvfCalc(), i = state.dvf; const diff = c.f - c.d;
    const input = (k, lab, step = 100) => `<label>${lab}<input type="number" step="${step}" min="0" data-dvf="${k}" value="${i[k]}"></label>`;
    return `
      <section class="panel duel reveal" id="dvf">
        <h2>Cappadocia to Istanbul: drive or fly?</h2>
        <p class="lede small">Your question, answered in rupees. Change any input and both sides recalculate.</p>
        <div class="duel-grid">
          <article class="side ${c.d <= c.f ? "win-cost" : ""}">
            ${photo("drive_motorway", "side-img", "Motorway")}
            <div class="side-body">
              <h3>🚗 Drive (Plan A)</h3>
              <p class="muted small">${esc(DRIVE_VS_FLY.time.drive)}</p>
              <div class="items">${c.drive.map(([k, v]) => `<div><span>${esc(k)}</span><b>${inr(v)}</b></div>`).join("")}</div>
              <div class="side-total"><span>Total</span><b>${inr(c.d)}</b></div>
              <p class="small">The drive day by itself costs <b>${inr(c.dayOnly)}</b> (rental + fuel + tolls).</p>
              ${c.d <= c.f ? '<span class="sticker">💰 cheaper</span>' : ""}
            </div>
          </article>
          <div class="vs">VS</div>
          <article class="side win-time ${c.f < c.d ? "win-cost" : ""}">
            ${photo("d04", "side-img", "Airport")}
            <div class="side-body">
              <h3>✈️ Fly (Plan C)</h3>
              <p class="muted small">${esc(DRIVE_VS_FLY.time.fly)}</p>
              <div class="items">${c.fly.map(([k, v]) => `<div><span>${esc(k)}</span><b>${inr(v)}</b></div>`).join("")}</div>
              <div class="side-total"><span>Total</span><b>${inr(c.f)}</b></div>
              <p class="small">Saves about <b>4-5 h</b> of the day and about <b>9 h</b> of booster time.</p>
              <span class="sticker">⚡ faster</span>${c.f < c.d ? '<span class="sticker">💰 cheaper</span>' : ""}
            </div>
          </article>
        </div>
        <div class="verdict-bar">${diff > 0
          ? `<b>Verdict:</b> flying costs <b>${inr(diff)}</b> more but buys back most of a day and spares your 5-year-old about 9 hours in a booster. <b>We'd fly.</b> If budget is the priority, drive and break at Tuz Gölü.`
          : `<b>Verdict:</b> flying is cheaper <i>and</i> faster with these inputs. <b>Fly.</b>`}</div>
        <details class="dvf-inputs"><summary>Tweak the inputs</summary>
          <div class="form-grid">
            ${input("km", "Drive distance (km)", 10)}${input("cons", "Car L/100 km", 0.1)}${input("fuelTRY", "Fuel ₺/L", 0.5)}${input("rentalDayINR", "Rental per day (₹)")}
            ${input("tollsTRY", "Tolls (₺)", 10)}${input("idleExtraINR", "Idle day + parking (₹)")}${input("ticketINR", "Ticket per person (₹)")}${input("people", "People", 1)}
            ${input("bagFeeINR", "Excess bags (₹)")}${input("airportDriveKm", "Hotel to airport (km)", 5)}${input("transferINR", "IST minivan (₹)")}${input("istRentalDayINR", "Istanbul 1-day rental (₹)")}
          </div>
          <ul class="bullets small">${Object.values(DRIVE_VS_FLY.notes).map(n => `<li>${esc(n)}</li>`).join("")}</ul>
          <button class="btn sm" data-act="reset-dvf">Reset inputs</button>
        </details>
      </section>`;
  }

  function lugCalc() {
    const L = state.luggage, M = LUGGAGE_MODEL;
    const travel = {}, stored = {};
    M.types.forEach(t => { const have = Math.max(0, L.have[t.key] || 0); const st = Math.min(have, Math.max(0, L.store[t.key] || 0)); stored[t.key] = st; travel[t.key] = have - st; });
    const car = M.cars.find(c => c.key === L.car) || M.cars[1];
    const fare = M.fares.find(f => f.key === L.fare) || M.fares[0];
    const bootL = M.types.filter(t => t.where !== "feet").reduce((s, t) => s + travel[t.key] * t.litres, 0);
    const usable = car.boot * M.packEff; const fill = bootL / usable * 100;
    const holdTypes = M.types.filter(t => t.where === "hold");
    const checkedKg = holdTypes.reduce((s, t) => s + travel[t.key] * t.kg, 0);
    const allowance = M.people * fare.kg;
    const excessKg = Math.max(0, checkedKg - allowance);
    const excessTRY = Math.ceil(excessKg / 3) * M.excessTRYper3kg;
    const heavyBag = holdTypes.some(t => travel[t.key] > 0 && t.kg > fare.kg);
    const cabinOk = travel.cabin <= M.people, personalOk = travel.backpack <= M.people;
    const wardrobe = M.types.reduce((s, t) => s + travel[t.key] * t.litres * (t.where === "feet" ? 0.5 : 1), 0) / M.people;
    const storeTRY = M.types.reduce((s, t) => s + stored[t.key] * t.storeTRY, 0) * (L.days || 0);
    const bigUp = travel.large + travel.medium;
    const homePieces = Object.values(L.have).reduce((a, b) => a + b, 0) + (L.shopping || 0);
    return { travel, stored, car, fare, bootL, usable, fill, checkedKg, allowance, excessKg, excessTRY, heavyBag, cabinOk, personalOk, wardrobe, storeTRY, bigUp, homePieces };
  }
  function syncStorageBudget() {
    const c = lugCalc(); const line = state.budgetLines.find(l => l.id === "b12");
    if (line) line.amount = Math.round(c.storeTRY * FX.TRY / 100) * 100;
  }
  function vLuggage() {
    const L = state.luggage, M = LUGGAGE_MODEL, c = lugCalc();
    const stepper = (grp, key, val) => `<span class="stepper"><button class="icon" data-lug="${grp}|${key}|-1" aria-label="minus">−</button><b>${val}</b><button class="icon" data-lug="${grp}|${key}|1" aria-label="plus">+</button></span>`;
    const fillCls = c.fill <= 85 ? "good" : c.fill <= 100 ? "mid" : "bad";
    const fillTxt = c.fill <= 85 ? "Fits with room to spare" : c.fill <= 100 ? "Tight. Soft bags help." : "Won't fit. Size up the car or store more.";
    const wardCls = c.wardrobe >= 75 ? "good" : c.wardrobe >= 50 ? "mid" : "bad";
    const wardTxt = c.wardrobe >= 75 ? "Comfortable for warm Antalya + cold Cappadocia" : c.wardrobe >= 50 ? "Tight. Plan a laundry stop." : "Very tight for 6 nights with winter layers";
    return `
      <section class="panel luggage reveal" id="luggage">
        <div class="panel-h"><h2>Luggage planner 🧳</h2><span class="muted">Your real bags, your call</span></div>
        <p class="lede small">You've got 2 large, 3 small and 2 backpacks. Set what you own and what (if anything) you'd leave at IST for the first 6 nights. Everything below recalculates, and storage cost flows into the budget.</p>
        <div class="presets">${M.presets.map((p, i) => `<button class="chip ${JSON.stringify(p.store) === JSON.stringify(L.store) ? "on" : ""}" data-preset="${i}">${esc(p.name)}</button>`).join("")}</div>
        <div class="lug-grid">
          <div class="lug-table">
            <div class="lt-h"><span>Bag</span><span>We own</span><span>Leave at IST</span><span>Travels</span></div>
            ${M.types.map(t => `<div class="lt-r"><span><b>${esc(t.label)}</b><small>about ${t.litres} L / ${t.kg} kg</small></span>${stepper("have", t.key, L.have[t.key] || 0)}${stepper("store", t.key, c.stored[t.key])}<b class="travel-n">${c.travel[t.key]}</b></div>`).join("")}
            <div class="lug-opts">
              <label>Rental car<select data-lugsel="car">${M.cars.map(k => `<option value="${k.key}" ${k.key === L.car ? "selected" : ""}>${esc(k.label)}, about ${k.boot} L</option>`).join("")}</select></label>
              <label>Domestic fare<select data-lugsel="fare">${M.fares.map(f => `<option value="${f.key}" ${f.key === L.fare ? "selected" : ""}>${esc(f.label)}</option>`).join("")}</select></label>
              <label>Storage days<input type="number" min="0" max="12" data-lugnum="days" value="${L.days}"></label>
              <label>Extra bags bought in Istanbul<input type="number" min="0" max="4" data-lugnum="shopping" value="${L.shopping}"></label>
            </div>
          </div>
          <div class="lug-out">
            <div class="lo ${fillCls}"><small>Car boot</small><b>${Math.round(c.fill)}% full</b><div class="mini-bar"><i style="width:${Math.min(100, c.fill)}%"></i></div><span>${fillTxt}. ${Math.round(c.bootL)} L of bags vs about ${Math.round(c.usable)} L usable. Backpacks ride at your feet.</span></div>
            <div class="lo ${c.excessKg > 0 ? "mid" : "good"}"><small>IST to AYT flight</small><b>${c.checkedKg} kg checked</b><span>Allowance ${c.allowance} kg (${c.fare.kg} kg × 4, if pooled). ${c.excessKg > 0 ? `About ${c.excessKg} kg over, roughly ${tl(c.excessTRY)} (${inr(c.excessTRY * FX.TRY)}).` : "Within allowance."} ${c.heavyBag ? "A large bag is heavier than one person's allowance, so book all 4 on one booking and ask TK to pool (Needs confirmation), or pick ExtraFly." : ""} ${!c.cabinOk ? "Too many cabin bags: max 1 each." : ""}${!c.personalOk ? " Too many personal items." : ""}</span></div>
            <div class="lo ${wardCls}"><small>Wardrobe space, first 6 nights</small><b>${Math.round(c.wardrobe)} L / person</b><span>${wardTxt} ${statusBadge("Estimated")}</span></div>
            <div class="lo ${c.storeTRY ? "mid" : "good"}"><small>Storage at IST</small><b>${c.storeTRY ? tl(c.storeTRY) : "₹0"}</b><span>${c.storeTRY ? `≈ ${inr(c.storeTRY * FX.TRY)} for ${L.days} days. Added to the budget automatically. The staffed desk is in arrivals, opposite Exit 13.` : "Nothing stored. No airport detour on the way back."}</span></div>
            <div class="lo ${c.bigUp > 2 ? "mid" : "good"}"><small>Cave-hotel stairs</small><b>${c.bigUp} big ${c.bigUp === 1 ? "bag" : "bags"}</b><span>Ask the hotel for porter help. Göreme lanes are steep.</span></div>
            <div class="lo"><small>Flying home</small><b>${c.homePieces} pieces</b><span>Confirm IndiGo's per-passenger allowance. Book a minivan to IST (a normal taxi won't fit this).</span></div>
          </div>
        </div>
      </section>`;
  }

  function vLogistics() {
    const cities = [["Antalya", "antalya", "2026-11-05"], ["Cappadocia", "goreme", "2026-11-08"], ["Istanbul", "istanbul", "2026-11-12"]];
    return `
      <section class="page-head"><h1>Bags, wheels &amp; wings.</h1><p class="lede">Drive vs fly, the luggage planner, road legs, weather and bookings.</p></section>
      ${vDvf()}
      ${vLuggage()}
      <section class="panel reveal">
        <div class="panel-h"><h2>Road legs</h2></div>
        <div class="legs">${DRIVING.legs.map(l => `<article class="leg-card"><h3>${esc(l.name)}</h3>
          <div class="leg-stats"><span><b>${esc(l.km)}</b> km</span><span><b>${esc(l.time)}</b></span></div>
          <p class="small"><b>Route:</b> ${esc(l.route)}</p><p class="small"><b>Tolls:</b> ${esc(l.tolls)}</p><p class="small"><b>Stops:</b> ${esc(l.stops)}</p><p class="tip">⚠️ ${esc(l.notes)}</p></article>`).join("")}</div>
      </section>
      <section class="panel reveal">
        <div class="panel-h"><h2>November weather, per city</h2>${statusBadge("Estimated")}</div>
        <p class="muted small">Average of 2016-2025 for these exact dates (Open-Meteo / ERA5 archive). Not a forecast. Each day in The plan shows its own numbers, and the live forecast kicks in 16 days out.</p>
        <div class="weather">${cities.map(([n, p, d]) => { const days = Object.values(WX_NORMALS[p]); const hi = Math.round(days.reduce((s, x) => s + x.hi, 0) / days.length), lo = Math.round(days.reduce((s, x) => s + x.lo, 0) / days.length); const w = WX_NORMALS[p][d]; return `
          <article class="wcard c-${CITIES[n].color}">${photo(CITIES[n].img, "w-img")}<div class="w-body"><h3>${esc(n)}</h3><b class="temp">${hi}° / ${lo}°</b><p class="small">Rain on about ${Math.round(days.reduce((s, x) => s + x.rain, 0) / days.length)}% of days · sunrise ${w.rise} · sunset ${w.set}</p><p class="small">${n === "Antalya" ? "Still T-shirt weather by day. The sea is swimmable for the brave." : n === "Cappadocia" ? "Frosty dawns around 2 °C for the balloon. Pack a down jacket, gloves and a beanie." : "Mild and often grey. A waterproof shell and umbrella earn their space."}</p></div></article>`; }).join("")}</div>
        <h3 class="mt">Plan B for everything</h3>
        <div class="contingency">${CONTINGENCIES.map(([k, v]) => `<div><b>${esc(k)}</b><p class="small">${esc(v)}</p></div>`).join("")}</div>
      </section>
      <section class="panel reveal">
        <div class="panel-h"><h2>Booking priority</h2></div>
        <div class="bookings">${Object.entries(BOOKINGS).map(([k, items], i) => `<div class="bcol b${i}"><h3>${esc(k)}</h3><ul>${items.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}</div>
      </section>`;
  }

  /* ================= MONEY ================= */
  function vMoney() {
    const M = MONEY;
    const days = { "Istanbul day": 0, "Cappadocia day": 0, "Antalya day": 0, "Road-trip day": 0 };
    state.itinerary.forEach(d => {
      if (d.city === "Istanbul") days["Istanbul day"]++;
      else if (d.city === "Cappadocia") days["Cappadocia day"]++;
      else if (d.city === "Antalya") days["Antalya day"]++;
      else if (d.city === "Road trip") days["Road-trip day"]++;
    });
    let total = 0;
    const rows = M.perDay.map(([k, v]) => { const n = k.startsWith("Emergency") ? 1 : (days[k] || 0); total += n * v; return { k, v, n }; });
    return `
      <section class="page-head money-head">${photo("money_bazaar", "banner-sm")}<div><h1>Money moves 💳</h1><p class="lede">Which card, how much cash, and the one rule that saves you 3-8%.</p></div></section>
      <section class="panel dcc reveal"><h2>The one rule: always pay and withdraw in TRY</h2><p>${esc(M.dcc)}</p></section>
      <section class="panel reveal">
        <div class="panel-h"><h2>Cards to carry</h2></div>
        <div class="grid cards">${M.cards.map(c => `<article class="rcard plain"><div class="rc-body"><span class="city c-lilac">${esc(c.role)}</span><h3>${esc(c.card)}</h3><p class="small">${esc(c.why)} ${evidenceIn(c.why)}</p><p class="warn-line">${esc(c.warn)}</p></div></article>`).join("")}</div>
        <p class="muted small">No card numbers or personal financial data are stored here.</p>
      </section>
      <section class="panel reveal">
        <div class="panel-h"><h2>Cash (Turkish Lira) estimate</h2>${statusBadge("Estimated")}</div>
        <div class="cash">${rows.map(r => `<div class="cash-tile"><small>${esc(r.k)}</small><b>${tl(r.v)}</b><span>× ${r.n} = ${tl(r.n * r.v)}</span></div>`).join("")}
          <div class="cash-tile total c-lime"><small>Total for the trip</small><b>${tl(total)}</b><span>≈ ${inr(total * FX.TRY)}</span></div></div>
        <div class="split">
          <div><h3>Cash to carry from India</h3><p>About <b>€200</b> (≈ ${inr(200 * FX.EUR)}) as an emergency backup only. Don't pre-buy lots of TRY in India, because the rates are poor.</p></div>
          <div><h3>Cash to withdraw there</h3><p>About ₺10,000 on arrival, then ₺8,000-10,000 in Cappadocia and again in Istanbul. Keep no more than about ₺5,000 in your pocket.</p></div>
        </div>
        <p class="muted small">${esc(M.plan)} Days are counted from your itinerary. Bazaar shopping cash is extra.</p>
      </section>
      <section class="panel reveal"><div class="panel-h"><h2>ATM strategy</h2>${statusBadge("Traveller-reported")}</div><ul class="bullets">${M.atm.map(a => `<li>${esc(a)}</li>`).join("")}</ul></section>
      <section class="panel reveal">
        <div class="panel-h"><h2>Pay with what, where</h2></div>
        <div class="paygrid">${M.table.map(r => `<div class="pay"><span>${esc(r[0])}</span><b>${esc(r[1])}</b><small>Backup: ${esc(r[2])}</small></div>`).join("")}</div>
        <h3 class="mt">Where cash matters ${statusBadge("Traveller-reported")}</h3>
        <div class="pills">${M.cashPlaces.map(c => `<span class="pill">${esc(c)}</span>`).join("")}</div>
      </section>`;
  }

  /* ================= PACKING ================= */
  function vPacking() {
    const all = Object.values(state.packing).flat(); const done = all.filter(i => i.done).length;
    return `
      <section class="page-head pack-head">${photo("winter", "banner-sm", "Cappadocia in winter")}<div><h1>Pack it up 🧳</h1><p class="lede">${done} of ${all.length} packed. Cappadocia dawns are about 2 °C and Antalya afternoons about 24 °C, so pack for both.</p></div></section>
      <div class="meter slim"><div class="fill" style="width:${all.length ? (done / all.length) * 100 : 0}%"></div></div>
      <div class="packing">${Object.entries(state.packing).map(([g, items]) => `
        <article class="pgroup reveal"><h3>${esc(g)} <small>${items.filter(i => i.done).length}/${items.length}</small></h3>
          <ul>${items.map(i => `<li class="${i.done ? "done" : ""}"><label><input type="checkbox" data-pack="${esc(g)}|${i.id}" ${i.done ? "checked" : ""}> ${esc(i.text)}</label><button class="icon danger sm" data-delpack="${esc(g)}|${i.id}" title="Remove">✕</button></li>`).join("")}</ul>
          <form class="padd" data-padd="${esc(g)}"><input name="t" placeholder="Add item" aria-label="Add item to ${esc(g)}"><button class="btn sm">Add</button></form>
        </article>`).join("")}</div>`;
  }

  /* ---------------- credits ---------------- */
  function renderCredits() {
    if (typeof PHOTOS === "undefined") return;
    const list = Object.values(PHOTOS);
    $("#credits").innerHTML = `<details><summary>Photo credits (${list.length} photos, Wikimedia Commons)</summary><ul>${list.map(p =>
      `<li><a href="${esc(p.page)}" target="_blank" rel="noopener">${esc(p.title.replace(/\.\w+$/, ""))}</a> by ${esc(p.by)}, ${esc(p.lic)}</li>`).join("")}</ul></details>`;
  }

  /* ================= EVENTS ================= */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a[data-go], [data-tab]"); if (!t) return;
    const ds = t.dataset;
    if (ds.go) { e.preventDefault(); return go(ds.go, ds.intel); }
    if (ds.tab) return go(ds.tab);
    if (ds.intel) { ui.intel = ds.intel; return go("intel", ds.intel); }
    if (ds.city) { ui.city = ds.city; return render(); }
    if (ds.focus) { ui.focus = ds.focus; return render(); }
    if (ds.filter) { ui[ds.filter] = ds.val; return render(); }
    if (ds.km) { ui.fuelKm = Number(ds.km); $("#fKm").value = ds.km; return updateFuel(); }
    if (ds.act === "toggle-add") { ui.showAdd = !ui.showAdd; return render(); }
    if (ds.act === "cancel-edit") { ui.editing = null; return render(); }
    if (ds.act === "clear-preview") { ui.today = null; return render(); }
    if (ds.act === "reset-dvf") { state.dvf = clone(DRIVE_VS_FLY.inputs); save(); return render(); }
    if (ds.edit) { ui.editing = ds.edit; return render(); }
    if (ds.del) {
      const f = findAct(ds.del); if (!f || !confirm(`Delete "${f.a.title}"?`)) return;
      f.d.activities.splice(f.i, 1); save(); return render();
    }
    if (ds.move) {
      const f = findAct(ds.move); if (!f) return; const j = f.i + Number(ds.dir);
      if (j < 0 || j >= f.d.activities.length) return;
      [f.d.activities[f.i], f.d.activities[j]] = [f.d.activities[j], f.d.activities[f.i]]; save(); return render();
    }
    if (ds.lug) {
      const [grp, key, delta] = ds.lug.split("|"); const L = state.luggage;
      L[grp][key] = Math.max(0, (L[grp][key] || 0) + Number(delta));
      if (grp === "have") L.store[key] = Math.min(L.store[key] || 0, L.have[key]);
      if (grp === "store") L.store[key] = Math.min(L.store[key], L.have[key] || 0);
      syncStorageBudget(); save(true); return render();
    }
    if (ds.preset) { state.luggage.store = clone(LUGGAGE_MODEL.presets[Number(ds.preset)].store); syncStorageBudget(); save(true); return render(); }
    if (ds.delpack) { const [g, id] = ds.delpack.split("|"); state.packing[g] = state.packing[g].filter(i => i.id !== id); save(); return render(); }
    if (ds.dellisting) { state.userListings = state.userListings.filter(l => l.id !== ds.dellisting); save(); return render(); }
  });

  document.addEventListener("change", e => {
    const t = e.target, ds = t.dataset;
    if (ds.done) { const f = findAct(ds.done); if (f) { f.a.done = t.checked; save(); render(); } return; }
    if (t.id === "hideDone") { ui.hideDone = t.checked; return render(); }
    if (t.id === "previewDate") { ui.today = t.value || null; return render(); }
    if (ds.line) { const l = state.budgetLines.find(x => x.id === ds.line); if (l) { l.amount = Number(t.value) || 0; save(); render(); } return; }
    if (ds.pack) { const [g, id] = ds.pack.split("|"); const it = state.packing[g].find(i => i.id === id); if (it) { it.done = t.checked; save(); render(); } return; }
    if (ds.dcheck !== undefined) { state.driveChecks[ds.dcheck] = t.checked; save(); return; }
    if (ds.lugsel) { state.luggage[ds.lugsel] = t.value; syncStorageBudget(); save(true); return render(); }
    if (ds.lugnum) { state.luggage[ds.lugnum] = Math.max(0, Number(t.value) || 0); syncStorageBudget(); save(true); return render(); }
    if (ds.dvf) { state.dvf[ds.dvf] = Math.max(0, Number(t.value) || 0); save(true); const open = true; render(); const d = document.querySelector(".dvf-inputs"); if (d) d.open = open; return; }
  });

  document.addEventListener("input", e => {
    if (["fKm", "fCons", "fPrice"].includes(e.target.id)) { if (e.target.id === "fKm") ui.fuelKm = Number(e.target.value) || 0; updateFuel(); }
  });

  document.addEventListener("submit", e => {
    const f = e.target; e.preventDefault();
    if (f.id === "addForm") {
      const v = readForm(f); if (!v.title) return;
      const day = state.itinerary.find(d => d.date === v.date); if (!day) return;
      const { date, ...rest } = v; day.activities.push({ id: uid(), done: false, transport: "", ...rest });
      ui.showAdd = false; save(); render(); flash("Added ✓"); return;
    }
    if (f.dataset.editform) {
      const found = findAct(f.dataset.editform); if (!found) return;
      const { date, ...rest } = readForm(f);
      Object.assign(found.a, rest);
      if (date && date !== found.d.date) { found.d.activities.splice(found.i, 1); state.itinerary.find(d => d.date === date).activities.push(found.a); }
      ui.editing = null; save(); render(); return;
    }
    if (f.dataset.padd) {
      const text = f.t.value.trim(); if (!text) return;
      state.packing[f.dataset.padd].push({ id: uid(), text, done: false }); save(); render(); return;
    }
    if (f.id === "listingForm") {
      const d = new FormData(f);
      state.userListings.push({ id: uid(), city: d.get("city"), name: d.get("name").trim(), url: d.get("url").trim(),
        rating: d.get("rating"), reviews: Number(d.get("reviews")) || 0, price: Number(d.get("price")) || 0,
        micro: Number(d.get("micro")), parking: d.get("parking") === "on", twobr: d.get("twobr") === "on" });
      save(); render();
    }
  });

  /* ---------------- toolbar ---------------- */
  $("#btnExport").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `turkey-trip-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $("#btnImport").addEventListener("click", () => $("#fileImport").click());
  $("#fileImport").addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const s = JSON.parse(r.result);
        if (!s || !Array.isArray(s.itinerary)) throw new Error("No itinerary array");
        state = s.version === 2 ? { ...defaults(), ...s } : migrate(s); save(); render(); flash("Imported ✓");
      } catch (err) { alert("Couldn't import this file: " + err.message); }
      e.target.value = "";
    };
    r.readAsText(file);
  });
  $("#btnPrint").addEventListener("click", () => {
    const prev = { tab: ui.tab, city: ui.city, focus: ui.focus, hideDone: ui.hideDone };
    Object.assign(ui, { tab: "itinerary", city: "All", focus: "All", hideDone: false, editing: null, showAdd: false });
    render();
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
    document.querySelectorAll("details.day-more").forEach(d => (d.open = true));
    setTimeout(() => { window.print(); Object.assign(ui, prev); render(); }, 80);
  });
  $("#btnReset").addEventListener("click", () => {
    if (!confirm("Reset everything to the researched defaults? Your edits will be lost (export first if unsure).")) return;
    state = defaults(); save(); render();
  });

  /* ---------------- boot ---------------- */
  const [h, sub] = location.hash.replace("#", "").split("/");
  if (TABS.some(([k]) => k === h)) ui.tab = h;
  if (sub) ui.intel = sub;
  const setTopH = () => document.documentElement.style.setProperty("--top-h", $(".top").offsetHeight + "px");
  setTopH(); addEventListener("resize", setTopH);
  syncStorageBudget();
  renderCredits();
  render();
  refreshLiveWx();
})();
