/**
 * predictors/predictCart.js - Traveling merchant prediction (pre-1.6)
 * Logic from StardewValley.Locations.Forest.DayUpdate() for Pre-1.6 carts
 */

import { save } from "../state.js";
import { addCommas, compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { getRandomItems, getCartItem, overrideSaveData } from "./helpers.js";

/**
 * Get traveling merchant inventory predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Day offset for browsing
 * @returns {string} HTML output
 */
export function predictCart(isSearch, offset) {
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
    cartItems = [],
    i,
    seenItems = {};

  // Only applies to pre-1.6 versions
  if (compareSemVer(save.version, "1.6") >= 0) {
    output +=
      '<p style="color: red;">Traveling merchant mechanics changed in version 1.6+. Use the Cart (1.6+) tab for current version.</p>';
    return output;
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    $("#cart-prev").prop("disabled", true);
    $("#cart-next").prop("disabled", true);
    $("#cart-reset").html("Clear Search Results &amp; Reset Browsing");
  } else {
    if (typeof offset === "undefined") {
      offset = 28 * Math.floor(save.daysPlayed / 28);
    }
    if (offset < 112) {
      $("#cart-prev-year").prop("disabled", true);
    } else {
      $("#cart-prev-year").val(offset - 112);
      $("#cart-prev-year").prop("disabled", false);
    }
    if (offset < 28) {
      $("#cart-prev-month").prop("disabled", true);
    } else {
      $("#cart-prev-month").val(offset - 28);
      $("#cart-prev-month").prop("disabled", false);
    }
    $("#cart-reset").val("reset");
    $("#cart-next-month").val(offset + 28);
    $("#cart-next-year").val(offset + 112);
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

        // Traveling cart appears Wednesday and Friday
        var isCartDay = weekDay === 3 || weekDay === 5; // Wed or Fri (3=Wed 0-indexed, 5=Fri)

        if (!isCartDay) {
          thisEvent = "(Closed)";
          tclass = "no-event";
        } else {
          // Generate RNG seed for cart items
          if (compareSemVer(save.version, "1.6") >= 0) {
            rng = new CSRandom(
              getRandomSeed(save.gameID + day, save.dayAdjust),
            );
          } else {
            rng = new CSRandom(save.gameID + day + save.dayAdjust);
          }

          // Cart always has 4-8 items
          cartItems = [];
          seenItems = {};

          // Generate 4-8 cart items
          var numItems = 4 + rng.Next(5);
          for (i = 0; i < numItems; i++) {
            var cartItem = getCartItem(rng, seenItems);
            if (cartItem) {
              cartItems.push(cartItem.name);
              seenItems[cartItem.id] = true;
            }
          }

          // Format display: show first 3 items
          thisEvent = '<span class="cart cell">';
          for (i = 0; i < Math.min(cartItems.length, 3); i++) {
            thisEvent += cartItems[i];
            if (i < Math.min(cartItems.length, 3) - 1) {
              thisEvent += "<br/>";
            }
          }
          if (cartItems.length > 3) {
            thisEvent += "<br/>+" + (cartItems.length - 3) + " more";
          }
          thisEvent += "</span>";
        }

        if (day < save.daysPlayed) {
          tclass = "past";
        } else if (day === save.daysPlayed) {
          tclass = "current";
        } else {
          tclass = isCartDay ? "future" : "no-event";
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
