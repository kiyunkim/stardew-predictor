/**
 * predictors/predictTrains.js - Train event prediction
 * Logic from StardewValley.Locations.Railroad.DayUpdate()
 */

import { save } from "../state.js";
import { compareSemVer, addCommas } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Predict train visits for a given month
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictTrains(isSearch, offset) {
  var output = "",
    trainTime,
    thisTrain,
    day,
    week,
    weekDay,
    monthName,
    month,
    year,
    tclass,
    hour,
    min,
    ampm,
    rng;

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#train-prev").prop("disabled", true);
    $("#train-next").prop("disabled", true);
    $("#train-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#train-prev-year").prop("disabled", true);
    } else {
      $("#train-prev-year").val(offset - 112);
      $("#train-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#train-prev-month").prop("disabled", true);
    } else {
      $("#train-prev-month").val(offset - 28);
      $("#train-prev-month").prop("disabled", false);
    }
    $("#train-reset").val("reset");
    $("#train-next-month").val(offset + 28);
    $("#train-next-year").val(offset + 112);
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
        if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(day + save.dayAdjust, save.gameID / 2),
          );
        } else {
          rng = new CSRandom(save.gameID / 2 + day + save.dayAdjust);
        }
        if (day < 31) {
          thisTrain =
            '<span class="none">Railroad<br/>not yet<br/>accessible</span>';
        } else {
          thisTrain =
            '<span class="none">&nbsp;<br/>(No train)<br/>&nbsp</span>';
          if (rng.NextDouble() < 0.2) {
            trainTime = rng.Next(900, 1800);
            trainTime -= trainTime % 10;
            hour = Math.floor(trainTime / 100);
            min = trainTime % 100;
            if (min < 60) {
              if (hour > 12) {
                hour -= 12;
                ampm = " pm";
              } else if (hour === 12) {
                ampm = " pm";
              } else {
                ampm = " am";
              }
              if (min === 0) {
                min = "00";
              }
              thisTrain =
                '<img src="blank.png" class="event" id="train"><br/>Train at ' +
                hour +
                ":" +
                min +
                ampm;
            }
          }
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
          '<span class="train cell">' +
          thisTrain +
          "</span></td>";
      }
      output += "</tr>\n";
    }
    output += "</tbody></table>\n";
  }

  return output;
}
