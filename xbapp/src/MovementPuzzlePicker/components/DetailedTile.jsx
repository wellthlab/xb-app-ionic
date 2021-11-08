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
  IonIcon,
  IonText,
} from "@ionic/react";
import "./DetailedTile.scss";
import { useEffect } from "react";
import { BlockIndexContext } from "../context/BlockIndexContext";
import SelectExerciseButton from "./SelectExerciseButton";
import { close } from "ionicons/icons";

function DetailedTile(props) {
  console.log("CHECKER", props.isExplorer);
  const movement = props.movement || {};
  if (Object.keys(movement).length === 0) {
    return <p>Empty</p>;
  }
  const name = movement.name || "Exercise";
  const progressionLevel = movement.progressionLevel || 1;
  const description = movement.description || "New description";
  return (
    <div id="detailed-tile" className="centering" style={{ minWidth: "250px" }}>
      <IonCard style={props.style}>
        <IonCardHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  props.updateExercise(false, {});
                }}
              >
                <IonIcon icon={close}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonCardTitle>{name}</IonCardTitle>
            {/* <IonCardSubtitle>Level {progressionLevel}</IonCardSubtitle> */}
          </IonToolbar>
        </IonCardHeader>
        <IonCardContent>
          <IonText color="dark">
            <IonCardContent className="tile-description">
              {description}
            </IonCardContent>
          </IonText>
          <figure id="promo">
            <img src={"assets/moves/" + movement.images[0]} className="A" />
            <img src={"assets/moves/" + movement.images[1]} className="B" />
          </figure>
          {props.isExplorer ? (
            <></>
          ) : (
            <div className="tile-button-container">
              <SelectExerciseButton movement={movement}></SelectExerciseButton>
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default DetailedTile;
