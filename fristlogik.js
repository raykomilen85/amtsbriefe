/* Fristen-Logik für ki-hilfe.html (Brief übersetzen): erkennt Briefdatum, Termine und Fristen in deutschem Brieftext.
   Rechnet vorsichtig: im Zweifel früheres Datum. Feiertage nur landesweite. Keine Rechtsberatung. */
(function(){
"use strict";
const D=(y,m,d)=>new Date(Date.UTC(y,m-1,d));
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getUTCFullYear()+"-"+pad(d.getUTCMonth()+1)+"-"+pad(d.getUTCDate());
const addDays=(d,n)=>new Date(d.getTime()+n*864e5);
const dim=(y,m)=>new Date(Date.UTC(y,m+1,0)).getUTCDate();
function addMonths(d,n){const y=d.getUTCFullYear(),m=d.getUTCMonth()+n,ny=y+Math.floor(m/12),nm=((m%12)+12)%12;return new Date(Date.UTC(ny,nm,Math.min(d.getUTCDate(),dim(ny,nm))));}
function today(){const n=new Date();return D(n.getFullYear(),n.getMonth()+1,n.getDate());}
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return D(y,mo,da);}
function holidays(y,land){
  const E=easter(y),H={},add=(d,n)=>{H[iso(d)]=n},has=l=>l.includes(land);
  add(D(y,1,1),"Neujahr");add(addDays(E,-2),"Karfreitag");add(addDays(E,1),"Ostermontag");add(D(y,5,1),"Tag der Arbeit");
  add(addDays(E,39),"Christi Himmelfahrt");add(addDays(E,50),"Pfingstmontag");add(D(y,10,3),"Tag der Deutschen Einheit");
  add(D(y,12,25),"1. Weihnachtstag");add(D(y,12,26),"2. Weihnachtstag");
  if(has(["Baden-Württemberg","Bayern","Sachsen-Anhalt"]))add(D(y,1,6),"Heilige Drei Könige");
  if(has(["Berlin","Mecklenburg-Vorpommern"]))add(D(y,3,8),"Internationaler Frauentag");
  if(has(["Baden-Württemberg","Bayern","Hessen","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland"]))add(addDays(E,60),"Fronleichnam");
  if(has(["Saarland"]))add(D(y,8,15),"Mariä Himmelfahrt");
  if(has(["Thüringen"]))add(D(y,9,20),"Weltkindertag");
  if(has(["Brandenburg","Bremen","Hamburg","Mecklenburg-Vorpommern","Niedersachsen","Sachsen","Sachsen-Anhalt","Schleswig-Holstein","Thüringen"]))add(D(y,10,31),"Reformationstag");
  if(has(["Baden-Württemberg","Bayern","Nordrhein-Westfalen","Rheinland-Pfalz","Saarland"]))add(D(y,11,1),"Allerheiligen");
  if(has(["Sachsen"])){let d=addDays(D(y,11,23),-1);while(d.getUTCDay()!==3)d=addDays(d,-1);add(d,"Buß- und Bettag");}
  return H;
}
const holName=(d,land)=>holidays(d.getUTCFullYear(),land||"")[iso(d)]||null;
/* § 193 BGB / § 64 Abs. 3 SGG: Fristende am Samstag, Sonntag oder Feiertag → nächster Werktag */
function shiftEnd(d,land){let why=null,x=d;for(let i=0;i<10;i++){const w=x.getUTCDay(),h=holName(x,land);if(w===0||w===6||h){if(!why)why={day:x,hol:h};x=addDays(x,1);}else break;}return {date:x,why};}

const MON={januar:1,jänner:1,februar:2,märz:3,maerz:3,marz:3,april:4,mai:5,juni:6,juli:7,august:8,september:9,oktober:10,november:11,dezember:12};
const NUM={ein:1,eine:1,einem:1,einen:1,einer:1,eines:1,zwei:2,drei:3,vier:4,"fünf":5,fuenf:5,sechs:6,sieben:7,acht:8,neun:9,zehn:10,elf:11,"zwölf":12,zwoelf:12,vierzehn:14,"dreißig":30,dreissig:30};
const DATE_RE=/(\d{1,2})\s?\.\s?(?:(\d{1,2})\s?\.\s?|\s*([A-Za-zÄÖÜäöü]{3,9})\.?\s+)(\d{4}|\d{2})\b/g;

function validDate(y,m,d){if(y<100)y+=2000;if(m<1||m>12||d<1||d>dim(y,m-1)||y<2000||y>2100)return null;return D(y,m,d);}
function findDates(text){
  const out=[];let m;DATE_RE.lastIndex=0;
  while((m=DATE_RE.exec(text))){
    let mo=m[2]?+m[2]:MON[(m[3]||"").toLowerCase()];
    if(!mo){const k=Object.keys(MON).find(x=>x.startsWith((m[3]||"").toLowerCase().slice(0,3)));mo=k?MON[k]:0;}
    const d=validDate(+m[4],mo,+m[1]);
    if(d)out.push({date:d,index:m.index,end:m.index+m[0].length});
  }
  return out;
}
function sentenceAround(text,i,j){
  let a=i,b=j;
  while(a>0&&!/[.!?\n]/.test(text[a-1])||(a>1&&/\d/.test(text[a-2])&&text[a-1]==="."))a--;
  while(b<text.length&&!/[!?\n]/.test(text[b])&&!(text[b]==="."&&!/\d/.test(text[b-1]||"")&&!/\d/.test(text[b+1]||"")))b++;
  return text.slice(Math.max(0,a),Math.min(text.length,b+1)).replace(/\s+/g," ").trim().slice(0,220);
}
function diffDays(d){return Math.round((d-today())/864e5);}

function findLetterDate(text,dates){
  const lbl=/(Datum|Ihr Schreiben vom|Bescheid vom|Schreiben vom|vom)\s*:?\s*$/i;
  /* 1) "Datum: 12.10.2026" oder "Ort, den 12.10.2026" */
  for(const x of dates){
    const before=text.slice(Math.max(0,x.index-40),x.index);
    if(/Datum\s*:?\s*$/i.test(before)||/[A-ZÄÖÜ][a-zäöüß-]+,\s*(den\s*)?$/.test(before))return x.date;
  }
  /* 2) erstes Datum im oberen Viertel, das nicht in der Zukunft liegt und kein "bis/vom/Termin" davor hat */
  const top=Math.max(400,text.length*0.3);
  for(const x of dates){
    if(x.index>top)break;
    const before=text.slice(Math.max(0,x.index-30),x.index);
    if(/(bis|spätestens|am|vom|geb\.|geboren)\s*(zum\s*)?$/i.test(before))continue;
    if(lbl.test(before))continue;
    if(diffDays(x.date)<=0&&diffDays(x.date)>-400)return x.date;
  }
  return null;
}

function analyse(text,opt){
  opt=opt||{};const land=opt.land||"";text=String(text||"");
  const dates=findDates(text);
  let letterDate=opt.letterDate||null,letterFound=!!letterDate;
  if(!letterDate){letterDate=findLetterDate(text,dates);letterFound=!!letterDate;}
  const base=letterDate||today();
  const items=[],seen=new Set();
  const push=(kind,date,extra)=>{const k=kind+iso(date);if(seen.has(k))return;seen.add(k);items.push(Object.assign({kind,date,days:diffDays(date)},extra||{}));};

  /* Konkrete Daten im Text */
  for(const x of dates){
    if(letterDate&&iso(x.date)===iso(letterDate)&&letterFound&&!opt.letterDate)continue;
    const s=sentenceAround(text,x.index,x.end);
    const before=text.slice(Math.max(0,x.index-60),x.index);
    const after=text.slice(x.end,x.end+40);
    if(/(geb\.|geboren|Geburtsdatum|Ihr Schreiben vom|Bescheid vom|Antrag vom|seit dem)\s*:?\s*$/i.test(before))continue;
    if(/Termin|Einladung|erscheinen|vorsprechen|Gespräch|Vorsprache|Meldetermin|Untersuchung/i.test(s)||/^\s*(um|,\s*um)\s*\d{1,2}[:.]\d{2}|\bUhr\b/i.test(after)){push("appt",x.date,{quote:s});continue;}
    if(/(bis\s*(zum|spätestens)?|spätestens\s*(bis)?(\s*zum)?|Frist|fällig|einzureichen|vorzulegen|zu zahlen|überweisen|zurücksenden|nachreichen)/i.test(s)&&diffDays(x.date)>-60){push("due",x.date,{quote:s});}
  }
  /* Relative Fristen: "innerhalb von 2 Wochen", "binnen eines Monats" */
  const REL=/(innerhalb|binnen)\s+(?:von\s+)?(\d{1,2}|[a-zäöüß]+)\s+(Tag(?:e|en)?|Woche(?:n)?|Monat(?:e|en|s)?)/gi;let r;
  const rbb=/Rechtsbehelfsbelehrung|Widerspruch|Einspruch|Klage/i;
  while((r=REL.exec(text))){
    const n=/^\d+$/.test(r[2])?+r[2]:NUM[r[2].toLowerCase()];if(!n)continue;
    const s=sentenceAround(text,r.index,r.index+r[0].length);
    /* Bekanntgabe: 4. Tag nach Aufgabe zur Post (§ 37 Abs. 2 SGB X / § 122 AO, seit 2025) */
    const start=letterDate?addDays(letterDate,4):today();
    const unit=r[3].toLowerCase();
    let end=unit.startsWith("monat")?addMonths(start,n):unit.startsWith("woche")?addDays(start,7*n):addDays(start,n);
    const sh=shiftEnd(end,land);
    push(rbb.test(s)?"objection":"period",sh.date,{quote:s,why:sh.why&&iso(sh.why.day)!==iso(sh.date)?sh.why:null});
  }
  /* Rechtsbehelfsbelehrung ohne erkannte Frist → 1 Monat annehmen */
  if(/Rechtsbehelfsbelehrung/i.test(text)&&!items.some(i=>i.kind==="objection")){
    const sh=shiftEnd(addMonths(addDays(base,4),1),land);
    push("objection",sh.date,{assumed:true,why:sh.why&&iso(sh.why.day)!==iso(sh.date)?sh.why:null});
  }
  items.sort((a,b)=>a.date-b.date);
  return {letterDate,letterFound,items};
}
window.Frist={D,iso,addDays,addMonths,shiftEnd,holidays,analyse};
})();
