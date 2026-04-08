/**
 * utils.js - General utility functions
 */

export function addCommas(x) {
  // Jamie Taylor @ https://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
  return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

export function capitalize(s) {
  // joelvh @ https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  return s && s[0].toUpperCase() + s.slice(1);
}

export function compareSemVer(a, b) {
  // semver-compare by James Halliday ("substack") @ https://github.com/substack/semver-compare
  var pa = a.split(".");
  var pb = b.split(".");
  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  return 0;
}

export function wikify(item, page) {
  // removing egg colors & quantity amounts; changing spaces to underscores
  if (typeof item == "undefined") {
    return "undefined";
  }
  var trimmed = item.replace(" (White)", "");
  trimmed = trimmed.replace(" (Brown)", "");
  trimmed = trimmed.replace(" (Any)", "");
  trimmed = trimmed.replace(/ \(\d+\)/, "");
  trimmed = trimmed.replace(/ /g, "_");
  return page
    ? '<a href="https://stardewvalleywiki.com/' +
        page +
        "#" +
        trimmed +
        '">' +
        item +
        "</a>"
    : '<a href="https://stardewvalleywiki.com/' +
        trimmed +
        '">' +
        item +
        "</a>";
}
