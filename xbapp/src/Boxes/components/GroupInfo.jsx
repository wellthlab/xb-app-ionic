import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import MinutesChart from "./minutesChart";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  IonIcon,
  IonItem,
  IonChip,
  IonTitle,
  IonLabel,
  IonButton,
  IonList,
  IonListHeader,
  IonItemGroup,
  IonItemDivider,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonProgressBar,
} from "@ionic/react";
import {
  peopleOutline,
  todayOutline,
  add,
  barChart,
  checkmarkCircleOutline,
  closeCircleOutline,
  arrowForwardOutline,
  documentText,
  informationCircleOutline,
} from "ionicons/icons";
import Instructions from "./Instructions";

import { addControllersProp } from "../../util_model/controllers";

import DailyJournal from "../../Journal/DailyJournal";
import DailyActions from "./DailyActions";

import "./GroupInfo.scss";

const GroupInfo = ({ group, controllers, match }) => {
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();
  function toggleAlert() {
    setShowAlert(!showAlert);
  }

  const [view, setView] = useState(
    match.params.page ? match.params.page : "info"
  );

  console.log(view, match.params);

  const [showMenu, setShowMenu] = useState(false);

  var content = "";

  var day = group.experiment.day;

  /**
   * Experiment info
   */
  if (view == "info") {
    var daydesc =
      day == 0
        ? "Starts tomorrow"
        : day < 0
        ? "Starts in " + Math.abs(day) + " days"
        : day > 119
        ? "Finished"
        : "Today is day " + day;

    var members =
      group.users.length > 1 ? group.users.length + " members" : "Just You";

    //TODO: group.experiment.info.duration to retrieve the automatic duration of the studies
    content = (
      <IonGrid>
        <IonRow>
          <IonCol>
            <h2 slot="start">{group.experiment.title}</h2>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <IonItem lines="none">
              <Instructions
                html={group.experiment.current_stage.instructions}
              />
            </IonItem>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <IonItem lines="none">
              <IonIcon icon={todayOutline} slot="start" /> {daydesc}
              {daydesc == "Finished"
                ? " 119 days"
                : daydesc.includes("Starts")
                ? ""
                : " of 119"}
            </IonItem>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <IonProgressBar
              value={
                day > 119 ? 119 / 119 : day / group.experiment.info.duration
              }
            />
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <IonItem lines="none">
              <IonIcon icon={peopleOutline} slot="start" /> {members}
            </IonItem>
          </IonCol>
          <IonCol>
            <IonItem lines="none">
              Team Code: <strong>{group.code}</strong>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  } else if (view == "tasks") {
    /**
     * Task list
     */
    content = <DailyActions group={group} today={day} />;
  } else if (view == "journal") {
    /**
     * Journal & Charts
     */
    content = (
      <>
        <DailyJournal
          todayNumber={day}
          entries={group.entries}
          group={group}
        ></DailyJournal>
        {/*<IonFab vertical="bottom" horizontal="center" slot="fixed">
        <IonFabButton onClick={(e) => { console.log(e); }}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>*/}
      </>
    );
  } else if (view == "charts") {
    content = (
      <>
        <IonList>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel>View Data</IonLabel>
            </IonItemDivider>
            {/* <p>Charts will be available soon. Thank you for your patience.</p> */}
            <Link to={"/box/move/" + group._id + "/charts"}>
              <IonItem
                color="tertiary"
                style={{ cursor: "pointer" }}
                detail={true}
              >
                <IonIcon icon={barChart} slot="start" />
                View Charts
              </IonItem>
            </Link>
          </IonItemGroup>
        </IonList>
      </>
    );
  }

  var setSegment = (e) => {
    setView(e.detail.value);
  };

  return (
    <>
      <IonSegment onIonChange={setSegment} value={view}>
        <IonSegmentButton value="info">
          <IonIcon icon={informationCircleOutline} /> Info
        </IonSegmentButton>
        <IonSegmentButton value="tasks">
          <IonIcon icon={checkmarkCircleOutline} /> Tasks
        </IonSegmentButton>
        <IonSegmentButton value="journal">
          <IonIcon icon={documentText} /> Journal
        </IonSegmentButton>
        <IonSegmentButton value="charts">
          <IonIcon icon={barChart} /> Charts
        </IonSegmentButton>
      </IonSegment>

      {content}
    </>
  );
};

export default connect(
  (state, ownProps) => {
    return {};
  },
  {
    pure: false,
  }
)(addControllersProp(GroupInfo));
