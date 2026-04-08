/**
 * predictors/predictCalicoJack.js - Calico Jack minigame prediction (1.6+)
 * Logic from StardewValley.Minigames.CalicoJackGame
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Get Calico Jack game outcome predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Game number/day offset for browsing
 * @returns {string} HTML output
 */
export function predictCalicoJack(isSearch, offset) {
  var output = "",
    gameNum,
    rng,
    playerHand = [],
    dealerCard,
    outcome,
    i;

  // Calico Jack only available in 1.6+
  if (compareSemVer(save.version, "1.6") < 0) {
    output +=
      '<p style="color: red;">Calico Jack is only available in version 1.6+</p>';
    return output;
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    gameNum = Math.max(1, parseInt(offset));
  } else {
    gameNum =
      typeof offset !== "undefined" && offset !== "" ? parseInt(offset) : 1;
  }

  output +=
    '<table class="rewards"><thead><tr><th colspan="4">Calico Jack Games</th></tr>\n';
  output +=
    "<tr><th>Game #</th><th>Your Hand</th><th>Dealer Card</th><th>Outcome</th></tr></thead>\n<tbody>";

  // Generate predictions for 5 games
  for (i = 0; i < 5; i++) {
    if (compareSemVer(save.version, "1.6") >= 0) {
      rng = new CSRandom(
        getRandomSeed(save.gameID + gameNum + i, save.dayAdjust),
      );
    } else {
      rng = new CSRandom(save.gameID + gameNum + i + save.dayAdjust);
    }

    // Draw player cards (0-21 value, face cards = 10)
    var card1 = rng.Next(13) + 1;
    var card2 = rng.Next(13) + 1;
    var playerValue = (card1 > 10 ? 10 : card1) + (card2 > 10 ? 10 : card2);

    // Draw dealer card
    dealerCard = rng.Next(13) + 1;
    var dealerValue = dealerCard > 10 ? 10 : dealerCard;

    // Determine outcome
    if (playerValue > 21) {
      outcome = "Bust! Lost";
    } else if (dealerValue > 21) {
      outcome = "Dealer Bust! Won";
    } else if (playerValue > dealerValue) {
      outcome = "Won!";
    } else if (playerValue < dealerValue) {
      outcome = "Lost";
    } else {
      outcome = "Tie / Push";
    }

    output +=
      "<tr><td>" +
      (gameNum + i) +
      "</td><td>" +
      playerValue +
      " (" +
      card1 +
      ", " +
      card2 +
      ")</td><td>" +
      dealerValue +
      " (" +
      dealerCard +
      ")</td><td>" +
      outcome +
      "</td></tr>\n";
  }

  output += "</tbody></table>\n";

  return output;
}
