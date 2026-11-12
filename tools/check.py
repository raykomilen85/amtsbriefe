# Prüfung, die im GitHub-Actions-Runner läuft (dort ist das Internet erreichbar):
#  1. alle Seiten aus sitemap.xml + Impressum/Datenschutz live auf amtsbriefe.de (HTTP-Status)
#  2. alle externen Links aus den HTML-Dateien (HTTP-Status)
#  3. Wortlaut der zitierten Normen von gesetze-im-internet.de (Text + SHA-256, zum Vergleich mit dem letzten Lauf)
#  4. GitHub-Doku: Satz zur IP-Speicherung bei GitHub Pages
# Aufruf: python3 tools/check.py   (Ergebnis im Job-Log und in check-report.txt als Artefakt)
import glob, hashlib, html, re, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

UA = {"User-Agent": "Mozilla/5.0 (amtsbriefe.de link check; +https://amtsbriefe.de/impressum.html)"}
out = []
def log(s=""):
    print(s); out.append(s)

def get(url, body=False):
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.status, (r.read().decode("utf-8", "replace") if body else ""), r.geturl()
        except urllib.error.HTTPError as e:
            if e.code in (429, 503) and attempt < 2:
                time.sleep(5); continue
            return e.code, "", url
        except Exception as e:
            if attempt < 2:
                time.sleep(3); continue
            return "ERR " + type(e).__name__, "", url

# 1. eigene Seiten
sm = open("sitemap.xml", encoding="utf-8").read()
pages = sorted(set(re.findall(r"<loc>([^<]+)</loc>", sm)))
pages += ["https://amtsbriefe.de/impressum.html", "https://amtsbriefe.de/datenschutz.html", "https://amtsbriefe.de/a1235c5efafc60bf8e2284fa29c3aa9a.txt"]
with ThreadPoolExecutor(8) as ex:
    res = list(ex.map(get, pages))
bad = [(u, r[0]) for u, r in zip(pages, res) if r[0] != 200]
log(f"== EIGENE SEITEN: {len(pages)} geprüft, {len(bad)} Fehler")
for u, c in bad: log(f"  {c} {u}")

# 2. externe Links
ext = set()
for f in glob.glob("**/*.html", recursive=True) + ["index.html"]:
    for u in re.findall(r'href="(https?://[^"#]+)', open(f, encoding="utf-8").read()):
        if "amtsbriefe.de" not in u:
            ext.add(html.unescape(u))
ext = sorted(ext)
with ThreadPoolExecutor(6) as ex:
    res = list(ex.map(get, ext))
bad = [(u, r[0], r[2]) for u, r in zip(ext, res) if r[0] != 200]
log(f"== EXTERNE LINKS: {len(ext)} geprüft, {len(bad)} nicht 200")
for u, c, final in bad: log(f"  {c} {u}" + (f" -> {final}" if final != u else ""))

# 3. Normen
NORMS = ["aufenthg_2004/__11", "aufenthg_2004/__23a", "aufenthg_2004/__59", "aufenthg_2004/__60a", "aufenthg_2004/__81",
         "aufenthg_2004/__84", "vwgo/__58", "vwgo/__75", "vwgo/__81", "asylvfg_1992/__74", "berathig/__1", "wogg/__7",
         "wogg/__25", "bkgg_1996/__6a", "beeg/__7", "beeg/__13", "uhvorschg/__4", "sgb_12/__44", "sgg/__88"]
log("== NORMEN (gesetze-im-internet.de)")
for n in NORMS:
    c, body, _ = get(f"https://www.gesetze-im-internet.de/{n}.html", body=True)
    m = re.search(r'<div class="jnhtml">([\s\S]*?)</div>\s*</div>\s*</div>', body) or re.search(r'<div class="jnhtml">([\s\S]*)', body)
    txt = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", m.group(1) if m else ""))).strip()
    txt = txt.split("Nach oben")[0].split("Impressum")[0].strip()
    title = re.search(r"<title>([^<]*)</title>", body)
    log(f"-- {n} [{c}] {title.group(1).strip() if title else ''} sha256={hashlib.sha256(txt.encode()).hexdigest()[:16]}")
    log("   " + txt[:6000])

# 4. GitHub Pages IP-Satz
log("== GITHUB DOKU")
for u in ["https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages",
          "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
          "https://www.goatcounter.com/help/privacy"]:
    c, body, _ = get(u, body=True)
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", body)))
    hits = [s.strip() for s in re.findall(r"[^.]*\bIP address[^.]*\.", t)][:6]
    log(f"-- [{c}] {u}")
    for h in hits: log("   * " + h[:400])

open("check-report.txt", "w", encoding="utf-8").write("\n".join(out))
