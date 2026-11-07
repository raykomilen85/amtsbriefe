// Erzeugt statische, von Google lesbare Einzelseiten für jede Briefvorlage aus index.html:
//   /vorlage/<slug>.html  (eine Seite pro Vorlage, Deutsch)
//   /vorlagen.html        (Übersicht aller Vorlagen nach Behörde)
// und trägt sie in sitemap.xml ein. Aufruf im Repo-Wurzelordner: node tools/vorlagen.js
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");
const SITE = "https://amtsbriefe.de";
const STAND = new Date().toISOString().slice(0, 10);
const STAND_DE = STAND.split("-").reverse().join(".");

// --- Daten aus der App in index.html lesen (gleiche Quelle wie die App, nichts doppelt pflegen) ---
const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const js = [...idx.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][2][1];
const ctx = {}; vm.createContext(ctx);
vm.runInContext(js.slice(0, js.indexOf("const landOf")) + ";globalThis.__={L,OFF,TT,FL};", ctx);
const { L, OFF, TT, FL } = ctx.__;

// --- Stil und Kopf von einer bestehenden statischen Seite übernehmen ---
const ref = fs.readFileSync(path.join(ROOT, "alltag-briefvorlagen.html"), "utf8");
const STYLE = ref.match(/<style>[\s\S]*?<\/style>/)[0].replace("</style>",
  ".cta{display:inline-block;background:var(--brand);color:#fff;font-weight:700;padding:12px 18px;border-radius:12px;text-decoration:none;margin:6px 8px 6px 0}" +
  ".cta.ghost{background:transparent;color:var(--brand);border:2px solid var(--brand)}" +
  "pre.brief{white-space:pre-wrap;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;font:16px/1.6 ui-monospace,Menlo,Consolas,monospace;overflow-wrap:anywhere}" +
  ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;padding:0;list-style:none}" +
  ".grid a{display:block;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px;text-decoration:none;color:var(--ink);font-weight:600}" +
  ".grid a small{display:block;color:var(--muted);font-weight:400}" +
  "footer{border-top:1px solid var(--line);margin-top:40px;padding:20px 0;font-size:15px}footer .wrap{display:flex;flex-wrap:wrap;gap:14px}" +
  ".note{color:var(--muted);font-size:15px}@media print{header,footer,.cta,.noprint{display:none}}</style>");
const ICON = ref.match(/<link rel="icon"[^>]*>/)[0];
const LOGO = ref.match(/<a class="logo"[\s\S]*?<\/a>/)[0].replace('href="./"', 'href="/"');

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = s => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const label = k => (FL[k] && FL[k].de) || k;
const ph = s => s.replace(/\{\{(\w+)\}\}/g, (m, k) => "[" + label(k) + "]");

const titleOf = l => (l.tt ? TT[l.tt].t : l.t).de;
const whenOf = l => (l.tt ? TT[l.tt].w : l.w).de;
const officeName = l => OFF[l.a].n;

const items = L.map(l => {
  const t = titleOf(l), o = officeName(l);
  return { l, t, o, when: whenOf(l), slug: slug(o.split("/")[0] + "-" + t) };
});

function letterText(l) {
  const lines = ["[" + label("name") + "]", "[" + label("street") + "]", "[" + label("city") + "]", "",
    OFF[l.a].to || OFF[l.a].n, "[Anschrift der Behörde]", "", "[Ort], [Datum]", "",
    l.ref + ": [" + l.ref + "]", "", "Betreff: " + ph(l.s), "", "Sehr geehrte Damen und Herren,", ""];
  for (const p of l.b(() => true)) lines.push(ph(p), "");
  lines.push("Mit freundlichen Grüßen", "", "[Unterschrift]", "[" + label("name") + "]");
  return lines.join("\n");
}

function page({ url, title, desc, h1, crumbs, body, ld }) {
  return `<!doctype html>
<html lang="de" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${url}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(h1)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${SITE}${url}"><meta property="og:site_name" content="Amtsbriefe">
<meta property="og:image" content="${SITE}/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1F4E8C">
${ICON}
${STYLE}
${ld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>
<body>
<header><div class="wrap">${LOGO}</div></header>
<main class="wrap">
<nav class="crumb">${crumbs.map(([n, u]) => u ? `<a href="${u}">${esc(n)}</a>` : esc(n)).join(" › ")}</nav>
<h1>${esc(h1)}</h1>
${body}
<p class="note">Allgemeine Informationen, keine Rechtsberatung. Lassen Sie Ihren Fall von einer Beratungsstelle oder einer Anwältin/einem Anwalt prüfen. Stand: ${STAND_DE}</p>
</main>
<footer><div class="wrap"><a href="/">Amtsbriefe</a><a href="/vorlagen.html">Alle Vorlagen</a><a href="/frist-rechner.html">Fristen-Rechner</a><a href="/woerterbuch.html">Wörterbuch</a><a href="/impressum.html">Impressum</a><a href="/datenschutz.html">Datenschutz</a></div></footer>
</body>
</html>
`;
}

const crumbLD = list => ({ "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: list.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + u })) });

fs.mkdirSync(path.join(ROOT, "vorlage"), { recursive: true });
const COPY_JS = `<script>document.querySelectorAll("[data-copy]").forEach(function(b){b.onclick=function(){var t=document.getElementById(b.dataset.copy).textContent;var o=b.textContent;var d=function(){b.textContent="Kopiert ✓";setTimeout(function(){b.textContent=o},1800)};try{navigator.clipboard.writeText(t).then(d,d)}catch(e){d()}}});</script>`;

for (const it of items) {
  const { l, t, o, when } = it;
  const url = `/vorlage/${it.slug}.html`;
  const h1 = `${o.split(" / ")[0]}: ${t} – Muster & Vorlage`;
  const title = `${o.split(" / ")[0]}: ${t} – Muster | Amtsbriefe`;
  const desc = (`${when} Kostenlose Vorlage zum Ausfüllen, Drucken oder als E-Mail – erklärt in 13 Sprachen.`).slice(0, 300);
  const fields = [...new Set(["name", "street", "city", ...l.f])].map(label).concat([l.ref]);
  const others = items.filter(x => x.l.a === l.a && x !== it);
  const faq = [
    [`Wie schicke ich den Brief an ${o.split(" / ")[0]}?`, "Unterschreiben und eine Kopie behalten. Am sichersten: persönlich abgeben und den Eingang auf Ihrer Kopie stempeln lassen, per Fax mit Sendebericht oder per Einschreiben."],
    ["Ist die Vorlage kostenlos?", "Ja. Alle Vorlagen auf amtsbriefe.de sind kostenlos und ohne Anmeldung nutzbar. Ihre Eingaben bleiben in Ihrem Browser."],
    ["Gibt es die Erklärung in meiner Sprache?", "Ja. Die Erklärungen gibt es in 13 Sprachen, zum Beispiel Türkisch, Arabisch, Ukrainisch, Polnisch, Bulgarisch und Englisch. Der Brief selbst ist immer auf Deutsch."]
  ];
  const body = `<p class="intro">${esc(when)}</p>
<p><a class="cta" href="/#brief=${l.id}">Jetzt online ausfüllen</a><a class="cta ghost" href="/frist-rechner.html">Frist berechnen</a></p>
<h2>Muster: ${esc(t)}</h2>
<pre class="brief" id="brief">${esc(letterText(l))}</pre>
<p class="noprint"><button class="cta ghost" type="button" data-copy="brief">Text kopieren</button></p>
<h2>Das brauchen Sie</h2>
<ul>${fields.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
<h2>So gehen Sie vor</h2>
<ol class="steps"><li>Online-Vorlage öffnen und Ihre Daten eintragen – die Lücken werden automatisch gefüllt.</li><li>Brief ausdrucken oder als E-Mail senden und unterschreiben.</li><li>Nachweis sichern: Eingangsstempel auf Ihrer Kopie, Fax-Sendebericht oder Einschreiben.</li><li>Frist im Blick behalten – der <a href="/frist-rechner.html">Fristen-Rechner</a> hilft.</li></ol>
<h2>Häufige Fragen</h2>
${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n")}
${others.length ? `<h2>Weitere Vorlagen für ${esc(o)}</h2><ul class="grid">${others.map(x => `<li><a href="/vorlage/${x.slug}.html">${esc(x.t)}</a></li>`).join("")}</ul>` : ""}
<p><a href="/vorlagen.html">Alle ${items.length} Vorlagen ansehen</a></p>
${COPY_JS}`;
  const crumbs = [["Amtsbriefe", "/"], ["Vorlagen", "/vorlagen.html"], [t, null]];
  const ld = [crumbLD([["Amtsbriefe", "/"], ["Vorlagen", "/vorlagen.html"], [t, url]]),
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@context": "https://schema.org", "@type": "Article", headline: h1, inLanguage: "de", dateModified: STAND, publisher: { "@type": "Organization", name: "Amtsbriefe", url: SITE + "/" } }];
  fs.writeFileSync(path.join(ROOT, "vorlage", it.slug + ".html"), page({ url, title, desc, h1, crumbs, body, ld }));
}

// --- Übersicht ---
const groups = {};
for (const it of items) (groups[it.o] = groups[it.o] || []).push(it);
const hubBody = `<p class="intro">${items.length} kostenlose Briefvorlagen für Jobcenter, Agentur für Arbeit, Krankenkasse, Ausländerbehörde, BAMF und weitere Ämter. Jede Vorlage können Sie online ausfüllen, drucken oder als E-Mail senden – die Erklärungen gibt es in 13 Sprachen.</p>
${Object.entries(groups).map(([o, list]) => `<h2>${esc(o)}</h2><ul class="grid">${list.map(x => `<li><a href="/vorlage/${x.slug}.html">${esc(x.t)}<small>${esc(x.when.slice(0, 90))}${x.when.length > 90 ? "…" : ""}</small></a></li>`).join("")}</ul>`).join("\n")}
<h2>Weitere Hilfe</h2><ul class="grid"><li><a href="/aufenthalt-laeuft-ab.html">Aufenthaltserlaubnis läuft ab</a></li><li><a href="/abschiebung-hilfe.html">Abschiebung droht</a></li><li><a href="/sozialleistungen-antrag.html">Sozialleistungen beantragen</a></li><li><a href="/alltag-briefvorlagen.html">Kündigung, Inkasso, Mängel</a></li><li><a href="/familie-schule.html">Familie &amp; Schule</a></li><li><a href="/auto-gewerbe-gesundheit.html">Auto, Gewerbe, Gesundheit</a></li></ul>`;
fs.writeFileSync(path.join(ROOT, "vorlagen.html"), page({ url: "/vorlagen.html",
  title: "Alle Briefvorlagen für Ämter – kostenlos | Amtsbriefe",
  desc: `${items.length} kostenlose Musterbriefe für Jobcenter, Agentur für Arbeit, Krankenkasse, Ausländerbehörde und BAMF: Widerspruch, Antrag, Fristverlängerung. In 13 Sprachen erklärt.`,
  h1: "Alle Briefvorlagen für Behörden", crumbs: [["Amtsbriefe", "/"], ["Vorlagen", null]], body: hubBody,
  ld: [crumbLD([["Amtsbriefe", "/"], ["Vorlagen", "/vorlagen.html"]]),
    { "@context": "https://schema.org", "@type": "ItemList", itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/vorlage/${x.slug}.html`, name: x.t })) }] }));

// --- Sitemap ---
const smPath = path.join(ROOT, "sitemap.xml");
let sm = fs.readFileSync(smPath, "utf8").replace(/<url><loc>https:\/\/amtsbriefe\.de\/(vorlage\/[^<]+|vorlagen\.html)<\/loc>[\s\S]*?<\/url>\n?/g, "");
const add = ["/vorlagen.html", ...items.map(x => `/vorlage/${x.slug}.html`)].map(u => `<url><loc>${SITE}${u}</loc><lastmod>${STAND}</lastmod></url>`).join("\n");
sm = sm.replace("</urlset>", add + "\n</urlset>");
fs.writeFileSync(smPath, sm);
fs.writeFileSync(path.join(__dirname, "vorlagen-urls.txt"), ["/vorlagen.html", ...items.map(x => `/vorlage/${x.slug}.html`)].map(u => SITE + u).join("\n") + "\n");
console.log(items.length, "Vorlagen-Seiten + Übersicht geschrieben");
