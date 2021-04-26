import React, { useState, useEffect } from "react";
import XBHeader from "../components/XBHeader";

import { connect } from "react-redux";
import MinutesChart from "../components/minutesChart";
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
import Instructions from "../components/Instructions";

import { addControllersProp } from "../model/controllers";

import DailyJournal from "../components/journal/DailyJournal";
import DailyActions from "../components/DailyActions";

import "./Group.scss";

const Group = ({ match, teams, controllers, account }) => {
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();
  function toggleAlert() {
    setShowAlert(!showAlert);
  }

  const [view, setView] = useState(match.params.page ? match.params.page : 'info');

  console.log(view, match.params);

  const [showMenu, setShowMenu] = useState(false);

  // Load team data if required; mostly useful during development
  controllers.LOAD_TEAMS_IF_REQD();

  // Wait for teams to be loaded
  if (teams.fetching) {
    return (
      <IonPage id="weekInfo">
        <XBHeader></XBHeader>
        <IonContent>
          <ion-spinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  /**
   * Look up the group
   */
  var gid = match.params.id; // Group ID comes from route
  var group = false;
  for (var g of teams.teams) {
    // Find the group in the store
    if (g._id == gid) {
      group = g;
    }
  }

  // Check the active day is set, and that group is found etc.
  if (group === false) {
    return <IonPage>Nope :(</IonPage>;
  }

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
        : day > group.experiment.info.duration
        ? "Finished"
        : "Today is day " + day;

    var members =
      group.users.length > 1 ? group.users.length + " members" : "Just You";

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
              <IonIcon icon={todayOutline} slot="start" /> {daydesc} of{" "}
              {group.experiment.info.duration}
            </IonItem>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol>
            <IonProgressBar value={day / group.experiment.info.duration} />
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
    content = <DailyActions group={group} activeDay={day} />;
  } else if (view == "journal") {
  /**
   * Journal & Charts
   */
    const list = (
      <IonList>
        <IonListHeader>Ionic</IonListHeader>
        <IonItem button>Learn Ionic</IonItem>
        <IonItem button>Documentation</IonItem>
        <IonItem button>Showcase</IonItem>
        <IonItem button>GitHub Repo</IonItem>
        <IonItem lines="none" detail={false} button onClick={false}>
          Close
        </IonItem>
      </IonList>
    );

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

            <Link to={"/group/" + group._id + "/charts"}>
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
    <IonPage id="weekInfo">
      <XBHeader title={group.name}></XBHeader>
      <IonContent>
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
      </IonContent>
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      account: state.account,
      teams: state.teams,
      boxes: state.boxes,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(Group));
