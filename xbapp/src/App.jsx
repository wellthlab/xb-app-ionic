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
} from "ionicons/icons";

// Redux stuff
import { connect } from "react-redux";

// Pages
import Account from "./pages/account/Account";
import Feed from "./pages/Feed";
import About from "./pages/info/About";
import Tutorial from "./pages/info/Tutorial.jsx";
import MoveTutorial from "./pages/info/MoveTutorial";
import Timeline from "./pages/info/Timeline";

import Register from "./pages/account/Register.jsx";
import Login from "./pages/account/Login.jsx";
import ForgotPassword from "./pages/account/ForgotPassword";

import OptionTabs from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Experiments from "./pages/DEPRECATEDExperiments";

import GroupCharts from "./pages/boxes/Charts";
import Day from "./pages/boxes/DEPRECATEDDay";

import JoinTeam from "./pages/startJourney/JoinTeam.jsx";
import CreateTeam from "./pages/startJourney/CreateTeam";

import EatPage from "./pages/boxes/Eat";
import MovePage from "./pages/boxes/Move";
import AddResponse from "./pages/boxes/AddResponse";

import BlockPlanner from "./pages/BlockPlanner";
import MovementPicker from "./pages/MovementPicker";

import getXBClient from "./model/client";

import {
  START_LOGIN,
  ACCEPT_LOGIN,
  REJECT_LOGIN,
} from "./model/slices/Account";

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
import "./theme/variables.css";

import "./theme/App.css";

/****************************************************************/

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
      // console.log("Using stored account", user);
      START_LOGIN({ email: false });
      ACCEPT_LOGIN({});
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
                render={() => <Redirect to="/feed" />}
                exact={true}
              />
              {/*<Route path="/group/:id/journal" component={Day} exact={true} />*/}
              {/*<Route path="/group/:id/:page" component={Group} exact={true} />*/}
              {/*<Route path="/group/:id/" component={Group} exact={true} />*/}
              <Route path="/feed" component={Feed} exact={true} />
              <Route
                path="/notifications"
                component={Notifications}
                exact={true}
              />
              <Route path="/settings" component={OptionTabs} exact={true} />
              <Route path="/box/eat" component={EatPage} exact={true} />
              <Route path="/box/move" component={MovePage} exact={true} />
              <Route
                path="/box/move/movement-picker"
                component={MovementPicker}
                exact={true}
              />
              /** * Experiment list - Deprecated */
              <Route path="/experiments" component={Experiments} exact={true} />
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
                render={() => <Redirect to="/feed" />}
                exact={true}
              />
              <Route path="/account" component={Account} exact={true} />
              <Route path="/timeline" component={Timeline} exact={true} />
              {/* <Route path="/planner" component={BlockPlanner} exact={true} /> */}
              <Route
                path="/movetutorial"
                component={MoveTutorial}
                exact={true}
              />
              <Route
                path="/forgot-password"
                component={ForgotPassword}
                exact={true}
              />
              <Route path="/about" component={About} exact={true} />
            </Switch>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab={"News & Updates"} href={"/feed"}>
              <IonIcon icon={newspaperOutline} />
              <IonLabel>{"News & Updates"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Experiments"} href={"/experiments"}>
              <IonIcon icon={cubeOutline} />
              <IonLabel>{"Experiments"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Move"} href={"/box/move"}>
              <IonIcon icon={bicycleOutline} />
              <IonLabel>{"Move"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Eat"} href={"/box/eat"}>
              <IonIcon icon={fastFoodOutline} />
              <IonLabel>{"Eat"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Info"} href={"/settings"}>
              <IonIcon icon={settingsOutline} />
              <IonLabel>{"Info"}</IonLabel>
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
