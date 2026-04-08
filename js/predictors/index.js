/**
 * predictors/index.js - Central export point for all predictor functions
 *
 * This module imports and re-exports all individual predictor functions,
 * making them available as a cohesive API
 */

// Helper functions
export {
  getRandomItemFromSeason,
  getCartItem,
  getRandomItems,
  getRandomWallFloor,
  overrideSaveData,
} from "./helpers.js";

// Individual predictor modules
export { predictTrains } from "./predictTrains.js";
export { predictNight } from "./predictNight.js";
export { predictCrane } from "./predictCrane.js";
export { predictMineChests } from "./predictMineChests.js";
export { predictEnchantments } from "./predictEnchantments.js";
export { predictResortVisitors } from "./predictResortVisitors.js";
export { predictWallpaper } from "./predictWallpaper.js";
export { predictTrash } from "./predictTrash.js";
export { predictSandy } from "./predictSandy.js";
export { predictKrobus } from "./predictKrobus.js";
export { predictMines } from "./predictMines.js";
export { predictMakeover } from "./predictMakeover.js";
export { predictCart } from "./predictCart.js";
export { predictGemBirds } from "./predictGemBirds.js";
export { predictWinterStar } from "./predictWinterStar.js";
export { predictStatues } from "./predictStatues.js";
export { predictGreenRain } from "./predictGreenRain.js";
export { predictCalicoJack } from "./predictCalicoJack.js";
export { predictBookseller } from "./predictBookseller.js";
export { predictPrizeTicket } from "./predictPrizeTicket.js";
export { predictRaccoon } from "./predictRaccoon.js";

// Modularized predictors in subfolders
export { predictGeodes } from "./geodes/index.js";
export { predictMysteryBoxes } from "./mysteryBoxes/index.js";

/**
 * Router function to dispatch predictor calls based on tab ID
 * Maps tab names to their corresponding predictor functions
 *
 * Usage: predictByTab(tabID, isSearch, offset, extra)
 * Returns: HTML output string for the tab
 */
export async function predictByTab(tabID, isSearch, offset, extra) {
  // Import functions dynamically based on tab ID
  let predictor = null;

  try {
    switch (tabID) {
      case "trains":
        const { predictTrains } = await import("./predictTrains.js");
        predictor = predictTrains;
        break;
      case "night":
        const { predictNight } = await import("./predictNight.js");
        predictor = predictNight;
        break;
      case "crane":
        const { predictCrane } = await import("./predictCrane.js");
        predictor = predictCrane;
        break;
      case "mc":
        const { predictMineChests } = await import("./predictMineChests.js");
        predictor = predictMineChests;
        break;
      case "enchant":
        const { predictEnchantments } =
          await import("./predictEnchantments.js");
        predictor = predictEnchantments;
        break;
      case "resort":
        const { predictResortVisitors } =
          await import("./predictResortVisitors.js");
        predictor = predictResortVisitors;
        break;
      case "wallpaper":
        const { predictWallpaper } = await import("./predictWallpaper.js");
        predictor = predictWallpaper;
        break;
      case "trash":
        const { predictTrash } = await import("./predictTrash.js");
        predictor = predictTrash;
        break;
      case "sandy":
        const { predictSandy } = await import("./predictSandy.js");
        predictor = predictSandy;
        break;
      case "krobus":
        const { predictKrobus } = await import("./predictKrobus.js");
        predictor = predictKrobus;
        break;
      case "mines":
        const { predictMines } = await import("./predictMines.js");
        predictor = predictMines;
        break;
      case "makeover":
        const { predictMakeover } = await import("./predictMakeover.js");
        predictor = predictMakeover;
        break;
      case "cart":
        const { predictCart } = await import("./predictCart.js");
        predictor = predictCart;
        break;
      case "gembirds":
        const { predictGemBirds } = await import("./predictGemBirds.js");
        predictor = predictGemBirds;
        break;
      case "ws":
        const { predictWinterStar } = await import("./predictWinterStar.js");
        predictor = predictWinterStar;
        break;
      case "statues":
        const { predictStatues } = await import("./predictStatues.js");
        predictor = predictStatues;
        break;
      case "gr":
        const { predictGreenRain } = await import("./predictGreenRain.js");
        predictor = predictGreenRain;
        break;
      case "cj":
        const { predictCalicoJack } = await import("./predictCalicoJack.js");
        predictor = predictCalicoJack;
        break;
      case "bookseller":
        const { predictBookseller } = await import("./predictBookseller.js");
        predictor = predictBookseller;
        break;
      case "prizeticket":
        const { predictPrizeTicket } = await import("./predictPrizeTicket.js");
        predictor = predictPrizeTicket;
        break;
      case "raccoon":
        const { predictRaccoon } = await import("./predictRaccoon.js");
        predictor = predictRaccoon;
        break;
      case "geodes":
        const { predictGeodes } = await import("./geodes/index.js");
        predictor = predictGeodes;
        break;
      case "mbox":
        const { predictMysteryBoxes } = await import("./mysteryBoxes/index.js");
        predictor = predictMysteryBoxes;
        break;
      // TODO: Add remaining cases as predictors are extracted
      default:
        console.warn(`No predictor found for tab: ${tabID}`);
        return `<p>Predictor not yet implemented for this tab.</p>`;
    }

    return predictor(isSearch, offset, extra);
  } catch (error) {
    console.error(`Error loading predictor for ${tabID}:`, error);
    return `<p>Error loading predictor: ${error.message}</p>`;
  }
}
