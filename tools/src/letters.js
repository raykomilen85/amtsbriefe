// German letter templates (letters to German authorities are always written in German).
// {{key}} = field to fill in. SAMPLE holds example values for the "filled example" view.
const SAMPLE = {
  name: "Ayşe Yılmaz",
  street: "Musterstraße 12",
  city: "23611 Bad Schwartau",
  dob: "14.03.1990",
  nat: "türkisch",
  file: "AZ 123-456/26",
  office: "Kreis Ostholstein – Ausländerbehörde",
  officeaddr: "Lübecker Straße 41\n23701 Eutin",
  title: "Aufenthaltserlaubnis nach § 30 AufenthG",
  expiry: "15.11.2026",
  bdate: "20.10.2026",
  phone: "0151 23456789",
  reason: "Ich bin seit dem 01.09.2026 bei der Firma Muster GmbH unbefristet beschäftigt. Den Arbeitsvertrag lege ich bei.",
  impossible: "Ich besitze keinen gültigen Reisepass. Die Botschaft hat meinen Antrag auf einen neuen Pass noch nicht bearbeitet (Nachweis anbei).",
  until: "31.12.2026",
  why: "Meine Tochter beendet am 18.12.2026 das Schulhalbjahr. Außerdem muss ich meine Wohnung ordnungsgemäß kündigen.",
  doctor: "Dr. med. Muster, Facharzt für Innere Medizin",
  date: "30.10.2026",
  today: "30.10.2026",
  month: "November 2026",
  kgnr: "123FK456789",
  child: "Emre Yılmaz, geb. 02.05.2019",
  vsnr: "12 140390 Y 123",
  adate: "15.08.2026",
  benefit: "Wohngeld",
  otherparent: "Mehmet Demir, letzte bekannte Anschrift: Beispielweg 3, 20095 Hamburg",
  contract: "K-48151623", product: "Mobilfunkvertrag mit der Rufnummer 0151 23456789", policy: "HR-2024-778899", insurance: "Hausratversicherung",
  creditor: "Muster Online-Shop GmbH", amount: "187,40 €", since: "12.10.2026", deadline: "25.11.2026", period: "01.01.2025 bis 31.12.2025", received: "14.10.2026",
  job: "Lagerhelferin", empend: "31.10.2026", months: "August und September 2026", persnr: "4711",
  objection: "Ich habe bei Ihrem Auftraggeber nie einen Vertrag geschlossen und keine Ware erhalten.",
  defect: "Im Schlafzimmer bildet sich an der Außenwand Schimmel (ca. 1 m²). Fotos liegen bei.",
  copies: "2", person: "Emre Yılmaz, geb. 02.05.2019", bplace: "Lübeck", relation: "Mutter", purpose: "Kindergeld und Anmeldung in der Schule", start: "01.08.2027", hours: "ganztags, ca. 8 Stunden täglich", class: "3b", absent: "03.11.2026 bis 05.11.2026", language: "Türkisch",
  hardship: "Ich lebe seit 9 Jahren in Deutschland, spreche Deutsch auf B1-Niveau, arbeite in Vollzeit und meine zwei Kinder gehen hier zur Schule.",
};

const LABELS = {
  name: "Vor- und Nachname", street: "Straße und Hausnummer", city: "PLZ und Ort",
  dob: "Geburtsdatum", nat: "Staatsangehörigkeit", file: "Aktenzeichen",
  office: "Name der Behörde", officeaddr: "Adresse der Behörde", title: "Art des Aufenthaltstitels",
  expiry: "Ablaufdatum", bdate: "Datum des Bescheids/Schreibens", phone: "Telefonnummer",
  reason: "Ihre Gründe und Nachweise", impossible: "Warum die Ausreise/Abschiebung nicht möglich ist",
  until: "gewünschtes Datum", why: "Ihre Gründe", doctor: "Name des Arztes / der Ärztin",
  date: "Datum der Bescheinigung", month: "Monat (ab wann)", kgnr: "Kindergeldnummer", child: "Name und Geburtsdatum des Kindes",
  vsnr: "Rentenversicherungsnummer", adate: "Datum Ihres Antrags", benefit: "Name der Leistung", otherparent: "Name und letzte Adresse des anderen Elternteils", today: "heutiges Datum", hardship: "Ihre persönliche Situation",
  contract: "Kunden- oder Vertragsnummer", product: "Art des Vertrags (z. B. Mobilfunkvertrag mit Rufnummer)", policy: "Versicherungsnummer", insurance: "Art der Versicherung",
  creditor: "Name des Auftraggebers / Gläubigers", amount: "geforderter Betrag", objection: "Ihre Gründe / Einwendungen", since: "seit wann (Datum)", defect: "Beschreibung des Mangels",
  deadline: "Frist (Datum)", period: "Abrechnungszeitraum", received: "Datum des Erhalts", job: "Ihre Tätigkeit", empend: "Ende des Arbeitsverhältnisses", months: "Monate", persnr: "Personalnummer",
  copies: "Anzahl", person: "Name, Geburtsname und Geburtsdatum der Person", bplace: "Geburtsort", relation: "Ihr Verhältnis zur Person (z. B. ich selbst, Mutter, Vater)", purpose: "Verwendungszweck", start: "gewünschter Beginn (Datum)", hours: "Betreuungsumfang (Stunden pro Tag)", class: "Klasse", absent: "Zeitraum (von – bis)", language: "Sprache",
};

const head = `{{name}}
{{street}}
{{city}}
Tel.: {{phone}}

{{office}}
{{officeaddr}}

{{city}}, den {{today}}`;

const foot = `Mit freundlichen Grüßen

______________________
{{name}}`;

const LETTERS = {
  verl: {
    subj: "Antrag auf Verlängerung meines Aufenthaltstitels – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Verlängerung meines Aufenthaltstitels ({{title}}), der am {{expiry}} abläuft.

Name: {{name}}, geboren am {{dob}}, Staatsangehörigkeit: {{nat}}

Ich stelle diesen Antrag schriftlich und vor Ablauf meines Aufenthaltstitels, weil ich keinen früheren Termin bekommen habe. Fehlende Unterlagen reiche ich nach Aufforderung sofort nach.

Ich bitte um Ausstellung einer Fiktionsbescheinigung nach § 81 Abs. 5 AufenthG und um einen Termin.

Bitte bestätigen Sie mir den Eingang dieses Antrags.`,
  },
  fikt: {
    subj: "Bitte um Ausstellung einer Fiktionsbescheinigung – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

am {{bdate}} habe ich die Verlängerung meines Aufenthaltstitels beantragt. Mein bisheriger Titel ist am {{expiry}} abgelaufen bzw. läuft an diesem Tag ab.

Da ich den Antrag rechtzeitig gestellt habe, gilt mein Aufenthaltstitel nach § 81 Abs. 4 AufenthG fort. Ich bitte Sie, mir hierüber eine Fiktionsbescheinigung nach § 81 Abs. 5 AufenthG auszustellen. Ich benötige sie als Nachweis, zum Beispiel für meinen Arbeitgeber und das Jobcenter.

Bitte teilen Sie mir mit, wann ich die Bescheinigung abholen kann oder ob Sie sie mir zusenden.`,
  },
  anh: {
    subj: "Stellungnahme zu Ihrem Anhörungsschreiben vom {{bdate}} – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

zu Ihrem Anhörungsschreiben vom {{bdate}} nehme ich wie folgt Stellung:

{{reason}}

Ich bitte Sie, diese Gründe bei Ihrer Entscheidung zu berücksichtigen und meinem Antrag stattzugeben. Weitere Unterlagen reiche ich bei Bedarf gerne nach.`,
  },
  wid: {
    subj: "Widerspruch gegen Ihren Bescheid vom {{bdate}} – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

gegen Ihren Bescheid vom {{bdate}} lege ich hiermit fristgerecht

Widerspruch

ein.

Die Begründung reiche ich nach. Damit ich den Widerspruch begründen kann, beantrage ich gleichzeitig Akteneinsicht nach § 29 VwVfG. Bitte senden Sie mir eine Kopie meiner Akte zu oder nennen Sie mir einen Termin zur Einsicht.

Bitte bestätigen Sie mir den Eingang dieses Widerspruchs.`,
  },
  akte: {
    subj: "Antrag auf Akteneinsicht – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich Einsicht in meine Ausländerakte (§ 29 VwVfG).

Name: {{name}}, geboren am {{dob}}, Staatsangehörigkeit: {{nat}}

Bitte senden Sie mir eine Kopie der Akte zu oder nennen Sie mir kurzfristig einen Termin zur Einsicht. Eine Rechtsanwältin, ein Rechtsanwalt oder eine Beratungsstelle darf die Akte auch für mich einsehen, wenn ich eine Vollmacht vorlege.`,
  },
  dul: {
    subj: "Antrag auf Erteilung einer Duldung – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Erteilung einer Duldung nach § 60a Abs. 2 AufenthG.

Name: {{name}}, geboren am {{dob}}, Staatsangehörigkeit: {{nat}}

Meine Abschiebung ist aus folgenden Gründen nicht möglich:

{{impossible}}

Nachweise lege ich bei. Bitte bestätigen Sie mir den Eingang dieses Antrags schriftlich.`,
  },
  frist: {
    subj: "Antrag auf Verlängerung der Ausreisefrist – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

mit Ihrem Schreiben vom {{bdate}} wurde mir eine Frist zur freiwilligen Ausreise gesetzt.

Ich beantrage, diese Frist bis zum {{until}} zu verlängern (§ 59 Abs. 1 Satz 4 AufenthG). Meine Gründe:

{{why}}

Ich bin bereit, freiwillig auszureisen, und lege die Nachweise bei.`,
  },
  arzt: {
    subj: "Vorlage einer ärztlichen Bescheinigung – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

anbei lege ich die ärztliche Bescheinigung von {{doctor}} vom {{date}} vor (§ 60a Abs. 2c AufenthG).

Aus der Bescheinigung ergibt sich, dass meine Erkrankung einer Abschiebung entgegensteht. Ich bitte Sie, dies bei Ihrer Entscheidung zu berücksichtigen und mir eine Duldung zu erteilen.

Bitte bestätigen Sie mir den Eingang dieses Schreibens.`,
  },
  hfk: {
    subj: "Bitte um Befassung der Härtefallkommission – {{name}}, geb. {{dob}}",
    body: `Sehr geehrte Damen und Herren,

ich bitte die Härtefallkommission, sich mit meinem Fall zu befassen (§ 23a AufenthG).

Name: {{name}}, geboren am {{dob}}, Staatsangehörigkeit: {{nat}}
Zuständige Ausländerbehörde: {{office}}, Aktenzeichen: {{file}}

Meine persönliche Situation:

{{hardship}}

Nachweise (z. B. Arbeitsvertrag, Schulbescheinigungen, Sprachzertifikate, Empfehlungsschreiben) lege ich bei.`,
  },
  wohngeld: {
    sample: { office: "Stadt Musterstadt – Wohngeldstelle", officeaddr: "Rathausplatz 1\n12345 Musterstadt" },
    subj: "Antrag auf Wohngeld",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich Wohngeld ab dem {{month}}.

Name: {{name}}, geboren am {{dob}}

Bitte senden Sie mir die Antragsformulare zu. Ich fülle sie aus und reiche alle Nachweise (Mietvertrag, Einkommensnachweise) sofort nach. Ich stelle diesen Antrag jetzt, weil der Bewilligungszeitraum mit dem Monat der Antragstellung beginnt (§ 25 Abs. 2 WoGG).

Bitte bestätigen Sie mir den Eingang dieses Antrags.`,
  },
  kiz: {
    sample: { office: "Familienkasse", officeaddr: "Postfach (siehe Ihr Kindergeld-Schreiben)" },
    subj: "Antrag auf Kinderzuschlag – Kindergeldnummer: {{kgnr}}",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich Kinderzuschlag für mein Kind / meine Kinder ab dem {{month}}.

Name: {{name}}, geboren am {{dob}}
Kindergeldnummer: {{kgnr}}
Kind: {{child}}

Bitte senden Sie mir die nötigen Formulare zu oder teilen Sie mir mit, welche Unterlagen fehlen. Ich reiche sie umgehend nach.

Bitte bestätigen Sie mir den Eingang dieses Antrags.`,
  },
  uvg: {
    sample: { office: "Kreis Musterkreis – Jugendamt, Unterhaltsvorschusskasse", officeaddr: "Kreishausstraße 1\n12345 Musterstadt" },
    subj: "Antrag auf Unterhaltsvorschuss für {{child}}",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich Unterhaltsvorschuss nach dem Unterhaltsvorschussgesetz für mein Kind {{child}}.

Das Kind lebt bei mir. Der andere Elternteil zahlt keinen oder nicht regelmäßig Unterhalt:
{{otherparent}}

Ich habe den anderen Elternteil zur Zahlung aufgefordert (Nachweis anbei). Bitte senden Sie mir die Antragsformulare zu. Fehlende Unterlagen reiche ich sofort nach.

Bitte bestätigen Sie mir den Eingang dieses Antrags.`,
  },
  grusi: {
    sample: { office: "Stadt Musterstadt – Sozialamt", officeaddr: "Rathausplatz 1\n12345 Musterstadt" },
    subj: "Antrag auf Grundsicherung im Alter und bei Erwerbsminderung",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich Leistungen der Grundsicherung im Alter und bei Erwerbsminderung nach dem SGB XII.

Name: {{name}}, geboren am {{dob}}
Rentenversicherungsnummer: {{vsnr}}

Bitte senden Sie mir die Antragsformulare zu. Unterlagen über Einkommen, Vermögen und Miete reiche ich sofort nach. Der Antrag wirkt auf den Ersten des Monats zurück, in dem er gestellt wird (§ 44 Abs. 2 SGB XII).

Bitte bestätigen Sie mir den Eingang dieses Antrags.`,
  },
  rente: {
    sample: { office: "Deutsche Rentenversicherung", officeaddr: "(Adresse aus Ihrem letzten Rentenschreiben)" },
    subj: "Antrag auf Kontenklärung und Rentenauskunft – Versicherungsnummer: {{vsnr}}",
    body: `Sehr geehrte Damen und Herren,

ich bitte um Klärung meines Versicherungskontos und um eine aktuelle Rentenauskunft.

Name: {{name}}, geboren am {{dob}}
Versicherungsnummer: {{vsnr}}

Bitte teilen Sie mir mit, welche Zeiten in meinem Konto noch fehlen. Nachweise über Schule, Ausbildung, Arbeit und Kindererziehung – auch aus dem Ausland – reiche ich gerne ein.`,
  },
  sach: {
    sample: { office: "Stadt Musterstadt – Wohngeldstelle", officeaddr: "Rathausplatz 1\n12345 Musterstadt" },
    subj: "Sachstandsanfrage zu meinem Antrag auf {{benefit}} vom {{adate}} – Aktenzeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

am {{adate}} habe ich {{benefit}} beantragt. Bisher habe ich keinen Bescheid erhalten.

Bitte teilen Sie mir den aktuellen Stand der Bearbeitung mit und ob noch Unterlagen fehlen. Bitte nennen Sie mir außerdem, bis wann ich mit einer Entscheidung rechnen kann.

Ich bitte um eine kurze Antwort innerhalb von zwei Wochen.`,
  },
  kuend: {
    sample: { office: "Muster Mobilfunk GmbH – Kundenservice", officeaddr: "Postfach 10 20 30\n40210 Düsseldorf" },
    subj: "Kündigung meines Vertrags – Kunden-/Vertragsnummer: {{contract}}",
    body: `Sehr geehrte Damen und Herren,

hiermit kündige ich meinen Vertrag ({{product}}) fristgerecht zum nächstmöglichen Zeitpunkt.

Name: {{name}}, geboren am {{dob}}
Kunden-/Vertragsnummer: {{contract}}

Bitte bestätigen Sie mir die Kündigung und das genaue Vertragsende schriftlich (per Brief oder E-Mail). Das SEPA-Lastschriftmandat für diesen Vertrag widerrufe ich zum Vertragsende.

Einer Vertragsverlängerung stimme ich nicht zu. Bitte kontaktieren Sie mich nicht telefonisch zu Werbe- oder Rückgewinnungszwecken.`,
  },
  kuendvers: {
    sample: { office: "Muster Versicherung AG", officeaddr: "Versicherungsplatz 1\n10115 Berlin" },
    subj: "Kündigung meiner {{insurance}} – Versicherungsnummer: {{policy}}",
    body: `Sehr geehrte Damen und Herren,

hiermit kündige ich meine {{insurance}} mit der Versicherungsnummer {{policy}} fristgerecht zum Ende der laufenden Versicherungsperiode, hilfsweise zum nächstmöglichen Zeitpunkt.

Name: {{name}}, geboren am {{dob}}

Bitte bestätigen Sie mir die Kündigung und das Datum, zu dem der Vertrag endet, schriftlich. Das SEPA-Lastschriftmandat widerrufe ich zum Vertragsende.`,
  },
  inkasso: {
    sample: { office: "Muster Inkasso GmbH", officeaddr: "Forderungsweg 5\n20095 Hamburg", file: "INK-2026-55123" },
    subj: "Widerspruch gegen Ihre Forderung – Ihr Zeichen: {{file}}",
    body: `Sehr geehrte Damen und Herren,

mit Schreiben vom {{bdate}} fordern Sie im Auftrag von {{creditor}} von mir einen Betrag von {{amount}}.

Ich widerspreche dieser Forderung. Sie ist aus meiner Sicht nicht berechtigt:
{{objection}}

Bitte legen Sie mir die Forderung vollständig und nachvollziehbar dar (§ 13a Rechtsdienstleistungsgesetz): Auftraggeber, Vertragsgegenstand und Datum des Vertragsschlusses, Berechnung von Zinsen und Inkassokosten. Bitte senden Sie mir außerdem eine Kopie des Vertrags bzw. der Unterlagen, auf die Sie die Forderung stützen.

Bis zur Klärung leiste ich keine Zahlung. Mit diesem Schreiben erkenne ich die Forderung nicht an. Bitte antworten Sie mir schriftlich.`,
  },
  maengel: {
    sample: { office: "Muster Wohnbau GmbH – Hausverwaltung", officeaddr: "Am Markt 7\n23552 Lübeck" },
    subj: "Mängelanzeige – Mietwohnung {{street}}, {{city}}",
    body: `Sehr geehrte Damen und Herren,

in meiner Mietwohnung ({{street}}, {{city}}) besteht seit dem {{since}} folgender Mangel:
{{defect}}

Ich zeige Ihnen diesen Mangel hiermit an (§ 536c BGB) und bitte Sie, ihn bis zum {{deadline}} fachgerecht zu beseitigen. Bitte teilen Sie mir rechtzeitig einen Termin mit, damit Handwerker in die Wohnung kommen können. Sie erreichen mich unter {{phone}}.

Ich behalte mir vor, die Miete wegen des Mangels zu mindern (§ 536 BGB). Bis zur Beseitigung zahle ich die Miete nur unter Vorbehalt.`,
  },
  nk: {
    sample: { office: "Muster Wohnbau GmbH – Hausverwaltung", officeaddr: "Am Markt 7\n23552 Lübeck", objection: "Die Kosten für Hausmeister sind gegenüber dem Vorjahr um 60 % gestiegen. Außerdem ist die Wohnfläche mit 72 m² statt 65 m² angesetzt." },
    subj: "Nebenkostenabrechnung {{period}} – Einwendungen und Bitte um Belegeinsicht",
    body: `Sehr geehrte Damen und Herren,

Ihre Nebenkostenabrechnung für den Zeitraum {{period}} habe ich am {{received}} erhalten.

Gegen die Abrechnung erhebe ich folgende Einwendungen (§ 556 Abs. 3 BGB):
{{objection}}

Außerdem bitte ich um Einsicht in die Originalbelege (Rechnungen, Verträge, Verbrauchswerte und Umlageschlüssel). Bitte nennen Sie mir dafür einen Termin bis zum {{deadline}} oder senden Sie mir Kopien.

Eine Nachzahlung leiste ich erst nach Prüfung der Belege.`,
  },
  zeugnis: {
    sample: { office: "Muster Logistik GmbH – Personalabteilung", officeaddr: "Hafenstraße 20\n23568 Lübeck" },
    subj: "Bitte um ein qualifiziertes Arbeitszeugnis",
    body: `Sehr geehrte Damen und Herren,

mein Arbeitsverhältnis bei Ihnen als {{job}} endet bzw. endete am {{empend}}.

Ich bitte Sie um ein qualifiziertes Arbeitszeugnis, das sich auch auf Leistung und Verhalten im Arbeitsverhältnis erstreckt (§ 109 Gewerbeordnung).

Bitte senden Sie mir das Zeugnis bis zum {{deadline}} an meine oben genannte Adresse.`,
  },
  lohn: {
    sample: { office: "Muster Logistik GmbH – Personalabteilung", officeaddr: "Hafenstraße 20\n23568 Lübeck" },
    subj: "Bitte um Lohnabrechnungen – Personalnummer: {{persnr}}",
    body: `Sehr geehrte Damen und Herren,

für {{months}} habe ich keine Lohnabrechnung erhalten.

Nach § 108 Gewerbeordnung ist mir bei Zahlung des Arbeitsentgelts eine Abrechnung in Textform zu erteilen. Bitte senden Sie mir die fehlenden Abrechnungen bis zum {{deadline}}.

Sollte für diese Monate noch Lohn offen sein, bitte ich um Zahlung bis zum selben Datum.`,
  },
  geburtsurk: {
    sample: { office: "Stadt Musterstadt – Standesamt", officeaddr: "Rathausplatz 1\n12345 Musterstadt" },
    subj: "Antrag auf Ausstellung von Geburtsurkunden",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Ausstellung von {{copies}} Geburtsurkunde(n) für folgende Person:

Name, Geburtsname und Geburtsdatum: {{person}}
Geburtsort: {{bplace}}
Mein Verhältnis zu dieser Person: {{relation}}

Verwendungszweck: {{purpose}}

Eine Kopie meines Ausweises lege ich bei. Bitte teilen Sie mir die Gebühr und die Zahlungsmöglichkeiten mit, falls eine Zahlung im Voraus nötig ist. Bitte senden Sie die Urkunde(n) an meine oben genannte Adresse.`,
  },
  kita: {
    sample: { office: "Landkreis Musterkreis – Jugendamt, Kindertagesbetreuung", officeaddr: "Kreishausstraße 1\n12345 Musterstadt" },
    subj: "Anmeldung des Betreuungsbedarfs / Antrag auf einen Platz in der Kindertagesbetreuung (§ 24 SGB VIII)",
    body: `Sehr geehrte Damen und Herren,

hiermit melde ich für mein Kind einen Betreuungsplatz in einer Kindertageseinrichtung oder in der Kindertagespflege an.

Kind: {{child}}
Gewünschter Beginn: {{start}}
Gewünschter Betreuungsumfang: {{hours}}

Mein Kind hat einen Rechtsanspruch auf Förderung nach § 24 SGB VIII. Bitte bestätigen Sie mir den Eingang dieser Anmeldung schriftlich und teilen Sie mir mit, ob noch Unterlagen fehlen.

Sollte zum gewünschten Termin kein Platz zur Verfügung stehen, bitte ich um eine schriftliche Mitteilung bzw. einen Bescheid.`,
  },
  krank: {
    sample: { office: "Grundschule Am Markt – Klassenleitung 3b", officeaddr: "Am Markt 3\n23611 Bad Schwartau" },
    subj: "Entschuldigung für das Fehlen meines Kindes {{child}}, Klasse {{class}}",
    body: `Sehr geehrte Damen und Herren,

mein Kind {{child}}, Klasse {{class}}, konnte im Zeitraum {{absent}} wegen Krankheit nicht am Unterricht teilnehmen.

Ich bitte, das Fehlen zu entschuldigen. Falls die Schule eine ärztliche Bescheinigung verlangt, reiche ich sie nach.`,
  },
  beurlaub: {
    sample: { office: "Grundschule Am Markt – Schulleitung", officeaddr: "Am Markt 3\n23611 Bad Schwartau", absent: "03.12.2026 bis 04.12.2026", why: "Hochzeit meiner Schwester am 04.12.2026 in Hamburg. Die Einladung lege ich bei." },
    subj: "Antrag auf Beurlaubung vom Unterricht – {{child}}, Klasse {{class}}",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich, mein Kind {{child}}, Klasse {{class}}, im Zeitraum {{absent}} vom Unterricht zu beurlauben.

Grund:
{{why}}

Nachweise lege ich bei. Den versäumten Unterrichtsstoff wird mein Kind selbstständig nacharbeiten.

Bitte teilen Sie mir Ihre Entscheidung schriftlich mit.`,
  },
  beistand: {
    sample: { office: "Landkreis Musterkreis – Jugendamt, Beistandschaften", officeaddr: "Kreishausstraße 1\n12345 Musterstadt" },
    subj: "Antrag auf Beistandschaft nach § 1712 BGB für mein Kind {{child}}",
    body: `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Beistandschaft des Jugendamts für mein Kind {{child}} für folgende Aufgaben (Zutreffendes bitte ankreuzen):

[ ] Feststellung der Vaterschaft
[ ] Geltendmachung von Unterhaltsansprüchen

Das Kind lebt bei mir. Ich habe die alleinige elterliche Sorge bzw. das Kind lebt bei gemeinsamer Sorge in meiner Obhut (§ 1713 BGB).

Anderer Elternteil: {{otherparent}}

Bitte bestätigen Sie mir den Eingang und nennen Sie mir die zuständige Ansprechperson sowie die Unterlagen, die Sie benötigen.`,
  },
  beratung: {
    sample: { office: "Landkreis Musterkreis – Jugendamt, Allgemeiner Sozialer Dienst", officeaddr: "Kreishausstraße 1\n12345 Musterstadt", child: "Emre (7 Jahre) und Elif (4 Jahre)", why: "Ich lebe getrennt vom Vater meiner Kinder. Ich brauche Beratung zum Umgang der Kinder mit dem Vater und zum Unterhalt." },
    subj: "Bitte um einen Beratungstermin",
    body: `Sehr geehrte Damen und Herren,

ich bitte um einen Termin für ein Beratungsgespräch beim Jugendamt.

Thema:
{{why}}

Kind/Kinder: {{child}}

Ich bin am besten unter der oben genannten Telefonnummer erreichbar. Falls nötig, bitte ich um eine Dolmetscherin oder einen Dolmetscher für folgende Sprache: {{language}}.`,
  },
};

module.exports = { SAMPLE, LABELS, LETTERS, head, foot };
