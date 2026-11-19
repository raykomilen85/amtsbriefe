const NAVL = require("./navlinks.js");
// "Was tun?" rule-based wizard in 13 languages (content: src/wastun/<lang>.json). Called from build.js.
const fs = require("fs");
const path = require("path");
module.exports = function ({ CSS, LOGO, LANGS, SITE, VORL, ABOUT_NAV, esc, root, out }) {
  const SLUG = "was-tun";
  const LAND = { "01": ["Schleswig-Holstein", "https://zufish.schleswig-holstein.de/"], "02": ["Hamburg", "https://www.hamburg.de/behoerdenfinder/"], "03": ["Niedersachsen", "https://www.service.niedersachsen.de/"], "04": ["Bremen", "https://www.service.bremen.de/startseite-1459"], "05": ["Nordrhein-Westfalen", "https://meineverwaltung.nrw/"], "06": ["Hessen", "https://verwaltungsportal.hessen.de/"], "07": ["Rheinland-Pfalz", "https://bus.rlp.de/"], "08": ["Baden-Württemberg", "https://www.service-bw.de/zufi"], "09": ["Bayern", "https://www.bayernportal.de/"], "10": ["Saarland", "https://service.saarland.de/"], "11": ["Berlin", "https://service.berlin.de/behoerden/"], "12": ["Brandenburg", "https://service.brandenburg.de/service/de/adressen/"], "13": ["Mecklenburg-Vorpommern", "https://www.mv-serviceportal.de/"], "14": ["Sachsen", "https://amt24.sachsen.de/zufi"], "15": ["Sachsen-Anhalt", "https://buerger.sachsen-anhalt.de/"], "16": ["Thüringen", "https://verwaltung.thueringen.de/"] };
  // labels of existing pages, taken from the homepage translation object N
  const idx = fs.readFileSync(path.join(out, "index.html"), "utf8");
  const m = idx.match(/\(function\(\)\{var N=(\{.*?\});\s*var /s) || idx.match(/\(function\(\)\{var N=(\{.*?\});/s);
  const N = Function("return " + m[1])();
  const W = Object.fromEntries(LANGS.map(([l]) => [l, JSON.parse(fs.readFileSync(path.join(__dirname, "src", "wastun", l + ".json"), "utf8"))]));
  const pre = l => (l === "de" ? "" : "/" + l);
  const url = l => `${SITE}/${l === "de" ? "" : l + "/"}${SLUG}.html`;
  const rel = (from, l) => (from === "de" ? "" : "../") + (l === "de" ? "" : l + "/") + SLUG + ".html";
  // resource keys per situation; "nonEU:" only for non-EU, "EU:" only for EU
  const RULES = [["ki", "frist", "vorl", "rechte", "stelle"], ["f30", "integ", "nonEU:aufent", "rechte", "stelle"], ["agentur", "gsg", "sozial", "frist", "rechte"], ["familie", "sozial", "rechte", "stelle"], ["f30", "stelle", "alltag"], ["nonEU:aufent", "nonEU:abschieb", "EU:f30", "stelle", "rechte"]];
  const extra = `.wz fieldset{border:1px solid #d6dde8;border-radius:12px;padding:.8rem 1rem;margin:0 0 .9rem;background:#fff}.wz legend{font-weight:700;padding:0 .3rem}
.wz label.o{display:flex;gap:.6rem;align-items:center;padding:.45rem 0;font-size:1.02rem;cursor:pointer}.wz input[type=radio]{width:1.25rem;height:1.25rem}
.wz select{width:100%;padding:.5rem;font-size:1rem;border-radius:8px}.wz .go{background:#1F4E8C;color:#fff;border:0;border-radius:10px;padding:.75rem 1.2rem;font-size:1.05rem;font-weight:700;cursor:pointer}
#res{border:2px solid #1F4E8C;border-radius:12px;padding:1rem;margin-top:1rem;background:#f4f7fc}#res ul{padding-inline-start:1.2rem}#res li{margin:.45rem 0}.again{background:none;border:1px solid #99a;border-radius:8px;padding:.4rem .8rem;cursor:pointer}`;
  for (const [lang] of LANGS) {
    const w = W[lang], dir = lang === "ar" ? "rtl" : "ltr", p = pre(lang);
    const t = k => (N[k] && (N[k][lang] || N[k].de)) || k;
    const RES = { ki: [w.ki, root(lang) + "ki-hilfe.html"], frist: [w.frist, root(lang) + "frist-rechner.html"], vorl: [VORL[lang] || VORL.de, p + "/vorlagen.html"],
      rechte: [t("rechte"), p + "/ihre-rechte.html"], stelle: [w.stelleL, p + "/zustaendige-stelle.html"], f30: [t("f30"), p + "/erste-30-tage.html"], integ: [t("integ"), p + "/integrationskurs.html"],
      aufent: [t("aufent"), p + "/aufenthalt-laeuft-ab.html"], abschieb: [t("abschieb"), p + "/abschiebung-hilfe.html"], agentur: [w.agentur, p + "/vorlage/agentur-fuer-arbeit-arbeitsuchend-melden.html"],
      gsg: [t("gsg"), p + "/grundsicherungsgeld.html"], sozial: [t("sozial"), p + "/sozialleistungen-antrag.html"], familie: [t("familie"), p + "/familie-schule.html"], alltag: [t("alltag"), p + "/alltag-briefvorlagen.html"] };
    const cfg = { R: RULES, RES, tips: w.tips, eunote: w.eunote, portal: w.portal, L: Object.fromEntries(Object.entries(LAND).map(([k, v]) => [k, v[1]])) };
    const ld = { "@context": "https://schema.org", "@type": "WebApplication", name: w.h1, url: url(lang), inLanguage: lang, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }, description: w.desc };
    const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<script>if(location.protocol=="http:"&&location.hostname.slice(-13)=="amtsbriefe.de")location.replace("https:"+location.href.slice(5))</script>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(w.title)}</title>
<meta name="description" content="${esc(w.desc)}">
<link rel="canonical" href="${url(lang)}">
${LANGS.map(([l]) => `<link rel="alternate" hreflang="${l}" href="${url(l)}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${url("de")}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(w.h1)}"><meta property="og:description" content="${esc(w.desc)}"><meta property="og:url" content="${url(lang)}"><meta property="og:image" content="https://amtsbriefe.de/og-image.png">
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
<nav class="crumb"><a href="${root(lang)}">Amtsbriefe</a> › ${esc(w.nav)}</nav>
<h1>${esc(w.h1)}</h1>
<p class="intro">${esc(w.intro)}</p>
<form class="wz" id="wz">
<fieldset><legend>${esc(w.q1)}</legend>${w.opts.map((o, i) => `<label class="o"><input type="radio" name="s" value="${i}"${i === 0 ? " required" : ""}> ${esc(o)}</label>`).join("")}</fieldset>
<fieldset><legend>${esc(w.q2)}</legend><label class="o"><input type="radio" name="c" value="eu"> ${esc(w.eu)}</label><label class="o"><input type="radio" name="c" value="non" checked> ${esc(w.noneu)}</label></fieldset>
<fieldset><legend>${esc(w.q3)}</legend><select name="l" aria-label="${esc(w.q3)}"><option value="">${esc(w.none)}</option>${Object.entries(LAND).sort((a, b) => a[1][0].localeCompare(b[1][0], "de")).map(([k, [n]]) => `<option value="${k}">${esc(n)}</option>`).join("")}</select></fieldset>
<button class="go" type="submit">${esc(w.show)}</button>
</form>
<section id="res" hidden aria-live="polite"><h2>${esc(w.res)}</h2><p id="tip"></p><ul id="list"></ul><button class="again" type="button" id="again">${esc(w.restart)}</button></section>
</main>
<footer><div class="wrap"><a href="${root(lang)}">Amtsbriefe</a>${NAVL(lang)}<a href="${p}/vorlagen.html">${VORL[lang] || VORL.de}</a><a href="${p}/ueber-uns.html">${ABOUT_NAV[lang]}</a><a href="${root(lang)}impressum.html">Impressum</a><a href="${root(lang)}datenschutz.html">Datenschutz</a></div></footer>
<script>
(function(){var C=${JSON.stringify(cfg)};var f=document.getElementById("wz"),res=document.getElementById("res");
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
f.addEventListener("submit",function(e){e.preventDefault();var s=f.s.value;if(s==="")return;s=+s;var eu=f.c.value==="eu",l=f.l.value,h=[];
 C.R[s].forEach(function(k){if(k.indexOf("nonEU:")===0){if(eu)return;k=k.slice(6)}else if(k.indexOf("EU:")===0){if(!eu)return;k=k.slice(3)}var r=C.RES[k];var u=r[1];if(k==="stelle"&&l)u+="?land="+l;h.push('<li><a href="'+u+'">'+esc(r[0])+"</a></li>")});
 if(l&&C.L[l])h.push('<li><a href="'+C.L[l]+'" rel="noopener">'+esc(C.portal)+"</a></li>");
 document.getElementById("tip").textContent=eu&&s===5?C.eunote:C.tips[s]+(eu&&s===1?" "+C.eunote:"");document.getElementById("list").innerHTML=h.join("");res.hidden=false;res.scrollIntoView({behavior:"smooth",block:"start"})});
document.getElementById("again").addEventListener("click",function(){f.reset();res.hidden=true;window.scrollTo(0,0)});})();
</script>
</body>
</html>
`;
    const d = lang === "de" ? out : path.join(out, lang);
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, SLUG + ".html"), html);
  }
  console.log("built", LANGS.length, "was-tun pages");
};
