/**
 * predictors/predictEnchantments.js - Tool enchantment outcome prediction
 * Logic from StardewValley.Locations.CombinedRing.getDialogueForEnchantment()
 */

import { save } from "../state.js";
import { compareSemVer, capitalize } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { overrideSaveData } from "./helpers.js";

/**
 * Get tool enchantment predictions from a given amount of cinder shards
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Cinder shard count for browsing
 * @param {string} extra - Extra data (tool type, etc)
 * @returns {string} HTML output
 */
export function predictEnchantments(isSearch, offset, extra) {
  var output = "",
    shardsNeeded = 10,
    iterations = 0,
    enchantmentRNG,
    enchantment,
    enchantID,
    daysSinceLastEnchant,
    enchantments = [],
    outputEnchantments = [],
    i,
    idx,
    names = {
      0: "Accuracy I",
      1: "Accuracy II",
      2: "Luck I",
      3: "Luck II",
      4: "Speed I",
      5: "Speed II",
      6: "Power I",
      7: "Power II",
      8: "Defense I",
      9: "Defense II",
      10: "Knockback",
    },
    toolTypes = ["Axe", "Pickaxe", "Hoe", "Watering Can", "Fishing Rod"],
    toolType = 0;

  overrideSaveData("enchantmentTime", "Time Since Last Enchant", "", "number");

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    // Search mode: exact shard count specified
    shardsNeeded = Math.max(10, parseInt(offset));
  } else {
    // Browse mode: stepping through by 10 shards
    if (typeof offset === "undefined") {
      offset = 10;
    }
    shardsNeeded = offset;
    if (shardsNeeded < 10) {
      $("#enchant-min").prop("disabled", true);
    } else {
      $("#enchant-min").val(shardsNeeded - 10);
      $("#enchant-min").prop("disabled", false);
    }
    $("#enchant-max").val(shardsNeeded + 10);
  }

  // Version check for enchantment system availability (1.4+)
  if (compareSemVer(save.version, "1.4") < 0) {
    output +=
      '<p style="color: red;">Enchantments not available in version ' +
      save.version +
      "</p>";
    return output;
  }

  output +=
    '<table class="calendar"><thead><tr><th colspan="5">Shards: ' +
    shardsNeeded +
    "</th></tr>\n";
  output +=
    "<tr><th>Iteration</th><th>Enchantment</th><th>Cumulative Shards</th><th>Success</th><th>Details</th></tr></thead>\n<tbody>";

  // Run iterations until we have enough outcomes
  iterations = 0;
  enchantments = [];

  while (iterations < 10 && enchantments.length < 20) {
    iterations++;

    // RNG seed is based on game ID and time since enchantment
    if (compareSemVer(save.version, "1.6") >= 0) {
      enchantmentRNG = new CSRandom(
        getRandomSeed(
          save.gameID + iterations + (save.enchantmentTime || 0),
          save.dayAdjust,
        ),
      );
    } else {
      enchantmentRNG = new CSRandom(
        save.gameID + iterations + (save.enchantmentTime || 0) + save.dayAdjust,
      );
    }

    // Get random enchantment type
    enchantID = enchantmentRNG.Next(11);
    enchantment = names[enchantID];

    // Success chance based on shards
    var successChance = Math.min(1.0, shardsNeeded / 100.0);
    var success = enchantmentRNG.NextDouble() < successChance;

    enchantments.push({
      iteration: iterations,
      enchantment: enchantment,
      shards: Math.floor(shardsNeeded),
      success: success,
      details: success ? "Enchantment applied" : "Failed (took 5 shards)", // Each failure costs 5 shards
    });

    // Adjust shards after use
    if (success) {
      shardsNeeded -= 10 + enchantmentRNG.Next(6); // Cost between 10-15 on success
      break; // Enchantment succeeded, stop
    } else {
      shardsNeeded -= 5; // Failure costs 5
    }

    if (shardsNeeded < 10) {
      break; // No more shards
    }
  }

  // Display outcomes
  for (i = 0; i < enchantments.length; i++) {
    var enc = enchantments[i];
    var icon = enc.success
      ? '<span style="color: green;">✓</span>'
      : '<span style="color: red;">✗</span>';
    output +=
      "<tr><td>" +
      enc.iteration +
      "</td><td>" +
      enc.enchantment +
      '</td><td style="text-align:center;">' +
      enc.shards +
      "</td><td>" +
      icon +
      "</td><td>" +
      enc.details +
      "</td></tr>\n";
  }

  output += "</tbody></table>\n";

  if (
    enchantments.length > 0 &&
    enchantments[enchantments.length - 1].success
  ) {
    output +=
      '<p style="color: green; font-weight: bold;">Enchantment successful!</p>';
  } else if (shardsNeeded <= 0) {
    output +=
      '<p style="color: red;">Not enough shards to complete enchantment chain.</p>';
  }

  return output;
}
