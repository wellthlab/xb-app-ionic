import {
  IonCard,
  IonContent,
  IonPage,
  IonSpinner,
  IonItem,
  IonGrid,
  IonCol,
  IonRow,
  IonLabel,
  IonText,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { trailSignOutline } from "ionicons/icons";
import { connect } from "react-redux";
import parse from "html-react-parser";

import XBHeader from "../util/XBHeader";
import XBInfo from "../util/XBInfo";

import { addControllersProp } from "../util_model/controllers";

function PlaylistLibrary({ controllers, modules, teams, library }) {
  controllers.LOAD_TEAMS_IF_REQD();
  controllers.LOAD_MODULES_IF_REQD();

  if (!modules.loaded || !teams.loaded) {
    return (
      <IonPage>
        <XBHeader title="Playlists" />
        <IonContent>
          <IonSpinner className="center-spin" name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  const lib = library.library.find((lib) => lib.topic === "playlists");
  const team = teams.teams.bybox["move"][0];
  const orderedModules = [...modules.modules].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const moduleCards = orderedModules.map((module) => {
    return (
      <IonCard>
        <IonItem
          lines="none"
          style={{ "--ion-item-background": module.info.colour }}
        />
        <IonItem
          lines="none"
          style={{ "--padding-start": "10px", "--padding-inner-end": "10px" }}
        >
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonRow>
                  <IonCol>
                    <IonItem lines="none">
                      <IonLabel className="ion-text-wrap">
                        <IonText
                          style={{
                            "font-size": "1.2em",
                            "font-weight": "bold",
                          }}
                        >
                          {module.name}
                        </IonText>
                      </IonLabel>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonItem lines="none">
                      <IonText className="ion-text-justify">
                        {module.info.desc
                          ? parse(module.info.desc)
                          : "No description available."}
                      </IonText>
                    </IonItem>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>

            <IonItem lines="none">
              <IonCol>
                <IonButton
                  expand="block"
                  size="regular"
                  routerLink={
                    "/library/playlists/detail/explore/" +
                    team._id +
                    "/" +
                    module._id +
                    "/0"
                  }
                  onClick={() => {
                    localStorage.setItem("active-playlist", 0);
                  }}
                >
                  <IonIcon slot="start" icon={trailSignOutline} />
                  Explore
                </IonButton>
              </IonCol>
            </IonItem>
          </IonGrid>
        </IonItem>
      </IonCard>
    );
  });

  return (
    <IonPage>
      <XBHeader title="Playlists" />
      <IonContent>
        <XBInfo title="EXPLORE" desc={lib.desc} />
        {moduleCards}
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    modules: state.modules,
    teams: state.teams,
    library: state.library,
  };
}, {})(addControllersProp(PlaylistLibrary));
