# Prüfung, die im GitHub-Actions-Runner läuft (dort ist das Internet erreichbar):
#  1. alle Seiten aus sitemap.xml + Impressum/Datenschutz live auf amtsbriefe.de (HTTP-Status)
#  2. alle externen Links aus den HTML-Dateien (HTTP-Status)
#  3. (Normen: gesetze-im-internet.de blockiert den Runner – Prüfung erfolgt manuell)
#  4. GitHub-Doku: Satz zur IP-Speicherung bei GitHub Pages
# Aufruf: python3 tools/check.py   (Ergebnis im Job-Log und in check-report.txt als Artefakt)
import glob, hashlib, html, re, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

UA = {"User-Agent": "Mozilla/5.0 (amtsbriefe.de link check; +https://amtsbriefe.de/impressum.html)"}
out = []
def log(s=""):
    print(s); out.append(s)

def get(url, body=False):
    # curl mit harter Zeitgrenze (urllib blieb bei manchen Servern hängen)
    r = subprocess.run(["curl", "-sSL", "--max-time", "25", "--retry", "1", "-A", UA["User-Agent"],
                        "-o", "-" if body else "/dev/null", "-w", "\n%{http_code} %{url_effective}", url],
                       capture_output=True, timeout=70)
    txt = r.stdout.decode("utf-8", "replace")
    txt, _, tail = txt.rpartition("\n")
    code, _, final = tail.partition(" ")
    code = int(code) if code.isdigit() and code != "000" else "ERR " + (r.stderr.decode()[:60].strip() or "timeout")
    return code, txt, final or url

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
        if "amtsbriefe.de" not in u and "gesetze-im-internet.de" not in u:
            ext.add(html.unescape(u))
ext = sorted(ext)
with ThreadPoolExecutor(6) as ex:
    res = list(ex.map(get, ext))
bad = [(u, r[0], r[2]) for u, r in zip(ext, res) if r[0] != 200]
log(f"== EXTERNE LINKS: {len(ext)} geprüft, {len(bad)} nicht 200")
for u, c, final in bad: log(f"  {c} {u}" + (f" -> {final}" if final != u else ""))

# 3. Normen: gesetze-im-internet.de ist vom GitHub-Runner aus nicht erreichbar (Verbindungs-Timeout, Stand 12.11.2026).
#    Die Normen werden deshalb bei der täglichen Kontrolle per WebFetch geprüft, nicht hier.
log("== NORMEN: nicht im Runner prüfbar (gesetze-im-internet.de blockiert Rechenzentrums-IPs) – manuell prüfen")

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
