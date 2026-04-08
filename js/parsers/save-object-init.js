// Save Object Initialization Module
// Provides default values for the global save object used throughout the app

export function initializeSaveObject() {
  // Reasonable defaults for when no save file is provided
  // These values are used if the app is run from gameID parameter
  return {
    version: "1.6",
    farmName: "Unknown Farm",
    niceDate: "",
    gameID: null,
    daysPlayed: 1,
    year: 1,
    geodesCracked: [0],
    mysteryBoxesOpened: [0],
    ticketPrizesClaimed: [0],
    timesEnchanted: [0],
    trashCansChecked: [0],
    deepestMineLevel: 0,
    timesFedRaccoons: 0,
    dailyLuck: -0.1,
    luckLevel: 0,
    canHaveChildren: false,
    quarryUnlocked: false,
    desertUnlocked: false,
    greenhouseUnlocked: false,
    theaterUnlocked: false,
    ccComplete: false,
    jojaComplete: false,
    hasFurnaceRecipe: false,
    hasSpecialCharm: false,
    leoMoved: false,
    hasGarbageBook: false,
    gotMysteryBook: false,
    useLegacyRandom: false,
    hardmodeMines: false,
    qiCropsActive: false,
    visitsUntilY1Guarantee: -1,
    names: [],
    gender: [],
    // Default character list used when save position data is unavailable
    // Actual ordering changes based on marriages and location changes
    characters: [
      "George",
      "Evelyn",
      "Alex",
      "Haley",
      "Emily",
      "Vincent",
      "Sam",
      "Jodi",
      "Kent",
      "Clint",
      "Lewis",
      "Pierre",
      "Abigail",
      "Caroline",
      "Gus",
      "Penny",
      "Pam",
      "Harvey",
      "Elliott",
      "Demetrius",
      "Robin",
      "Maru",
      "Sebastian",
      "Linus",
      "Wizard",
      "Jas",
      "Marnie",
      "Shane",
      "Leah",
      "Dwarf",
      "Krobus",
      "Sandy",
      "Willy",
      "Leo",
    ],
    // Items obtained from geodes that don't require museum donation
    // Used by geode cracker to determine what items to mark as donatable
    donatedItems: {
      Coal: 1,
      Clay: 1,
      Stone: 1,
      "Copper Ore": 1,
      "Iron Ore": 1,
      "Gold Ore": 1,
      "Iridium Ore": 1,
      "Golden Pumpkin": 1,
      "Treasure Chest": 1,
      Pearl: 1,
      "Banana Sapling": 1,
      "Mango Sapling": 1,
      "Pineapple Seeds": 1,
      "Taro Tuber": 1,
      "Mahogany Seed": 1,
      "Fossilized Skull": 1,
      "Treasure Appraisal Guide": 1,
    },
    // Large multiplayer saves can get out of sync between days played and current date
    // This offset is stored here and can be set via URL parameter
    dayAdjust: 0,
    // Multiplayer tracking
    mp_ids: [],
  };
}

/**
 * Reset tracking arrays for a new save file
 * Called after version and game ID are detected
 */
export function resetArrays(save) {
  save.mp_ids = [];
  save.geodesCracked = [];
  save.mysteryBoxesOpened = [];
  save.ticketPrizesClaimed = [];
  save.timesEnchanted = [];
  save.trashCansChecked = [];
  save.names = [];
  save.gender = [];
}

/**
 * Get default season and day names (same for all versions)
 */
export function getSeasonAndDayNames() {
  return {
    seasonNames: ["Spring", "Summer", "Fall", "Winter"],
    dayNames: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  };
}
