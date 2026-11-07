// Builds impressum.html and datenschutz.html in 13 languages from tools/src/legal/<lang>.json.
// German is the legally binding version; the others are shown with a note. Usage: node tools/legal.js
const fs = require("fs"), path = require("path");
const LANGS = [["de","Deutsch"],["tr","Türkçe"],["bg","Български"],["ar","العربية"],["uk","Українська"],["pl","Polski"],["en","English"],["el","Ελληνικά"],["fr","Français"],["nl","Nederlands"],["ro","Română"],["es","Español"],["ku","Kurdî"]];
const V = { ADDR: "Milen Yakimov<br>Cleverhoferweg 154<br>23611 Bad Schwartau<br>Deutschland", MAIL: "raykomilen85@gmail.com",
  GH: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement", GC: "https://www.goatcounter.com/help/privacy" };
const D = {}; for (const [l] of LANGS) D[l] = JSON.parse(fs.readFileSync(path.join(__dirname, "src/legal", l + ".json"), "utf8"));
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const fill = s => esc(s).replace(/\{(ADDR|MAIL|GH|GC)\}/g, (m, k) => k === "ADDR" ? V.ADDR : k === "MAIL" ? V.MAIL : `<span class="u">${V[k]}</span>`);
const body = (l, key) => { const p = D[l][key];
  return `<h1>${esc(p.title)}</h1>` + p.s.map(([h, t]) => `<h2>${esc(h)}</h2><p>${fill(t)}</p>`).join("") + `<p><small>${esc(p.stand)}</small></p>`; };
function page(key, file, deTitle) {
  const R = {}; for (const [l] of LANGS) R[l] = { back: D[l][key].back, note: D[l].note, title: D[l][key].title, html: body(l, key) };
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${deTitle} – Amtsbriefe</title>
<meta name="robots" content="noindex">
<style>
:root{--bg:#EEF1F5;--fg:#17213A;--muted:#566079;--accent:#1F4E8C;--card:#fff;--line:#D5DDE6;--warn:#FFF4D6;--warnb:#F0C75E}
@media (prefers-color-scheme:dark){:root{--bg:#0F131B;--fg:#E5E9F1;--muted:#9BA5B9;--accent:#8FB5EE;--card:#172133;--line:#2A3850;--warn:#3A2F12;--warnb:#8A6D1E;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 Arial,Helvetica,"Noto Sans","Noto Sans Arabic",sans-serif}
main{max-width:680px;margin:0 auto;padding:24px 16px 48px}
h1{font-size:28px;line-height:1.25;margin:16px 0 20px}h2{font-size:18px;margin:28px 0 6px}
p{margin:0 0 10px;overflow-wrap:anywhere}a{color:var(--accent)}small{color:var(--muted)}.u{overflow-wrap:anywhere}
.langs{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 4px}.langs button{font:inherit;font-size:14px;padding:5px 10px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.langs button[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:#fff}
.note{background:var(--warn);border:1px solid var(--warnb);border-radius:10px;padding:10px 12px;margin:14px 0 0;font-size:15px}.note button{font:inherit;background:none;border:0;padding:0;color:var(--accent);text-decoration:underline;cursor:pointer}
</style>
<meta property="og:image" content="https://amtsbriefe.de/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
</head>
<body>
<main>
<p><a href="/" id="back">${esc(D.de[key].back)}</a></p>
<div class="langs" id="langs" role="group" aria-label="Sprache"></div>
<div class="note" id="note" hidden></div>
<div id="c">${body("de", key)}</div>
</main>
<script>
var LANGS=${JSON.stringify(LANGS)},R=${JSON.stringify(R)};
var lang="de";try{var s=localStorage.getItem("bb-lang");if(R[s])lang=s}catch(e){}
function show(l){lang=l;var r=R[l];document.documentElement.lang=l;document.documentElement.dir=l==="ar"?"rtl":"ltr";
document.getElementById("c").innerHTML=r.html;document.getElementById("back").textContent=r.back;document.title=r.title+" – Amtsbriefe";
var n=document.getElementById("note");n.hidden=l==="de";if(l!=="de"){n.innerHTML="";n.appendChild(document.createTextNode(r.note+" "));var b=document.createElement("button");b.type="button";b.lang="de";b.textContent="Deutsche Fassung";b.onclick=function(){show("de")};n.appendChild(b)}
document.getElementById("langs").innerHTML=LANGS.map(function(x){return '<button type="button" data-l="'+x[0]+'" lang="'+x[0]+'" aria-pressed="'+(x[0]===l)+'">'+x[1]+'</button>'}).join("")}
document.getElementById("langs").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;show(b.dataset.l);try{localStorage.setItem("bb-lang",b.dataset.l)}catch(x){}});
show(lang);
</script>
<script data-goatcounter="https://amtsbriefede.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</body>
</html>
`;
}
const out = path.join(__dirname, "..");
fs.writeFileSync(path.join(out, "impressum.html"), page("imp", "impressum.html", "Impressum"));
fs.writeFileSync(path.join(out, "datenschutz.html"), page("ds", "datenschutz.html", "Datenschutz"));
console.log("legal pages built:", LANGS.length, "languages");
