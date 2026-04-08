/**
 * predictors/predictSandy.js - Desert merchant (Sandy) inventory prediction
 * Logic from StardewValley.Locations.SandyShop.DayUpdate()
 */

import { save } from "../state.js";
import { addCommas, compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import {
  getRandomItems,
  getRandomItemFromSeason,
  overrideSaveData,
} from "./helpers.js";

/**
 * Get Sandy's shop inventory predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictSandy(isSearch, offset) {
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
    sandyItems = [],
    shirtItems = [],
    i;

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#sandy-prev").prop("disabled", true);
    $("#sandy-next").prop("disabled", true);
    $("#sandy-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#sandy-prev-year").prop("disabled", true);
    } else {
      $("#sandy-prev-year").val(offset - 112);
      $("#sandy-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#sandy-prev-month").prop("disabled", true);
    } else {
      $("#sandy-prev-month").val(offset - 28);
      $("#sandy-prev-month").prop("disabled", false);
    }
    $("#sandy-reset").val("reset");
    $("#sandy-next-month").val(offset + 28);
    $("#sandy-next-year").val(offset + 112);
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

        // Generate Sandy's shop inventory
        sandyItems = [];

        // Regular shop items (seeds, supplies)
        var seedList = [
          { name: "Parsnip Seeds", id: 453, price: 10 },
          { name: "Summer Seeds", id: 465, price: 80 },
          { name: "Fall Seeds", id: 476, price: 60 },
          { name: "Rare Plant", id: 485, price: 1000 },
        ];

        // Shirt options from Saloon
        shirtItems = [
          { name: "Formal Outfit", id: 30, price: 800 },
          { name: "Purple Shorts", id: 75, price: 150 },
          { name: "Green Shirt", id: 22, price: 200 },
        ];

        // Pick 2-3 seed items
        for (i = 0; i < 3; i++) {
          if (rng.NextDouble() < 0.4) {
            sandyItems.push(seedList[rng.Next(seedList.length)]);
          }
        }

        // Pick 1-2 clothing items
        for (i = 0; i < 2; i++) {
          if (rng.NextDouble() < 0.3) {
            sandyItems.push(shirtItems[rng.Next(shirtItems.length)]);
          }
        }

        // Generate display
        thisEvent = '<span class="sandy-items">';
        for (i = 0; i < Math.min(sandyItems.length, 2); i++) {
          thisEvent +=
            sandyItems[i].name + (i < sandyItems.length - 1 ? "<br/>" : "");
        }
        if (sandyItems.length === 0) {
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
