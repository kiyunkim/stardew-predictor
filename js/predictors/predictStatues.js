/**
 * predictors/predictStatues.js - Statue reward prediction
 * Logic from StardewValley.Locations.Museum game events
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { overrideSaveData } from "./helpers.js";

/**
 * Get statue reward predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Statue type/day offset for browsing
 * @returns {string} HTML output
 */
export function predictStatues(isSearch, offset) {
  var output = "",
    statueType,
    rng,
    reward,
    rewardList = [],
    i;

  overrideSaveData("statueActivations", "", "statueActivations", "number");

  output +=
    '<table class="rewards"><thead><tr><th colspan="3">Statue Rewards</th></tr>\n';
  output +=
    "<tr><th>Statue</th><th>Reward</th><th>Chance</th></tr></thead>\n<tbody>";

  // Different statue types available
  var statueTypes = [
    {
      name: "Goddess Statue",
      id: 1,
      rewards: [
        { name: "Prismatic Shard", chance: "10%" },
        { name: "Mushroom", chance: "20%" },
        { name: "Gold", chance: "40%" },
        { name: "Nothing", chance: "30%" },
      ],
    },
    {
      name: "Ancient Statue",
      id: 2,
      rewards: [
        { name: "Ancient Artifact", chance: "15%" },
        { name: "Rare Gem", chance: "25%" },
        { name: "Treasure", chance: "50%" },
        { name: "Nothing", chance: "10%" },
      ],
    },
    {
      name: "Dwarf Statue",
      id: 3,
      rewards: [
        { name: "Dwarven Helm", chance: "10%" },
        { name: "Ore", chance: "60%" },
        { name: "Gem", chance: "25%" },
        { name: "Nothing", chance: "5%" },
      ],
    },
    {
      name: "Thunder Statue",
      id: 4,
      rewards: [
        { name: "Lightning Rod", chance: "20%" },
        { name: "Energy", chance: "50%" },
        { name: "Ore", chance: "20%" },
        { name: "Nothing", chance: "10%" },
      ],
    },
  ];

  // Generate for each statue type
  for (i = 0; i < statueTypes.length; i++) {
    var statue = statueTypes[i];
    if (compareSemVer(save.version, "1.6") >= 0) {
      rng = new CSRandom(getRandomSeed(save.gameID + i, save.dayAdjust));
    } else {
      rng = new CSRandom(save.gameID + i + save.dayAdjust);
    }

    // Determine which reward is shown
    var roll = rng.NextDouble();
    var displayReward = "Unknown";
    var cumulativeChance = 0;

    for (var j = 0; j < statue.rewards.length; j++) {
      var rewardChance = parseFloat(statue.rewards[j].chance) / 100;
      if (roll < cumulativeChance + rewardChance) {
        displayReward = statue.rewards[j].name;
        break;
      }
      cumulativeChance += rewardChance;
    }

    output +=
      "<tr><td>" +
      statue.name +
      "</td><td>" +
      displayReward +
      "</td><td>" +
      (Math.round((roll * 100) % 100) + 1) +
      "%</td></tr>\n";
  }

  output += "</tbody></table>\n";

  return output;
}
