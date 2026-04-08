// Version Detection Module
// Handles detecting the Stardew Valley version from XML save data
// Versions support: 1.2, 1.3, 1.4, 1.5, 1.5.3, 1.6

export function detectGameVersion(xmlDoc) {
  // Try to read version from gameVersion element first (1.3+)
  let version = $(xmlDoc).find("gameVersion").first().text();

  if (version === "") {
    // Fallback for very old saves (1.2 and earlier)
    // Check for version-specific update flags
    version = "1.2";
    if ($(xmlDoc).find("hasApplied1_4_UpdateChanges").text() === "true") {
      version = "1.4";
    } else if (
      $(xmlDoc).find("hasApplied1_3_UpdateChanges").text() === "true"
    ) {
      version = "1.3";
    }
  }

  return version;
}

/**
 * Get XML namespace prefix based on save version
 * 1.3+ uses XML schema instance namespace (xsi) vs older p3
 */
export function getXmlNamespacePrefix(xmlDoc) {
  return $(xmlDoc).find("SaveGame[xmlns\\:xsi]").length > 0 ? "xsi" : "p3";
}

/**
 * Update UI title based on version features
 * 1.3 added the Night Market Boat
 */
export function updateCartTitleForVersion(version) {
  if (compareSemVer(version, "1.3") >= 0) {
    $("#cart-title").html("Traveling Merchant Cart and Night Market Boat");
  } else {
    $("#cart-title").html("Traveling Merchant Cart");
  }
}

/**
 * Check if version is >= target version using semantic versioning
 * Returns: -1 if version < target, 0 if equal, 1 if version > target
 * Imported from utils module for version comparisons
 */
// Note: compareSemVer is imported from utils module and used throughout
// Example: compareSemVer(save.version, "1.3") >= 0 means version 1.3 or later
