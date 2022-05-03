import React from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
} from "@ionic/react";
import { connect } from "react-redux";

import "./PathSelector.css";
import { addControllersProp } from "../util_model/controllers";

/**
 * Props:
    day: Day number to show
    date: Date of the day being shown
    responses: Responses to render in journal
    children: Child elements; rendered in a control area. Use for buttons etc.
 *
 */
const PathSelector = ({
  controllers,
  modules,
  userProfile,
  teams,
  onSubmit,
}) => {
  controllers.LOAD_MODULES_IF_REQD();
  controllers.SET_USER_PROFILE_IF_REQD();
  controllers.LOAD_TEAMS_IF_REQD();

  // Modules and user profile loaded here (not in the controller) as this ended
  // up being a better experience for the user with feedback that something is
  // happening
  if (!modules.loaded || !userProfile.loaded || !teams.loaded) {
    return <IonSpinner name="crescent" className="center-spin" />;
  }

  const oldPath = teams.teams[0].s22path.path;

  // Save the path choice
  function onSelect(path) {
    onSubmit([
      {
        type: "s22path",
        path: path,
      },
    ]);

    // Subscribe to that path's module
    controllers.SET_MODULE_FOR_PATH(path, oldPath);
  }

  return (
    <IonContent>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Builder</IonCardTitle>
          <IonCardSubtitle>Starting from Scratch</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <div class="ion-text-justify">
                  Pick this path if you're starting from scratch. The focus is
                  on building a foundation for your movement. You can mix and
                  match endurance moves with resistance, and increase from 7
                  minutes to day to 35 minutes per day over a period of about 10
                  weeks.
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="full"
                  onClick={() => {
                    onSelect("builder");
                  }}
                >
                  Select Builder
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Explorer</IonCardTitle>
          <IonCardSubtitle>
            You move, but it's not a daily practice
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <div class="ion-text-justify">
                  Pick this path if you already have some sort of established
                  movement, but it isn't a formalised daily practice yet. Bring
                  your practice and experiment with adding to it. If you're a
                  lifter, incorporate some more cardio, and if you're a runner,
                  add some resistance.
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="full"
                  onClick={() => {
                    onSelect("explorer");
                  }}
                >
                  Select Explorer
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Experimentalist</IonCardTitle>
          <IonCardSubtitle>
            You have an established movement practice
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <div class="ion-text-justify">
                  Pick this path if you have an established heart rate elevating
                  movement practice already — something you’ve been doing over a
                  year – bring that. To keep things interesting, we have a suite
                  of experiments you can try out to take that practice to new
                  places – should you wish to explore.
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="full"
                  onClick={() => {
                    onSelect("experimentalist");
                  }}
                >
                  Select Experimentalist
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Flâneur du Parkour</IonCardTitle>
          <IonCardSubtitle>Exercise is a dirty word</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol>
                <div class="ion-text-justify">
                  If you’ve been alergic to exercise, consider the flâneur. A
                  flâneur is an explorer, stroller, a people watcher – while
                  constantly on the move, the word “exercise” does not enter the
                  vocabulary – ambulation is a way to experience the rich
                  variety of the world, not the end in itself.
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="full"
                  onClick={() => {
                    onSelect("flaneur");
                  }}
                >
                  Select Flâneur
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
    modules: state.modules,
    userProfile: state.userProfile,
  };
}, {})(addControllersProp(PathSelector));
