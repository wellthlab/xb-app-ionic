import {
  barbellOutline,
  newspaperOutline,
  schoolOutline,
  videocamOutline,
  stopwatchOutline,
  flaskOutline,
  informationCircleOutline,
  trailSignOutline,
  journalOutline,
} from "ionicons/icons";

/**
 *
 * @param verb
 * @returns {string}
 */
export default function getTaskIcon(verb) {
  switch (verb) {
    case "LEARN":
      return schoolOutline;
    case "MOVE":
      return barbellOutline;
    case "ANSWER":
      return newspaperOutline;
    case "WATCH":
      return videocamOutline;
    case "MEASURE":
      return stopwatchOutline;
    case "EXPERIMENT":
      return flaskOutline;
    case "FOLLOW":
      return trailSignOutline;
    case "JOURNAL":
      return journalOutline;
    default:
      return informationCircleOutline;
  }
}
