# amtsbriefe.de – Ausbauplan (von Milen am 19.11.2026 beauftragt)

Ziel der Website: Menschen in Deutschland – vor allem neu Zugewanderten in den ersten 1–3 Jahren –
Papierkram verständlich machen: Was muss ich tun, in welcher Reihenfolge, bis wann, welche Rechte habe ich?

Arbeitsweise: pro Lauf genau EIN offener Punkt (von oben nach unten). Ein Punkt gilt erst als erledigt,
wenn ALLE Abnahmekriterien erfüllt sind. Dann hier abhaken (Datum + Commit) und committen.

Allgemeine Abnahmekriterien für jeden Punkt:
- in allen 13 Sprachen (de, tr, bg, ar, uk, pl, en, el, fr, nl, ro, es, ku); Musterbriefe bleiben Deutsch
- jede Rechtsaussage mit amtlicher Quelle (gesetze-im-internet.de – über Chrome lesen, WebFetch ist dort gesperrt –,
  bamf.de, arbeitsagentur.de, Behördenseiten); Quellen und „Stand“ auf der Seite; nichts erfinden; keine Einzelfall-Rechtsberatung
- Seite in sitemap.xml (alle 13 Sprachen, hreflang), von der Startseite und passenden Seiten verlinkt, SEO-Titel ≤ 60, Beschreibung ≤ 155 Zeichen
- Playwright bei 390 px: kein horizontales Scrollen, keine JS-Fehler, Sprachwechsel funktioniert
- danach Indexierung in Search Console beantragen (Chrome) und IndexNow pingen

## Punkte

- [x] A. Integrationskurs-Seite (/integrationskurs.html) + 3 Vorlagen (Teilnahmebescheinigung, Entschuldigung, 50 % Erstattung) – erledigt 19.11.2026 (Commit 7a599a0)
- [x] A2. (erledigt 19.11.2026: Vorlagen ikwechsel, ikwid; § 70 VwGO geprüft) Weitere Integrationskurs-Vorlagen: Antrag auf Wechsel des Kursträgers (§ 14 Abs. 4 IntV); Widerspruch gegen Ablehnung der Zulassung (Frist laut Rechtsbehelfsbelehrung prüfen). Auf /integrationskurs.html ergänzen.
- [x] 2. (erledigt 19.11.2026: /ueber-uns.html in 13 Sprachen, Footer-Links in allen Generatoren und statischen Seiten) „Über uns“ (/ueber-uns.html): wer hinter der Seite steht (Milen Yakimov, Bad Schwartau; besucht selbst einen Integrationskurs in Lübeck; hat die Seite gebaut, weil Behördenbriefe schwer zu verstehen sind), Ziel, wie Inhalte geprüft werden (amtliche Quellen, Stand-Datum), was die Seite NICHT ist (keine Behörde, keine Rechtsberatung), Kontakt-E-Mail wie im Impressum. Keine Wohnadresse außer der, die schon im Impressum steht. Im Footer aller Seiten verlinken (Generatoren anpassen).
- [x] 3. (erledigt 19.11.2026: /grundsicherungsgeld.html, Vorlagen gsanh + gswid; SGB II §§ 31–32, SGB X § 24, SGG § 84 geprüft) Bürgergeld → Grundsicherungsgeld (/grundsicherungsgeld.html): Was hat sich seit 01.07.2026 geändert, was bedeutet es für Briefe/Bescheide (Behörden dürfen bis 31.12.2026 noch „Bürgergeld“ schreiben), Mitwirkungspflichten, Minderungen und wie man auf eine Anhörung antwortet, Widerspruch. Neue Vorlagen: Antwort auf Anhörung vor Leistungsminderung; Widerspruch gegen Minderung. Quellen: SGB II (gesetze-im-internet.de), arbeitsagentur.de/grundsicherung-loest-buergergeld-ab. Schwerpunkt Nicht-Deutsch-Sprachen (auf Deutsch ist die Konkurrenz sehr stark).
- [x] 4. (erledigt 19.11.2026: /erste-30-tage.html in 13 Sprachen, Checkliste mit localStorage, § 17/19 BMG, § 31 ZKG, § 193 VVG geprüft) Wegweiser „Die ersten 30 Tage in Deutschland“ (/erste-30-tage.html): Schritte in Reihenfolge (Anmeldung beim Bürgeramt innerhalb von 2 Wochen § 17 BMG, Wohnungsgeberbestätigung, Steuer-ID kommt per Post, Bankkonto/Basiskonto § 31 ZKG, Krankenversicherung, Rundfunkbeitrag, ggf. Ausländerbehörde, Kindergeld/Familienkasse, Integrationskurs, Schule/Kita). Je Schritt: Amt, Frist, Unterlagen, passende Vorlage (Link), typische Fehler. Abhakbare Checkliste, gespeichert nur im Browser (localStorage mit try/catch).
- [x] 5. (erledigt 19.11.2026: /ihre-rechte.html in 13 Sprachen; § 25/33/44 SGB X, BerHG 15 €, MBE/JMD, Mindestlohn 13,90 € (Bundesregierung), § 31 ZKG, § 24 SGB VIII geprüft) „Kennen Sie Ihre Rechte?“ (/ihre-rechte.html): 10 Karten, je 3–5 Sätze + Quelle: Widerspruch und Frist; Akteneinsicht (§ 25 SGB X / § 29 VwVfG); schriftlichen Bescheid verlangen; Überprüfungsantrag (§ 44 SGB X); Beratungshilfe (BerHG); kostenlose Migrationsberatung (MBE/JMD); Mindestlohn (MiLoG, aktuellen Betrag prüfen); Basiskonto; Recht auf Kita-Platz (§ 24 SGB VIII); Befreiung vom Rundfunkbeitrag. Jede Karte verlinkt auf passende Vorlage/Seite.
- [x] 6. (erledigt 19.11.2026: /was-tun.html in 13 Sprachen, regelbasiert, Bundesland → Landesportal + Zuständige Stelle mit ?land=) Wegweiser-Assistent (/was-tun.html): 3–4 Fragen (Was ist passiert? Brief bekommen / neu angekommen / Job verloren / Kind geboren / Umzug / Aufenthalt läuft ab; Staatsangehörigkeit EU/Nicht-EU; Bundesland) → zeigt passenden Wegweiser, Vorlagen, Fristen-Rechner, KI-Hilfe. Reines JavaScript, regelbasiert, keine externen Dienste, alle 13 Sprachen.
- [x] 7a. (erledigt 19.11.2026: /wegzug-ausland.html in 13 Sprachen, Vorlagen wzmiet, wzrb, wzkk, wzfk; BMG §§ 17, 24, 54, AufenthG § 51, EStG § 68, SGB I § 60, BGB §§ 568, 573c, rundfunkbeitrag.de geprüft; Commit 401a5fc) Wegweiser „Deutschland verlassen“ – Nachfrage laut Search Console („deutschland verlassen abmelden“, „meldeadresse im ausland“, „wymeldowanie z niemiec“, „abmeldeschein wohnsitz“).
- [ ] 7. Weitere Wegweiser nur bei nachgewiesener Nachfrage (Search Console / GoatCounter): z. B. „Job verloren“, „Kind geboren“, „Umzug“. Jeweils als eigener Punkt hier eintragen, wenn Daten es zeigen.

## Log
- 19.11.2026: Plan angelegt; A, A2, 2 und 3 erledigt.
- 19.11.2026: Punkte 4, 5 und 6 erledigt. Offen nur Punkt 7 (datengetrieben).
- 19.11.2026: Indexierung beantragt (Search Console): was-tun, erste-30-tage, ihre-rechte (de+tr), grundsicherungsgeld (de). Am selben Abend nachgeholt: integrationskurs, ueber-uns, tr/grundsicherungsgeld, tr/integrationskurs. Alle neuen Seiten (de+tr) beantragt. IndexNow für alle 13 Sprachen gesendet.
- 19.11.2026: Search Console (28 Tage, 497 Impressionen) für Punkt 7 ausgewertet: Häufungen bei „Steuerklasse ändern/wechseln“ (~13 Impr., de/uk/pl) und „Abmeldung / Deutschland verlassen“ (~10 Impr., de/pl/fr). Vorschlag an Milen geschickt, noch NICHT eingetragen (wartet auf Zustimmung). GoatCounter im Browser nicht lesbar.
- 19.11.2026: Punkt 7a (Deutschland verlassen) erledigt. „Steuerklasse wechseln“ bewusst NICHT als eigene Seite: /vorlage/finanzamt-steuerklasse-wechseln.html deckt die Suchanfragen schon ab (SEO-Task pflegt sie), eine zweite Seite würde mit ihr konkurrieren.
