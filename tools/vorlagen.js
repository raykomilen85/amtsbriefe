// Erzeugt statische, von Google lesbare Einzelseiten für jede Briefvorlage aus index.html – in 13 Sprachen:
//   /vorlage/<slug>.html, /<lang>/vorlage/<slug>.html   (eine Seite pro Vorlage und Sprache)
//   /vorlagen.html,       /<lang>/vorlagen.html         (Übersicht aller Vorlagen nach Behörde)
// Der Musterbrief selbst bleibt immer Deutsch (so wird er an das Amt geschickt); Titel, Erklärung,
// Schritte und FAQ sind übersetzt (Titel/Erklärung/Feldnamen aus der App, Seitentexte aus src/vorlagen-i18n.json).
// Trägt alle Seiten in sitemap.xml ein und schreibt tools/vorlagen-urls.txt (für IndexNow/Search Console).
// Aufruf im Repo-Wurzelordner: node tools/vorlagen.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");
const SITE = "https://amtsbriefe.de";
const STAND = new Date().toISOString().slice(0, 10);
const STAND_DE = STAND.split("-").reverse().join(".");
const I = require("./src/vorlagen-i18n.json");
const X = require("./src/vorlagen-extra.json"); // seitenspezifische Hinweise + FAQ (de/tr/en)
const LANGS = Object.keys(I);
const pre = lg => (lg === "de" ? "" : "/" + lg);

// --- Daten aus der App in index.html lesen (gleiche Quelle wie die App, nichts doppelt pflegen) ---
const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const js = [...idx.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][2][1];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(js.slice(0, js.indexOf("const landOf")) + ";globalThis.__={L,OFF,TT,FL};", ctx);
const { L, OFF, TT, FL } = ctx.__;
const T = (o, lg) => (o && (o[lg] || o.de)) || "";

// --- Stil, Icon und Logo von einer bestehenden statischen Seite übernehmen ---
const ref = fs.readFileSync(path.join(ROOT, "alltag-briefvorlagen.html"), "utf8");
const STYLE = ref.match(/<style>[\s\S]*?<\/style>/)[0].replace("</style>",
  ".cta{display:inline-block;background:var(--brand);color:#fff;font-weight:700;padding:12px 18px;border-radius:12px;text-decoration:none;margin:6px 8px 6px 0;border:0;font-size:16px;cursor:pointer}" +
  ".cta.ghost{background:transparent;color:var(--brand);border:2px solid var(--brand)}" +
  "pre.brief{white-space:pre-wrap;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;font:16px/1.6 ui-monospace,Menlo,Consolas,monospace;overflow-wrap:anywhere;direction:ltr;text-align:left}" +
  ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;padding:0;list-style:none}" +
  ".grid a{display:block;height:100%;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;text-decoration:none;color:var(--ink);font-weight:600}" +
  ".grid a small{display:block;color:var(--muted);font-weight:400}.de{color:var(--muted);font-size:.9em}" +
  "details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:8px 0}summary{font-weight:600;cursor:pointer}" +
  "footer{border-top:1px solid var(--line);margin-top:40px;padding:20px 0;font-size:15px}footer .wrap{display:flex;flex-wrap:wrap;gap:14px}" +
  ".note{color:var(--muted);font-size:15px}@media print{header,footer,.cta,.noprint{display:none}}</style>");
const ICON = ref.match(/<link rel="icon"[^>]*>/)[0];
const LOGO = ref.match(/<a class="logo"[\s\S]*?<\/a>/)[0].replace('href="./"', 'href="/"');

// Titel der bestehenden Hilfeseiten je Sprache (aus deren <h1>)
const HELP = ["aufenthalt-laeuft-ab", "abschiebung-hilfe", "sozialleistungen-antrag", "alltag-briefvorlagen", "familie-schule", "auto-gewerbe-gesundheit"];
const helpTitle = (lg, p) => {
  const f = path.join(ROOT, lg === "de" ? "" : lg, p + ".html");
  if (!fs.existsSync(f)) return null;
  const m = fs.readFileSync(f, "utf8").match(/<h1>([\s\S]*?)<\/h1>/);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : null;
};

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = s => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ph = s => s.replace(/\{\{(\w+)\}\}/g, (m, k) => "[" + T(FL[k], "de") + "]");
const fmt = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

const items = L.map(l => {
  const tObj = l.tt ? TT[l.tt].t : l.t, wObj = l.tt ? TT[l.tt].w : l.w, o = OFF[l.a].n.split(" / ")[0];
  return { l, tObj, wObj, o, oFull: OFF[l.a].n, slug: slug(o + "-" + tObj.de) };
});

function letterText(l) {
  const lines = ["[" + T(FL.name, "de") + "]", "[" + T(FL.street, "de") + "]", "[" + T(FL.city, "de") + "]", "",
    OFF[l.a].to || OFF[l.a].n, "[Anschrift der Behörde]", "", "[Ort], [Datum]", "",
    l.ref + ": [" + l.ref + "]", "", "Betreff: " + ph(l.s), "", "Sehr geehrte Damen und Herren,", ""];
  for (const p of l.b(() => true)) lines.push(ph(p), "");
  lines.push("Mit freundlichen Grüßen", "", "[Unterschrift]", "[" + T(FL.name, "de") + "]");
  return lines.join("\n");
}

function page({ lg, rel, title, desc, h1, crumbs, body, ld }) {
  const S = I[lg], dir = lg === "ar" ? "rtl" : "ltr", url = pre(lg) + rel;
  const alts = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${SITE}${pre(x)}${rel}">`).join("\n") +
    `\n<link rel="alternate" hreflang="x-default" href="${SITE}${rel}">`;
  const nav = LANGS.map(x => `<a href="${pre(x)}${rel}" hreflang="${x}"${x === lg ? ' aria-current="page"' : ""}>${esc(I[x].name)}</a>`).join("");
  return `<!doctype html>
<html lang="${lg}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url}">
${alts}
<meta property="og:type" content="article"><meta property="og:title" content="${esc(h1)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${url}"><meta property="og:site_name" content="Amtsbriefe"><meta property="og:locale" content="${lg}">
<meta property="og:image" content="${SITE}/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1F4E8C">
${ICON}
${STYLE}
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
<script data-goatcounter="https://amtsbriefede.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</head>
<body>
<header><div class="wrap">${LOGO}
<nav class="langs" aria-label="Sprache">${nav}</nav></div></header>
<main class="wrap">
<nav class="crumb">${crumbs.map(([n, u]) => u ? `<a href="${u}">${esc(n)}</a>` : esc(n)).join(" › ")}</nav>
<h1>${esc(h1)}</h1>
${body}
<p class="note">${esc(S.disc)} ${esc(S.stand)}: ${STAND_DE}</p>
</main>
<footer><div class="wrap"><a href="/">Amtsbriefe</a><a href="${pre(lg)}/vorlagen.html">${esc(S.ft[0])}</a><a href="/frist-rechner.html">${esc(S.ft[1])}</a><a href="/woerterbuch.html">${esc(S.ft[2])}</a><a href="/impressum.html">Impressum</a><a href="/datenschutz.html">Datenschutz</a></div></footer>
<script>document.querySelectorAll("[data-copy]").forEach(function(b){b.onclick=function(){var t=document.getElementById(b.dataset.copy).textContent,o=b.textContent,d=function(){b.textContent=${JSON.stringify(S.copied)};setTimeout(function(){b.textContent=o},1800)};try{navigator.clipboard.writeText(t).then(d,d)}catch(e){d()}}});
document.querySelectorAll("[data-lang]").forEach(function(a){a.addEventListener("click",function(){try{localStorage.setItem("bb-lang",a.dataset.lang)}catch(e){}})});</script>
</body>
</html>
`;
}

const crumbLD = list => ({ "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: list.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + u })) });

const urls = [];
for (const lg of LANGS) {
  const S = I[lg], P = pre(lg);
  fs.mkdirSync(path.join(ROOT, lg === "de" ? "" : lg, "vorlage"), { recursive: true });

  for (const it of items) {
    const { l, o } = it, t = T(it.tObj, lg), when = T(it.wObj, lg);
    const rel = `/vorlage/${it.slug}.html`;
    const h1 = `${o}: ${t} – ${S.mv}`;
    const title0 = `${o}: ${t} – ${S.mv}`; const title = title0.length > 60 ? title0 : `${title0} | Amtsbriefe`;
    const desc = `${when} ${S.descTail}`.slice(0, 300);
    const fields = [...new Set(["name", "street", "city", ...l.f])]
      .map(k => esc(T(FL[k], lg)) + (lg !== "de" ? ` <span class="de">(${esc(T(FL[k], "de"))})</span>` : "")).concat([esc(l.ref)]);
    const others = items.filter(x => x.l.a === l.a && x !== it);
    const xt = X[l.id] && X[l.id][lg];
    const faq = (xt ? [xt.faq] : []).concat(S.faqs.map(([q, a]) => [fmt(q, { o }), a]));
    const body = `<p class="intro">${esc(when)}</p>
<p><a class="cta" href="/#brief=${l.id}" data-lang="${lg}">${esc(S.fill)}</a><a class="cta ghost" href="/frist-rechner.html">${esc(S.frist)}</a></p>
<h2>${esc(S.sample)}: ${esc(t)}</h2>
${S.de_note ? `<p>${esc(S.de_note)}</p>` : ""}
<pre class="brief" id="brief" lang="de">${esc(letterText(l))}</pre>
<p class="noprint"><button class="cta ghost" type="button" data-copy="brief">${esc(S.copy)}</button></p>
<h2>${esc(S.need)}</h2>
<ul>${fields.map(f => `<li>${f}</li>`).join("")}</ul>
<h2>${esc(S.howto)}</h2>
<ol class="steps">${S.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
${xt ? `<h2>${esc(X._h[lg])}</h2>\n<ul class="tips">${xt.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
<h2>${esc(S.faq)}</h2>
${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n")}
${others.length ? `<h2>${esc(fmt(S.more, { o: it.oFull }))}</h2><ul class="grid">${others.map(x => `<li><a href="${P}/vorlage/${x.slug}.html">${esc(T(x.tObj, lg))}</a></li>`).join("")}</ul>` : ""}
<p><a href="${P}/vorlagen.html">${esc(fmt(S.all, { n: items.length }))}</a></p>`;
    const crumbs = [["Amtsbriefe", "/"], [S.tmpl, `${P}/vorlagen.html`], [t, null]];
    const ld = [crumbLD([["Amtsbriefe", "/"], [S.tmpl, `${P}/vorlagen.html`], [t, P + rel]]),
      { "@context": "https://schema.org", "@type": "FAQPage", inLanguage: lg, mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      { "@context": "https://schema.org", "@type": "Article", headline: h1, inLanguage: lg, dateModified: STAND, publisher: { "@type": "Organization", name: "Amtsbriefe", url: SITE + "/" } }];
    fs.writeFileSync(path.join(ROOT, lg === "de" ? "" : lg, "vorlage", it.slug + ".html"), page({ lg, rel, title, desc, h1, crumbs, body, ld }));
    urls.push(SITE + P + rel);
  }

  // Übersicht
  const groups = {};
  for (const it of items) (groups[it.oFull] = groups[it.oFull] || []).push(it);
  const help = HELP.map(p => [p, helpTitle(lg, p)]).filter(x => x[1]);
  const hubBody = `<p class="intro">${esc(fmt(S.hubIntro, { n: items.length }))}</p>
${Object.entries(groups).map(([o, list]) => `<h2>${esc(o)}</h2><ul class="grid">${list.map(x => { const w = T(x.wObj, lg); return `<li><a href="${P}/vorlage/${x.slug}.html">${esc(T(x.tObj, lg))}<small>${esc(w.slice(0, 90))}${w.length > 90 ? "…" : ""}</small></a></li>`; }).join("")}</ul>`).join("\n")}
${help.length ? `<h2>${esc(S.help)}</h2><ul class="grid">${help.map(([p, n]) => `<li><a href="${P}/${p}.html">${esc(n)}</a></li>`).join("")}</ul>` : ""}`;
  fs.writeFileSync(path.join(ROOT, lg === "de" ? "" : lg, "vorlagen.html"), page({ lg, rel: "/vorlagen.html",
    title: `${S.hubTitle} | Amtsbriefe`, desc: fmt(S.hubIntro, { n: items.length }).slice(0, 300),
    h1: S.hubH1, crumbs: [["Amtsbriefe", "/"], [S.tmpl, null]], body: hubBody,
    ld: [crumbLD([["Amtsbriefe", "/"], [S.tmpl, `${P}/vorlagen.html`]]),
      { "@context": "https://schema.org", "@type": "ItemList", itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}${P}/vorlage/${x.slug}.html`, name: T(x.tObj, lg) })) }] }));
  urls.push(SITE + P + "/vorlagen.html");
}

// --- Sitemap (alte Vorlagen-Einträge aller Sprachen ersetzen) ---
const smPath = path.join(ROOT, "sitemap.xml");
let sm = fs.readFileSync(smPath, "utf8").replace(/<url><loc>https:\/\/amtsbriefe\.de\/(?:[a-z]{2}\/)?(?:vorlage\/[^<]+|vorlagen\.html)<\/loc>[\s\S]*?<\/url>\n?/g, "");
const alt = u => { const rel = u.slice(SITE.length).replace(/^\/[a-z]{2}(?=\/)/, "");
  return LANGS.map(x => `<xhtml:link rel="alternate" hreflang="${x}" href="${SITE}${pre(x)}${rel}"/>`).join("") +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${rel}"/>`; };
sm = sm.replace("</urlset>", urls.map(u => `<url><loc>${u}</loc><lastmod>${STAND}</lastmod>${alt(u)}</url>`).join("\n") + "\n</urlset>");
fs.writeFileSync(smPath, sm);
fs.writeFileSync(path.join(__dirname, "vorlagen-urls.txt"), urls.join("\n") + "\n");
console.log(`${items.length} Vorlagen × ${LANGS.length} Sprachen + Übersichten = ${urls.length} Seiten`);
