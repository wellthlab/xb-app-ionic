/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component, useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonToolbar,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  IonAlert,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  cubeOutline,
  menu,
  newspaperOutline,
  settingsOutline,
  fastFoodOutline,
  bicycleOutline,
  trophyOutline,
  playOutline,
  barbellOutline,
  bookOutline,
} from "ionicons/icons";

// Redux stuff
import { connect } from "react-redux";

// Pages
import Account from "./Account/Account";
import Feed from "./Feed/Feed";
import Leaderboard from "./Leaderboard/Leaderboard";
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
import Experiments from "./DEPRECATED/DEPRECATEDExperiments";

import GroupCharts from "./Boxes/Charts";
import Day from "./DEPRECATED/DEPRECATEDDay";

import JoinTeam from "./StartJourney/JoinTeam.jsx";
import CreateTeam from "./StartJourney/CreateTeam";

import EatPage from "./Boxes/Eat";
import MovePage from "./Boxes/Move";
import AddResponse from "./Boxes/AddResponse";

import BlockPlanner from "./MovementPuzzlePicker/BlockPlanner";
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

import RecordMovement from "./RecordMovement/RecordMovement";
import MovementTimer from "./RecordMovement/MovementTimer";

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
import XBHeader from "./util/XBHeader";

/****************************************************************/

const LeaderboardHolder = (props) => {
  return (
    <>
      <XBHeader title="Teams Leaderboard"></XBHeader>
      <IonContent>
        Soon, we'll be able to show you which Teams are meeting their targets.
      </IonContent>
    </>
  );
};

// autoBind, because life's TOO SHORT
const autoBindReact = require("auto-bind/react"); // Needs to go after import, because it's a const

const App = ({ account, START_LOGIN, ACCEPT_LOGIN }) => {
  let content = null;

  useEffect(() => {
    if (
      !account.loggedin &&
      !account.fetching &&
      window.localStorage.length != 0
    ) {
      var user = getXBClient().getUser();
      console.log("Using stored account", user);
      if (user) {
        START_LOGIN({ email: false });
        ACCEPT_LOGIN({});
      }
    }
  });
  if (account.loggedin !== false) {
    content = (
      <>
        <IonTabs>
          <IonRouterOutlet id="appContent">
            <Switch>
              <Route path="/tutorial" component={Tutorial} exact={true} />
              <Route
                path="/"
                render={() => <Redirect to="/box/move" />}
                exact={true}
              />
              {/*<Route path="/group/:id/journal" component={Day} exact={true} />*/}
              {/*<Route path="/group/:id/:page" component={Group} exact={true} />*/}
              {/*<Route path="/group/:id/" component={Group} exact={true} />*/}
              <Route path="/feed" component={Feed} exact={true} />
              <Route
                path="/leaderboard"
                component={LeaderboardHolder}
                exact={true}
              />
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
              /** * TODO: Pass box type in the URL on these; linked from the
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
              <Route
                path="/movetutorial"
                component={MoveTutorial}
                exact={true}
              />
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
              {/** Record movement and timer for Strength 22 */}
              <Route
                path="/add-movement"
                component={RecordMovement}
                exact={true}
              />
              <Route
                path="/timer/:req/:id/:day/:task/:index"
                component={MovementTimer}
                exact={true}
              />
            </Switch>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab={"Progress"} href={"/box/move"}>
              <IonIcon icon={barbellOutline} />
              <IonLabel>{"Progress"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Teams"} href={"/leaderboard"}>
              <IonIcon icon={trophyOutline} />
              <IonLabel>{"Teams"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Move"} href={"/add-movement"}>
              <IonIcon icon={playOutline} />
              <IonLabel>{"Move"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"News"} href={"/feed"}>
              <IonIcon icon={bookOutline} />
              <IonLabel>{"Reference"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Settings"} href={"/settings"}>
              <IonIcon icon={settingsOutline} />
              <IonLabel>{"Settings"}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </>
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

  //}
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
