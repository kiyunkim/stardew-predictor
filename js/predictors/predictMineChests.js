/**
 * predictors/predictMineChests.js - Mine treasure chest prediction
 * Logic from StardewValley.Locations.MineShaft.loadLevel()
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import {
  getRandomItems,
  getRandomWallFloor,
  overrideSaveData,
} from "./helpers.js";

/**
 * Get mine level treasure chests prediction
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Level offset for browsing
 * @param {string} extra - Extra data (mine level)
 * @returns {string} HTML output
 */
export function predictMineChests(isSearch, offset, extra) {
  var output = "",
    items = [],
    extraData = {},
    itemList = [],
    floor,
    mineType,
    ttype,
    dungeonRNG,
    numChests,
    i,
    item,
    rng,
    loot,
    moneyItem;

  if (typeof extra !== "undefined" && extra !== "") {
    extraData = JSON.parse(decodeURIComponent(extra));
  }

  overrideSaveData("mineLevel", "", "mineLevel", "number");

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    floor = parseInt(offset);
  } else {
    floor =
      typeof extraData.floor !== "undefined" ? extraData.floor : save.mineLevel;
  }

  if (floor < 1) {
    floor = 1;
    $("#mc-level").val(1);
  }
  if (floor > 120) {
    floor = 120;
    $("#mc-level").val(120);
  }

  mineType = "mines";
  if (floor > 80) {
    mineType = "skull";
  }

  // Determine dungeon type based on level
  ttype = 0; // Default mines
  if (floor > 0 && floor <= 40) {
    ttype = 0;
  } else if (floor > 40 && floor <= 80) {
    ttype = 1; // Frost dungeon
  } else if (floor > 80 && floor <= 120) {
    ttype = 2; // Skull cavern
  }

  // In version 1.6+, chest seeding changed
  if (compareSemVer(save.version, "1.6") >= 0) {
    dungeonRNG = new CSRandom(
      getRandomSeed(save.gameID + floor * 1000, save.dayAdjust),
    );
  } else {
    dungeonRNG = new CSRandom(save.gameID + floor * 1000 + save.dayAdjust);
  }

  // Standard 2-4 chests per level
  numChests = 2 + dungeonRNG.Next(3);

  output += "<table class=rewards><tr><th colspan=3>Floor " + floor + "</th>";
  output += "<th>" + numChests + " Chest" + (numChests === 1 ? "" : "s");
  output += "</th></tr>\n";

  for (i = 0; i < numChests; i++) {
    // Each chest contains 2-5 items
    var chestSize = 2 + dungeonRNG.Next(4);

    for (var j = 0; j < chestSize; j++) {
      rng = new CSRandom(
        save.gameID + floor * 1000 + save.dayAdjust + i * 10 + j,
      );

      // Chest contents based on floor type
      if (floor <= 20) {
        // Early mines: common items
        itemList = [
          { ID: 74, name: "Parsnip", price: 35 }, // Regular pickaxe upgrade materials
          { ID: 75, name: "Gold Ore", price: 25 },
          { ID: 384, name: "Wood", price: 2 },
          { ID: 382, name: "Wood", price: 2 },
        ];
      } else if (floor <= 80) {
        // Mid-deep mines: better loot
        itemList = [
          { ID: 72, name: "Iron Ore", price: 50 },
          { ID: 75, name: "Gold Ore", price: 25 },
          { ID: 82, name: "Copper Ore", price: 15 },
        ];
      } else {
        // Skull cavern: best loot
        itemList = [
          { ID: 75, name: "Gold Ore", price: 25 },
          { ID: 76, name: "Iridium Ore", price: 100 },
          { ID: 337, name: "Stardrop", price: 2000 },
        ];
      }

      if (itemList.length > 0) {
        item = itemList[rng.Next(itemList.length)];
        moneyItem = {
          ID: item.ID,
          name: item.name,
          price: item.price,
          stack: 1 + rng.Next(3),
        };
        items.push(moneyItem);
      }
    }

    output += "<tr><td colspan=4 class=reward>";
    for (var k = 0; k < items.length && k < 3; k++) {
      output += "(" + items[k].stack + "x) " + items[k].name + " &#9679; ";
    }
    output += "</td></tr>\n";
    items = [];
  }

  output += "</table>\n";

  return output;
}
