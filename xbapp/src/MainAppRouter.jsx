import { Switch } from "react-router";
import { Redirect, Route } from "react-router-dom";
import Login from "./Account/Login";
import Feed from "./Feed/Feed";
import Notifications from "./Account/Notifications";
import OptionTabs from "./Account/Settings";
import MovePage from "./Boxes/Move";
import MovementPicker from "./MovementPuzzlePicker/MovementPicker";
import AddResponse from "./Boxes/AddResponse";
import JoinTeam from "./StartJourney/JoinTeam";
import CreateTeam from "./StartJourney/CreateTeam";
import Account from "./Account/Account";
import ForgotPassword from "./Account/ForgotPassword";

import Home from "./Home";
import PlaylistDetail from "./Playlists/ModuleDetail";
import PlaylistActive from "./Playlists/ActiveModules";
import PlaylistPlayer from "./Playlists/PlaylistPlayer";
import ModuleSubscription from "./Playlists/ModulePicker";
import UserProfile from "./UserProfile/SetUserProfile";
import HistoricPlaylistEntry from "./Playlists/PlaylistPreviousDay";
import ChangeTeam from "./StartJourney/ChangeTeam";
import JournalMainPage from "./Journal/Journal22";
import AddNote from "./Journal/AddNote";
import Library from "./Library/Library";
import GlossaryLibrary from "./Library/GlossaryLibrary";
import MoveLibrary from "./Library/MoveLibrary";
import NeuroLibrary from "./Library/NeuroLibrary";
import TutorialLibrary from "./Library/TutorialLibrary";
import PlaylistLibrary from "./Library/PlaylistLibrary";
import { IonRouterOutlet } from "@ionic/react";
import React from "react";

/**
 *
 * @param teamsLoaded
 * @returns {JSX.Element}
 */
function getAppOutlet(teamsLoaded) {
  return (
    <IonRouterOutlet>
      <Switch>
        {teamsLoaded ? (
          <Route path="/" render={() => <Redirect to="/move" />} exact={true} />
        ) : (
          <Route path="/" component={Login} exact={true} />
        )}
        <Route path="/feed" component={Feed} exact={true} />
        <Route path="/notifications" component={Notifications} exact={true} />
        <Route path="/settings" component={OptionTabs} exact={true} />
        <Route path="/box/move" component={MovePage} exact={true} />
        <Route
          path="/box/move/:type/movement-picker/:exercise"
          component={MovementPicker}
          exact={true}
        />
        <Route
          path="/box/move/:id/:day/add/:type"
          component={AddResponse}
          exact={true}
        />
        <Route path="/start/join/:expid" component={JoinTeam} exact={true} />
        // Create a new team
        <Route
          path="/start/create/:expid"
          component={CreateTeam}
          exact={true}
        />
        <Route
          path="/register"
          render={() => <Redirect to="/box/move" />}
          exact={true}
        />
        <Route path="/account" component={Account} exact={true} />
        <Route
          path="/forgot-password"
          component={ForgotPassword}
          exact={true}
        />
        <Route path="/move" component={Home} exact={true} />
        <Route
          path="/move/task-detail/:mode/:teamId/:moduleId/:progress"
          component={PlaylistDetail}
          exact={true}
        />
        <Route
          path="/move/active-playlists"
          component={PlaylistActive}
          exact={true}
        />
        <Route
          path="/move/timer/:mode/:teamId/:moduleId/:playlistIdx/:progress/:startingTask"
          component={PlaylistPlayer}
          exact={true}
        />
        <Route
          path="/library/playlists/detail/:mode/:teamId/:moduleId/:progress"
          component={PlaylistDetail}
          exact={true}
        />
        <Route
          path={"/move/module-subscriber/:topic"}
          component={ModuleSubscription}
          exact={true}
        />
        <Route
          path="/settings/user-profile"
          component={UserProfile}
          exact={true}
        />
        <Route
          path="/move/task-player-historic/:teamId/:moduleId/:playlistIdx/:progress"
          component={HistoricPlaylistEntry}
          exact={true}
        />
        <Route
          path={"/settings/change-team"}
          component={ChangeTeam}
          exact={true}
        />
        <Route
          path={"/journal/:isoDate/:feed"}
          component={JournalMainPage}
          exact={true}
        />
        <Route
          path={"/journal/note/:teamId/:day/:isoDate/:feed"}
          component={AddNote}
          exact={true}
        />
        <Route path={"/library"} component={Library} exact={true} />
        <Route
          path={"/library/glossary"}
          component={GlossaryLibrary}
          exact={true}
        />
        <Route
          path={"/library/explorer"}
          component={MoveLibrary}
          exact={true}
        />
        <Route path={"/library/neuro"} component={NeuroLibrary} exact={true} />
        <Route
          path={"/library/tutorials"}
          component={TutorialLibrary}
          exact={true}
        />
        <Route
          path={"/library/playlists"}
          component={PlaylistLibrary}
          exact={true}
        />
      </Switch>
    </IonRouterOutlet>
  );
}

export { getAppOutlet };
