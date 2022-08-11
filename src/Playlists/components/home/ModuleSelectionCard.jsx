import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  IonThumbnail,
} from "@ionic/react";

import TopicButton from "../module/TopicButton";
import MovementModuleTopicButton from "../module/MovementModuleTopicButton";

/**
 * Display a card containing links to the available modules. It will go in
 * this order
 *  - Do Your Own Thing
 *  - Movement Snacks
 *  - Movement Playlists
 *
 *
 * @param team
 * @param userProfile
 * @param availableModules
 * @returns {JSX.Element}
 * @constructor
 */
function ModuleSelectionCard({ team, userProfile, availableModules }) {
  return (
    <IonCard>
      {/* Do your own thing */}
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

      {/* Movement Snacks, because they are different */}
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
              <TopicButton topic="snack" title="Together or Alone" />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>

      {/* Where other modules can be picked */}
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
        <MovementModuleTopicButton
          userProfile={userProfile}
          modules={availableModules}
          team={team}
        />
      </IonItem>
    </IonCard>
  );
}

export default ModuleSelectionCard;
