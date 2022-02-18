import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonItem,
  IonLabel,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
} from "@ionic/react";
import {
  addCircleOutline,
  informationCircleOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

import inputFactory from "../Boxes/inputFactory";

// import "./MovementTimer.css";
import Timer from "../Instruments/StatelessTimer";
import TotalTimer from "./components/TotalTimer";
import ManualTime from "./components/ManualEntry";
import XBHeader from "../util/XBHeader";

/**
 * Display a timer for the current exercise.
 *
 * Saves a response to the database that combines the output of the task (if any) with
 * the number of minutes that it took
 */
function MovementTimer(props) {
  let [paused, setPaused] = useState(false);
  let [manualEntry, setManualEntry] = useState(false);

  let gid = props.match.params.id;
  let day = props.match.params.day;
  let tasktype = props.match.params.task;
  let taskindex = props.match.params.index;

  const [group, setGroup] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);

  const [minutes, setMinutes] = useState(false);
  const [exResponse, setExResponse] = useState({});

  // Load team data if required; mostly useful during development
  props.controllers.LOAD_TEAMS_IF_REQD();

  if (group === false) {
    // Find the group if not set already
    for (var g of props.teams.teams) {
      // Find the group in the store
      if (g._id == gid) {
        setGroup(g);
      }
    }

    return <>Group not found</>;
  }

  // TODO: Looking up tasks like this won't scale; we should create a slice to store the current timer state
  // and push all the relevant state - including the current task - into that
  if (currentTask === false) {
    // Find the task if not found already
    setCurrentTask(group.experiment.tasks[day].required[taskindex]);
    return <></>;
  }

  console.log("Current timer task", currentTask);

  if (typeof currentTask == "undefined") {
    return <>ERROR; task is not defined</>;
  }

  let totalMinutes = group.s22plan.target;

  // Save the response, plus the minutes from the timer, day number, and type
  async function save() {
    var res = {};

    // Add data from the task's proto response, if there is one
    for (var k of Object.keys(currentTask.protoResponse ?? {})) {
      res[k] = currentTask.protoResponse[k];
    }

    // Add data from the widgets
    for (var k of Object.keys(exResponse)) {
      res[k] = exResponse[k];
    }

    res.type = tasktype;
    res.minutes = minutes;
    res.day = day;
    await props.controllers.ADD_RESPONSE(gid, res);
  }

  var updateResponse = (res) => {
    // Merge the prevous response into the new one
    // We do this rather than overwriting, because sometimes inputFactory combines multiple widgets together and want to save the combined data
    var updated = {};

    for (var k of Object.keys(exResponse)) {
      updated[k] = exResponse[k];
    }

    for (var k of Object.keys(res)) {
      updated[k] = res[k];
    }

    setExResponse(updated);
  };

  const content = inputFactory(
    tasktype,
    group,
    day,
    updateResponse,
    currentTask
  );

  let extra;
  if (content !== false) {
    extra = content.input;
  } else {
    extra = "";
  }

  var ready = minutes > 0;

  return (
    <>
      <XBHeader title="Record Movement" />
      <IonContent style={{ "--padding-bottom": "85px" }}>
        {/* Exercise and for how long header -- press for details */}
        <IonItem
          detailIcon={informationCircleOutline}
          detail={true}
          color={"secondary"}
          // href={"/"}  // todo: link to info page about task
        >
          <IonLabel>{currentTask.desc.toUpperCase()}</IonLabel>
        </IonItem>

        {/* Additional content, like the move picker or a video */}
        {extra}

        {/* Timer and buttons for manual entry of minutes */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Time your Session</IonCardTitle>
            <IonCardSubtitle>
              Record the time you spend on this activity; it counts towards your
              daily target
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                {!manualEntry ? (
                  <IonCol>
                    {/* entry from timer */}
                    <Timer id={gid} active="false" onPause={setMinutes}></Timer>
                    <p style={{ textAlign: "center" }}>
                      Stop the timer when you're done
                    </p>
                  </IonCol>
                ) : (
                  <ManualTime
                    id={gid}
                    task={currentTask}
                    onChange={setMinutes}
                  ></ManualTime>
                )}
              </IonRow>
              <IonRow>
                <IonCol
                  style={{
                    padding: "0px",
                    textAlign: "center",
                    paddingBottom: "20px",
                  }}
                >
                  <a
                    onClick={() => {
                      setManualEntry(!manualEntry);
                    }}
                    expand="full"
                  >
                    <IonIcon icon={addCircleOutline}></IonIcon> &nbsp;
                    {manualEntry ? "Back to timer" : "Enter minutes manually"}
                  </a>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol style={{ textAlign: "center" }}>
                  {ready ? (
                    <IonButton
                      onClick={save}
                      expand="full"
                      routerLink="/addmovement"
                    >
                      Save Activity <IonIcon icon={arrowForwardOutline} />
                    </IonButton>
                  ) : (
                    ""
                  )}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <TotalTimer
                    target={group.myTargetToday}
                    logged={group.myMinutesToday + minutes}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
      experiments: state.experiments,
      boxes: state.boxes,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(MovementTimer));
