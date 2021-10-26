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

    const VASImagesdemo = {
      0: "happy.png",
      1: "happy.png",
      2: "happy.png",
      3: "happy.png",
      4: "happy.png",
      5: "happy.png",
      6: "happy.png",
      7: "happy.png",
      8: "happy.png",
      9: "happy.png",
      10: "happy.png",
    };
const VASImages = {
  0: "nopain.png",
  1: "verymild.png",
  2: "discomforting.png",
  3: "tolerable.png",
  4: "distressing.png",
  5: "verydistressing.png",
  6: "intense.png",
  7: "veryintense.png",
  8: "utterlyhorrible.png",
  9: "excruciatingunbearable.png",
  10: "unimaginableunbearable.png",
};

const VASFace = {
  0: "Pain Free",
  1: "Very Mild",
  2: "Discomforting",
  3: "Tolerable",
  4: "Distressing",
  5: "Very Distressing",
  6: "Intense",
  7: "Very Intense",
  8: "Utterly Horrible",
  9: "Excruciating Unbearable",
  10: "Unimaginable Unbearable",
};

const VASSection = {
  0: "No Pain!",
  1: "Minor Pain!",
  2: "Minor Pain!",
  3: "Minor Pain!",
  4: "Moderate Pain!",
  5: "Moderate Pain!",
  6: "Moderate Pain!",
  7: "Severe Pain!",
  8: "Severe Pain!",
  9: "Severe Pain!",
  10: "Severe Pain!",
};

const VASExplanations = {
  0: "Feeling perfectly normal.",
  1: "Nagging, annoying, but doesn't interfere with most daily activities. You are able to adapt to pain psychologically.",
  2: "Nagging, annoying, but doesn't interfere with most daily activities. You are able to adapt to pain psychologically.",
  3: "Nagging, annoying, but doesn't interfere with most daily activities. You are able to adapt to pain psychologically.",
  4: "Interferes significantly with daily living activities. Requires lifestyle changes but you remain independent. You are unable to adapt to pain.",
  5: "Interferes significantly with daily living activities. Requires lifestyle changes but you remain independent. You are unable to adapt to pain.",
  6: "Interferes significantly with daily living activities. Requires lifestyle changes but you remain independent. You are unable to adapt to pain.",
  7: "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
  8: "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
  9: "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
  10: "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
};

const Balance = (props) => {
  const [value, setValue] = useState(0);
  //comparing represents the answers to the "how do you feel compared to yesterday?". Other strings represents the general "how do you feel"
  var sliderVASFace = [
    "Pain Free",
    "Very Mild",
    "Discomforting",
    "Tolerable",
    "Distressing",
    "Very Distressing",
    "Intense",
    "Very Intense",
    "Utterly Horrible",
    "Excruciating Unbearable",
    "Unimaginable Unbearable",
  ];

  var sliderVASSection = [
    "No Pain!",
    "Minor Pain!",
    "Minor Pain!",
    "Minor Pain!",
    "Moderate Pain!",
    "Moderate Pain!",
    "Moderate Pain!",
    "Severe Pain!",
    "Severe Pain!",
    "Severe Pain!",
    "Severe Pain!",
  ];

  var sliderVASExplanations = [
    "Feeling perfectly normal.",
    "Nagging, annoying, but doesn't interfere with most daily activities. You are able to adapt to pain psychologically.",
    "Nagging, annoying, but doesn't interfere with most daily activities. You are able to adapt to pain psychologically.",
    "Nagging, annoying, but doesn't interfere with most daily activities. You are able to adapt to pain psychologically.",
    "Interferes significantly with daily living activities. Requires lifestyle changes but you remain independent. You are unable to adapt to pain.",
    "Interferes significantly with daily living activities. Requires lifestyle changes but you remain independent. You are unable to adapt to pain.",
    "Interferes significantly with daily living activities. Requires lifestyle changes but you remain independent. You are unable to adapt to pain.",
    "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
    "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
    "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
    "Disabling; unable to perform daily activities. Unable to engage in normal activities. Unable to function independently.",
  ];

  function onChangeSlider(valueToUpdate) {
    setValue(valueToUpdate);
    if (props.onChange) {
      props.onChange(
        valueToUpdate,
        sliderVASFace[valueToUpdate],
        sliderVASSection[valueToUpdate],
        sliderVASExplanations[valueToUpdate]
      );
    }
  }

  return (
    <>
      <p style={{ padding: "5px 8px 5px 8px" }}>
        Rate the state of pain you feel (DOMS).
      </p>
      <div style={{margin: "auto"}}>
      <img
        style={{ display: "block", marginLeft: "auto", marginRight: "auto", width: "50px", resize: "both", textAlign: "center" }}
        src={"assets/mood/" + VASImagesdemo[value]}
        alt="balanced"
      />
      </div>
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel>{sliderVASFace[value]}</IonLabel>
      </IonItem>
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel style={{ overflowWrap: "break-word", whiteSpace: "normal" }}>
          {sliderVASSection[value]}
        </IonLabel>
      </IonItem>
      <IonItem style={{ textAlign: "center" }}>
        <IonLabel style={{ overflowWrap: "break-word", whiteSpace: "normal" }}>
          {sliderVASExplanations[value]}
        </IonLabel>
      </IonItem>
      <IonItem>
        <IonRange
          min={0}
          max={10}
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
export { VASImages, VASFace, VASSection, VASExplanations };
