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
    // TODO: we need to get where to save this from somewhere.. previously it was given by something in <Route>
    // let id =
    // await props.controllers.ADD_RESPONSE();
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
          ></IonInput>
          <IonButton onClick={saveMinutes}>
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
