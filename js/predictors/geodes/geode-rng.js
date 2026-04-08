/**
 * predictors/geodes/geode-rng.js
 * RNG seeding and prewarm logic for geodes
 */

import { save } from "../../state.js";
import { compareSemVer } from "../../utils.js";
import { getRandomSeed, bigIntToSigned32 } from "../../rng.js";

/**
 * Initialize RNG instances for a geode
 * @param {number} geodeNum - Which geode to crack
 * @param {number} whichPlayer - Player index (for multiplayer)
 * @returns {object} {rng, rngTrove}
 */
export function initializeGeodeRNG(geodeNum, whichPlayer) {
  var rng, rngTrove;

  if (compareSemVer(save.version, "1.6") >= 0) {
    if (typeof save.mp_ids !== "undefined" && save.mp_ids.length > 0) {
      var seed = getRandomSeed(
        geodeNum,
        save.gameID / 2,
        bigIntToSigned32(save.mp_ids[whichPlayer]) / 2,
      );
      rng = new CSRandom(seed);
      rngTrove = new CSRandom(seed);
    } else {
      var seed = getRandomSeed(geodeNum, save.gameID / 2, 0);
      rng = new CSRandom(seed);
      rngTrove = new CSRandom(seed);
    }
  } else {
    rng = new CSRandom(geodeNum + save.gameID / 2);
    rngTrove = new CSRandom(geodeNum + save.gameID / 2);
  }

  return { rng: rng, rngTrove: rngTrove };
}

/**
 * Prewarm RNG instances (1.4+ feature)
 * Helps counter RNG repeating patterns
 */
export function prewarmGeodeRNG(rng, rngTrove) {
  if (compareSemVer(save.version, "1.4") < 0) {
    return;
  }

  // First warmup batch
  var prewarm_amount = rng.Next(1, 10);
  rngTrove.Next();
  for (var j = 0; j < prewarm_amount; j++) {
    rng.NextDouble();
    rngTrove.NextDouble();
  }

  // Second warmup batch
  prewarm_amount = rng.Next(1, 10);
  rngTrove.Next();
  for (var i = 0; i < prewarm_amount; i++) {
    rng.NextDouble();
    rngTrove.NextDouble();
  }
}
