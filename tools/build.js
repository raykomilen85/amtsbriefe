// Builds the static help pages (Aufenthalt, Abschiebung, Sozialleistungen, Alltag, Familie & Schule, Auto/Gewerbe/Gesundheit) in 13 languages.
// Usage: node build.js  -> writes into ./out
const fs = require("fs");
const path = require("path");
const { SAMPLE, LABELS, LETTERS, head, foot } = require("./src/letters");
const C = Object.assign({}, require("./src/content-de-en-tr"), require("./src/content-bg-ar-uk"), require("./src/content-pl-ku"));
const SZ = require("./src/content-sozial");
for (const l of Object.keys(SZ)) C[l].sozial = SZ[l].sozial;
const AL = require("./src/content-alltag");
for (const l of Object.keys(AL)) C[l].alltag = AL[l].alltag;
Object.assign(C, require("./src/content-neu.json")); // el, fr, nl, ro, es
// "Familie & Schule" page: one JSON per language in src/familie/; contact URLs are language-independent.
// Facts checked 05.11.2026: gesetze-im-internet.de (PStG §§ 18-20, 59, 62; SGB VIII §§ 8, 17, 18, 24, 59; BGB §§ 1712, 1713),
// familienportal.de (Beistandschaft kostenlos; Kita-Suche; Anmeldung Standesamt), bra.nrw.de (§ 43 SchulG NRW).
const FAM_URLS = [
  "https://familienportal.de/familienportal/lebenslagen/ausbildung-beruf/kinderbetreuung/wie-finde-ich-einen-kita-platz--155596",
  "https://familienportal.de/familienportal/lebenslagen/schwangerschaft-geburt/anmeldung-standesamt/anmeldung-kind-standesamt--190402",
  "https://familienportal.de/familienportal/lebenslagen/trennung/allein-und-getrennt-erziehende-eltern/wie-kann-ich-unterhalt-und-vaterschaft-mit-einem-beistand-regeln--126098",
  "https://www.115.de/",
];
// "Auto, Gewerbe, Gesundheit" page. Facts checked 05.11.2026 on gesetze-im-internet.de: FeV §§ 28, 29, 31;
// FZV §§ 6, 15, 16, 25; KraftStG § 13; GewO §§ 14, 146; AufenthG § 4a; AO § 138; SGB IX §§ 2, 151, 152; SGG § 84;
// SGB XI §§ 7a, 7b, 15, 18, 18c, 33; bmv.de (i-Kfz), bundesgesundheitsministerium.de (Antrag auch telefonisch).
const AUTO_URLS = [
  "https://www.bmv.de/SharedDocs/DE/Artikel/StV/Strassenverkehr/internetbasierte-fahrzeugzulassung.html",
  "https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/pflegebeduerftig-was-nun",
  "https://www.115.de/",
];
for (const [dir, key, urls] of [["familie", "familie", FAM_URLS], ["auto", "auto", AUTO_URLS]]) for (const l of Object.keys(C)) {
  const f = JSON.parse(fs.readFileSync(path.join(__dirname, "src", dir, l + ".json"), "utf8"));
  f.contacts = f.contacts.map((c, i) => [c[0], c[1], c[2], urls[i]]);
  C[l][key] = f;
}

const SITE = "https://amtsbriefe.de";
const STAND = "05.11.2026";
const LANGS = [["de","Deutsch"],["tr","Türkçe"],["bg","Български"],["ar","العربية"],["uk","Українська"],["pl","Polski"],["en","English"],["el","Ελληνικά"],["fr","Français"],["nl","Nederlands"],["ro","Română"],["es","Español"],["ku","Kurdî"]];
const STEP = { de: "Schritt für Schritt", tr: "Adım adım", bg: "Стъпка по стъпка", ar: "خطوة بخطوة", uk: "Крок за кроком", pl: "Krok po kroku", en: "Step by step", el: "Βήμα προς βήμα", fr: "Étape par étape", nl: "Stap voor stap", ro: "Pas cu pas", es: "Paso a paso", ku: "Gav bi gav" };
const PAGES = { aufenthalt: "aufenthalt-laeuft-ab", abschiebung: "abschiebung-hilfe", sozial: "sozialleistungen-antrag", alltag: "alltag-briefvorlagen", familie: "familie-schule", auto: "auto-gewerbe-gesundheit" };
const SRC_SOZ = [["§ 25 WoGG","wogg/__25.html"],["§ 7 WoGG","wogg/__7.html"],["§ 6a BKGG","bkgg_1996/__6a.html"],["§ 7 BEEG","beeg/__7.html"],["§ 13 BEEG","beeg/__13.html"],["§ 4 UVG","uhvorschg/__4.html"],["§ 44 SGB XII","sgb_12/__44.html"],["§ 88 SGG","sgg/__88.html"],["§ 75 VwGO","vwgo/__75.html"]];
const SOURCES = {
  aufenthalt: [["§ 81 AufenthG","aufenthg_2004/__81.html"],["§ 84 AufenthG","aufenthg_2004/__84.html"],["§ 58 VwGO","vwgo/__58.html"],["§ 81 VwGO","vwgo/__81.html"],["§ 29 VwVfG","vwvfg/__29.html"],["§ 1 BerHG","berathig/__1.html"]],
  sozial: SRC_SOZ,
  alltag: [["§ 56 TKG","tkg_2021/__56.html"],["§ 309 BGB","bgb/__309.html"],["§ 312k BGB","bgb/__312k.html"],["§ 11 VVG","vvg_2008/__11.html"],["§ 13a RDG","rdg/__13a.html"],["§ 195 BGB","bgb/__195.html"],["§ 199 BGB","bgb/__199.html"],["§ 692 ZPO","zpo/__692.html"],["§ 536 BGB","bgb/__536.html"],["§ 536c BGB","bgb/__536c.html"],["§ 556 BGB","bgb/__556.html"],["§ 108 GewO","gewo/__108.html"],["§ 109 GewO","gewo/__109.html"]],
  familie: [["§ 18 PStG","pstg/__18.html"],["§ 19 PStG","pstg/__19.html"],["§ 20 PStG","pstg/__20.html"],["§ 59 PStG","pstg/__59.html"],["§ 62 PStG","pstg/__62.html"],["§ 24 SGB VIII","sgb_8/__24.html"],["§ 8 SGB VIII","sgb_8/__8.html"],["§ 17 SGB VIII","sgb_8/__17.html"],["§ 18 SGB VIII","sgb_8/__18.html"],["§ 59 SGB VIII","sgb_8/__59.html"],["§ 1712 BGB","bgb/__1712.html"],["§ 1713 BGB","bgb/__1713.html"]],
  auto: [["§ 29 FeV","fev_2010/__29.html"],["§ 28 FeV","fev_2010/__28.html"],["§ 31 FeV","fev_2010/__31.html"],["Anlage 11 FeV","fev_2010/anlage_11.html"],["§ 6 FZV","fzv_2023/__6.html"],["§ 15 FZV","fzv_2023/__15.html"],["§ 16 FZV","fzv_2023/__16.html"],["§ 13 KraftStG","kraftstg/__13.html"],["§ 14 GewO","gewo/__14.html"],["§ 146 GewO","gewo/__146.html"],["§ 4a AufenthG","aufenthg_2004/__4a.html"],["§ 138 AO","ao_1977/__138.html"],["§ 2 SGB IX","sgb_9_2018/__2.html"],["§ 152 SGB IX","sgb_9_2018/__152.html"],["§ 84 SGG","sgg/__84.html"],["§ 15 SGB XI","sgb_11/__15.html"],["§ 18c SGB XI","sgb_11/__18c.html"],["§ 33 SGB XI","sgb_11/__33.html"],["§ 7a SGB XI","sgb_11/__7a.html"]],
  abschiebung: [["§ 59 AufenthG","aufenthg_2004/__59.html"],["§ 60a AufenthG","aufenthg_2004/__60a.html"],["§ 23a AufenthG","aufenthg_2004/__23a.html"],["§ 11 AufenthG","aufenthg_2004/__11.html"],["§ 84 AufenthG","aufenthg_2004/__84.html"],["§ 74 AsylG","asylvfg_1992/__74.html"],["§ 1 BerHG","berathig/__1.html"]],
};
const HELP = [
  ["BAMF – Migrationsberatung in Ihrer Nähe finden","https://bamf-navi.bamf.de/"],
  ["UNHCR Deutschland – Wo finde ich Hilfe?","https://help.unhcr.org/germany/de/wo-finde-ich-hilfe/"],
  ["PRO ASYL – Beratung und Informationen","https://www.proasyl.de/"],
];

const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const url = (lang, key) => `${SITE}/${lang === "de" ? "" : lang + "/"}${PAGES[key]}.html`;
const rel = (from, lang, key) => (from === "de" ? "" : "../") + (lang === "de" ? "" : lang + "/") + PAGES[key] + ".html";
const root = from => from === "de" ? "./" : "../";

function letterHTML(k, filled) {
  const L = LETTERS[k];
  const full = `${head}\n\nBetreff: ${L.subj}\n\n${L.body}\n\n${foot}`;
  return esc(full).replace(/\{\{(\w+)\}\}/g, (m, f) =>
    filled ? `<span class="v">${esc(Object.assign({}, SAMPLE, L.sample || {})[f]).replace(/\n/g, "\n")}</span>` : `<mark>[${esc(LABELS[f])}]</mark>`);
}
function letterText(k, filled) {
  const L = LETTERS[k];
  return `${head}\n\nBetreff: ${L.subj}\n\n${L.body}\n\n${foot}`.replace(/\{\{(\w+)\}\}/g, (m, f) => filled ? Object.assign({}, SAMPLE, L.sample || {})[f] : `[${LABELS[f]}]`);
}

const CSS = `:root{--ink:#16233a;--muted:#5b6b82;--bg:#f6f8fb;--card:#fff;--line:#dde4ee;--brand:#1F4E8C;--brand2:#2c66b0;--warn:#fff4d6;--warnb:#f0c75e;--mark:#FBE27C;--ok:#1d7a4f}
@media (prefers-color-scheme:dark){:root{--ink:#e8eef7;--muted:#a3b1c6;--bg:#0f1622;--card:#172133;--line:#2a3850;--brand:#7fb0f0;--brand2:#9cc3f5;--warn:#3a2f12;--warnb:#8a6d1e;--mark:#6b5a12;--ok:#5fd19b}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans","Noto Sans Arabic",sans-serif}
a{color:var(--brand)}h1,h2,h3,p,li,summary{overflow-wrap:break-word;hyphens:auto}.wrap{max-width:860px;margin:0 auto;padding:0 16px}
header{background:var(--card);border-bottom:1px solid var(--line)}header .wrap{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;padding:12px 16px}
.logo{display:flex;gap:10px;align-items:center;font-weight:800;font-size:20px;color:var(--ink);text-decoration:none}.logo svg{width:34px;height:34px}
.langs{display:flex;flex-wrap:wrap;gap:6px}.langs a{font-size:14px;padding:4px 9px;border:1px solid var(--line);border-radius:99px;text-decoration:none;color:var(--ink)}.langs a[aria-current]{background:var(--brand);border-color:var(--brand);color:#fff}
nav.crumb{font-size:14px;color:var(--muted);margin:18px 0 0}h1{font-size:clamp(26px,5vw,36px);line-height:1.2;margin:10px 0 14px}
h2{font-size:23px;margin:34px 0 12px}.intro{background:var(--warn);border:1px solid var(--warnb);border-radius:14px;padding:14px 16px;font-weight:600}
table{width:100%;table-layout:fixed;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden}td{padding:10px 12px;overflow-wrap:anywhere;hyphens:auto;border-top:1px solid var(--line);vertical-align:top}tr:first-child td{border-top:0}td:first-child{font-weight:600;width:45%}td small{font-weight:400;color:var(--muted)}
ol.steps{list-style:none;padding:0;margin:0;counter-reset:s;display:grid;gap:10px}ol.steps li{counter-increment:s;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px 14px 58px;position:relative}
ol.steps li::before{content:counter(s);position:absolute;inset-inline-start:14px;top:14px;width:30px;height:30px;border-radius:50%;background:var(--brand);color:#fff;font-weight:700;display:grid;place-items:center;font-size:15px}
[dir=rtl] ol.steps li{padding:14px 58px 14px 16px}ol.steps h3{margin:0 0 4px;font-size:18px}ol.steps p{margin:0}
.note{color:var(--muted);font-size:15px}details{background:var(--card);border:1px solid var(--line);border-radius:14px;margin:10px 0}summary{cursor:pointer;padding:14px 44px 14px 16px;position:relative;font-weight:700;list-style:none}summary::-webkit-details-marker{display:none}
summary::after{content:"＋";position:absolute;inset-inline-end:16px;top:14px;color:var(--brand)}[dir=rtl] summary{padding:14px 16px 14px 44px}details[open] summary::after{content:"－"}summary small{display:block;font-weight:400;color:var(--muted)}
.lt{padding:0 16px 16px}.tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}button{font:inherit;font-size:15px;padding:7px 12px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink);cursor:pointer}
button[aria-pressed=true]{background:var(--brand);border-color:var(--brand);color:#fff}button.act{background:var(--brand2);border-color:var(--brand2);color:#fff}
pre{white-space:pre-wrap;word-wrap:break-word;direction:ltr;text-align:left;font:15px/1.55 ui-monospace,Menlo,Consolas,monospace;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:14px;margin:0}
mark{background:var(--mark);color:inherit;border-radius:3px;padding:0 2px}.v{background:rgba(29,122,79,.14);border-radius:3px}
ul.help{padding:0;list-style:none;display:grid;gap:8px}ul.help a{display:block;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;text-decoration:none;font-weight:600}
.src{font-size:14px;color:var(--muted)}.src a{margin-inline-end:10px}footer{margin-top:40px;border-top:1px solid var(--line);padding:20px 0 40px;font-size:14px;color:var(--muted)}footer a{margin-inline-end:14px}
@media print{header,nav,.tabs,footer,.intro,ol.steps,table,h2,ul.help,.src,.note,.other{display:none!important}details{border:0}summary{display:none}details:not([open]){display:none}pre{border:0;background:none;font-size:12pt}}`;

const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#1F4E8C"/><rect x="16" y="12" width="32" height="40" rx="3" fill="#fff"/><rect x="22" y="20" width="20" height="3" fill="#1F4E8C"/><rect x="22" y="28" width="20" height="3" fill="#B7C4D8"/><rect x="22" y="35" width="14" height="3" fill="#B7C4D8"/><rect x="22" y="42" width="12" height="4" rx="1" fill="#FBE27C"/></svg>`;

function page(lang, key) {
  const t = C[lang], u = t.ui, p = t[key];
  const others = Object.keys(PAGES).filter(k => k !== key);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const alts = LANGS.map(([l]) => `<link rel="alternate" hreflang="${l}" href="${url(l, key)}">`).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${url("de", key)}">`;
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: lang,
    mainEntity: p.steps.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Amtsbriefe", item: SITE + "/" },
    { "@type": "ListItem", position: 2, name: p.h1, item: url(lang, key) }] };
  const letters = Object.entries(p.letters).map(([k, [name, why]]) => `
<details id="${k}">
<summary>${esc(name)}<small>${esc(why)}</small></summary>
<div class="lt">
<div class="tabs" role="group">
<button type="button" data-v="blank" aria-pressed="true">${esc(u.blank)}</button>
<button type="button" data-v="ex" aria-pressed="false">${esc(u.example)}</button>
<button type="button" class="act" data-copy>${esc(u.copy)}</button>
<button type="button" class="act" data-print>${esc(u.print)}</button>
</div>
<pre data-blank>${letterHTML(k, false)}</pre>
<pre data-ex hidden>${letterHTML(k, true)}</pre>
<textarea hidden data-tblank>${esc(letterText(k, false))}</textarea><textarea hidden data-tex>${esc(letterText(k, true))}</textarea>
</div>
</details>`).join("");

  return `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)} | Amtsbriefe</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url(lang, key)}">
${alts}
<meta property="og:type" content="article"><meta property="og:title" content="${esc(p.h1)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:url" content="${url(lang, key)}"><meta property="og:site_name" content="Amtsbriefe">
<meta name="theme-color" content="#1F4E8C">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(LOGO.replace(' aria-hidden="true"', ' xmlns="http://www.w3.org/2000/svg"'))}">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(faq)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>
<header><div class="wrap"><a class="logo" href="${root(lang)}">${LOGO}Amtsbriefe</a>
<nav class="langs" aria-label="Sprache">${LANGS.map(([l, n]) => `<a href="${rel(lang, l, key)}" hreflang="${l}"${l === lang ? ' aria-current="page"' : ""}>${n}</a>`).join("")}</nav></div></header>
<main class="wrap">
<nav class="crumb"><a href="${root(lang)}">Amtsbriefe</a> › ${esc(p.h1)}</nav>
<h1>${esc(p.h1)}</h1>
<p class="intro">${esc(p.intro)}</p>
<h2>${esc(u.deadlines)}</h2>
<table>${p.deadlines.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</table>
<h2>${esc(STEP[lang])}</h2>
<ol class="steps">${p.steps.map(([h, x]) => `<li><h3>${esc(h)}</h3><p>${esc(x)}</p></li>`).join("")}</ol>
${p.contacts ? `<h2>${esc(p.contactsTitle)}</h2>
<table class="ct">${p.contacts.map(([n, w, c, h]) => `<tr><td><a href="${h}" rel="noopener" target="_blank">${esc(n)} ↗</a><br><small>${esc(w)}</small></td><td>${esc(c)}</td></tr>`).join("")}</table>` : ""}
<h2>${esc(u.letters)}</h2>
<p class="note">${esc(u.lettersNote)}</p>
${letters}
${key === "sozial" || key === "alltag" || key === "familie" || key === "auto" ? "" : `<h2>${esc(u.help)}</h2>
<ul class="help">${HELP.map(([n, h]) => `<li><a href="${h}" rel="noopener" target="_blank">${esc(n)} ↗</a></li>`).join("")}</ul>`}
<p class="other"><strong>${esc(u.other)}:</strong> ${others.map(o => `<a href="${rel(lang, lang, o)}">${esc(t[o].h1)}</a>`).join(" · ")} · <a href="${root(lang)}">${esc(u.home)}</a></p>
<p class="src"><strong>${esc(u.sources)}:</strong> ${SOURCES[key].map(([n, h]) => `<a href="https://www.gesetze-im-internet.de/${h}" rel="noopener" target="_blank">${n}</a>`).join("")}<br>${esc(u.stand)}: ${STAND}</p>
<p class="note">${esc(u.disclaimer)}</p>
</main>
<footer><div class="wrap"><a href="${root(lang)}">Amtsbriefe</a><a href="${root(lang)}impressum.html">Impressum</a><a href="${root(lang)}datenschutz.html">Datenschutz</a></div></footer>
<script>
document.querySelectorAll("details .lt").forEach(function(b){
  var bl=b.querySelector("[data-blank]"),ex=b.querySelector("[data-ex]"),v="blank";
  b.querySelectorAll("[data-v]").forEach(function(btn){btn.onclick=function(){v=btn.dataset.v;bl.hidden=v!=="blank";ex.hidden=v==="blank";b.querySelectorAll("[data-v]").forEach(function(x){x.setAttribute("aria-pressed",x===btn)});};});
  var c=b.querySelector("[data-copy]"),orig=c.textContent;
  c.onclick=function(){var t=b.querySelector(v==="blank"?"[data-tblank]":"[data-tex]").value;
    var done=function(){c.textContent=${JSON.stringify(u.copied)};setTimeout(function(){c.textContent=orig},1800)};
    try{navigator.clipboard.writeText(t).then(done,function(){fallback(t);done()})}catch(e){fallback(t);done()}};
  b.querySelector("[data-print]").onclick=function(){var d=b.closest("details");document.querySelectorAll("details").forEach(function(x){if(x!==d)x.removeAttribute("open")});window.print()};
});
function fallback(t){var a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove()}
if(location.hash){var d=document.querySelector(location.hash);if(d&&d.tagName==="DETAILS")d.open=true}
</script>
</body>
</html>
`;
}

const out = path.join(__dirname, "..");

const urls = [];
for (const [lang] of LANGS) for (const key of Object.keys(PAGES)) {
  const dir = lang === "de" ? out : path.join(out, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, PAGES[key] + ".html"), page(lang, key));
  urls.push(url(lang, key));
}

console.log("built", urls.length, "pages");
