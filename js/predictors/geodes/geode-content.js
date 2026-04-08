/**
 * predictors/geodes/geode-content.js
 * Geode content lookup and item determination logic
 */

import { save } from "../../state.js";
import { compareSemVer } from "../../utils.js";

/**
 * Get geode content for a specific geode number and type
 * @param {CSRandom} rng - RNG instance for this geode
 * @param {CSRandom} rngTrove - Separate RNG for Artifact Trove/Golden Coconut
 * @param {number} geodeNum - Which geode number this is (for seed)
 * @param {string} geodeType - 'regular' | 'frozen' | 'magma' | 'omni' | 'trove' | 'coconut'
 * @returns {object} {names: [item1, item2...], quantities: [qty1, qty2...]}
 */
export function getGeodeContent(rng, rngTrove, geodeNum, geodeType) {
  var items = ["Stone", "Stone", "Stone", "Stone"];
  var quantities = [1, 1, 1, 1];

  // 1.6 reversed the check for ores vs minerals
  var roll = rng.NextDouble();
  var getGoodStuff =
    compareSemVer(save.version, "1.6") >= 0 ? roll < 0.5 : !(roll < 0.5);

  if (getGoodStuff) {
    // Minerals and gems (rare items)
    var next = rng.NextDouble();

    // Geode contents are indexed: 535=regular geode, 536=frozen, 537=magma, 749=omni
    var geodeIndexes = {
      regular: 535,
      frozen: 536,
      magma: 537,
      omni: 749,
    };

    var index = geodeIndexes[geodeType] || 749;
    items[0] =
      save.objects[
        save.geodeContents[index][
          Math.floor(next * save.geodeContents[index].length)
        ]
      ].name;

    // Prismatic shard check
    if (compareSemVer(save.version, "1.6") >= 0) {
      if (next < 0.008 && geodeNum > 15) {
        items[3] = save.objects["_74"].name; // Prismatic Shard
      } else {
        items[3] =
          save.objects[
            save.geodeContents[749][
              Math.floor(rng.Next(save.geodeContents[749].length))
            ]
          ].name;
      }
    } else {
      if (rng.NextDouble() < 0.008 && geodeNum > 15) {
        items[3] = save.objects["_74"].name;
      } else {
        items[3] =
          save.objects[
            save.geodeContents[749][
              Math.floor(next * save.geodeContents[749].length)
            ]
          ].name;
      }
    }
  } else {
    // Ores and common items
    var qty = rng.Next(3) * 2 + 1;
    if (rng.NextDouble() < 0.1) {
      qty = 10;
    }
    if (rng.NextDouble() < 0.01) {
      qty = 20;
    }

    if (rng.NextDouble() < 0.5) {
      // Common ores
      var c = rng.Next(4);
      if (c < 2) {
        items[0] = save.objects["_390"].name; // Stone
        quantities[0] = qty;
        items[1] = items[0];
        quantities[1] = qty;
        items[2] = items[0];
        quantities[2] = qty;
        items[3] = items[0];
        quantities[3] = qty;
      } else if (c === 2) {
        items[0] = save.objects["_330"].name; // Clay
        quantities[0] = 1;
        items[1] = items[0];
        items[2] = items[0];
        items[3] = items[0];
      } else {
        items[0] = save.objects["_86"].name; // Topaz
        quantities[0] = 1;
        items[1] = save.objects["_84"].name; // Amethyst
        items[2] = save.objects["_82"].name; // Jade
        items[3] =
          save.objects[
            "_" +
              (compareSemVer(save.version, "1.3") >= 0
                ? 82 + rng.Next(3) * 2
                : 82)
          ].name;
      }
    } else {
      // Mix by geode type
      var next = rng.NextDouble();

      // Regular geode
      var c = Math.floor(next * 3);
      if (c === 0) {
        items[0] = save.objects["_378"].name;
      } else if (c === 1) {
        items[0] =
          save.objects[save.deepestMineLevel > 25 ? "_380" : "_378"].name;
      } else {
        items[0] = save.objects["_382"].name;
      }
      quantities[0] = qty;

      // Frozen geode
      c = Math.floor(next * 4);
      if (c === 0) {
        items[1] = save.objects["_378"].name;
      } else if (c === 1) {
        items[1] = save.objects["_380"].name;
      } else if (c === 2) {
        items[1] = save.objects["_382"].name;
      } else {
        items[1] =
          save.objects[save.deepestMineLevel > 75 ? "_384" : "_380"].name;
      }
      quantities[1] = qty;

      // Magma & Omni (same roll)
      c = Math.floor(next * 5);
      if (c === 0) {
        items[2] = save.objects["_378"].name;
        items[3] = items[2];
      } else if (c === 1) {
        items[2] = save.objects["_380"].name;
        items[3] = items[2];
      } else if (c === 2) {
        items[2] = save.objects["_382"].name;
        items[3] = items[2];
      } else if (c === 3) {
        items[2] = save.objects["_384"].name;
        items[3] = items[2];
      } else {
        items[2] = save.objects["_386"].name;
        items[3] = items[2];
        quantities[2] = Math.floor(qty / 2 + 1);
        quantities[3] = quantities[2];
      }
      quantities[2] = qty;
      quantities[3] = qty;
    }
  }

  return { names: items, quantities: quantities };
}

/**
 * Get Artifact Trove content (1.4+)
 */
export function getArtifactTroveContent(rngTrove) {
  if (compareSemVer(save.version, "1.4") < 0) {
    return { name: "Stone", quantity: 1 };
  }

  var c = rngTrove.NextDouble();
  var itemID =
    save.geodeContents[275][Math.floor(c * save.geodeContents[275].length)];
  return {
    name: save.objects[itemID].name,
    quantity: 1,
  };
}

/**
 * Get Golden Coconut content (1.5+)
 */
export function getGoldenCoconutContent(rngTrove) {
  if (compareSemVer(save.version, "1.5") < 0) {
    return { name: "Stone", quantity: 1 };
  }

  var c = rngTrove.NextDouble();
  var couldBeHat = c < 0.05;
  var roll = Math.floor(c * save.geodeContents[791].length);
  var qty = roll === 2 || roll === 3 || roll === 6 ? 5 : 1;

  return {
    name: save.objects[save.geodeContents[791][roll]].name,
    quantity: qty,
  };
}

/**
 * Check for Qi Beans (1.5+)
 */
export function checkForQiBeans(rng) {
  if (compareSemVer(save.version, "1.5") < 0) {
    return false;
  }
  return rng.NextDouble() < 0.1;
}
