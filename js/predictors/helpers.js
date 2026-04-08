/**
 * predictors/helpers.js - Helper functions used by multiple predictor modules
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";

/**
 * Get a random item from a specific season's available items
 * Used by predictTrash and possibly other predictors
 */
export function getRandomItemFromSeason(rng, season) {
  var possibleItems = [
    "Topaz",
    "Amethyst",
    "Cave Carrot",
    "Quartz",
    "Earth Crystal",
    "Seaweed",
    "Joja Cola",
    "Green Algae",
    "Red Mushroom",
  ];
  if (save.deepestMineLevel > 40) {
    possibleItems.push(
      "Aquamarine",
      "Jade",
      "Diamond",
      "Frozen Tear",
      "Purple Mushroom",
    );
  }
  if (save.deepestMineLevel > 80) {
    possibleItems.push("Ruby", "Emerald", "Fire Quartz");
  }
  if (save.desertUnlocked) {
    possibleItems.push("Coconut", "Cactus Fruit", "Sandfish", "Scorpion Carp");
  }
  if (save.hasFurnaceRecipe) {
    possibleItems.push("Copper Bar", "Iron Bar", "Gold Bar", "Refined Quartz");
  }
  switch (season) {
    case 0:
      possibleItems.push(
        "Wild Horseradish",
        "Daffodil",
        "Leek",
        "Dandelion",
        "Anchovy",
        "Sardine",
        "Bream",
        "Largemouth Bass",
        "Smallmouth Bass",
        "Carp",
        "Catfish",
        "Sunfish",
        "Herring",
        "Eel",
        "Seaweed",
        "Joja Cola",
        "Flounder",
      );
      break;
    case 1:
      possibleItems.push(
        "Pufferfish",
        "Tuna",
        "Bream",
        "Largemouth Bass",
        "Rainbow Trout",
        "Carp",
        "Pike",
        "Sunfish",
        "Red Mullet",
        "Octopus",
        "Red Snapper",
        "Super Cucumber",
        "Spice Berry",
        "Grape",
        "Sweet Pea",
        "Flounder",
      );
      break;
    case 2:
      possibleItems.push(
        "Common Mushroom",
        "Wild Plum",
        "Hazelnut",
        "Blackberry",
        "Anchovy",
        "Sardine",
        "Bream",
        "Largemouth Bass",
        "Smallmouth Bass",
        "Salmon",
        "Walleye",
        "Carp",
        "Catfish",
        "Eel",
        "Red Snapper",
        "Sea Cucumber",
        "Super Cucumber",
        "Midnight Carp",
      );
      break;
    case 3:
      possibleItems.push(
        "Winter Root",
        "Crystal Fruit",
        "Snow Yam",
        "Crocus",
        "Tuna",
        "Sardine",
        "Bream",
        "Largemouth Bass",
        "Walleye",
        "Perch",
        "Pike",
        "Red Mullet",
        "Herring",
        "Red Snapper",
        "Squid",
        "Sea Cucumber",
        "Midnight Carp",
      );
      break;
  }
  return possibleItems[rng.Next(possibleItems.length)];
}

/**
 * Get a random cart item (traveling merchant)
 * Used by predictCart and its variants
 */
export function getCartItem(rng, seenItems) {
  var theItem = {};
  var itemID = rng.Next(2, 790);
  if (compareSemVer(save.version, "1.4") >= 0) {
    var keepGoing = true;
    while (keepGoing) {
      itemID++;
      itemID %= 790;
      if (save.cartItems_1_4.hasOwnProperty(itemID)) {
        theItem.name = save.cartItems_1_4[itemID];
        theItem.price = Math.max(
          rng.Next(1, 11) * 100,
          save.objects["_" + itemID].price * rng.Next(3, 6),
        );
        theItem.qty = rng.NextDouble() < 0.1 ? 5 : 1;
        if (!(theItem.name in seenItems)) {
          seenItems[theItem.name] = 1;
          keepGoing = false;
        }
      }
    }
  } else {
    theItem.name = save.cartItems[itemID];
    // Fallback price logic for pre-1.4 saves
    var failsafe = 0;
    while (
      failsafe++ < 800 &&
      (!save.objects.hasOwnProperty("_" + itemID) ||
        save.objects["_" + itemID].name !== theItem.name)
    ) {
      itemID++;
      itemID %= 790;
    }
    theItem.price = Math.max(
      rng.Next(1, 11) * 100,
      save.objects["_" + itemID].price * rng.Next(3, 6),
    );
    theItem.qty = rng.NextDouble() < 0.1 ? 5 : 1;
  }
  return theItem;
}

/**
 * Get random items from a category
 * Helper for shops and loot tables
 */
export function getRandomItems(
  rng,
  type,
  min,
  max,
  requirePrice,
  isRandomSale,
  doCategoryChecks = false,
  howMany = 1,
) {
  var shuffledItems = {};
  for (const id in save[type]) {
    var key = rng.Next();
    if (isNaN(save[type][id].id)) {
      continue;
    }
    if (requirePrice && save[type][id].price == 0) {
      continue;
    }
    if (isRandomSale && save[type][id].offlimits) {
      continue;
    }
    var index = parseInt(save[type][id].id);
    if (index >= min && index <= max) {
      shuffledItems[key] = id;
    }
  }
  var selectedItems = [];
  var slot = 1;
  for (const key in shuffledItems) {
    if (
      doCategoryChecks &&
      (save[type][shuffledItems[key]].category >= 0 ||
        save[type][shuffledItems[key]].category === -999)
    ) {
      continue;
    }
    if (
      doCategoryChecks &&
      (save[type][shuffledItems[key]].type === "Arch" ||
        save[type][shuffledItems[key]].type === "Minerals" ||
        save[type][shuffledItems[key]].type === "Quest")
    ) {
      continue;
    }
    selectedItems.push(shuffledItems[key]);
    if (slot++ >= howMany) {
      break;
    }
  }
  return selectedItems;
}

/**
 * Get random wallpaper/floor item
 * Used by predictWallpaper and similar
 */
export function getRandomWallFloor(
  rng,
  min,
  max,
  extra,
  exclude = {},
  howMany = 1,
) {
  var shuffledItems = {};
  for (var id = min; id <= max + extra; id++) {
    var key = rng.Next();
    shuffledItems[key] = id;
  }
  var selectedItems = [];
  var slot = 1;
  for (const key in shuffledItems) {
    if (
      exclude.hasOwnProperty(shuffledItems[key]) ||
      shuffledItems[key] > max
    ) {
      continue;
    }
    selectedItems.push(shuffledItems[key]);
    if (slot++ >= howMany) {
      break;
    }
  }
  return selectedItems;
}

/**
 * Override save data using URL parameters
 * Used by parseSummary
 */
export function overrideSaveData(prop, longName, shortName, type = "text") {
  if (save.hasOwnProperty(prop)) {
    var queryProp;
    if (longName && window.QueryString.hasOwnProperty(longName)) {
      queryProp = longName;
    } else if (shortName && window.QueryString.hasOwnProperty(shortName)) {
      queryProp = shortName;
    } else {
      return false;
    }
    var queryValue = window.QueryString[queryProp];
    if (type === "bool") {
      save[prop] = queryValue.toLowerCase() === "true" || queryValue === "1";
    } else if (type === "float") {
      save[prop] = Number.parseFloat(queryValue);
    } else if (type === "int") {
      save[prop] = Number.parseInt(queryValue);
    } else {
      save[prop] = queryValue;
    }
    return true;
  }
  return false;
}
