import {
  IonCard,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { arrowForwardOutline, playOutline } from "ionicons/icons";

import { getActiveModules } from "../util";

/**
 * Display a card link component to take users to the active-modules page
 *
 * @param userProfile
 *
 * @returns {JSX.Element}
 */
function ActiveModulesPageLink({ userProfile }) {
  // userProfile.modules is an object with keys which are the module topics,
  // i.e. strength-training. We need to loop through each topic and get the
  // id of the modules the user is subscribed to and push this to a list of
  // all module ids
  const userModules = userProfile.modules || {};
  const activeModules = getActiveModules(userModules);

  return (
    <div>
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
    </div>
  );
}

export default ActiveModulesPageLink;
