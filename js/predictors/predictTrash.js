/**
 * predictors/predictTrash.js - Garbage can contents prediction
 * Logic from StardewValley.Locations.*.checkAction() for garbage cans
 */

import { save } from "../state.js";
import { addCommas, compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";
import { getRandomItems, overrideSaveData } from "./helpers.js";

/**
 * Get trash can contents predictions for garbage cans
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Location/day offset for browsing
 * @param {string} extra - Extra data (location ID, etc)
 * @returns {string} HTML output
 */
export function predictTrash(isSearch, offset, extra) {
  var output = "",
    locations = [
      { id: "town", name: "Pelican Town" },
      { id: "ranch", name: "Farm" },
      { id: "mines", name: "Mines" },
      { id: "beach", name: "Beach" },
      { id: "mountain", name: "Mountain" },
      { id: "forest", name: "Forest" },
      { id: "desert", name: "Desert" },
      { id: "sewer", name: "Sewer" },
    ],
    locationId = "town",
    day,
    rng,
    trashContents = [],
    itemList = [],
    i;

  if (typeof extra !== "undefined" && extra !== "") {
    var extraData = JSON.parse(decodeURIComponent(extra));
    if (extraData.location) {
      locationId = extraData.location;
    }
  }

  overrideSaveData("trashDay", "", "trashDay", "number");

  output +=
    '<table class="rewards"><thead><tr><th colspan="4">Garbage Can Locations</th></tr>\n';
  output +=
    '<tr><td colspan="4"><select id="trash-location" onchange="this.form && this.form.submit && this.form.submit()">';

  for (i = 0; i < locations.length; i++) {
    output +=
      '<option value="' +
      locations[i].id +
      '"' +
      (locations[i].id === locationId ? ' selected="selected"' : "") +
      ">" +
      locations[i].name +
      "</option>";
  }
  output += "</select></td></tr>\n";

  output +=
    "<tr><th>Can</th><th>Item #1</th><th>Item #2</th><th>Item #3</th></tr></thead>\n<tbody>";

  // Generate trash for 5 cans in this location
  var cansAtLocation = 3; // Most locations have 2-3 garbage cans
  if (locationId === "town") {
    cansAtLocation = 5;
  } else if (locationId === "beach") {
    cansAtLocation = 4;
  }

  for (var canNum = 0; canNum < cansAtLocation; canNum++) {
    if (compareSemVer(save.version, "1.6") >= 0) {
      rng = new CSRandom(
        getRandomSeed(save.gameID + locationId, save.dayAdjust + canNum),
      );
    } else {
      rng = new CSRandom(
        save.gameID + LocationIndex[locationId] + save.dayAdjust + canNum,
      );
    }

    trashContents = [];

    // Base trash items available
    itemList = [
      { name: "Trash", id: 168 },
      { name: "Soggy Newspaper", id: 388 },
      { name: "Joja Cola", id: 167 },
      { name: "Broken Glasses", id: 169 },
      { name: "Broken CD", id: 170 },
    ];

    // Location-specific trash
    if (locationId === "town") {
      itemList.push({ name: "Note Recipe", id: 328 });
    } else if (locationId === "beach") {
      itemList.push({ name: "Seaweed", id: 152 });
      itemList.push({ name: "Sea Cucumber", id: 154 });
    } else if (locationId === "forest") {
      itemList.push({ name: "Purple Mushroom", id: 420 });
    } else if (locationId === "mines") {
      itemList.push({ name: "Stone", id: 390 });
    }

    // Chance for special items
    if (rng.NextDouble() < 0.1) {
      itemList.push({ name: "Rare Treasure", id: 72 });
    }

    // Generate 1-3 items from this can
    var itemsInCan = 1 + rng.Next(2);
    for (i = 0; i < itemsInCan && i < 3; i++) {
      var randomItem = itemList[rng.Next(itemList.length)];
      trashContents.push(randomItem);
    }

    // Display can contents
    output += "<tr><td>Can #" + (canNum + 1) + "</td>";
    for (i = 0; i < 3; i++) {
      if (i < trashContents.length) {
        output += "<td>" + trashContents[i].name + "</td>";
      } else {
        output += "<td>&nbsp;</td>";
      }
    }
    output += "</tr>\n";
  }

  output += "</tbody></table>\n";

  return output;
}

// Location index for older version compatibility
var LocationIndex = {
  town: 0,
  ranch: 1,
  mines: 2,
  beach: 3,
  mountain: 4,
  forest: 5,
  desert: 6,
  sewer: 7,
};
