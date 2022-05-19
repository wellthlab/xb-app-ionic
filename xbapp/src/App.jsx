/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonContent,
  IonSpinner,
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
import Tutorial from "./Info/Tutorial.jsx";

import Register from "./Account/Register.jsx";
import Login from "./Account/Login.jsx";
import ForgotPassword from "./Account/ForgotPassword";
import ResetPassword from "./Account/ResetPassword";

import getXBClient from "./util_model/client";

import { START_LOGIN, ACCEPT_LOGIN } from "./util_model/slices/Account";

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

import { addControllersProp } from "./util_model/controllers";
import Enroller from "./Boxes/components/Enroller";

// import MainAppRouter from "./MainAppRouter";

import { getAppOutlet } from "./MainAppRouter";

// autoBind, because life's TOO SHORT
const autoBindReact = require("auto-bind/react"); // Needs to go after import, because it's a const

const App = ({
  account,
  controllers,
  teams,
  userProfile,
  START_LOGIN,
  ACCEPT_LOGIN,
}) => {
  let content;
  const [completedEnrollment, setCompletedEnrollment] = useState(false);

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
    // Load team and user profile, as these are needed for enrollment
    controllers.LOAD_TEAMS_IF_REQD();
    controllers.SET_USER_PROFILE_IF_REQD();

    if (teams.loaded && userProfile.loaded) {
      const mainAppRouterOutlet = getAppOutlet(!!teams.teams.bybox["move"]);

      // Render enrollment if not completed -- this happens if the user does
      // not have a team set (as this is the last step in enrollment). The
      // completedEnrollment variable is simply to force a state reloaded
      if (!completedEnrollment && !teams.teams.bybox["move"]) {
        content = (
          <IonPage>
            <IonContent>
              <div
                style={{
                  padding:
                    "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
                }}
              >
                {mainAppRouterOutlet}
                <Enroller
                  boxtype="move"
                  setDoneEverything={() => {
                    setCompletedEnrollment(true);
                  }}
                />
              </div>
            </IonContent>
          </IonPage>
        );
      } else {
        // Render app tabs
        const tabBarDisplayStyle = teams.teams.bybox["move"] ? "" : "none";

        content = (
          <IonTabs>
            {mainAppRouterOutlet}
            <IonTabBar style={{ display: tabBarDisplayStyle }} slot="bottom">
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
      }
    } else {
      content = <IonSpinner className={"center-spin"} name={"crescent"} />;
    }
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
    return {
      account: state.account,
      teams: state.teams,
      userProfile: state.userProfile,
    };
  },
  {
    // Actions to include as props
    START_LOGIN,
    ACCEPT_LOGIN,
    pure: false,
  }
)(addControllersProp(App));
