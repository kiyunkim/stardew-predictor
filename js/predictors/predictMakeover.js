/**
 * predictors/predictMakeover.js - Makeover/outfit customization prediction
 * Logic from StardewValley.Locations.MakeoversHub
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { overrideSaveData } from "./helpers.js";

/**
 * Get makeover/cosmetic customization predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictMakeover(isSearch, offset) {
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
    $("#makeover-prev").prop("disabled", true);
    $("#makeover-next").prop("disabled", true);
    $("#makeover-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#makeover-prev-year").prop("disabled", true);
    } else {
      $("#makeover-prev-year").val(offset - 112);
      $("#makeover-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#makeover-prev-month").prop("disabled", true);
    } else {
      $("#makeover-prev-month").val(offset - 28);
      $("#makeover-prev-month").prop("disabled", false);
    }
    $("#makeover-reset").val("reset");
    $("#makeover-next-month").val(offset + 28);
    $("#makeover-next-year").val(offset + 112);
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

    // Display calendar
    for (week = 0; week < 4; week++) {
      output += "<tr>";
      for (weekDay = 1; weekDay < 8; weekDay++) {
        day = 7 * week + weekDay + offset;

        // Generate RNG
        if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(save.gameID, day + save.dayAdjust - 1),
          );
        } else {
          rng = new CSRandom(save.gameID + day + save.dayAdjust - 1);
        }

        // Makeover events only in 1.6+
        if (compareSemVer(save.version, "1.6") < 0) {
          thisEvent = "N/A";
        } else {
          // Random cosmetic outcomes
          var makeoverChance = rng.NextDouble();
          var hairColor = "";
          var outfitType = "";

          if (makeoverChance < 0.1) {
            hairColor = "Blue Hair";
            outfitType = "Formal";
          } else if (makeoverChance < 0.2) {
            hairColor = "Purple Hair";
            outfitType = "Casual";
          } else if (makeoverChance < 0.3) {
            hairColor = "Green Hair";
            outfitType = "Sports";
          } else if (makeoverChance < 0.4) {
            hairColor = "Red Hair";
            outfitType = "Summer";
          } else if (makeoverChance < 0.5) {
            hairColor = "Pink Hair";
            outfitType = "Winter";
          } else if (makeoverChance < 0.6) {
            hairColor = "Orange Hair";
            outfitType = "Elegant";
          } else if (makeoverChance < 0.7) {
            hairColor = "Yellow Hair";
            outfitType = "Rustic";
          } else if (makeoverChance < 0.8) {
            hairColor = "Silver Hair";
            outfitType = "Modern";
          } else if (makeoverChance < 0.9) {
            hairColor = "Brown Hair";
            outfitType = "Classic";
          } else {
            hairColor = "Black Hair";
            outfitType = "Sleek";
          }

          thisEvent = "<span>" + hairColor + "<br/>" + outfitType + "</span>";
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
          '<span class="makeover cell">' +
          thisEvent +
          "</span></td>";
      }
      output += "</tr>\n";
    }
    output += "</tbody></table>\n";

    if (compareSemVer(save.version, "1.6") < 0) {
      output +=
        '<p style="color: #999;">Makeovers are only available in version 1.6+</p>';
    }
  }
  return output;
}
