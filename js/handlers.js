/**
 * handlers.js - Event handlers for user interactions
 */

import { save } from "./state.js";
import { updateTab, updateOutput } from "./parsers.js";

/**
 * Handle button clicks from prediction tabs
 */
export function buttonHandler(button) {
  // This assumes there is only 1 set of buttons and that the updateTab function has only 2 parameters,
  // but there are exceptions
  var field = button.id.split("-");
  var tab = field[0];
  if (tab === "cj") {
    var which = field[1];
    if (which === "d") {
      if (typeof button.value === "undefined" || button.value === "reset") {
        updateTab(tab, false);
      } else {
        updateTab(tab, false, Number(button.value));
      }
    } else {
      // Preserve current offset and change extra parameter
      var offset = Number($("#" + tab + "-d-next-day").val()) - 1;
      if (typeof button.value === "undefined" || button.value === "reset") {
        updateTab(tab, false, offset);
      } else {
        updateTab(tab, false, offset, Number(button.value));
      }
    }
  } else {
    if (typeof button.value === "undefined" || button.value === "reset") {
      updateTab(tab, false);
    } else {
      updateTab(tab, false, Number(button.value));
    }
  }
}

/**
 * Handle dropdown select changes
 */
export function selectHandler(element) {
  // Assumes there are also browse buttons which can be used to find current offset
  var field = element.id.split("-");
  var tab = field[0];
  var offset = Number($("#" + tab + "-next").val()) - 20;
  updateTab(tab, false, offset);
}

/**
 * Handle search input
 */
export function searchHandler(element) {
  var tab = element.id.split("-")[0],
    text_id = tab + "-search-text";

  updateTab(tab, true, document.getElementById(text_id).value);
}

/**
 * Toggle visibility of collapsible sections
 */
export function toggleVisible(evt) {
  var t = evt.target;
  if ($(t).next().is(":visible")) {
    $(t).next().hide();
    $(t).html("Show");
  } else {
    $(t).next().show();
    $(t).html("Hide");
  }
}

/**
 * Handle file selection and parsing
 * Reads save file, detects compression, and parses XML
 */
export function handleFileSelect(evt) {
  var file = evt.target.files[0],
    reader = new FileReader(),
    prog = document.getElementById("progress");

  // Switch version saves are compressed and wind up quite small so we do the probably dumb thing of assuming
  // compression if the read file is under 500k. We need to make this determination now because a compressed
  // file should be read as an ArrayBuffer but an uncompressed one as Text
  var saveCompressed = file.size < 512000;

  prog.value = 0;
  $("#output-container").hide();
  $("#progress-container").show();
  $("#changelog").hide();
  // There is one player-based select menu that needs to be reset if a new file is loaded.
  $("#enchant-player-select").empty();
  $("#enchant-player").hide();
  reader.onloadstart = function (e) {
    prog.value = 20;
  };
  reader.onprogress = function (e) {
    if (e.lengthComputable) {
      var p = 20 + (e.loaded / e.total) * 60;
      prog.value = p;
    }
  };
  reader.onload = function (e) {
    var xmlDoc;
    if (saveCompressed) {
      try {
        xmlDoc = $.parseXML(pako.inflate(e.target.result, { to: "string" }));
      } catch (error) {
        var message =
          "<h3>Save Parse Error</h3><p>The app was unable to process the save file. This is most likely a bug with the app, so please let the dev know about it. Details below.</p>";
        $("#parse-error").html(
          message + '<p class="code">' + error + "<br/>" + error.stack + "</p>",
        );
      }
    } else {
      try {
        xmlDoc = $.parseXML(e.target.result);
      } catch (error) {
        var message =
          "<h3>Save Parse Error</h3><p>The app was unable to process the save file. This is most likely a bug with the app, so please let the dev know about it. Details below.</p>";
        $("#parse-error").html(
          message + '<p class="code">' + error + "<br/>" + error.stack + "</p>",
        );
      }
    }
    prog.value = 90;
    updateOutput(xmlDoc);
  };
  if (saveCompressed) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}
