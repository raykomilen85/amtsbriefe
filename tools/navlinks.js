// Footer links to the guide pages (Was tun? / Die ersten 30 Tage / Ihre Rechte) in the page language.
const fs = require("fs");
const path = require("path");
const C = {};
const nav = (dir, l) => { const k = dir + l; if (!(k in C)) { try { C[k] = JSON.parse(fs.readFileSync(path.join(__dirname, "src", dir, l + ".json"), "utf8")).nav; } catch (e) { C[k] = null; } } return C[k]; };
module.exports = function (l) {
  const pre = l === "de" ? "" : "/" + l;
  return [["wastun", "was-tun"], ["f30", "erste-30-tage"], ["rechte", "ihre-rechte"]]
    .map(([d, s]) => `<a href="${pre}/${s}.html">${(nav(d, l) || nav(d, "de")).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</a>`).join("");
};
