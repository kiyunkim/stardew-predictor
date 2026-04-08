/**
 * rng.js - Random number generation utilities
 * Mimics Stardew Valley's RNG implementation
 */

import { save } from "./state.js";

/**
 * Convert a BigInt to unsigned 32-bit integer
 * WARNING: This can lose precision; only use when game is typecasting
 */
export function bigIntToUnsigned32(big) {
  return big.and(0xffffffff).toJSNumber();
}

/**
 * Convert a BigInt to signed 32-bit integer
 * WARNING: This can lose precision; only use when game is typecasting
 */
export function bigIntToSigned32(big) {
  return Math.imul(1, bigIntToUnsigned32(big));
}

/**
 * BigInt wrapper for getRandomSeed to be called if the params are bigInts
 */
export function getRandomSeedFromBigInts(a, b, c, d, e) {
  for (var arg = 0; arg < arguments.length; arg++) {
    if (typeof arguments[arg] !== "undefined") {
      arguments[arg] = arguments[arg].mod(2147483647).toJSNumber();
    }
  }
  return getRandomSeed(a, b, c, d, e);
}

/**
 * Mimics RNG wrappers of Stardew 1.6
 * Calculates seed value based on logic of StardewValley.Utility.CreateRandomSeed()
 * Note: This is called directly for most predictions, not using DaySave wrapper
 */
export function getRandomSeed(a, b = 0, c = 0, d = 0, e = 0) {
  if (save.useLegacyRandom) {
    return Math.floor(
      ((a % 2147483647) +
        (b % 2147483647) +
        (c % 2147483647) +
        (d % 2147483647) +
        (e % 2147483647)) %
        2147483647,
    );
  } else {
    return getHashFromArray(
      a % 2147483647,
      b % 2147483647,
      c % 2147483647,
      d % 2147483647,
      e % 2147483647,
    );
  }
}

/**
 * JS implementation of StardewValley.Utility.GetDeterministicHashCode() with string argument
 */
export function getHashFromString(value) {
  var TE = new TextEncoder();
  var H = XXH.h32();
  return H.update(TE.encode(value).buffer).digest().toNumber();
}

/**
 * JS implementation of StardewValley.Utility.GetDeterministicHashCode() with int array argument
 */
export function getHashFromArray(...values) {
  var array = new Int32Array(values);
  var H = XXH.h32();
  return H.update(array.buffer).digest().toNumber();
}
