/**
 * predictors/mysteryBoxes/index.js
 * Main mystery box predictor entry point
 */

import { save } from "../../state.js";
import { compareSemVer, wikify, addCommas } from "../../utils.js";
import {
  getMysteryBoxItem,
  getGoldenAnimalCracker,
  getBoxItemCount,
} from "./box-content.js";
import { initializeBoxRNG, determineBoxType } from "./box-rng.js";
import { overrideSaveData } from "../helpers.js";

/**
 * Predict mystery box contents
 * Handles Mystery Boxes, Golden Boxes, and special Golden Boxes with Farming Mastery
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Box number or search term
 * @returns {string} HTML output
 */
export function predictMysteryBoxes(isSearch, offset) {
  var output = "",
    boxNum,
    rng,
    items = [],
    i,
    searchTerm,
    searchStart,
    searchEnd,
    searchResults = {},
    count = 0,
    whichPlayer = 0;

  // Check for farming mastery
  overrideSaveData("farmingMastery", "", "farmingMastery", "number");
  var hasFarmingMastery = save.masteryPerks && save.masteryPerks.farming;

  // Check for fishing level
  var playerFishingLevel = (save.skillLevels && save.skillLevels.fishing) || 0;

  // Multiplayer support
  if (typeof save.mp_ids !== "undefined" && save.mp_ids.length > 1) {
    $("#mbox-player").show();
    if ($("#mbox-player-select option").length === 0) {
      for (var player = 0; player < save.mp_ids.length; player++) {
        var prefix = player === 0 ? "Main Farmer " : "Farmhand ";
        var o = new Option(prefix + save.names[player], player);
        if (player === 0) {
          o.selected = true;
        }
        $("#mbox-player-select").append(o);
      }
    } else {
      whichPlayer = $("#mbox-player-select").val();
    }
  } else {
    $("#mbox-player").hide();
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    // Search mode
    $("#mbox-prev-100").prop("disabled", true);
    $("#mbox-prev").prop("disabled", true);
    $("#mbox-next").prop("disabled", true);
    $("#mbox-next-100").prop("disabled", true);
    $("#mbox-reset").html("Clear Search Results &amp; Reset Browsing");

    searchTerm = new RegExp(offset, "i");
    searchStart = 1;
    searchEnd = parseInt($("#mbox-search-range").val()) + searchStart;

    output +=
      '<table class="output"><thead><tr><th colspan="5">Search results for &quot;' +
      offset +
      "&quot; in mystery boxes</th></tr>\n";
    output +=
      "<tr><th>Box</th><th>Type</th><th>Item 1</th><th>Item 2 (Golden)</th><th>Special (Farming)</th></tr>\n<tbody>";

    for (boxNum = searchStart; boxNum < searchEnd; boxNum++) {
      rng = initializeBoxRNG(boxNum, whichPlayer);
      var boxType = determineBoxType(boxNum, rng, hasFarmingMastery);

      items = [];
      var itemCount = getBoxItemCount(boxType);

      // Get regular items
      for (i = 0; i < (boxType === "mystery" ? 1 : 2); i++) {
        var item = getMysteryBoxItem(rng, boxType, playerFishingLevel);
        items.push(item.name);
      }

      // Special item if farming mastery
      if (boxType === "golden-farming") {
        items.push(getGoldenAnimalCracker().name);
      }

      // Check against search term
      var foundMatch = false;
      for (i = 0; i < items.length; i++) {
        if (searchTerm.test(items[i])) {
          if (!searchResults.hasOwnProperty(items[i])) {
            searchResults[items[i]] = [];
          }
          searchResults[items[i]].push(boxNum);
          foundMatch = true;
          count++;
        }
      }

      // Display row if match found
      if (foundMatch) {
        output +=
          "<tr><td>" +
          boxNum +
          "</td><td>" +
          (boxType === "golden-farming"
            ? "Golden (Farming)"
            : boxType.charAt(0).toUpperCase() + boxType.slice(1)) +
          "</td>";
        output += "<td>" + (items[0] || "") + "</td>";
        output += "<td>" + (items[1] || "") + "</td>";
        output += "<td>" + (items[2] || "") + "</td>";
        output += "</tr>\n";
      }
    }

    output += "</tbody></table>\n";
    output +=
      "<p>Found " +
      count +
      " matching item" +
      (count === 1 ? "" : "s") +
      ".</p>";
  } else {
    // Browse mode
    output += "<p>Browse or search mystery boxes above.</p>";

    if (hasFarmingMastery) {
      output +=
        '<p style="color: green;">✓ Farming Mastery Active: Bonus items in Golden Boxes</p>';
    }

    output +=
      '<table class="rewards"><thead><tr><th colspan="4">Mystery Box Preview</th></tr>';
    output +=
      "<tr><th>Type</th><th>Chance</th><th>Items</th><th>Notes</th></tr></thead>\n<tbody>";

    output += "<tr>";
    output += "<td>Mystery Box</td>";
    output += "<td>50%</td>";
    output += "<td>1 item (rare)</td>";
    output += "<td>Basic box</td>";
    output += "</tr>\n";

    output += "<tr>";
    output += "<td>Golden Box</td>";
    output += "<td>50%</td>";
    output += "<td>2 items (rarer)</td>";
    output += "<td>Double rewards</td>";
    output += "</tr>\n";

    if (hasFarmingMastery) {
      output += "<tr>";
      output += "<td>Golden Box (Farming)</td>";
      output += "<td>15% of Golden</td>";
      output += "<td>2 + Special Item</td>";
      output += "<td>Includes Golden Animal Cracker</td>";
      output += "</tr>\n";
    }

    output += "</tbody></table>\n";
  }

  return output;
}
