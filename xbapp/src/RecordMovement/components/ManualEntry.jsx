import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addControllersProp } from "../../util_model/controllers";
import { IonButton, IonIcon, IonCol, IonInput, IonItem } from "@ionic/react";
import { saveOutline } from "ionicons/icons";

/**
 *  Manual time input for movement
 */
function ManualTime(props) {
  let [minutes, setMinutes] = useState(null);
  let [saved, setSaved] = useState(false); // todo: to show when response has been saved

  // save input and reset the input box
  async function saveMinutes() {
    console.log("saveMinutes: saving " + minutes + " minutes");
    console.log("id", props.id);
    await props.controllers.ADD_RESPONSE(props.id, [
      { type: "mins", minutes: minutes, task: props.task },
    ]);
    setMinutes(null);
  }

  return (
    <>
      <IonCol>
        <h3>Enter your MINUTES manually</h3>
        <IonItem>
          <IonInput
            value={minutes ? minutes : ""}
            placeholder={"minutes"}
            onIonChange={(e) => setMinutes(parseFloat(e.detail.value))}
            inputMode={"numeric"}
            min={"0"}
            max={"7"}
          ></IonInput>
          <IonButton onClick={saveMinutes} href={"/addmovement"}>
            <IonIcon icon={saveOutline}></IonIcon>
            &nbsp;Save
          </IonButton>
        </IonItem>
      </IonCol>
    </>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      experiment: state.experiments,
    };
  },
  {
    // actions to add or smth
  }
)(addControllersProp(ManualTime));
