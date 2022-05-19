/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  settingsOutline,
  barbellOutline,
  journalOutline,
  libraryOutline,
  bodyOutline,
} from "ionicons/icons";

// Redux stuff
import { connect } from "react-redux";

// Pages
import Account from "./Account/Account";
import Feed from "./Feed/Feed";
import Teams from "./Teams/Teams";
import About from "./Info/About";
import Tutorial from "./Info/Tutorial.jsx";
import MoveTutorial from "./Info/MoveTutorial";
import Timeline from "./Info/Timeline";
import HeartRateChartPage from "./Info/HeartRateChartPage";
import ProtocolChartPage from "./Info/ProtocolChartPage";

import Register from "./Account/Register.jsx";
import Login from "./Account/Login.jsx";
import ForgotPassword from "./Account/ForgotPassword";
import ResetPassword from "./Account/ResetPassword";

import OptionTabs from "./Account/Settings";
import Notifications from "./Account/Notifications";

import GroupCharts from "./Boxes/Charts";

import JoinTeam from "./StartJourney/JoinTeam.jsx";
import CreateTeam from "./StartJourney/CreateTeam";

import EatPage from "./Boxes/Eat";
import MovePage from "./Boxes/Move";
import AddResponse from "./Boxes/AddResponse";

import MovementPicker from "./MovementPuzzlePicker/MovementPicker";

import Balance from "./UserInput/Balance";
import VAS from "./UserInput/VAS";
import WorkAssessment from "./UserInput/WorkAssessment";
import HeartRateTask from "./UserInput/HeartRateTask";
import Plank from "./UserInput/Plank";
import WallSit from "./UserInput/WallSit";
import POMS from "./UserInput/POMS";
import Scheduler from "./UserInput/Scheduler";
import Quiz from "./UserInput/Quiz";
import PushPull from "./UserInput/PushPull";

import UserProfile from "./UserProfile/SetUserProfile";
import ModuleSubscription from "./Playlists/ModulePicker";
import PlaylistPlayer from "./Playlists/PlaylistPlayer";
import HistoricPlaylistEntry from "./Playlists/PlaylistPreviousDay";
import ChangeTeam from "./StartJourney/ChangeTeam";
import PlaylistDetail from "./Playlists/ModuleDetail";
import JournalMainPage from "./Journal/Journal22";
import Library from "./Library/Library";
import AddNote from "./Journal/AddNote";
import MoveLibrary from "./Library/MoveLibrary";
import NeuroLibrary from "./Library/NeuroLibrary";
import TutorialLibrary from "./Library/TutorialLibrary";

import getXBClient from "./util_model/client";

import {
  START_LOGIN,
  ACCEPT_LOGIN,
  REJECT_LOGIN,
} from "./util_model/slices/Account";

/*************************************************************
 * CSS
 */

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Other CSS from other libs */
import "react-circular-progressbar/dist/styles.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./util_theme/variables.css";

import "./util_theme/App.css";
import PlaylistLibrary from "./Library/PlaylistLibrary";
import Home from "./Home";
import GlossaryLibrary from "./Library/GlossaryLibrary";
import PlaylistActive from "./Playlists/ActiveModules";

// autoBind, because life's TOO SHORT
const autoBindReact = require("auto-bind/react"); // Needs to go after import, because it's a const

const App = ({ account, START_LOGIN, ACCEPT_LOGIN }) => {
  let content;

  useEffect(() => {
    if (
      !account.loggedin &&
      !account.fetching &&
      window.localStorage.length !== 0
    ) {
      let user = getXBClient().getUser();
      if (user) {
        START_LOGIN({ email: false });
        ACCEPT_LOGIN({});
      }
    }
  });

  if (account.loggedin) {
    content = (
      <IonTabs>
        <IonRouterOutlet animated={true}>
          <Switch>
            <Route path="/tutorial" component={Tutorial} exact={true} />
            <Route
              path="/"
              render={() => <Redirect to="/move" />}
              exact={true}
            />
            <Route path="/feed" component={Feed} exact={true} />
            <Route path="/box/move/teams" component={Teams} exact={true} />
            <Route
              path="/notifications"
              component={Notifications}
              exact={true}
            />
            <Route path="/settings" component={OptionTabs} exact={true} />
            <Route path="/box/eat" component={EatPage} exact={true} />
            <Route path="/box/move" component={MovePage} exact={true} />
            <Route
              path="/box/move/:type/movement-picker/:exercise"
              component={MovementPicker}
              exact={true}
            />
            /** * Data entry / tasks */
            <Route
              path="/box/move/:id/:day/add/:type"
              component={AddResponse}
              exact={true}
            />
            /** * Charts */
            <Route
              path="/box/move/:id/charts"
              component={GroupCharts}
              exact={true}
            />
            /** TODO: Pass box type in the URL on these; linked from the
            relevant box page */
            <Route
              path="/start/join/:expid"
              component={JoinTeam}
              exact={true}
            />
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
            // Info page
            <Route path="/timeline" component={Timeline} exact={true} />
            <Route path="/movetutorial" component={MoveTutorial} exact={true} />
            <Route path="/about" component={About} exact={true} />
            <Route
              path="/heartratechart"
              component={HeartRateChartPage}
              exact={true}
            />
            <Route
              path="/protocolchart"
              component={ProtocolChartPage}
              exact={true}
            />
            {/**for testing purposes */}
            <Route path="/balance" component={Balance} exact={true} />
            <Route path="/vas" component={VAS} exact={true} />
            //tasks
            <Route path="/heartrate" component={HeartRateTask} exact={true} />
            <Route
              path="/work-assessment"
              component={WorkAssessment}
              exact={true}
            />
            <Route path="/quiz" component={Quiz} exact={true} />
            <Route path="/pushpull" component={PushPull} exact={true} />
            <Route path="/plank" component={Plank} exact={true} />
            <Route path="/wallsit" component={WallSit} exact={true} />
            <Route path="/poms" component={POMS} exact={true} />
            <Route path="/scheduler" component={Scheduler} exact={true} />
            {/* STUFF FOR STRENGTH 22 */}
            <Route path="/move" component={Home} exact={true} />
            {/* playing variants */}
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
            {/* library/explore variants */}
            <Route
              path="/library/playlists/player/:mode/:teamId/:moduleId/:playlistIdx/:progress/:startingTask"
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
            <Route
              path={"/library/neuro"}
              component={NeuroLibrary}
              exact={true}
            />
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

        <IonTabBar slot="bottom">
          <IonTabButton tab={"Team"} href={"/box/move"}>
            <IonIcon icon={barbellOutline} />
            <IonLabel>Team</IonLabel>
          </IonTabButton>
          <IonTabButton tab={"Journal"} href={"/journal/null/activity"}>
            <IonIcon icon={journalOutline} />
            <IonLabel>Journal</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Move" href="/move">
            <IonIcon icon={bodyOutline} />
            <IonLabel>Move</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Library" href="/library">
            <IonIcon icon={libraryOutline} />
            <IonLabel>Library</IonLabel>
          </IonTabButton>
          <IonTabButton tab={"Settings"} href={"/settings"}>
            <IonIcon icon={settingsOutline} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    );
  } else {
    content = (
      <IonRouterOutlet>
        <Switch>
          <Route path="/register" component={Register} exact={true} />
          <Route path="/tutorial" component={Tutorial} exact={true} />
          <Route path="/" component={Login} exact={true} />
          <Route path="/page" component={Tutorial} exact={true} />
          <Route
            path="/forgot-password"
            component={ForgotPassword}
            exact={true}
          />
          <Route path="/reset-password" component={ResetPassword} exact />
        </Switch>
      </IonRouterOutlet>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>{content}</IonReactRouter>
    </IonApp>
  );
};

export default connect(
  (state, ownProps) => {
    return { account: state.account };
  },
  {
    // Actions to include as props
    START_LOGIN,
    ACCEPT_LOGIN,
    pure: false,
  }
)(App);
