/**
 * predictors/predictNight.js - Night time event prediction
 * Logic from StardewValley.Utility.pickFarmEvent()
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Predict night events (meteor, witch, fairy, etc) for a given month
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictNight(isSearch, offset) {
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
    $("#night-prev").prop("disabled", true);
    $("#night-next").prop("disabled", true);
    $("#night-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#night-prev-year").prop("disabled", true);
    } else {
      $("#night-prev-year").val(offset - 112);
      $("#night-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#night-prev-month").prop("disabled", true);
    } else {
      $("#night-prev-month").val(offset - 28);
      $("#night-prev-month").prop("disabled", false);
    }
    $("#night-reset").val("reset");
    $("#night-next-month").val(offset + 28);
    $("#night-next-year").val(offset + 112);
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
        var couldBeWindstorm = false;
        // The event is actually rolled in the morning at 6am, but from a user standpoint it makes more sense
        // to think of it occuring during the previous night. We will offset the day by 1 because of this.
        if (day + save.dayAdjust === 30) {
          thisEvent =
            '<img src="blank.png" class="event" id="train"><br/>Earthquake';
        } else if (compareSemVer(save.version, "1.6") >= 0) {
          rng = new CSRandom(
            getRandomSeed(day + 1 + save.dayAdjust, save.gameID / 2),
          );
          for (var i = 0; i < 10; i++) {
            rng.NextDouble();
          }
          // If the greenhouse has been repaired, an extra roll for the windstorm needs to happen
          if (save.greenhouseUnlocked) {
            couldBeWindstorm = rng.NextDouble() < 0.1;
          }
          var nextRoll = rng.NextDouble();
          if (!save.greenhouseUnlocked) {
            couldBeWindstorm = nextRoll < 0.1;
          }
          if (nextRoll < 0.01 && month % 4 < 3) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_f"><br/>Fairy';
          } else if (rng.NextDouble() < 0.01 && day + 1 + save.dayAdjust > 20) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_w"><br/>Witch';
          } else if (rng.NextDouble() < 0.01 && day + 1 + save.dayAdjust > 5) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_m"><br/>Meteor';
          } else if (rng.NextDouble() < 0.005) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_o"><br/>Stone Owl';
          } else if (rng.NextDouble() < 0.008 && year > 1) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_c"><br/>Strange Capsule';
          } else {
            thisEvent =
              '<span class="none">&nbsp;<br/>(No event)<br/>&nbsp</span>';
          }
        } else {
          rng = new CSRandom(save.gameID / 2 + day + 1 + save.dayAdjust);
          if (
            compareSemVer(save.version, "1.3") < 0 &&
            save.canHaveChildren &&
            rng.NextDouble() < 0.05
          ) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_b"><br/>"Want a Baby?"';
          } else if (rng.NextDouble() < 0.01 && month % 4 < 3) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_f"><br/>Fairy';
          } else if (rng.NextDouble() < 0.01) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_w"><br/>Witch';
          } else if (rng.NextDouble() < 0.01) {
            thisEvent =
              '<img src="blank.png" class="event" id="event_m"><br/>Meteor';
          } else {
            if (compareSemVer(save.version, "1.5") < 0) {
              if (rng.NextDouble() < 0.01 && year > 1) {
                thisEvent =
                  '<img src="blank.png" class="event" id="event_c"><br/>Strange Capsule';
              } else if (rng.NextDouble() < 0.01) {
                thisEvent =
                  '<img src="blank.png" class="event" id="event_o"><br/>Stone Owl';
              } else {
                thisEvent =
                  '<span class="none">&nbsp;<br/>(No event)<br/>&nbsp</span>';
              }
            } else if (compareSemVer(save.version, "1.5.3") < 0) {
              if (rng.NextDouble() < 0.008 && year > 1) {
                thisEvent =
                  '<img src="blank.png" class="event" id="event_c"><br/>Strange Capsule';
              } else if (rng.NextDouble() < 0.008) {
                thisEvent =
                  '<img src="blank.png" class="event" id="event_o"><br/>Stone Owl';
              } else {
                thisEvent =
                  '<span class="none">&nbsp;<br/>(No event)<br/>&nbsp</span>';
              }
            } else {
              if (rng.NextDouble() < 0.005) {
                thisEvent =
                  '<img src="blank.png" class="event" id="event_o"><br/>Stone Owl';
              } else if (rng.NextDouble() < 0.008 && year > 1) {
                thisEvent =
                  '<img src="blank.png" class="event" id="event_c"><br/>Strange Capsule';
              } else {
                thisEvent =
                  '<span class="none">&nbsp;<br/>(No event)<br/>&nbsp</span>';
              }
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
        var extra = couldBeWindstorm
          ? ' <span class="wind"><img alt="Tree Stump" src="blank.png" class="mid" id="stump"></span>'
          : "";
        output +=
          '<td class="' +
          tclass +
          '"><span class="date"> ' +
          (day - offset) +
          "</span>" +
          extra +
          "<br/>" +
          '<span class="night cell">' +
          thisEvent +
          "</span></td>";
      }
      output += "</tr>\n";
    }
    output +=
      '<tr><td colspan="7" class="middle legend"><img src="blank.png" class="mid" alt="Tree Stump" id="stump"> <span>Indicates a day which could be the windstorm that knocks down the big tree in Cindersap Forest (only shows on 1.6 saves)</span></td></tr>';
    output += "</tbody></table>\n";
  }
  return output;
}
