/**
 * predictors/mysteryBoxes/box-content.js
 * Mystery box item pools and tier distribution
 */

import { save } from "../../state.js";
import { compareSemVer } from "../../utils.js";

/**
 * Get tier-based item from mystery box content
 * Uses weighted tier system: Ultra-rare, Common, Fallback
 * @param {CSRandom} rng - RNG instance
 * @param {string} boxType - 'mystery' | 'golden' | 'golden-farming'
 * @param {number} playerFishingLevel - Player's fishing skill level
 * @returns {object} {name, id}
 */
export function getMysteryBoxItem(rng, boxType, playerFishingLevel) {
  playerFishingLevel = playerFishingLevel || 0;

  var roll = rng.NextDouble();

  // Tier 1: Ultra-rare items (0.5-1%)
  var ultraRareRoll = 0.01;
  if (boxType === "golden-farming") {
    ultraRareRoll = 0.015; // Slightly higher for farming perk box
  }

  if (roll < ultraRareRoll) {
    return getUltraRareItem(rng);
  }

  // Tier 2: Common items (~30%)
  if (roll < 0.35) {
    return getCommonItem(rng, playerFishingLevel);
  }

  // Tier 3: Fallback (~65%)
  return getFallbackItem(rng);
}

/**
 * Ultra-rare tier items available in mystery boxes
 */
function getUltraRareItem(rng) {
  var ultraRareItems = [
    { name: "Warp Totem", id: 688 },
    { name: "Prismatic Shard", id: 74 },
    { name: "Unidentified Minerals", id: 749 },
    { name: "Mystery Book", id: 790 },
    { name: "Purple Book", id: 791 },
    { name: "Iridium Ring", id: 527 },
    { name: "Top Hat", id: 67 },
    { name: "Farmer Shirt", id: 1254 },
    { name: "Wallpaper", id: 411 },
  ];

  var selected = ultraRareItems[rng.Next(ultraRareItems.length)];
  return selected;
}

/**
 * Common tier items - skill-dependent
 */
function getCommonItem(rng, fishingLevel) {
  var commonItems = [
    // Seeds
    { name: "Spring Seeds", id: 472 },
    { name: "Summer Seeds", id: 473 },
    { name: "Fall Seeds", id: 474 },
    { name: "Winter Seeds", id: 475 },
    { name: "Ancient Seeds", id: 499 },
    { name: "Coffee Beans", id: 433 },

    // Eggs
    { name: "Brown Egg", id: 180 },
    { name: "White Egg", id: 181 },

    // Gems
    { name: "Geode", id: 535 },
    { name: "Frozen Geode", id: 536 },
    { name: "Magma Geode", id: 537 },

    // Skill books
    { name: "Combat Book", id: 792 },
    { name: "Foraging Book", id: 793 },

    // Version 1.6+ items
    { name: "Raccoon Seed", id: 912 },
  ];

  // Fishing-dependent items (need fishing level 6+)
  if (fishingLevel >= 6) {
    commonItems.push({ name: "Tuna", id: 152 });
    commonItems.push({ name: "Angler", id: 155 });
  } else {
    commonItems.push({ name: "Fried Mushroom", id: 195 });
    commonItems.push({ name: "Fried Mushroom", id: 195 });
  }

  var selected = commonItems[rng.Next(commonItems.length)];
  return selected;
}

/**
 * Fallback tier items - always available
 */
function getFallbackItem(rng) {
  var fallbackItems = [
    { name: "Parsnip", id: 24 },
    { name: "Cauliflower", id: 22 },
    { name: "Corn", id: 92 },
    { name: "Sunflower", id: 421 },
    { name: "Hazelnut", id: 408 },
    { name: "Purple Mushroom", id: 420 },
    { name: "Red Mushroom", id: 281 },
    { name: "Common Seeds", id: 478 },
    { name: "Log", id: 388 },
    { name: "Wood", id: 382 },
    { name: "Stone", id: 390 },
    { name: "Quartz", id: 80 },
    { name: "Flute Block", id: 9 },
    { name: "String", id: 771 },
  ];

  var selected = fallbackItems[rng.Next(fallbackItems.length)];
  return selected;
}

/**
 * Special: Golden Animal Cracker - ONLY in Golden Box with Farming Perk
 */
export function getGoldenAnimalCracker() {
  return { name: "Golden Animal Cracker", id: 923 };
}

/**
 * Get number of items in box
 * Mystery box: 1x items
 * Golden box: 2x items
 * Plus 1 special item if farming perk active
 */
export function getBoxItemCount(boxType) {
  var baseCount = boxType === "golden" || boxType === "golden-farming" ? 2 : 1;
  var specialCount = boxType === "golden-farming" ? 1 : 0;
  return baseCount + specialCount;
}
