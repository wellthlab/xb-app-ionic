import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonListHeader,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { connect } from "react-redux";

import {
  add,
  addCircle,
  arrowForwardOutline,
} from "ionicons/icons";

import "./PathSelector.css";

/**
 * Props:
    day: Day number to show
    date: Date of the day being shown
    responses: Responses to render in journal
    children: Child elements; rendered in a control area. Use for buttons etc.
 *
 */
const PathSelector = ({ team, onSelect }) => {

  var path = team.s22path;

  return (
      <IonContent>

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Starting from Scratch</IonCardSubtitle>
            <IonCardTitle>Builder</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Pick this path if you're starting from scratch. The focus is on building a foundation for your movement. You can mix and match
            endurance moves with resistance, and increase from 7 minutes to day to 35 minutes per day over a period of about 10 weeks.
            <IonButton  onClick=(() => { onSelect('builder'); })>Select Builder</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>You move, but it's not a daily practice</IonCardSubtitle>
            <IonCardTitle>Explorer</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Pick this path if you already have some sort of established movement, but it isn't a formalised daily practice yet. Bring your
            practice and experiment with adding to it. If you're a lifter, incorporate some more cardio, and if you're a runner, add some
            resistance.
            <IonButton  onClick=(() => { onSelect('explorer'); })>Select Explorer</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>You have an establised movement practice</IonCardSubtitle>
            <IonCardTitle>Experimentalist</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Pick this path if you have an established heart rate elevating movement practice already — something you’ve been doing over a year –
            bring that. To keep things interesting, we have a suite of experiments you can try out to take that practice to new places – should
            you wish to explore.
            <IonButton  onClick=(() => { onSelect('experimentalist'); })>Select Experimentalist</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Exercise is a dirty word</IonCardSubtitle>
            <IonCardTitle>Flâneur du Parkour</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            If you’ve been alergic to exercise, consider the flâneur. A flâneur is an explorer, stroller, a people watcher – while constantly
            on the move, the word “exercise” does not enter the vocabulary – ambulation is a way to experience the rich variety of the world,
            not the end in itself.
            <IonButton  onClick=(() => { onSelect('flaneur'); })>Select Flâneur</IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
  );
};

export default PathSelector;
