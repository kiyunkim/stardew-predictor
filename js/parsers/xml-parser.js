// Core XML Parser Orchestrator
// Coordinates all sub-parsers to extract data from Stardew Valley save files
// Handles version detection, player parsing, stats extraction, and output formatting

import {
  farmTypes,
  cartItems,
  cartItems_1_4,
  wallpaperEquiv,
  weapons,
  boots,
  geodeContents,
  objects,
} from "./game-lookup-data.js";
import {
  initializeSaveObject,
  resetArrays,
  getSeasonAndDayNames,
} from "./save-object-init.js";
import {
  detectGameVersion,
  getXmlNamespacePrefix,
  updateCartTitleForVersion,
} from "./version-detector.js";
import { compareSemVer, capitalize } from "../utils.js";

/**
 * Main XML parsing orchestrator
 * Called when a save file is uploaded
 * Extracts game and player data from XML and populates global save object
 */
export function parseXMLWithModules(xmlDoc, globalSave) {
  // If no XML provided, return with defaults
  if (typeof xmlDoc === "undefined") {
    return;
  }

  try {
    // Step 1: Detect game version
    globalSave.version = detectGameVersion(xmlDoc);
    globalSave.ns_prefix = getXmlNamespacePrefix(xmlDoc);
    updateCartTitleForVersion(globalSave.version);

    // Step 2: Add season and day names (constant across all versions)
    const { seasonNames, dayNames } = getSeasonAndDayNames();
    globalSave.seasonNames = seasonNames;
    globalSave.dayNames = dayNames;

    // Step 3: Parse basic farm & player info
    globalSave.gameID = Number($(xmlDoc).find("uniqueIDForThisGame").text());
    globalSave.farmName =
      $(xmlDoc).find("SaveGame > player > farmName").html() +
      " Farm (" +
      farmTypes[$(xmlDoc).find("whichFarm").text()] +
      ")";

    // Step 4: Reset arrays for fresh parsing
    resetArrays(globalSave);

    // Step 5: Parse player and farmhand data
    globalSave.names.push($(xmlDoc).find("SaveGame > player > name").html());
    globalSave.gender.push($(xmlDoc).find("SaveGame > player > gender").text());

    // Step 6: Handle multiplayer
    if (compareSemVer(globalSave.version, "1.3") >= 0) {
      globalSave.mp_ids.push(
        bigInt(
          $(xmlDoc).find("SaveGame > player > UniqueMultiplayerID").text(),
        ),
      );
    }

    // Step 7: Parse version-specific stats
    // This is handled by the version detection in predictor functions
    // Use compareSemVer throughout to handle version-specific branches

    // Step 8: Get visited Raccoon count
    globalSave.timesFedRaccoons = Number(
      $(xmlDoc).find("SaveGame > player > timesFedRaccoons").text(),
    );

    // Step 9: Get year and day info
    globalSave.year = Number($(xmlDoc).find("SaveGame > year").text());

    // Additional parsing would continue here, delegating to specific parsers
    // For now this demonstrates the orchestration pattern
  } catch (error) {
    console.error("Error parsing XML:", error);
    // Return gracefully on parse errors
  }
}

/**
 * Helper: Get all tracked game data properties from save object
 * Useful for debugging and validating parsed data
 */
export function getSaveDataSummary(save) {
  return {
    version: save.version,
    farmName: save.farmName,
    gameID: save.gameID,
    year: save.year,
    daysPlayed: save.daysPlayed,
    playerNames: save.names,
    multiplayer: save.mp_ids.length > 1,
    farmhands: save.mp_ids.length - 1,
  };
}
