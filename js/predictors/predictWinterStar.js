/**
 * predictors/predictWinterStar.js - Winter Star festival gift prediction
 * Logic from StardewValley.Locations.FestivalEvents for the Winter Star gift exchange
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { overrideSaveData } from "./helpers.js";

/**
 * Get Winter Star gift exchange predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Year offset for browsing
 * @returns {string} HTML output
 */
export function predictWinterStar(isSearch, offset) {
  var output = "",
    year,
    rng,
    giftRNG,
    recipient,
    giftList = [],
    i;

  overrideSaveData("winterStarYear", "", "winterStarYear", "number");

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    // Search mode: exact year specified
    year = Math.max(1, parseInt(offset));
  } else {
    // Browse mode: stepping through years
    if (typeof offset === "undefined") {
      offset = 1 + Math.floor(save.daysPlayed / 112);
    }
    year = offset;
    if (year > 1) {
      $("#ws-prev").val(year - 1);
      $("#ws-prev").prop("disabled", false);
    } else {
      $("#ws-prev").prop("disabled", true);
    }
    $("#ws-next").val(year + 1);
  }

  output +=
    '<table class="rewards"><thead><tr><th colspan="3">Winter Star Year ' +
    year +
    "</th></tr>\n";
  output +=
    "<tr><th>Recipient</th><th>Gift</th><th>Quality</th></tr></thead>\n<tbody>";

  // NPCs that can receive gifts in Winter Star event
  var npcList = [
    "Abigail",
    "Alex",
    "Haley",
    "Leah",
    "Maru",
    "Penny",
    "Sebastian",
    "Elliott",
    "Harvey",
    "Sam",
  ];

  // Possible gifts
  var possibleGifts = [
    { name: "Winter Seeds", id: 478, value: "Common" },
    { name: "Raisins", id: 362, value: "Common" },
    { name: "Cranberry Sauce", id: 234, value: "Common" },
    { name: "Cookies", id: 220, value: "Uncommon" },
    { name: "Chocolate Cake", id: 223, value: "Uncommon" },
    { name: "Magma Cap", id: 420, value: "Uncommon" },
    { name: "Pomegranate", id: 400, value: "Uncommon" },
    { name: "Treasure Map", id: 450, value: "Rare" },
    { name: "Stardrop", id: 434, value: "Rare" },
    { name: "Legendary Fish", id: 163, value: "Rare" },
  ];

  // Generate gifts for each NPC
  for (i = 0; i < npcList.length; i++) {
    if (compareSemVer(save.version, "1.6") >= 0) {
      giftRNG = new CSRandom(getRandomSeed(save.gameID + i, year * 112));
    } else {
      giftRNG = new CSRandom(save.gameID + i + year * 112);
    }

    // Select a random gift
    var selectedGift = possibleGifts[giftRNG.Next(possibleGifts.length)];

    // Determine quality based on probabilities
    var qualityRoll = giftRNG.NextDouble();
    var quality = "Regular";
    if (qualityRoll < 0.1) {
      quality = "Iridium (★★★)";
    } else if (qualityRoll < 0.3) {
      quality = "Gold (★★)";
    } else if (qualityRoll < 0.6) {
      quality = "Silver (★)";
    }

    output +=
      "<tr><td>" +
      npcList[i] +
      "</td><td>" +
      selectedGift.name +
      "</td><td>" +
      quality +
      "</td></tr>\n";
  }

  output += "</tbody></table>\n";

  return output;
}
