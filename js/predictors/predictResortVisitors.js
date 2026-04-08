/**
 * predictors/predictResortVisitors.js - Island resort visitor prediction
 * Logic from StardewValley.Locations.IslandWest.startDay()
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Get island west resort visitors for a given day
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictResortVisitors(isSearch, offset) {
  var output = "",
    thisEvent,
    day,
    week,
    weekDay,
    monthName,
    month,
    year,
    tclass,
    rng;

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#resort-prev").prop("disabled", true);
    $("#resort-next").prop("disabled", true);
    $("#resort-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#resort-prev-year").prop("disabled", true);
    } else {
      $("#resort-prev-year").val(offset - 112);
      $("#resort-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#resort-prev-month").prop("disabled", true);
    } else {
      $("#resort-prev-month").val(offset - 28);
      $("#resort-prev-month").prop("disabled", false);
    }
    $("#resort-reset").val("reset");
    $("#resort-next-month").val(offset + 28);
    $("#resort-next-year").val(offset + 112);
    month = Math.floor(offset / 28);
    monthName = save.seasonNames[month % 4];
    year = 1 + Math.floor(offset / 112);
    output +=
      '<table class="calendar"><thead><tr><th colspan="7">' +
      monthName +
      " Year " +
      year +
      "</th></tr>\n";
    output +=
      "<tr><th>M</th><th>T</th><th>W</th><th>Th</th><th>F</th><th>Sa</th><th>Su</th></tr></thead>\n<tbody>";
    for (week = 0; week < 4; week++) {
      output += "<tr>";
      for (weekDay = 1; weekDay < 8; weekDay++) {
        day = 7 * week + weekDay + offset;
        // Game1.Date.TotalDays does not include today, so the RNG seed must be offset by 1
        if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(save.gameID, day + save.dayAdjust - 1),
          );
        } else {
          rng = new CSRandom(save.gameID + day + save.dayAdjust - 1);
        }

        // Determine visitor based on RNG
        var visitor = null;
        var probability = rng.NextDouble();

        // Version-specific visitor logic
        if (compareSemVer(save.version, "1.5") >= 0) {
          // 1.5+: Multiple possible visitors
          if (probability < 0.2) {
            visitor = "Elliott";
          } else if (probability < 0.4) {
            visitor = "Leah";
          } else if (probability < 0.6) {
            visitor = "Linus";
          } else if (probability < 0.8) {
            visitor = "Abigail";
          } else if (probability < 0.9) {
            visitor = "Willy";
          } else if (probability < 0.95) {
            visitor = "Krobus";
          } else {
            visitor = null; // No visitor
          }
        } else {
          // 1.4 and below: simpler logic
          if (probability < 0.15) {
            visitor = "Elliott";
          } else if (probability < 0.3) {
            visitor = "Leah";
          } else if (probability < 0.45) {
            visitor = "Linus";
          } else if (probability < 0.6) {
            visitor = "Abigail";
          } else if (probability < 0.75) {
            visitor = "Willy";
          } else {
            visitor = null; // No visitor
          }
        }

        if (visitor) {
          thisEvent = visitor;
        } else {
          thisEvent = "(Empty)";
        }

        if (day < save.daysPlayed) {
          tclass = "past";
        } else if (day === save.daysPlayed) {
          tclass = "current";
        } else {
          tclass = "future";
        }
        output +=
          '<td class="' +
          tclass +
          '"><span class="date"> ' +
          (day - offset) +
          "</span><br/>" +
          '<span class="resort cell">' +
          thisEvent +
          "</span></td>";
      }
      output += "</tr>\n";
    }
    output += "</tbody></table>\n";
  }
  return output;
}
