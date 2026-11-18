// "Ihre Rechte" page (10 cards) in 13 languages (content: src/rechte/<lang>.json). Called from build.js.
const fs = require("fs");
const path = require("path");
module.exports = function ({ CSS, LOGO, LANGS, SITE, VORL, ABOUT_NAV, esc, root, out }) {
  const SLUG = "ihre-rechte", STAND = "19.11.2026";
  const G = "https://www.gesetze-im-internet.de/";
  // per card: [source label, url], help link [type, target]
  const META = [
    [["§ 84 SGG, § 70 VwGO", G + "sgg/__84.html"], ["r", "frist-rechner"]],
    [["§ 25 SGB X", G + "sgb_10/__25.html"], ["v", "jobcenter-akteneinsicht-beantragen"]],
    [["§ 33 Abs. 2 SGB X", G + "sgb_10/__33.html"], ["v", "jobcenter-bitte-um-schriftlichen-bescheid"]],
    [["§ 44 SGB X", G + "sgb_10/__44.html"], ["v", "jobcenter-ueberpruefungsantrag"]],
    [["BerHG", G + "berathig/"], null],
    [["migrationsberatung.org", "https://www.migrationsberatung.org/"], ["x", "https://www.jugendmigrationsdienste.de/"]],
    [["Bundesregierung: Mindestlohn", "https://www.bundesregierung.de/breg-de/aktuelles/mindestlohn-2026-2364720"], null],
    [["§ 31 ZKG", G + "zkg/__31.html"], ["p", "erste-30-tage"]],
    [["§ 24 SGB VIII", G + "sgb_8/__24.html"], ["p", "familie-schule"]],
    [["rundfunkbeitrag.de", "https://www.rundfunkbeitrag.de/"], ["p", "grundsicherungsgeld"]]];
  const F = Object.fromEntries(LANGS.map(([l]) => [l, JSON.parse(fs.readFileSync(path.join(__dirname, "src", "rechte", l + ".json"), "utf8"))]));
  const pre = l => (l === "de" ? "" : "/" + l);
  const url = l => `${SITE}/${l === "de" ? "" : l + "/"}${SLUG}.html`;
  const rel = (from, l) => (from === "de" ? "" : "../") + (l === "de" ? "" : l + "/") + SLUG + ".html";
  const extra = `.rc{display:grid;gap:.8rem;margin:1rem 0}.rc article{border:1px solid #d6dde8;border-radius:12px;padding:.9rem 1rem;background:#fff}
.rc h2{font-size:1.1rem;margin:0 0 .4rem}.rc h2 span{display:inline-grid;place-items:center;width:1.7rem;height:1.7rem;border-radius:50%;background:#1F4E8C;color:#fff;font-size:.9rem;margin-inline-end:.5rem}
.rc p{margin:.3rem 0}.rc .src{font-size:.9rem;color:#445}.note{background:#fff8e1;border-radius:10px;padding:.7rem .9rem}`;
  for (const [lang] of LANGS) {
    const f = F[lang], L = f.lab, dir = lang === "ar" ? "rtl" : "ltr";
    const help = m => { if (!m) return ""; const [t, x] = m; const h = t === "v" ? `${pre(lang)}/vorlage/${x}.html` : t === "r" ? `${root(lang)}${x}.html` : t === "x" ? x : `${pre(lang)}/${x}.html`; return ` · <a href="${h}"${t === "x" ? ' rel="noopener"' : ""}>${esc(L.go)} →</a>`; };
    const ld = [{ "@context": "https://schema.org", "@type": "ItemList", inLanguage: lang, name: f.h1, url: url(lang),
      itemListElement: f.cards.map(([h], i) => ({ "@type": "ListItem", position: i + 1, name: h, url: `${url(lang)}#r${i + 1}` })) },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Amtsbriefe", item: `${SITE}/${lang === "de" ? "" : lang + "/"}` }, { "@type": "ListItem", position: 2, name: f.nav, item: url(lang) }] }];
    const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(f.title)}</title>
<meta name="description" content="${esc(f.desc)}">
<link rel="canonical" href="${url(lang)}">
${LANGS.map(([l]) => `<link rel="alternate" hreflang="${l}" href="${url(l)}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${url("de")}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(f.h1)}"><meta property="og:description" content="${esc(f.desc)}"><meta property="og:url" content="${url(lang)}"><meta property="og:image" content="https://amtsbriefe.de/og-image.png">
<meta name="theme-color" content="#1F4E8C">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(LOGO.replace(' aria-hidden="true"', ' xmlns="http://www.w3.org/2000/svg"'))}">
<style>${CSS}${extra}</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script data-goatcounter="https://amtsbriefede.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</head>
<body>
<header><div class="wrap"><a class="logo" href="${root(lang)}">${LOGO}Amtsbriefe</a>
<nav class="langs" aria-label="Sprache">${LANGS.map(([l, n]) => `<a href="${rel(lang, l)}" hreflang="${l}"${l === lang ? ' aria-current="page"' : ""}>${n}</a>`).join("")}</nav></div></header>
<main class="wrap">
<nav class="crumb"><a href="${root(lang)}">Amtsbriefe</a> › ${esc(f.nav)}</nav>
<h1>${esc(f.h1)}</h1>
<p class="intro">${esc(f.intro)}</p>
<div class="rc">
${f.cards.map(([h, t], i) => `<article id="r${i + 1}"><h2><span>${i + 1}</span>${esc(h)}</h2><p>${esc(t)}</p><p class="src">${esc(L.src)}: <a href="${META[i][0][1]}" rel="noopener">${esc(META[i][0][0])}</a>${help(META[i][1])}</p></article>`).join("\n")}
</div>
<p class="note">${esc(L.note)}</p>
<p><small>${esc(L.stand)}: ${STAND}</small></p>
</main>
<footer><div class="wrap"><a href="${root(lang)}">Amtsbriefe</a><a href="${pre(lang)}/vorlagen.html">${VORL[lang] || VORL.de}</a><a href="${pre(lang)}/ueber-uns.html">${ABOUT_NAV[lang]}</a><a href="${root(lang)}impressum.html">Impressum</a><a href="${root(lang)}datenschutz.html">Datenschutz</a></div></footer>
</body>
</html>
`;
    const d = lang === "de" ? out : path.join(out, lang);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, SLUG + ".html"), html);
  }
  console.log("built", LANGS.length, "ihre-rechte pages");
};
