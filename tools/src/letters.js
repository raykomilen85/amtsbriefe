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
};

module.exports = { SAMPLE, LABELS, LETTERS, head, foot };
