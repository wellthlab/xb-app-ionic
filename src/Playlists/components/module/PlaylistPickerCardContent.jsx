import {
  IonLabel,
  IonItem,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
} from "@ionic/react";
import { playCircleOutline, refreshOutline } from "ionicons/icons";
import parse from "html-react-parser";

/**
 * A component which includes the module colour, as well as the name and
 * description of the module. Depending on the topic, the button will either
 * include a subscription toggle or a play button (for snacks) to start the
 * movement snack immediately.
 *`
 * @param team - the team object for the user
 * @param topic  - only the main topic is sent
 * @param module - the module object
 * @param userModules - the user's modules from their user profile
 * @param updatedModules - function to update the user's modules
 */
function PlaylistPickerCardContent({
  team,
  topic,
  module,
  userModules,
  updateModules,
}) {
  // first check to see if the user has played or not
  let havePlayedBefore;
  let moduleUserProgress;
  if (module._id in userModules) {
    havePlayedBefore = userModules[module._id].active;
    moduleUserProgress = userModules[module._id].stage;
  } else {
    havePlayedBefore = false;
    moduleUserProgress = 0;
  }
  const isSnack = topic.includes("snack/");

  const buttonLink =
    "/move/task-detail/play/" +
    team._id +
    "/" +
    module._id +
    "/" +
    (isSnack ? 0 : moduleUserProgress);

  const notCompleted = moduleUserProgress + 1 < module.playlists.length + 1;
  const havePlayedMsg = notCompleted ? (
    `You are on playlist ${moduleUserProgress + 1} of ${
      module.playlists.length
    }`
  ) : (
    <IonText>
      You've <strong>completed</strong> this playlist, but feel free to replay!
    </IonText>
  );
  const havePlayedButtonMsg = notCompleted ? "Start" : "Replay";

  return (
    <IonGrid>
      {/* Title and toggle button */}
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            <IonLabel className="ion-text-wrap">
              <IonRow>
                <IonText
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "bold",
                  }}
                >
                  {module.name}
                </IonText>
              </IonRow>
              {isSnack ? (
                ""
              ) : (
                <IonRow>
                  <h4>
                    {havePlayedBefore
                      ? havePlayedMsg
                      : "You are have not played this playlist yet"}
                  </h4>
                </IonRow>
              )}
            </IonLabel>
          </IonItem>
        </IonCol>
      </IonRow>
      {/* module description */}
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

      <IonRow>
        <IonCol>
          <IonButton
            expand="block"
            size="regular"
            routerLink={buttonLink}
            onClick={() => {
              localStorage.setItem(
                "active-playlist",
                isSnack ? "0" : moduleUserProgress
              );
              if (!havePlayedBefore) {
                updateModules(true, module.name, module._id, topic);
              }
            }}
          >
            <IonIcon
              slot="start"
              icon={notCompleted ? playCircleOutline : refreshOutline}
            />
            {moduleUserProgress > 0 ? havePlayedButtonMsg : "Start"}
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

export default PlaylistPickerCardContent;
