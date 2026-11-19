const NAVL = require("./navlinks.js");
// "Über uns" page in 13 languages (content: src/about/<lang>.json). Called from build.js.
const fs = require("fs");
const path = require("path");
module.exports = function ({ CSS, LOGO, LANGS, SITE, VORL, esc, root, out }) {
  const A = Object.fromEntries(LANGS.map(([l]) => [l, JSON.parse(fs.readFileSync(path.join(__dirname, "src", "about", l + ".json"), "utf8"))]));
  const url = l => `${SITE}/${l === "de" ? "" : l + "/"}ueber-uns.html`;
  const rel = (from, l) => (from === "de" ? "" : "../") + (l === "de" ? "" : l + "/") + "ueber-uns.html";
  for (const [lang] of LANGS) {
    const a = A[lang], dir = lang === "ar" ? "rtl" : "ltr";
    const ld = { "@context": "https://schema.org", "@type": "AboutPage", inLanguage: lang, name: a.h1, url: url(lang),
      publisher: { "@type": "Person", name: "Milen Yakimov", address: { "@type": "PostalAddress", addressLocality: "Bad Schwartau", addressCountry: "DE" } } };
    const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(a.title)}</title>
<meta name="description" content="${esc(a.desc)}">
<link rel="canonical" href="${url(lang)}">
${LANGS.map(([l]) => `<link rel="alternate" hreflang="${l}" href="${url(l)}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${url("de")}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(a.h1)}"><meta property="og:description" content="${esc(a.desc)}"><meta property="og:url" content="${url(lang)}"><meta property="og:image" content="https://amtsbriefe.de/og-image.png">
<meta name="theme-color" content="#1F4E8C">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(LOGO.replace(' aria-hidden="true"', ' xmlns="http://www.w3.org/2000/svg"'))}">
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script data-goatcounter="https://amtsbriefede.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</head>
<body>
<header><div class="wrap"><a class="logo" href="${root(lang)}">${LOGO}Amtsbriefe</a>
<nav class="langs" aria-label="Sprache">${LANGS.map(([l, n]) => `<a href="${rel(lang, l)}" hreflang="${l}"${l === lang ? ' aria-current="page"' : ""}>${n}</a>`).join("")}</nav></div></header>
<main class="wrap">
<nav class="crumb"><a href="${root(lang)}">Amtsbriefe</a> › ${esc(a.h1)}</nav>
<h1>${esc(a.h1)}</h1>
<p class="intro">${esc(a.intro)}</p>
${a.sec.map(([h, t]) => `<h2>${esc(h)}</h2>\n<p>${esc(t).replace(/raykomilen85@gmail\.com/, '<a href="mailto:raykomilen85@gmail.com">raykomilen85@gmail.com</a>')}</p>`).join("\n")}
</main>
<footer><div class="wrap"><a href="${root(lang)}">Amtsbriefe</a>${NAVL(lang)}<a href="${lang === "de" ? "" : "/" + lang}/vorlagen.html">${VORL[lang] || VORL.de}</a><a href="${lang === "de" ? "" : "/" + lang}/ueber-uns.html">${a.nav}</a><a href="${root(lang)}impressum.html">Impressum</a><a href="${root(lang)}datenschutz.html">Datenschutz</a></div></footer>
</body>
</html>
`;
    const d = lang === "de" ? out : path.join(out, lang);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, "ueber-uns.html"), html);
  }
  console.log("built", LANGS.length, "Über-uns pages");
  return Object.fromEntries(LANGS.map(([l]) => [l, A[l].nav]));
};
