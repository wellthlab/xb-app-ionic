import {
  IonPage,
  IonContent,
  IonItem,
  IonItemGroup,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonLabel,
  IonCard,
  IonCardContent,
} from "@ionic/react";
import {
  chevronBackCircleOutline,
  chevronForwardCircleOutline,
  calendarOutline,
  playOutline,
} from "ionicons/icons";

import { connect } from "react-redux";
import { addControllersProp } from "../util_model/controllers";

import XBHeader from "../util/XBHeader";
import { useState } from "react";

function PlaylistDescription({ module }) {
  return (
    <IonGrid>
      <IonItem lines="none" color="primary">
        <IonRow>
          <IonCol>
            <IonLabel>{module.name}</IonLabel>
          </IonCol>
        </IonRow>
      </IonItem>
      <IonItem lines="none">
        <IonRow>
          <IonCol>
            <IonLabel>{module.desc}</IonLabel>
          </IonCol>
        </IonRow>
      </IonItem>
    </IonGrid>
  );
}

function PlaylistTasks({ tasks }) {
  let [day, setDay] = useState(0);

  function nextDay() {
    if (day === 0) return; // TODO: remove
    setDay(day + 1);
  }
  function prevDay() {
    if (day < 1) return;
    setDay(day - 1);
  }

  const tasksForDay = tasks[day][0];

  const tasksToDisplay = tasksForDay.map((task) => {
    return <IonItem>{task.desc}</IonItem>;
  });

  return (
    <IonCard>
      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonCol>
                  <IonButton onClick={prevDay}>
                    <IonIcon icon={chevronBackCircleOutline} />
                  </IonButton>
                </IonCol>
                <IonCol>Day {day}</IonCol>
                <IonCol>
                  <IonButton onClick={nextDay}>
                    <IonIcon icon={chevronForwardCircleOutline} />
                  </IonButton>
                </IonCol>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItemGroup>{tasksToDisplay}</IonItemGroup>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </IonCard>
  );
}

function PlayButton({ teamId, moduleId }) {
  return (
    <IonCard>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton>
                <IonIcon icon={calendarOutline} />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink={"/move/timer/" + teamId + "/" + moduleId}>
                <IonIcon icon={playOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

function PlaylistDetail(props) {
  props.controllers.LOAD_MODULES_IF_REQD();

  let m_id = props.match.params.id;
  let topic = props.match.params.topic;

  if (!props.modules.modules) {
    return <></>;
  }

  console.log("props.modules.modules", props.modules.modules);
  let module = props.modules.modules.find((m) => m._id === m_id);

  let tasksForDay = module.tasks[0][0];

  console.log(tasksForDay);

  return (
    <IonPage>
      <XBHeader title="Movement Playlists" />
      <IonContent>
        <PlaylistDescription module={module} />
        <PlaylistTasks tasks={module.tasks} />
        <PlayButton teamId={props.teams.teams[0]._id} moduleId={"1"} />
      </IonContent>
    </IonPage>
  );
}

export default connect(
  (state, ownProps) => {
    return {
      modules: state.modules,
      userProfile: state.userProfile,
      teams: state.teams,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(PlaylistDetail));
