import { IonText } from "@ionic/react";

import XBInfo from "../util/XBInfo";
import ActiveModulesPageLink from "./components/home/YourPlaylistsCard";
import ModuleSelectionCard from "./components/home/ModuleSelectionCard";

const teamsLink =
  "https://teams.microsoft.com/l/channel/19%3ab869ef6a42f14acd95036bd40" +
  "5f131c7%40thread.tacv2/app%2520discussion?groupId=11c4aee6-b0d1-4221" +
  "-adbe-1350280f6ef0&tenantId=4a5378f9-29f4-4d3e-be89-669d03ada9d8";

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
function ModuleHome(props) {
  const userProfile = props.userProfile.userProfile;
  const availableModules = props.modules.modules;
  const team = props.teams.teams.bybox.move[0];

  // Returned as a component style, as this is used in Home.jsx to fit in with
  // setting up a team and userprofile for the first time on the correct page
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
            app, we're glad you're here! Please report any bugs and share any
            feedback/suggestions in the{" "}
            <a href={teamsLink}>sinwork-discussion team</a>.
          </IonText>
        }
      />
      <ActiveModulesPageLink userProfile={userProfile} />
      <ModuleSelectionCard
        team={team}
        userProfile={userProfile}
        availableModules={availableModules}
      />
    </div>
  );
}

export default ModuleHome;
