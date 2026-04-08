/**
 * predictors/predictPrizeTicket.js - Prize ticket reward prediction (1.6+)
 * Logic from StardewValley.Locations.ArcadeMachine
 */

import { save } from "../state.js";
import { compareSemVer } from "../utils.js";
import { getRandomSeed } from "../rng.js";

/**
 * Get prize ticket rewards predictions
 * @param {boolean} isSearch - Whether this is a search or browse operation
 * @param {number} offset - Ticket amount for browsing
 * @returns {string} HTML output
 */
export function predictPrizeTicket(isSearch, offset) {
  var output = "",
    ticketAmount,
    rng,
    reward,
    rewardList = [],
    i;

  // Prize tickets available in 1.6+
  if (compareSemVer(save.version, "1.6") < 0) {
    output +=
      '<p style="color: red;">Prize tickets are only available in version 1.6+</p>';
    return output;
  }

  if (isSearch && typeof offset !== "undefined" && offset !== "") {
    ticketAmount = Math.max(1, parseInt(offset));
  } else {
    ticketAmount =
      typeof offset !== "undefined" && offset !== "" ? parseInt(offset) : 100;
  }

  output +=
    '<table class="rewards"><thead><tr><th colspan="3">Prize Ticket Rewards (' +
    ticketAmount +
    " tickets)</th></tr>\n";
  output +=
    "<tr><th>Prize Tier</th><th>Reward</th><th>Cost</th></tr></thead>\n<tbody>";

  // Prize tiers available
  var prizeList = [
    { name: "Wooden Flute", cost: 10, tier: "Common" },
    { name: "Door Sprite", cost: 20, tier: "Common" },
    { name: "Tree Stump", cost: 35, tier: "Uncommon" },
    { name: "Mermaid Decor", cost: 50, tier: "Uncommon" },
    { name: "Racoon Decor", cost: 75, tier: "Uncommon" },
    { name: "Combat Wand", cost: 100, tier: "Rare" },
    { name: "Sword", cost: 150, tier: "Rare" },
    { name: "Prismatic Artifact", cost: 200, tier: "Epic" },
    { name: "Legendary Reward", cost: 300, tier: "Legendary" },
  ];

  // Display available prizes with current tickets
  var remainingTickets = ticketAmount;
  for (i = 0; i < prizeList.length; i++) {
    var prize = prizeList[i];
    var canAfford = remainingTickets >= prize.cost;
    var rowClass = canAfford ? "" : 'style="color: #999;"';

    output +=
      "<tr " +
      rowClass +
      "><td>" +
      prize.tier +
      "</td><td>" +
      prize.name +
      "</td><td>" +
      prize.cost +
      " tickets";
    if (canAfford) {
      output += " (Affordable)";
      remainingTickets -= prize.cost;
    }
    output += "</td></tr>\n";
  }

  output +=
    "<tr><td colspan='3'><strong>Remaining: " +
    remainingTickets +
    " tickets</strong></td></tr>";
  output += "</tbody></table>\n";

  return output;
}
