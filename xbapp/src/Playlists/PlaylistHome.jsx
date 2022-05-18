import {
  IonGrid,
  IonLabel,
  IonCol,
  IonRow,
  IonItem,
  IonIcon,
  IonCard,
  IonThumbnail,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
} from "@ionic/react";
import { playOutline, arrowForwardOutline } from "ionicons/icons";

import TopicButtons from "./components/module/TopicButtons";
import XBInfo from "../util/XBInfo";
import Button from "./components/module/Button";
import { getActiveModules } from "./components/util";

/**
 * Renders a page where users can see their active playlists, and click to
 * display information about that playlist and play it. Also allows users to
 * see all possible modules, and subscribe to them.`
 *
 * @param props.controllers
 * @param props.modules
 * @param props.teams
 * @param props.userProfile
 *
 */
function PlaylistHome(props) {
  const userProfile = props.userProfile.userProfile;
  const availableModules = props.modules.modules;
  const team = props.teams.teams.bybox.move[0];

  // userProfile.modules is an object with keys which are the module topics,
  // i.e. strength-training. We need to loop through each topic and get the
  // id of the modules the user is subscribed to and push this to a list of
  // all module ids
  const userModules = userProfile.modules || {};
  const activeModules = getActiveModules(userModules);

  const teamsLink =
    "https://teams.microsoft.com/l/channel/19%3ab869ef6a42f14acd95036bd40" +
    "5f131c7%40thread.tacv2/app%2520discussion?groupId=11c4aee6-b0d1-4221" +
    "-adbe-1350280f6ef0&tenantId=4a5378f9-29f4-4d3e-be89-669d03ada9d8";

  return (
    <div>
      <XBInfo
        title={"WELCOME TO XB"}
        desc={
          <IonText>
            Welcome to the XB{" "}
            <strong>
              <u>beta</u>
            </strong>{" "}
            test app, we're glad to have you here! Please report any bugs and
            share any feedback/suggestions in the{" "}
            <a href={teamsLink}>sinwork-discussion team</a>.
          </IonText>
        }
      />

      {activeModules.length > 0 ? (
        <IonCard>
          <IonItem
            button
            lines="none"
            detail={false}
            detailIcon={playOutline}
            routerLink={"/move/active-playlists"}
          >
            <IonLabel>
              <IonCardTitle>Your Playlists</IonCardTitle>
            </IonLabel>
            <IonIcon size="large" icon={arrowForwardOutline} />
          </IonItem>
        </IonCard>
      ) : (
        ""
      )}

      {/* Do your own thing */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Ready to Move?</IonCardTitle>
          <IonCardSubtitle>
            If you have your own routine, record your minutes here
          </IonCardSubtitle>
        </IonCardHeader>
        <IonItem
          lines="none"
          style={{
            "--padding-start": "10px",
            "--padding-inner-end": "10px",
          }}
        >
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonItem
                  button
                  detail={true}
                  expand="full"
                  size="normal"
                  routerLink={
                    // router link for the "do your own thing" module
                    // is hardcoded ;-)
                    "/move/task-detail/play/" +
                    team._id +
                    "/627cfa1dc0a09e291e795788/0"
                  }
                  lines="none"
                  onClick={() => {
                    localStorage.setItem("active-playlist", "0");
                  }}
                >
                  <IonThumbnail slot="start">
                    <IonImg
                      src={
                        "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
                      }
                    />
                  </IonThumbnail>
                  <IonLabel>Do Your Own Thing</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonCard>

      {/* Movement Snacks, because they are different */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Movement Snacks</IonCardTitle>
          <IonCardSubtitle>
            Need a quick movement pick me up? Pick a snack to move with!
          </IonCardSubtitle>
        </IonCardHeader>
        <IonItem
          lines="none"
          style={{
            "--padding-start": "10px",
            "--padding-inner-end": "10px",
          }}
        >
          <IonGrid>
            <IonRow>
              <IonCol>
                <Button topic="snack" title="Together or Alone" />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      </IonCard>

      {/* Where other plans can be picked */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Movement Playlists</IonCardTitle>
          <IonCardSubtitle>
            Add some curated movement playlists to your daily movement
          </IonCardSubtitle>
        </IonCardHeader>
        <IonItem
          lines="none"
          style={{
            "--padding-start": "10px",
            "--padding-inner-end": "10px",
          }}
        >
          <TopicButtons
            userProfile={userProfile}
            modules={availableModules}
            team={team}
          />
        </IonItem>
      </IonCard>
    </div>
  );
}

export default PlaylistHome;
