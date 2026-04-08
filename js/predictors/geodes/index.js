/**
 * predictors/geodes/index.js
 * Main geode predictor entry point
 */

import { save } from "../../state.js";
import { compareSemVer, wikify, addCommas } from "../../utils.js";
import {
  getGeodeContent,
  getArtifactTroveContent,
  getGoldenCoconutContent,
  checkForQiBeans,
} from "./geode-content.js";
import { initializeGeodeRNG, prewarmGeodeRNG } from "./geode-rng.js";
import { overrideSaveData } from "../helpers.js";

/**
 * Predict geode contents and artifact trove/golden coconut rewards
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Geode number or search term
 * @returns {string} HTML output
 */
export function predictGeodes(isSearch, offset) {
  var output = "",
    numCracked,
    item,
    itemQty,
    g,
    c,
    couldBeQiBeans,
    tclass,
    searchTerm,
    searchStart,
    searchEnd,
    searchResults,
    count,
    pageSize = 20,
    whichPlayer = 0,
    rng,
    rngTrove;

  // Determine number of columns based on version
  var numColumns = 4;
  if (compareSemVer(save.version, "1.4") >= 0) {
    numColumns++;
  }
  if (compareSemVer(save.version, "1.5") >= 0) {
    numColumns++;
  }

  // Multiplayer support
  overrideSaveData("geodesCracked", "", "geodesCracked", "number");

  if (typeof save.mp_ids !== "undefined" && save.mp_ids.length > 1) {
    $("#geode-player").show();
    if ($("#geode-player-select option").length === 0) {
      for (var player = 0; player < save.mp_ids.length; player++) {
        var prefix = player === 0 ? "Main Farmer " : "Farmhand ";
        var o = new Option(prefix + save.names[player], player);
        if (player === 0) {
          o.selected = true;
        }
        $("#geode-player-select").append(o);
      }
    } else {
      whichPlayer = $("#geode-player-select").val();
    }
  } else {
    $("#geode-player").hide();
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    // Search mode
    $("#geode-prev-100").prop("disabled", true);
    $("#geode-prev").prop("disabled", true);
    $("#geode-next").prop("disabled", true);
    $("#geode-next-100").prop("disabled", true);
    $("#geode-reset").html("Clear Search Results &amp; Reset Browsing");

    searchTerm = new RegExp(offset, "i");
    searchStart = Math.max(
      1,
      $("#geode-search-all").prop("checked")
        ? 1
        : save.geodesCracked[whichPlayer],
    );
    searchEnd = parseInt($("#geode-search-range").val()) + searchStart;

    output +=
      '<table class="output"><thead><tr><th colspan="' +
      (numColumns + 2) +
      '">Search results for &quot;' +
      offset +
      "&quot; over " +
      $("#geode-search-range").val() +
      " geodes</th></tr>\n";
    output +=
      '<tr><th class="item">Item</th>' +
      '<th class="geode-result">Geode</th>' +
      '<th class="geode-result">Frozen Geode</th>' +
      '<th class="geode-result">Magma Geode</th>' +
      '<th class="geode-result">Omni Geode</th>';
    if (compareSemVer(save.version, "1.4") >= 0) {
      output += '<th class="geode-result">Artifact Trove</th>';
    }
    if (compareSemVer(save.version, "1.5") >= 0) {
      output += '<th class="geode-result">Golden Coconut</th>';
    }
    output += "</tr>\n<tbody>";

    count = 0;
    searchResults = {};

    for (numCracked = searchStart; numCracked < searchEnd; numCracked++) {
      var rngs = initializeGeodeRNG(numCracked, whichPlayer);
      rng = rngs.rng;
      rngTrove = rngs.rngTrove;
      prewarmGeodeRNG(rng, rngTrove);

      var items = [];

      // Regular geodes
      for (var typeIndex = 0; typeIndex < 4; typeIndex++) {
        var geodeTypes = ["regular", "frozen", "magma", "omni"];
        var content = getGeodeContent(
          rng,
          rngTrove,
          numCracked,
          geodeTypes[typeIndex],
        );
        items.push(content.names[typeIndex]);
      }

      // Artifact Trove (1.4+)
      if (compareSemVer(save.version, "1.4") >= 0) {
        var troveContent = getArtifactTroveContent(rngTrove);
        items.push(troveContent.name);
      }

      // Golden Coconut (1.5+)
      if (compareSemVer(save.version, "1.5") >= 0) {
        var coconutContent = getGoldenCoconutContent(rngTrove);
        items.push(coconutContent.name);
      }

      // Add to search results
      for (c = 0; c < items.length; c++) {
        if (searchTerm.test(items[c])) {
          if (!searchResults.hasOwnProperty(items[c])) {
            searchResults[items[c]] = [[], [], [], [], [], []];
          }
          searchResults[items[c]][c].push(numCracked);
          count++;
        }
      }
    }

    // Display search results
    Object.keys(searchResults)
      .sort()
      .forEach(function (key) {
        var itemIcon = "";
        if (!save.donatedItems.hasOwnProperty(key)) {
          itemIcon =
            ' <span data-tooltip="Need to Donate"><img src="blank.png" class="icon" id="gunther"></span>';
        }
        output += '<tr><td class="item">' + wikify(key) + itemIcon + "</td>";
        for (c = 0; c < numColumns; c++) {
          if (searchResults[key][c].length > 0) {
            output += "<td>" + searchResults[key][c].slice(0, 5);
            if (searchResults[key][c].length > 5) {
              output +=
                '<span data-tooltip="All: ' +
                searchResults[key][c].join(", ") +
                '">...</span>';
            }
            output += "</td>";
          } else {
            output += "<td></td>";
          }
        }
        output += "</tr>\n";
      });

    output += "</tbody></table>\n";
    output +=
      "<p>Found " +
      count +
      " matching item" +
      (count === 1 ? "" : "s") +
      ".</p>";
  } else {
    // Browse mode - show calendar-style grid
    output += "<p>Browse geodes or use search above.</p>";
    output +=
      "<p>Current geodes cracked: " +
      (save.geodesCracked[whichPlayer] || 0) +
      "</p>";
  }

  return output;
}
