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
} from "ionicons/icons";

// Redux stuff
import { connect } from "react-redux";

// Pages
import ExpList from "./pages/ExpList";
import Account from "./pages/Account";
import Feed from "./pages/Feed";
import About from "./pages/About";
import JourneyPlanner from "./pages/JourneyPlanner";
import Register from "./pages/Register.jsx";
import Tutorial from "./pages/Tutorial.jsx";
import Group from "./pages/Group.jsx";
import GroupCharts from "./pages/Charts";
import Day from "./pages/Day";
import ExperimentYourself from "./pages/ExperimentYourself.jsx";
import ExperimentInGroup from "./pages/ExperimentInGroup.jsx";
import CreateTeam from "./pages/CreateTeam";
import AddResponse from "./pages/AddResponse";
import OptionTabs from "./OptionTabs";
import Notifications from "./pages/Notifications";

// The login component
import Login from "./pages/Login.jsx";

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
              <Route
                path="/group/:id/:day/add/:type"
                component={AddResponse}
                exact={true}
              />
              <Route
                path="/group/:id/charts"
                component={GroupCharts}
                exact={true}
              />
              {/*<Route path="/group/:id/journal" component={Day} exact={true} />*/}
              <Route path="/group/:id/:page" component={Group} exact={true} />
              <Route path="/group/:id/" component={Group} exact={true} />
              <Route path="/group" component={ExpList} exact={true} />
              <Route path="/feed" component={Feed} exact={true} />
              <Route path="/account" component={Account} exact={true} />
              <Route path="/about" component={About} exact={true} />
              <Route
                path="/notifications"
                component={Notifications}
                exact={true}
              />
              <Route path="/settings" component={OptionTabs} exact={true} />
              <Route
                path="/start/yourself/:id"
                component={About}
                exact={true}
              />
              <Route
                path="/start/yourself"
                component={ExperimentYourself}
                exact={true}
              />
              <Route
                path="/start/group"
                component={ExperimentInGroup}
                exact={true}
              />
              <Route path="/start/create" component={CreateTeam} exact={true} />
              <Route path="/start" component={JourneyPlanner} exact={true} />
              <Route path="/tutorial" component={Tutorial} exact={true} />
              <Route
                path="/"
                render={() => <Redirect to="/feed" />}
                exact={true}
              />
              <Route
                path="/register"
                render={() => <Redirect to="/feed" />}
                exact={true}
              />
            </Switch>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab={"News & Updates"} href={"/feed"}>
              <IonIcon icon={newspaperOutline} />
              <IonLabel>{"News & Updates"}</IonLabel>
            </IonTabButton>

            <IonTabButton tab={"Experiments"} href={"/group"}>
              <IonIcon icon={cubeOutline} />
              <IonLabel>{"Experiments"}</IonLabel>
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
