import { useState } from "react";
import {
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonItem,
  IonRouterLink,
  IonRow,
  IonSpinner,
} from "@ionic/react";
import { connect } from "react-redux";

import TimerEDT from "./components/EDTMovementTimer";
import { getMove } from "../DEPRECATED/components/OLDMovementPicker";
import MovePicker from "./components/MovePicker";
import { addControllersProp } from "../util_model/controllers";

/**
 *  EDT task - includes the ability to change moves`
 *
 */
function EDTSet({
  task,
  team,
  userProfile,
  day,
  week,
  onSubmit,
  chosenMovements,
  controllers,
}) {
  const [showMovePicker, setShowMovePicker] = useState(false);
  const [moveA, setMoveA] = useState("");
  const [moveB, setMoveB] = useState("");

  function toggleShowMovePicker() {
    console.log("Toggling showMovePicker");
    setShowMovePicker(!showMovePicker);
  }

  controllers.GET_MOVEMENT_CHOICES_IF_REQD(task.moduleId);

  // if (!chosenMovements.loaded) {
  //   return <></>;
  // }

  const moves = chosenMovements.chosenMovements;

  // debugger;

  let content;

  if (showMovePicker) {
    content = (
      <>
        <MovePicker
          moduleId={task.moduleId}
          week={team.experiment.week}
          userProfile={userProfile}
          moveTypes={task.moveTypes}
          toggleView={toggleShowMovePicker}
        />
      </>
    );
  } else if (!chosenMovements.loaded || moves.length === 0) {
    content = (
      <>
        <IonCard>
          <IonCardContent>
            <IonGrid>
              {chosenMovements.loaded ? (
                <>
                  <IonRow>
                    <IonCol className="ion-text-center">
                      <IonText>
                        <h2>You need to select your moves</h2>
                      </IonText>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol className="ion-text-center">
                      <IonButton onClick={toggleShowMovePicker}>
                        Choose Moves
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </>
              ) : (
                <IonRow>
                  <IonCol className="ion-text-center">
                    <IonSpinner name="crescent" />
                  </IonCol>
                </IonRow>
              )}
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </>
    );
  } else {
    content = (
      <>
        <TimerEDT
          exercises={[moveA, moveB]}
          block={task.edtBlock}
          onSubmit={onSubmit}
          mins={7}
          secs={0}
        />
      </>
    );
  }

  return <>{content}</>;
}

export default connect((state, ownProps) => {
  return {
    chosenMovements: state.chosenMovements,
  };
}, {})(addControllersProp(EDTSet));
