/**
 * predictors/predictGemBirds.js - Gem bird reward prediction
 * Logic from StardewValley.Locations.Summit.Update()
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { overrideSaveData } from "./helpers.js";

/**
 * Get gem bird rewards predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictGemBirds(isSearch, offset) {
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

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#gembirds-prev").prop("disabled", true);
    $("#gembirds-next").prop("disabled", true);
    $("#gembirds-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#gembirds-prev-year").prop("disabled", true);
    } else {
      $("#gembirds-prev-year").val(offset - 112);
      $("#gembirds-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#gembirds-prev-month").prop("disabled", true);
    } else {
      $("#gembirds-prev-month").val(offset - 28);
      $("#gembirds-prev-month").prop("disabled", false);
    }
    $("#gembirds-reset").val("reset");
    $("#gembirds-next-month").val(offset + 28);
    $("#gembirds-next-year").val(offset + 112);
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

        // Generate RNG for gem bird rewards
        if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(save.gameID, day + save.dayAdjust - 1),
          );
        } else {
          rng = new CSRandom(save.gameID + day + save.dayAdjust - 1);
        }

        // Gem birds appear daily on the mountain
        // Available gems from birds
        var availableRewards = [
          { name: "Amethyst", id: 84, color: "purple" },
          { name: "Topaz", id: 86, color: "blue" },
          { name: "Jade", id: 82, color: "green" },
          { name: "Emerald", id: 90, color: "emerald" },
          { name: "Ruby", id: 92, color: "ruby" },
          { name: "Quartz", id: 80, color: "white" },
          { name: "Fluorite", id: 244, color: "fluorite" },
          { name: "Fire Quartz", id: 82, color: "orange" },
        ];

        // Birds drop random gem based on RNG
        var selectedReward =
          availableRewards[rng.Next(availableRewards.length)];

        // Chance to also get a second gem
        var secondReward = null;
        if (rng.NextDouble() < 0.2) {
          secondReward = availableRewards[rng.Next(availableRewards.length)];
        }

        thisEvent =
          '<span class="gembird-reward" style="color:' +
          selectedReward.color +
          '">' +
          selectedReward.name;
        if (secondReward) {
          thisEvent += "<br/>" + secondReward.name + "</span>";
        } else {
          thisEvent += "</span>";
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
          thisEvent +
          "</td>";
      }
      output += "</tr>\n";
    }
    output += "</tbody></table>\n";
  }
  return output;
}
