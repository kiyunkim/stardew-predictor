/**
 * predictors/predictWallpaper.js - Wallpaper and flooring shop prediction
 * Logic from StardewValley.Locations.SeedShop.DayUpdate()
 */

import { save } from "../state.js";
import { addCommas, compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { getRandomWallFloor, overrideSaveData } from "./helpers.js";

/**
 * Get wallpaper/flooring shop inventory predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictWallpaper(isSearch, offset) {
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
    wallpaper,
    flooring,
    i,
    wallpaperList = [],
    flooringList = [];

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#wallpaper-prev").prop("disabled", true);
    $("#wallpaper-next").prop("disabled", true);
    $("#wallpaper-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#wallpaper-prev-year").prop("disabled", true);
    } else {
      $("#wallpaper-prev-year").val(offset - 112);
      $("#wallpaper-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#wallpaper-prev-month").prop("disabled", true);
    } else {
      $("#wallpaper-prev-month").val(offset - 28);
      $("#wallpaper-prev-month").prop("disabled", false);
    }
    $("#wallpaper-reset").val("reset");
    $("#wallpaper-next-month").val(offset + 28);
    $("#wallpaper-next-year").val(offset + 112);
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

        // Generate wallpaper and flooring for the week
        wallpaperList = getRandomWallFloor(
          rng,
          0,
          112,
          undefined,
          undefined,
          2,
        );
        flooringList = getRandomWallFloor(rng, 0, 40, undefined, undefined, 2);

        // Format output
        var wallpaperStr = wallpaperList
          .map(function (w) {
            return "(ID: " + w + ")";
          })
          .join(", ");
        var flooringStr = flooringList
          .map(function (f) {
            return "(ID: " + f + ")";
          })
          .join(", ");

        thisEvent =
          '<span class="wallpaper">W: ' +
          wallpaperStr +
          "</span><br/>" +
          '<span class="flooring">F: ' +
          flooringStr +
          "</span>";

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
