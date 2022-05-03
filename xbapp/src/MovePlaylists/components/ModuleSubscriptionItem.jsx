import {
  IonLabel,
  IonItem,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  IonText,
  IonIcon,
} from "@ionic/react";
import { playCircleOutline } from "ionicons/icons";
import parse from "html-react-parser";

/**
 * A component which includes the module colour, as well as the name and
 * description of the module. Depending on the topic, the button will either
 * include a subscription toggle or a play button (for snacks) to start the
 * movement snack immediately.
 *
 * @param team - the team object for the user
 * @param topic  - only the main topic is sent
 * @param module - the module object
 * @param userModules - the user's modules from their user profile
 * @param updatedModules - function to update the user's modules
 */
function ModuleSubscriptionItem({
  team,
  topic,
  module,
  userModules,
  updateModules,
  showColour = true,
}) {
  // first check to see if the user is already subscribed
  let checked;
  if (module._id in userModules) {
    checked = userModules[module._id].active;
  } else {
    checked = false;
  }

  return (
    <IonItem lines="full">
      <IonGrid>
        <IonRow>
          {showColour ? (
            <IonCol
              style={{
                "background-color": module.info.colour,
              }}
              size="1"
            ></IonCol>
          ) : (
            ""
          )}

          <IonCol>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonLabel slot="start" className="ion-text-wrap">
                    <IonText
                      style={{
                        "font-size": "1.2em",
                        "font-weight": "bold",
                      }}
                    >
                      {module.name}
                    </IonText>
                  </IonLabel>
                  {topic !== "snack" ? (
                    <IonToggle
                      slot="end"
                      checked={checked}
                      onIonChange={(e) => {
                        updateModules(
                          e.detail.checked,
                          module.name,
                          module._id,
                          topic
                        );
                      }}
                    />
                  ) : (
                    ""
                  )}
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem lines="none">
                  <IonText className="ion-text-justify">
                    {parse(module.info.desc)}
                  </IonText>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonCol>
        </IonRow>
        {topic === "snack" ? (
          <IonItem lines="none">
            {/* <IonRow> */}
            <IonCol>
              <IonButton
                expand="block"
                size="regular"
                // slot="end"
                routerLink={
                  "/move/timer/" + team._id + "/" + module._id + "/0/0"
                }
              >
                <IonIcon icon={playCircleOutline} />
              </IonButton>
            </IonCol>
            {/* </IonRow> */}
          </IonItem>
        ) : (
          ""
        )}
      </IonGrid>
    </IonItem>
  );
}

export default ModuleSubscriptionItem;
