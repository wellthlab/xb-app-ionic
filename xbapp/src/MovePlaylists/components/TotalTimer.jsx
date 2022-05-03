import { IonProgressBar } from "@ionic/react";

/**
 * Display a progress bar to represent the current time progress
 */
function TotalTimer({ target, logged }) {
  let progress = logged / target;

  var tstr = target.toString().padStart(2, "0") + ":00";
  var lstr =
    Math.floor(logged).toString().padStart(2, "0") +
    ":" +
    Math.floor((logged * 60) % 60)
      .toString()
      .padStart(2, "0");

  return (
    <>
      <IonProgressBar value={progress}></IonProgressBar>
      <p>
        {lstr} of {tstr}
      </p>
    </>
  );
}

export default TotalTimer;
