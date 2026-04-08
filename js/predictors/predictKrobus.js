/**
 * predictors/predictKrobus.js - Krobus sewer shop inventory prediction
 * Logic from StardewValley.Locations.SewersShop.DayUpdate()
 */

import { save } from "../state.js";
import { addCommas, compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { getRandomItems, overrideSaveData } from "./helpers.js";

/**
 * Get Krobus's shop inventory predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictKrobus(isSearch, offset) {
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
    krobuItems = [],
    i;

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#krobus-prev").prop("disabled", true);
    $("#krobus-next").prop("disabled", true);
    $("#krobus-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#krobus-prev-year").prop("disabled", true);
    } else {
      $("#krobus-prev-year").val(offset - 112);
      $("#krobus-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#krobus-prev-month").prop("disabled", true);
    } else {
      $("#krobus-prev-month").val(offset - 28);
      $("#krobus-prev-month").prop("disabled", false);
    }
    $("#krobus-reset").val("reset");
    $("#krobus-next-month").val(offset + 28);
    $("#krobus-next-year").val(offset + 112);
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

        // Generate Krobus's shop inventory
        krobuItems = [];

        // Base shop items (always stocked)
        var baseItems = [
          { name: "Strange Bun", id: 227, price: 150 },
          { name: "Void Mayonnaise", id: 308, price: 2000 },
          { name: "Shadow Brute", id: 519, price: 1200 },
          { name: "Void Egg", id: 280, price: 5000 },
        ];

        // Random stock items
        var randomItems = [
          { name: "Void Blueprint", id: 328, price: 800 },
          { name: "Void Flute", id: 336, price: 700 },
          { name: "Void Salmon", id: 144, price: 150 },
          { name: "Black Linen Shirt", id: 272, price: 300 },
          { name: "Purple Shorts", id: 240, price: 200 },
        ];

        // Core items usually available
        krobuItems.push(baseItems[0]); // Strange Bun
        krobuItems.push(baseItems[1]); // Void Mayonnaise

        // Random specialty item
        if (rng.NextDouble() < 0.3) {
          krobuItems.push(baseItems[rng.Next(baseItems.length)]);
        }

        // Random clothing/miscellaneous
        if (rng.NextDouble() < 0.4) {
          krobuItems.push(randomItems[rng.Next(randomItems.length)]);
        }

        // Version-specific items (1.4+)
        if (compareSemVer(save.version, "1.4") >= 0 && rng.NextDouble() < 0.2) {
          var extraItems = [
            { name: "Void Essence", id: 305, price: 50 },
            { name: "Dark Essence", id: 306, price: 100 },
            { name: "Shadow Brute", id: 519, price: 1200 },
          ];
          krobuItems.push(extraItems[rng.Next(extraItems.length)]);
        }

        // Generate display
        thisEvent = '<span class="krobus-items">';
        for (i = 0; i < Math.min(krobuItems.length, 3); i++) {
          thisEvent +=
            krobuItems[i].name +
            (i < Math.min(krobuItems.length, 3) - 1 ? "<br/>" : "");
        }
        if (krobuItems.length === 0) {
          thisEvent += "(Standard Stock)";
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
