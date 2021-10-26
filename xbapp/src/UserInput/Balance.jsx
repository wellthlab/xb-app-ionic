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
 * Pick balance
 * Props:
    onChange: a callback that's fired when the mood slider changes
 */

const BalanceImages = {
  0: "left.png",
  1: "towardsleft.png",
  2: "still.png",
  3: "towardsright.png",
  4: "right.png",
};

const BalanceRelative = {
  0: "Highly unbalanced towards left",
  1: "Unbalanced towards left",
  2: "Balanced",
  3: "Unbalanced towards right",
  4: "Highly unbalanced towards right",
};

const BalanceRelativeExplanations = {
  0: "Throughout the exercise, you were leaning highly towards left with frequent loss of ballance.",
  1: "Throughout the exercise, you were leaning towards left with slight unbalance.",
  2: "Throughout the exercise, you didn't lose balance.",
  3: "Throughout the exercise, you were leaning towards right with slight unbalance.",
  4: "Throughout the exercise, you were leaning highly towards right with frequent loss of ballance.",
};

const Balance = (props) => {
  const [value, setValue] = useState(2);
  //comparing represents the answers to the "how do you feel compared to yesterday?". Other strings represents the general "how do you feel"
  var sliderValues = [
    "Highly unbalanced towards left",
    "Unbalanced towards left",
    "Balanced",
    "Unbalanced towards right",
    "Highly unbalanced towards right",
  ];

  var sliderValuesExplanations = [
    "Throughout the exercise, you were leaning highly towards left with frequent loss of ballance.",
    "Throughout the exercise, you were leaning towards left with slight unbalance.",
    "Throughout the exercise, you didn't lose balance.",
    "Throughout the exercise, you were leaning towards right with slight unbalance.",
    "Throughout the exercise, you were leaning highly towards right with frequent loss of ballance.",
  ];

  function onChangeSlider(valueToUpdate) {
    setValue(valueToUpdate);
    if (props.onChange) {
      props.onChange(
        valueToUpdate,
        sliderValues[valueToUpdate],
        sliderValuesExplanations[valueToUpdate]
      );
    }
  }

  return (
    <>
      <p style={{ padding: "5px 8px 5px 8px" }}>
        Rate your balance throughout the exercise.
      </p>
      <div style={{margin: "auto"}}>
      <img
        style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "50px", resize: "both", textAlign: "center" }}
        src={"assets/balance/" + BalanceImages[value]}
        alt="balanced"
      />
      </div>
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel>{sliderValues[value]}</IonLabel>
      </IonItem>
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel style={{ overflowWrap: "break-word", whiteSpace: "normal" }}>
          {sliderValuesExplanations[value]}
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonRange
          min={0}
          max={4}
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

export default Balance;
export { BalanceImages, BalanceRelative, BalanceRelativeExplanations };
