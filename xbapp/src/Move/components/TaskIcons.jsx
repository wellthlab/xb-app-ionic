import {
  barbellOutline,
  newspaperOutline,
  schoolOutline,
  videocamOutline,
  stopwatchOutline,
  flaskOutline,
  informationCircleOutline,
} from "ionicons/icons";

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
    default:
      return informationCircleOutline;
  }
}
