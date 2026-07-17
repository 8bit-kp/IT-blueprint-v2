/**
 * parseControlData
 *
 * Parses the mixed control-value format used for vendor / security-control
 * fields throughout the application.
 *
 * Two formats exist in the database:
 *   Object  – { choice, vendor, businessPriority, offering }
 *   Legacy  – plain string: "Yes" | "No" | "Vendor:<name>"
 *
 * Returns a normalised object safe to use in any report or dashboard.
 */
export const parseControlData = (val) => {
    let choice = "";
    let vendor = "";
    let businessPriority = "";
    let offering = "";

    if (typeof val === "object" && val !== null) {
        choice = val.choice ?? "";
        vendor = val.vendor ?? "";
        businessPriority = val.businessPriority ?? "";
        offering = val.offering ?? "";
    } else if (typeof val === "string" && val) {
        // Legacy string support
        if (val.startsWith("Vendor:")) {
            choice = "Yes";
            vendor = val.split("Vendor:")[1];
        } else {
            choice = val;
        }
    }

    // When the user selected "Yes" and chose a vendor, show the vendor name
    // as the primary display value instead of "Yes".
    const displayValue = choice === "Yes" && vendor ? vendor : choice;

    return { displayValue, businessPriority, offering, rawChoice: choice };
};
