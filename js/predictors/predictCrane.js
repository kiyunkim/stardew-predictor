/**
 * predictors/predictCrane.js - Movie theater crane game prediction
 * Logic from StardewValley.Locations.MovieTheater.addRandomNPCs()
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Predict crane game availability for a given month
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictCrane(isSearch, offset) {
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
    $("#crane-prev").prop("disabled", true);
    $("#crane-next").prop("disabled", true);
    $("#crane-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#crane-prev-year").prop("disabled", true);
    } else {
      $("#crane-prev-year").val(offset - 112);
      $("#crane-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#crane-prev-month").prop("disabled", true);
    } else {
      $("#crane-prev-month").val(offset - 28);
      $("#crane-prev-month").prop("disabled", false);
    }
    $("#crane-reset").val("reset");
    $("#crane-next-month").val(offset + 28);
    $("#crane-next-year").val(offset + 112);
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
        if (
          compareSemVer(save.version, "1.4") >= 0 &&
          rng.NextDouble() < 0.25
        ) {
          thisEvent =
            '<span class="none"><img src="blank.png" class="tall" id="movie_gs"><br/>(Game In Use)</span>';
        } else {
          thisEvent = "Game Can<br/>Be Played<br>&nbsp;";
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
          '<span class="crane cell">' +
          thisEvent +
          "</span></td>";
      }
      output += "</tr>\n";
    }
    output += "</tbody></table>\n";
  }
  return output;
}
