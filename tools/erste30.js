const NAVL = require("./navlinks.js");
// "Die ersten 30 Tage" checklist page in 13 languages (content: src/f30/<lang>.json). Called from build.js.
const fs = require("fs");
const path = require("path");
module.exports = function ({ CSS, LOGO, LANGS, SITE, VORL, ABOUT_NAV, esc, root, out }) {
  const SLUG = "erste-30-tage";
  const STAND = "19.11.2026";
  const SRC = [["§ 17 BMG", "https://www.gesetze-im-internet.de/bmg/__17.html"], ["§ 19 BMG", "https://www.gesetze-im-internet.de/bmg/__19.html"], ["§ 31 ZKG", "https://www.gesetze-im-internet.de/zkg/__31.html"], ["§ 193 VVG", "https://www.gesetze-im-internet.de/vvg_2008/__193.html"], ["Rundfunkbeitrag", "https://www.rundfunkbeitrag.de/"]];
  const F = Object.fromEntries(LANGS.map(([l]) => [l, JSON.parse(fs.readFileSync(path.join(__dirname, "src", "f30", l + ".json"), "utf8"))]));
  const pre = l => (l === "de" ? "" : "/" + l);
  const url = l => `${SITE}/${l === "de" ? "" : l + "/"}${SLUG}.html`;
  const rel = (from, l) => (from === "de" ? "" : "../") + (l === "de" ? "" : l + "/") + SLUG + ".html";
  const extra = `.chk{list-style:none;padding:0;margin:1rem 0}.chk li{border:1px solid #d6dde8;border-radius:10px;padding:.8rem .9rem;margin:.7rem 0;background:#fff}
.chk li.ok{background:#eef7ef;border-color:#9cc9a3}.chk label{display:flex;gap:.6rem;align-items:flex-start;font-weight:700;cursor:pointer;font-size:1.05rem}
.chk input{width:1.4rem;height:1.4rem;flex:0 0 auto;margin-top:.1rem}.chk .meta{font-size:.92rem;margin:.4rem 0 .2rem 2rem;color:#334}.chk .meta b{color:#1F4E8C}
.chk p{margin:.3rem 0 0 2rem}.chk .more{margin-left:2rem;display:inline-block;margin-top:.3rem}.bar{height:10px;background:#e3e8f0;border-radius:6px;overflow:hidden}
.bar i{display:block;height:100%;background:#2e7d32;width:0}.prog{font-weight:700;margin:.4rem 0}.reset{background:none;border:1px solid #99a;border-radius:8px;padding:.4rem .8rem;cursor:pointer}`;
  for (const [lang] of LANGS) {
    const f = F[lang], L = f.lab, dir = lang === "ar" ? "rtl" : "ltr";
    const link = i => { const x = f.links[i]; if (!x) return ""; const h = x[0] === "v" ? `${pre(lang)}/vorlage/${x[1]}.html` : `${pre(lang)}/${x[1]}.html`; return `<a class="more" href="${h}">${esc(L.more)} →</a>`; };
    const ld = [{ "@context": "https://schema.org", "@type": "HowTo", inLanguage: lang, name: f.h1, description: f.desc, url: url(lang),
      step: f.steps.map(([h, o, w, t], i) => ({ "@type": "HowToStep", position: i + 1, name: h, text: `${o} – ${w}. ${t}` })) },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Amtsbriefe", item: `${SITE}/${lang === "de" ? "" : lang + "/"}` }, { "@type": "ListItem", position: 2, name: f.nav, item: url(lang) }] }];
    const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<script>if(location.protocol=="http:"&&location.hostname.slice(-13)=="amtsbriefe.de")location.replace("https:"+location.href.slice(5))</script>
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
<div class="bar" aria-hidden="true"><i id="bar"></i></div>
<p class="prog" aria-live="polite"><span id="cnt">0</span>/${f.steps.length} ${esc(L.progress)}</p>
<ol class="chk" id="chk">
${f.steps.map(([h, o, w, t], i) => `<li id="s${i + 1}"><label><input type="checkbox" data-i="${i}"> ${i + 1}. ${esc(h)}</label>
<div class="meta"><b>${esc(L.office)}</b> ${esc(o)} · <b>${esc(L.when)}</b> ${esc(w)}</div>
<p>${esc(t)}</p>${link(i)}</li>`).join("\n")}
</ol>
<button class="reset" type="button" id="reset">${esc(L.reset)}</button>
<h2>${esc(L.tips)}</h2>
<ul>${f.tips.map((t, i) => `<li>${esc(t)}${i === 2 ? ` <a href="${root(lang)}ki-hilfe.html">KI-Hilfe</a> · <a href="${root(lang)}frist-rechner.html">Fristen-Rechner</a>` : ""}</li>`).join("")}</ul>
<h2>${esc(L.sources)}</h2>
<ul>${SRC.map(([n, u]) => `<li><a href="${u}" rel="noopener">${n}</a></li>`).join("")}</ul>
<p><small>${esc(L.stand)}: ${STAND}</small></p>
</main>
<footer><div class="wrap"><a href="${root(lang)}">Amtsbriefe</a>${NAVL(lang)}<a href="${pre(lang)}/vorlagen.html">${VORL[lang] || VORL.de}</a><a href="${pre(lang)}/ueber-uns.html">${ABOUT_NAV[lang]}</a><a href="${root(lang)}impressum.html">Impressum</a><a href="${root(lang)}datenschutz.html">Datenschutz</a></div></footer>
<script>
(function(){var K="ab-erste30",s={};try{s=JSON.parse(localStorage.getItem(K)||"{}")||{}}catch(e){}
var bx=document.querySelectorAll("#chk input"),n=bx.length;
function upd(){var c=0;bx.forEach(function(b){var on=!!s[b.dataset.i];b.checked=on;b.closest("li").classList.toggle("ok",on);if(on)c++});document.getElementById("cnt").textContent=c;document.getElementById("bar").style.width=(100*c/n)+"%"}
function save(){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
bx.forEach(function(b){b.addEventListener("change",function(){if(b.checked)s[b.dataset.i]=1;else delete s[b.dataset.i];save();upd()})});
document.getElementById("reset").addEventListener("click",function(){s={};save();upd()});upd()})();
</script>
</body>
</html>
`;
    const d = lang === "de" ? out : path.join(out, lang);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, SLUG + ".html"), html);
  }
  console.log("built", LANGS.length, "erste-30-tage pages");
};
