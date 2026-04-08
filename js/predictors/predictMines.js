/**
 * predictors/predictMines.js - Mine floor contents prediction
 * Logic from StardewValley.Locations.MineShaft.loadLevel() and generateContents()
 */

import { save } from "../state.js";
import { addCommas, compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { getRandomItems, overrideSaveData } from "./helpers.js";

/**
 * Get mine floor contents predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Floor number for browsing
 * @param {string} extra - Extra data (floor number, etc)
 * @returns {string} HTML output
 */
export function predictMines(isSearch, offset, extra) {
  var output = "",
    floor = 1,
    mineType = "mines",
    level,
    dungeonFloor,
    floorRNG,
    treasureCount,
    i,
    treasure,
    treasures = [],
    monstersPresent = [],
    itemsFound = [];

  if (typeof extra !== "undefined" && extra !== "") {
    var extraData = JSON.parse(decodeURIComponent(extra));
    if (extraData.floor) {
      floor = extraData.floor;
    }
  }

  overrideSaveData("mineLevel", "", "mineLevel", "number");

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    floor = Math.max(1, Math.min(120, parseInt(offset)));
  } else {
    floor = Math.max(
      1,
      Math.min(
        120,
        typeof offset !== "undefined" && offset !== ""
          ? parseInt(offset)
          : floor,
      ),
    );
  }

  // Determine mine type based on floor
  if (floor <= 40) {
    mineType = "mines";
  } else if (floor <= 80) {
    mineType = "frost";
  } else if (floor <= 120) {
    mineType = "skull";
  }

  output +=
    '<table class="rewards"><thead><tr><th colspan="3">Floor ' +
    floor +
    " (" +
    mineType.charAt(0).toUpperCase() +
    mineType.slice(1) +
    ")</th></tr>\n";
  output +=
    '<tr><th style="width:35%">Item Type</th><th style="width:20%">Levels</th><th style="width:45%">Common Items</th></tr></thead>\n<tbody>';

  // Generate RNG seed for this floor
  if (compareSemVer(save.version, "1.6") >= 0) {
    floorRNG = new CSRandom(
      getRandomSeed(save.gameID + floor * 1000, save.dayAdjust),
    );
  } else {
    floorRNG = new CSRandom(save.gameID + floor * 1000 + save.dayAdjust);
  }

  // Ore by depth
  var oresAtThisLevel = [];
  if (floor <= 20) {
    oresAtThisLevel = [
      { name: "Copper Ore", id: 382, tier: "Early" },
      { name: "Stone", id: 390, tier: "Early" },
    ];
  } else if (floor <= 40) {
    oresAtThisLevel = [
      { name: "Copper Ore", id: 382, tier: "Mid-Early" },
      { name: "Iron Ore", id: 384, tier: "Mid-Early" },
      { name: "Gold Ore", id: 386, tier: "Mid-Early" },
    ];
  } else if (floor <= 80) {
    oresAtThisLevel = [
      { name: "Gold Ore", id: 386, tier: "Deep" },
      { name: "Iridium Ore", id: 388, tier: "Deep" },
      { name: "Iron Ore", id: 384, tier: "Deep" },
    ];
  } else {
    oresAtThisLevel = [
      { name: "Iridium Ore", id: 388, tier: "Very Deep" },
      { name: "Gold Ore", id: 386, tier: "Very Deep" },
      { name: "Cinder Shards", id: 919, tier: "Very Deep" },
    ];
  }

  // Gems by type
  var gemsAtThisLevel = [];
  if (mineType === "mines") {
    gemsAtThisLevel = [
      { name: "Quartz", id: 80, rate: "Common" },
      { name: "Jade", id: 82, rate: "Uncommon" },
      { name: "Amethyst", id: 84, rate: "Uncommon" },
      { name: "Topaz", id: 86, rate: "Rare" },
    ];
  } else if (mineType === "frost") {
    gemsAtThisLevel = [
      { name: "Aquamarine", id: 88, rate: "Common" },
      { name: "Emerald", id: 90, rate: "Uncommon" },
      { name: "Ruby", id: 92, rate: "Rare" },
    ];
  } else {
    gemsAtThisLevel = [
      { name: "Mystic Crystal", id: 336, rate: "Common" },
      { name: "Fire Opal", id: 338, rate: "Uncommon" },
      { name: "Frozen Tear", id: 340, rate: "Uncommon" },
    ];
  }

  // Display ores
  output +=
    "<tr><td><strong>Ores</strong></td><td>" +
    floor +
    "-" +
    Math.min(floor + 10, 120) +
    '</td><td class="items">';
  for (i = 0; i < Math.min(oresAtThisLevel.length, 3); i++) {
    output += oresAtThisLevel[i].name + " &#9679; ";
  }
  output += "</td></tr>\n";

  // Display gems
  output +=
    "<tr><td><strong>Gems</strong></td><td>" +
    floor +
    "-" +
    Math.min(floor + 10, 120) +
    '</td><td class="items">';
  for (i = 0; i < Math.min(gemsAtThisLevel.length, 3); i++) {
    output +=
      gemsAtThisLevel[i].name + " (" + gemsAtThisLevel[i].rate + ") &#9679; ";
  }
  output += "</td></tr>\n";

  // chest contents
  var chestItems = [];
  if (floor <= 20) {
    chestItems = ["Wooden Chest", "Basic Supplies", "Healing Potions"];
  } else if (floor <= 80) {
    chestItems = ["Iron Chest", "Quality Ores", "Tools", "Treasure Map"];
  } else {
    chestItems = [
      "Obsidian Chest",
      "Rare Ores",
      "Ancient Artifacts",
      "Stardrop",
    ];
  }

  output +=
    "<tr><td><strong>Chests</strong></td><td>" +
    floor +
    "-" +
    Math.min(floor + 10, 120) +
    '</td><td class="items">';
  for (i = 0; i < Math.min(chestItems.length, 3); i++) {
    output += chestItems[i] + " &#9679; ";
  }
  output += "</td></tr>\n";

  // Special items by floor type
  var specialItems = [];
  if (compareSemVer(save.version, "1.5") >= 0) {
    if (mineType === "skull") {
      specialItems = ["Bone Flute", "Ancient Coin", "Sleeping Elixir"];
    } else {
      specialItems = [
        "Spring Foraging Bundle",
        "Artifact Spot Item",
        "Monster Drop",
      ];
    }
  }

  if (specialItems.length > 0) {
    output +=
      "<tr><td><strong>Special</strong></td><td>" +
      floor +
      "-" +
      Math.min(floor + 10, 120) +
      '</td><td class="items">';
    for (i = 0; i < Math.min(specialItems.length, 3); i++) {
      output += specialItems[i] + " &#9679; ";
    }
    output += "</td></tr>\n";
  }

  output += "</tbody></table>\n";

  return output;
}
