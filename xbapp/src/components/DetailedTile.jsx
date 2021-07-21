import React, { Component, useState } from "react";
import {
  IonSlides,
  IonSlide,
  IonContent,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonItem,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
} from "@ionic/react";
import "./DetailedTile.scss";
import { useEffect } from "react";
import { BlockIndexContext } from "../context/BlockIndexContext";
import SelectExerciseButton from "./SelectExerciseButton";

function DetailedTile(props) {
  const movement = props.movement || {};
  if (Object.keys(movement).length === 0) {
    return <p>Empty</p>;
  }
  const name = movement.name || "Exercise";
  const progressionLevel = movement.progressionLevel || 1;
  const description = movement.description || "New description";
  return (
    <div id="detailed-tile" className="centering" style={props.style}>
      <IonCard>
        <IonCardHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  props.updateExercise(false, {});
                }}
              >
                Go back
              </IonButton>
            </IonButtons>
            <IonCardTitle>{name}</IonCardTitle>
            <IonCardSubtitle>Level {progressionLevel}</IonCardSubtitle>
          </IonToolbar>
        </IonCardHeader>
        <IonCardContent>
          <IonCardContent>{description}</IonCardContent>
          <figure id="promo">
            <img src={"assets/moves/" + movement.images[0]} className="A" />
            <img src={"assets/moves/" + movement.images[1]} className="B" />
          </figure>
          <SelectExerciseButton movement={movement}></SelectExerciseButton>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default DetailedTile;
