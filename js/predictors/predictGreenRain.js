/**
 * predictors/predictGreenRain.js - Green rain event prediction (1.6+)
 * Logic from StardewValley.Utility.checkForGreenRain()
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Get green rain event predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictGreenRain(isSearch, offset) {
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

  // Green rain only available in 1.6+
  if (compareSemVer(save.version, "1.6") < 0) {
    output +=
      '<p style="color: red;">Green rain is only available in version 1.6+</p>';
    return output;
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#gr-prev").prop("disabled", true);
    $("#gr-next").prop("disabled", true);
    $("#gr-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#gr-prev-year").prop("disabled", true);
    } else {
      $("#gr-prev-year").val(offset - 112);
      $("#gr-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#gr-prev-month").prop("disabled", true);
    } else {
      $("#gr-prev-month").val(offset - 28);
      $("#gr-prev-month").prop("disabled", false);
    }
    $("#gr-reset").val("reset");
    $("#gr-next-month").val(offset + 28);
    $("#gr-next-year").val(offset + 112);
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

        // Check chance for green rain (3% base chance daily)
        if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(save.gameID, day + save.dayAdjust - 1),
          );
        } else {
          rng = new CSRandom(save.gameID + day + save.dayAdjust - 1);
        }

        var greenRainChance = 0.03; // 3% chance daily
        var willHaveGreenRain = rng.NextDouble() < greenRainChance;

        if (willHaveGreenRain) {
          // Green rain spawns extra forage items
          var forageDuration = 3 + rng.Next(2); // 3-4 days of green rain
          thisEvent =
            '<span class="green-rain">Green Rain!<br/>(' +
            forageDuration +
            " days)</span>";
        } else {
          thisEvent = "Normal";
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
          '<span class="gr cell">' +
          thisEvent +
          "</span></td>";
      }
      output += "</tr>\n";
    }
    output += "</tbody></table>\n";
  }
  return output;
}
