/**
 * predictors/predictBookseller.js - Bookseller inventory prediction (1.6+)
 * Logic from StardewValley.Locations.Bookseller
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Get Bookseller inventory predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictBookseller(isSearch, offset) {
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

  // Bookseller only available in 1.6+
  if (compareSemVer(save.version, "1.6") < 0) {
    output +=
      '<p style="color: red;">Bookseller is only available in version 1.6+</p>';
    return output;
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#bookseller-prev").prop("disabled", true);
    $("#bookseller-next").prop("disabled", true);
    $("#bookseller-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#bookseller-prev-year").prop("disabled", true);
    } else {
      $("#bookseller-prev-year").val(offset - 112);
      $("#bookseller-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#bookseller-prev-month").prop("disabled", true);
    } else {
      $("#bookseller-prev-month").val(offset - 28);
      $("#bookseller-prev-month").prop("disabled", false);
    }
    $("#bookseller-reset").val("reset");
    $("#bookseller-next-month").val(offset + 28);
    $("#bookseller-next-year").val(offset + 112);
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

        // Generate RNG for bookseller stock
        if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(save.gameID, day + save.dayAdjust - 1),
          );
        } else {
          rng = new CSRandom(save.gameID + day + save.dayAdjust - 1);
        }

        // Available books
        var availableBooks = [
          "Letter Collection Vol. I",
          "Letter Collection Vol. II",
          "Letter Collection Vol. III",
          "Lost Book (Purple))",
          "Lost Book (Green)",
          "Lost Book (Yellow)",
          "Ancient Poetry Collection Vol. I",
          "Ancient Poetry Collection Vol. II",
          "Ancient Poetry Collection Vol. III",
        ];

        // Bookseller has varying stock each day
        var bookStock = [];
        var numBooks = 2 + rng.Next(3); // 2-4 books
        var selectedIndices = new Set();

        for (var i = 0; i < numBooks; i++) {
          var idx = rng.Next(availableBooks.length);
          selectedIndices.add(idx);
        }

        for (var idx of selectedIndices) {
          bookStock.push(availableBooks[idx]);
        }

        thisEvent = '<span class="bookseller-stock">';
        for (i = 0; i < Math.min(bookStock.length, 2); i++) {
          thisEvent += bookStock[i];
          if (i < Math.min(bookStock.length, 2) - 1) {
            thisEvent += "<br/>";
          }
        }
        if (bookStock.length > 2) {
          thisEvent += "<br/>+" + (bookStock.length - 2) + " more";
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
