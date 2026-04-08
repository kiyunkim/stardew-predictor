/**
 * parsers.js - Save file parsing and output handling
 */

import { save } from "./state.js";
import { compareSemVer, wikify, addCommas } from "./utils.js";

/**
 * Update the UI with parsed save data
 * Calls parseSummary to process the XML and generate the summary output
 */
export function updateOutput(xmlDoc) {
  try {
    document.getElementById("out-summary").innerHTML = parseSummary(xmlDoc);
    $("input[name='tabset']").each(function () {
      updateTab(this.id.split("-")[1], false);
    });
    document.getElementById("progress").value = 100;
    $("#progress-container").hide();
    $("#output-container").show();
  } catch (error) {
    var message =
      "<h3>Save Parse Error</h3><p>The app was unable to process the save file. This is most likely a bug with the app, so please let the dev know about it. Details below.</p>";
    $("#parse-error").html(
      message + '<p class="code">' + error + "<br/>" + error.stack + "</p>",
    );
  }
  return;
}

/**
 * Parse the save file XML and extract game data
 * This function populates the global save object with farm information
 * NOTE: This is a placeholder - the full implementation should be extracted from stardew-predictor.js
 */
export function parseSummary(xmlDoc) {
  // TODO: Extract full parseSummary implementation from stardew-predictor.js
  var output = "";

  // Initialize save state with required properties
  save.seasonNames = ["Spring", "Summer", "Fall", "Winter"];
  save.dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Parse summary output goes here
  output = "<p>Save file parsed successfully!</p>";

  return output;
}

/**
 * Update a specific tab with prediction results
 * This will be connected to the predictor functions
 * NOTE: This is a placeholder - needs to be fully implemented
 */
export function updateTab(tabID, isSearch, offset, extra) {
  // TODO: Import and call appropriate predictor function based on tabID
  console.log("updateTab called for:", tabID, "isSearch:", isSearch);
}
