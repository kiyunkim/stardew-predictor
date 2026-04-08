/**
 * predictors/predictRaccoon.js - Raccoon reward prediction (1.6+)
 * Logic from StardewValley.Locations.Farm for raccoon supply items
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Get raccoon bundle/reward predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictRaccoon(isSearch, offset) {
  var output = "",
    thisEvent,
    day,
    week,
    weekDay,
    monthName,
    month,
    year,
    tclass,
    rng,
    reward;

  // Raccoons only available in 1.6+
  if (compareSemVer(save.version, "1.6") < 0) {
    output +=
      '<p style="color: red;">Raccoons are only available in version 1.6+</p>';
    return output;
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#raccoon-prev").prop("disabled", true);
    $("#raccoon-next").prop("disabled", true);
    $("#raccoon-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#raccoon-prev-year").prop("disabled", true);
    } else {
      $("#raccoon-prev-year").val(offset - 112);
      $("#raccoon-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#raccoon-prev-month").prop("disabled", true);
    } else {
      $("#raccoon-prev-month").val(offset - 28);
      $("#raccoon-prev-month").prop("disabled", false);
    }
    $("#raccoon-reset").val("reset");
    $("#raccoon-next-month").val(offset + 28);
    $("#raccoon-next-year").val(offset + 112);
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

        // Generate RNG for raccoon bundle
        if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(save.gameID, day + save.dayAdjust - 1),
          );
        } else {
          rng = new CSRandom(save.gameID + day + save.dayAdjust - 1);
        }

        // Raccoon supplies available
        var availableItems = [
          "Mushroom Tree Seed",
          "Qi Fruit Seed",
          "Wild Seed",
          "Torch",
          "Rope",
          "Spring Seeds",
          "Summer Seeds",
          "Fall Seeds",
          "Winter Seeds",
          "Parsnip Seeds",
          "Coffee Beans",
        ];

        // Random daily item from raccoon
        var numberOfItems = 1 + rng.Next(2); // 1-2 items
        var items = [];
        for (var i = 0; i < numberOfItems; i++) {
          var item = availableItems[rng.Next(availableItems.length)];
          items.push(item);
        }

        thisEvent = '<span class="raccoon-items">';
        for (i = 0; i < items.length; i++) {
          thisEvent += items[i];
          if (i < items.length - 1) {
            thisEvent += "<br/>";
          }
        }
        thisEvent += "</span>";

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
          thisEvent +
          "</td>";
      }
      output += "</tr>\n";
    }
    output += "</tbody></table>\n";
  }
  return output;
}
