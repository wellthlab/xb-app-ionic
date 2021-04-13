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

/**
 * Pick moood
 * Props:
    onChange: a callback that's fired when the mood slider changes
 */
const MoodPicker = (props) => {
  const [value, setValue] = useState(3);

  function onChangeSlider(valueToUpdate) {
    setValue(valueToUpdate);
    if (props.onChange) {
      props.onChange(valueToUpdate);
    }
  }

  return (
    <>
      <img
        style={{ width: "50px", resize: "both", textAlign: "center" }}
        src={
          value == 1
            ? "assets/mood/sad.png"
            : value == 2
            ? "assets/mood/somewhat_sad.png"
            : value == 3
            ? "assets/mood/neutral.png"
            : value == 4
            ? "assets/mood/somewhat_happy.png"
            : "assets/mood/happy.png"
        }
        alt="happy"
      />
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel>
          {value == 1
            ? "A lot worse"
            : value == 2
            ? "Worse"
            : value == 3
            ? "The Same"
            : value == 4
            ? "Better"
            : "A lot better"}
        </IonLabel>
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
