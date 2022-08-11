/**
 * Get the ID for the current experiment, given by the name of the box it
 * belongs to.
 *
 * @param boxtype The name of the box the experiment belongs to.
 *
 * @returns {string} The ID of the experiment.
 */
function getCurrentExperimentId(boxtype) {
    switch (boxtype) {
        case "move":
            return "6202d10ccc5d2aa4b830856d";
        case "eat":
        default:
            return ""
    }
}

export { getCurrentExperimentId };