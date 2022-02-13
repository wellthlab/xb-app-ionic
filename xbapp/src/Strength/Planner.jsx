import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import {
  IonContent,
  IonButton,
  IonList,
  IonListHeader,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonText
} from "@ionic/react";
import { connect } from "react-redux";

import {
  add,
  addCircle,
  arrowForwardOutline,
} from "ionicons/icons";

/**
 * Props:
    onSubmit - a callback for when the plan is submitted
 *
 */
const Planner = ({ onSubmit, group }) => {

  // TODO: Find the current path from somewhere
  //var path = team.s22path;

  function confirm() {

    const plan = {};

    // TODO: Generate the plan
    plan.effectiveWeek = 1; // Everyone is in week 1 to begin with!
    plan.target = parseInt(target);

    onSubmit([{
      type: 's22plan',
      plan: plan
    }]);
  }

  var path = group.s22path.path;

  const [target, setTarget] = useState(false);

  var complete = true && target !== false;

  return (
    <>
      <IonList>
        <IonListHeader>
        <IonLabel>Week 1 Plan</IonLabel>
        </IonListHeader>

        <IonItem>
          <IonText>
          This week, you just need to pick a daily target. For <strong>{path}s</strong>, we suggest 7 minutes, but you could increase it if you're feeling confident.
          </IonText>
        </IonItem>

        <IonItem>
          <IonLabel>Daily Target</IonLabel>
          <IonSelect onIonChange={(e) => {
            setTarget(e.detail.value);
          }}>
            <IonSelectOption>7 minutes</IonSelectOption>
            <IonSelectOption>14 minutes</IonSelectOption>
            <IonSelectOption>21 minutes</IonSelectOption>
            <IonSelectOption>28 minutes</IonSelectOption>
            <IonSelectOption>35 minutes</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
      { complete ? <IonButton onClick={confirm}>Save Plan</IonButton> : ""}
      </>
  );
};

export default Planner;
