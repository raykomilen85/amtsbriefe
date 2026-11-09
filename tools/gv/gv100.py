#!/usr/bin/env python3
"""Converts the Destatis Gemeindeverzeichnis (GV100AD, fixed-width ASCII) into small JSON files
for the page "Zuständige Stelle finden" (daten/gv/<Land>.json + daten/gv/meta.json).
Field positions (1-based) follow the GV100AD record layout of Destatis:
  Satzart 1-2, Gebietsstand 3-10 (JJJJMMTT),
  10 Land:      Land 11-12, Name 23-72
  40 Kreis:     Kreis 11-15, Name 23-72
  60 Gemeinde:  AGS 11-18, Name 23-72, Einwohner 140-150, PLZ 166-170
Usage: python3 gv100.py <GV100AD file> <output dir> <source url>"""
import json, os, sys

def read(path):
    raw = open(path, "rb").read()
    for enc in ("utf-8", "cp1252", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            pass

def main(src, out, source_url):
    laender, kreise, gem, stand = {}, {}, {}, ""
    for line in read(src).splitlines():
        if len(line) < 72:
            continue
        sa = line[0:2]
        name = line[22:72].strip()
        if sa == "10":
            laender[line[10:12]] = name
            stand = stand or line[2:10]
        elif sa == "40":
            kreise[line[10:15]] = name
        elif sa == "60":
            ags = line[10:18]
            if not ags.isdigit():
                continue
            plz = line[165:170].strip() if len(line) >= 170 else ""
            try:
                ew = int(line[139:150].strip() or 0)
            except ValueError:
                ew = 0
            gem.setdefault(ags[:2], []).append([ags, name, plz if plz.isdigit() else "", ew])
    if len(laender) != 16 or sum(len(v) for v in gem.values()) < 10000:
        sys.exit(f"Unerwartete Daten: {len(laender)} Länder, {sum(len(v) for v in gem.values())} Gemeinden")
    os.makedirs(out, exist_ok=True)
    for land in sorted(laender):
        ks = sorted([[k, n] for k, n in kreise.items() if k[:2] == land], key=lambda x: x[1])
        gs = sorted(gem.get(land, []), key=lambda x: x[1])
        with open(os.path.join(out, land + ".json"), "w", encoding="utf-8") as f:
            json.dump({"k": ks, "g": gs}, f, ensure_ascii=False, separators=(",", ":"))
    meta = {"stand": f"{stand[6:8]}.{stand[4:6]}.{stand[0:4]}" if len(stand) == 8 else "",
            "quelle": source_url, "laender": dict(sorted(laender.items())),
            "gemeinden": sum(len(v) for v in gem.values())}
    with open(os.path.join(out, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, separators=(",", ":"))
    print("ok", meta["stand"], meta["gemeinden"], "Gemeinden")

if __name__ == "__main__":
    main(*sys.argv[1:4])
