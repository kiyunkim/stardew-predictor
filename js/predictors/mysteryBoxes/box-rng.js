/**
 * predictors/mysteryBoxes/box-rng.js
 * RNG seeding and logic for mystery box predictions
 */

import { save } from "../../state.js";
import { compareSemVer } from "../../utils.js";
import { getRandomSeed, bigIntToSigned32 } from "../../rng.js";

/**
 * Initialize RNG for mystery box prediction
 * @param {number} boxNum - Which box number to predict
 * @param {number} whichPlayer - Player index
 * @returns {CSRandom} RNG instance
 */
export function initializeBoxRNG(boxNum, whichPlayer) {
  var rng;

  if (compareSemVer(save.version, "1.6") >= 0) {
    if (typeof save.mp_ids !== "undefined" && save.mp_ids.length > 0) {
      rng = new CSRandom(
        getRandomSeed(
          boxNum * 2,
          save.gameID / 2,
          bigIntToSigned32(save.mp_ids[whichPlayer]) / 2,
        ),
      );
    } else {
      rng = new CSRandom(getRandomSeed(boxNum * 2, save.gameID / 2, 0));
    }
  } else {
    rng = new CSRandom(boxNum * 2 + save.gameID / 2);
  }

  return rng;
}

/**
 * Determine box type based on golden/farming perks
 * @param {number} boxNum - Which box number
 * @param {CSRandom} rng - RNG instance for determining tier
 * @param {boolean} hasFarmingMastery - Does player have farming mastery?
 * @returns {string} 'mystery' | 'golden' | 'golden-farming'
 */
export function determineBoxType(boxNum, rng, hasFarmingMastery) {
  var typeRoll = rng.NextDouble();

  // 50% golden boxes
  if (typeRoll < 0.5) {
    // If they have farming mastery, occasionally get special golden box
    if (hasFarmingMastery && rng.NextDouble() < 0.3) {
      return "golden-farming";
    }
    return "golden";
  }

  return "mystery";
}
