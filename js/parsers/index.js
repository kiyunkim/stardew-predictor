// Parsers Module Index
// Re-exports all parser submodules for convenient importing
// Organized by functionality for clarity

export {
  farmTypes,
  cartItems,
  cartItems_1_4,
  wallpaperEquiv,
  weapons,
  boots,
  geodeContents,
  objects,
} from "./game-lookup-data.js";

export {
  initializeSaveObject,
  resetArrays,
  getSeasonAndDayNames,
} from "./save-object-init.js";

export {
  detectGameVersion,
  getXmlNamespacePrefix,
  updateCartTitleForVersion,
} from "./version-detector.js";

export { parseXMLWithModules, getSaveDataSummary } from "./xml-parser.js";

// Additional parser modules (to be created next):
// export { parsePlayerData } from "./player-parser.js";
// export { parsePlayerStats } from "./stats-parser.js";
// export { parseNPCAndFeatures } from "./npc-parser.js";
// export { handleURLParameters } from "./url-parameter-handler.js";
// export { formatSummaryOutput } from "./summary-output-formatter.js";
// export { formatMultiplayerStats } from "./multi-player-stats-formatter.js";
// export { formatVersionSpecificOutput } from "./version-conditional-output.js";

/**
 * Main entry point for XML parsing
 * This orchestrates the complete save file parsing workflow
 *
 * Usage in app:
 *   import { parseXMLWithModules } from "./parsers/index.js";
 *   import { initializeSaveObject } from "./parsers/index.js";
 *
 *   const save = initializeSaveObject();
 *   parseXMLWithModules(xmlDoc, save);
 */
