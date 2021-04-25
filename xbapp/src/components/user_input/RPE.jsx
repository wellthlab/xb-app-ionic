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
const RPE = (props) => {
  const [value, setValue] = useState(1);
  //comparing represents the answers to the "how do you feel compared to yesterday?". Other strings represents the general "how do you feel"
  var sliderValues = [
    "0-1: No Exertion",
    "2-3: Light Exertion",
    "4-5: Medium Exertion",
    "6-7: Moderate Exertion",
    "8-9: Hard Exertion",
    "10: Hardest Exertion",
  ];

  var sliderValuesExplanations = [
    "The only movement you're getting is pushing buttons on the TV remote.",
    "This is how you should feel when you're warming up, cooling down, and stretching.",
    "You're breathing a little faster. Your heart is pumping a little faster. You're feeling a little warmer, but you could still hold a conversation.",
    "You're breathing pretty hard now, you're probably sweating. You can talk, but it's getting tougher — you prefer to give one- to two-word answers, or when you're solidly at a seven, no talking at all.",
    "You're breathing really hard and you and you really don't want to talk at all. You're wondering how long you can go on like this, but you could go a little faster if needed.",
    "You can not keep this pace for more than a minute. Speaking is impossible. This is your limit. This is a sprint.",
  ];

  function onChangeSlider(valueToUpdate) {
    setValue(valueToUpdate);
    if (props.onChange) {
      props.onChange(
        valueToUpdate,
        sliderValues[valueToUpdate - 1],
        sliderValuesExplanations[valueToUpdate - 1]
      );
    }
  }

  return (
    <>
      <p style={{ padding: "5px 8px 5px 8px" }}>
        RPE: Rate of Perceived Exertion
      </p>

      <p style={{ padding: "5px 8px 5px 8px" }}>
        Do you feel between 4-6 during your Blocks?
      </p>
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel>{sliderValues[value - 1]}</IonLabel>
      </IonItem>
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel style={{ overflowWrap: "break-word", whiteSpace: "normal" }}>
          {sliderValuesExplanations[value - 1]}
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonRange
          min={1}
          max={6}
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

export default RPE;
