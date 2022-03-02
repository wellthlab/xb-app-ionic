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
  IonSpinner,
} from "@ionic/react";
import {
  addCircleOutline,
  informationCircleOutline,
  arrowForwardOutline,
} from "ionicons/icons";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";
import inputFactory from "../Boxes/inputFactory";
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
  const [manualEntry, setManualEntry] = useState(false);
  const [group, setGroup] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);
  const [minutes, setMinutes] = useState(false);
  const [exResponse, setExResponse] = useState({});

  let gid = props.match.params.id;
  let day = props.match.params.day;
  let type = props.match.params.type;
  let taskType = props.match.params.task;
  let optionalOrRequired = props.match.params.req;
  let taskIdx = props.match.params.index;
  let section = props.match.params.section;

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
    res.requiredTask = optionalOrRequired === "required";
    res.type = type;
    res.intype = taskType;
    res.minutes = minutes;
    res.day = day;
    await props.controllers.ADD_RESPONSE(gid, res);
    console.log("Saved response", res);
  }

  // Merge the prevous response into the new one
  // We do this rather than overwriting, because sometimes inputFactory combines multiple widgets together and want to save the combined data
  var updateResponse = (res) => {
    var updated = {};
    for (var k of Object.keys(exResponse)) {
      updated[k] = exResponse[k];
    }
    for (var k of Object.keys(res)) {
      updated[k] = res[k];
    }
    console.log("New response", res, updated);
    // If the response contains a minutes key - i.e is setting the number of minutes for the movement
    // then update our internal minute state
    if (Object.keys(res).includes("minutes")) {
      setMinutes(res.minutes);
    }
    setExResponse(updated);
  };

  // Load team data if required; mostly useful during development
  props.controllers.LOAD_TEAMS_IF_REQD();

  if (group === false) {
    // Find the group if not set already
    for (var g of props.teams.teams) {
      // Find the group in the store
      if (g._id === gid) {
        setGroup(g);
      }
    }
    return (
      <>
        {/* <div className="center-message">Looking for your group</div> */}
        <IonSpinner name="crescent" className="center-spin" />
      </>
    );
  }

  // TODO: Looking up tasks like this won't scale; we should create a slice to
  // store the current timer state and push all the relevant state - including
  // the current task - into that
  if (currentTask === false) {
    // Find the task if not found already
    if (optionalOrRequired === "required") {
      setCurrentTask(group.experiment.tasks[day].required[section][taskIdx]);
    } else {
      setCurrentTask(group.experiment.tasks[day].optional[taskIdx]);
    }
  }
  if (typeof currentTask == "undefined" || currentTask === false) {
    return (
      <>
        <div className="center-message">
          <h3>The current task has not been defined</h3>
        </div>
      </>
    );
  }

  let totalMinutes = group.s22plan.target;

  const content = inputFactory(
    taskType,
    group,
    day,
    updateResponse,
    currentTask
  );

  var taskExtraContent;
  if (content !== false) {
    taskExtraContent = content.input;
  } else {
    taskExtraContent = "";
  }

  var ready = minutes > 0;

  // Prepare a timer, if required
  var timer = "";

  if (currentTask.timed) {
    timer = (
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
                    routerLink="/add-movement"
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
    );
  } else {
    timer = (
      <>
        {ready ? (
          <IonCard>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol style={{ textAlign: "center" }}>
                    <IonButton
                      onClick={save}
                      expand="full"
                      routerLink="/add-movement"
                    >
                      Save Activity <IonIcon icon={arrowForwardOutline} />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        ) : (
          ""
        )}
      </>
    );
  }

  return (
    <>
      <XBHeader title="Record Your Movement" />
      <IonContent style={{ "--padding-bottom": "40px" }}>
        {/* Exercise and for how long header -- press for details */}
        <IonItem
          detailIcon={informationCircleOutline}
          detail={true}
          color={"secondary"}
        >
          <IonLabel>{currentTask.desc.toUpperCase()}</IonLabel>
        </IonItem>
        {/* Additional content, like the move picker or a video */}
        {taskExtraContent}
        {/* Timer and buttons for manual entry of minutes */}
        {/* The timer is NOT SHOWN when we're doing tasks with timed === false
         */}
        {timer}
      </IonContent>
    </>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(MovementTimer));
