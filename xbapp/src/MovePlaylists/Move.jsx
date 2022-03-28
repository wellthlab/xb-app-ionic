import {
  IonContent,
  IonLabel,
  IonItem,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner,
  useIonAlert,
  IonThumbnail,
} from "@ionic/react";
import {
  mailOutline,
  journalOutline,
  bodyOutline,
  libraryOutline,
} from "ionicons/icons";
import { connect } from "react-redux";

import "./Move.css";
import XBHeader from "../util/XBHeader";
import Enroller from "../Boxes/components/Enroller";
import UserProfile from "../UserProfile/UserProfile";
import { addControllersProp } from "../util_model/controllers";

function MovementWelcome({ controllers, teams, userProfile, modules }) {
  const [notImplementedAlert] = useIonAlert();
  const notImplementedClick = () => {
    notImplementedAlert("This isn't ready just yet!", [{ text: "Close" }]);
  };

  // Preload all this useful data as it's going to be needed for all the other
  // views.

  controllers.LOAD_TEAMS_IF_REQD();
  controllers.SET_USER_PROFILE_IF_REQD();
  controllers.LOAD_MODULES_IF_REQD();

  if (!teams.loaded || !userProfile.loaded || !modules.loaded) {
    return <IonSpinner className="center-spin" name="crescent" />;
  }

  let content;

  if (!teams.teams.bybox["move"]) {
    content = <Enroller boxtype="move" />;
  } else if (!userProfile.userProfile) {
    content = <UserProfile pageType="move" />;
  } else {
    content = (
      <IonItem className="vcs" lines="none">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem
                button
                className="ion-text-center"
                routerLink="/move/task-playlist"
                routerDirection="forward"
              >
                <IonLabel>Move</IonLabel>
                <IonIcon icon={bodyOutline} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem
                button
                className="ion-text-center"
                onClick={notImplementedClick}
              >
                <IonLabel>Journal</IonLabel>
                <IonIcon icon={journalOutline} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem
                button
                className="ion-text-center"
                onClick={notImplementedClick}
              >
                <IonLabel>Invitations</IonLabel>
                <IonIcon icon={mailOutline} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem
                button
                className="ion-text-center"
                onClick={notImplementedClick}
              >
                <IonLabel>Library</IonLabel>
                <IonIcon icon={libraryOutline} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    );
  }

  return (
    <IonPage>
      <XBHeader title={"Move"} />
      <IonContent>{content}</IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
    userProfile: state.userProfile,
    modules: state.modules,
  };
}, {})(addControllersProp(MovementWelcome));
