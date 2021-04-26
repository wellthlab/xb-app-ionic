import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  IonItem,
  IonListHeader,
  IonContent,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonPage,
  IonHeader,
  IonRange,
  IonItemDivider,
  IonButton,
} from "@ionic/react";

/**
 * The list of moves.
 * TODO: Make this not hard-coded!
 */

const MoodImages = {
  1: "sad.png",
  2: "somewhat_sad.png",
  3: "neutral.png",
  4: "somewhat_happy.png",
  5: "happy.png",
};

const MoodStringsRelative = {
  1: "A lot worse",
  2: "Worse",
  3: "The same",
  4: "Better",
  5: "A lot better",
};

const MoodStringsAbsolute = {
  1: "Very Bad",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Very good",
};

/**
 * Pick moood
 * Props:
    onChange: a callback that's fired when the mood slider changes
 */
const MoodPicker = (props) => {
  const [value, setValue] = useState(3);
  //comparing represents the answers to the "how do you feel compared to yesterday?". Other strings represents the general "how do you feel"
  var sliderValues =
    props.typeOfSlider == "comparing"
      ? MoodStringsRelative
      : MoodStringsAbsolute;

  function onChangeSlider(valueToUpdate) {
    setValue(valueToUpdate);
    if (props.onChange) {
      props.onChange(valueToUpdate, sliderValues[valueToUpdate]);
    }
  }

  return (
    <>
      <img
        style={{ width: "50px", resize: "both", textAlign: "center" }}
        src={"assets/mood/" + MoodImages[value]}
        alt="happy"
      />
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel>{sliderValues[value]}</IonLabel>
      </IonItem>
      <IonItem>
        <IonRange
          min={1}
          max={5}
          step={1}
          snaps={true}
          ticks={true}
          color="secondary"
          value={value}
          onIonChange={(e) => onChangeSlider(e.detail.value)}
        />
      </IonItem>
    </>
  );
};

export default MoodPicker;

export { MoodImages, MoodStringsAbsolute, MoodStringsRelative };
