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
} from "@ionic/react";
import "./DetailedTile.scss";
import { useEffect } from "react";

function DetailedTile(props) {
  const movement = props.movement || {};
  const name = movement.name || "Exercise";
  const progressionLevel = movement.progressionLevel || 1;
  const description = movement.description || "New description";
  return (
    <div id="detailed-tile" className="centering">
      <IonCard
        onClick={() => {
          props.updateExercise(false, {});
        }}
      >
        <IonCardHeader>
          <IonToolbar>
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
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default DetailedTile;
