/**
 * main.js - Main application entry point
 * Imports and initializes all modules
 */

// Re-export utilities for convenience
export { addCommas, capitalize, compareSemVer, wikify } from "./utils.js";

// Re-export RNG functions
export {
  bigIntToUnsigned32,
  bigIntToSigned32,
  getRandomSeedFromBigInts,
  getRandomSeed,
  getHashFromString,
  getHashFromArray,
} from "./rng.js";

// Re-export state
export { save, initializeSaveState } from "./state.js";

// Re-export handlers
export {
  buttonHandler,
  selectHandler,
  searchHandler,
  toggleVisible,
  handleFileSelect,
} from "./handlers.js";

// Re-export parsers
export { updateTab, updateOutput, parseSummary } from "./parsers.js";

/**
 * Initialize the application when the DOM is loaded
 */
export function initializeApp() {
  // Check for required File API support
  if (!(window.File && window.FileReader)) {
    document.getElementById("out-summary").innerHTML =
      '<span class="error">Fatal Error: Could not load the File & FileReader APIs</span>';
    return;
  }

  // Show input field immediately
  document.getElementById("input-container").style.display = "block";

  // Import handlers to attach event listeners
  import("./handlers.js").then((handlers) => {
    // Set up file input handler
    const fileInput = document.getElementById("file_select");
    if (fileInput) {
      fileInput.addEventListener("change", handlers.handleFileSelect, false);
    }

    // Initialize any other event handlers here
    console.log("Stardew Predictor modules loaded successfully!");
  });
}
