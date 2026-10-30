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
  hardship: "Ich lebe seit 9 Jahren in Deutschland, spreche Deutsch auf B1-Niveau, arbeite in Vollzeit und meine zwei Kinder gehen hier zur Schule.",
};

const LABELS = {
  name: "Vor- und Nachname", street: "Straße und Hausnummer", city: "PLZ und Ort",
  dob: "Geburtsdatum", nat: "Staatsangehörigkeit", file: "Aktenzeichen",
  office: "Name der Behörde", officeaddr: "Adresse der Behörde", title: "Art des Aufenthaltstitels",
  expiry: "Ablaufdatum", bdate: "Datum des Bescheids/Schreibens", phone: "Telefonnummer",
  reason: "Ihre Gründe und Nachweise", impossible: "Warum die Ausreise/Abschiebung nicht möglich ist",
  until: "gewünschtes Datum", why: "Ihre Gründe", doctor: "Name des Arztes / der Ärztin",
  date: "Datum der Bescheinigung", today: "heutiges Datum", hardship: "Ihre persönliche Situation",
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
};

module.exports = { SAMPLE, LABELS, LETTERS, head, foot };
