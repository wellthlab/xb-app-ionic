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
} from "@ionic/react";
import "./Tile.scss";
import { useEffect } from "react";

function Tile(props) {
  const colour = props.colour || "green";
  const movement = props.movement || {};
  const name = movement.name || "Exercise";
  const progressionLevel = movement.progressionLevel || 1;
  const image = movement?.images[0] || "";
  const width = "250px";
  return (
    <div id="tile" className="centering">
      <IonCard
        onClick={() => {
          props.updateExercise(true, movement);
        }}
        style={{
          width: width,
          height: width,
          margin: "10px",
        }}
      >
        <IonCardHeader className="tile-header">
          <IonCardTitle className="tile-title">{name}</IonCardTitle>
          <IonCardSubtitle>Level {progressionLevel}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem
            color="light"
            className="bg-transparent tile-item"
            lines="none"
            color="none"
          >
            <IonImg
              src={process.env.PUBLIC_URL + "/assets/moves/" + image}
              alt="No Image"
              className="tile-image"
            ></IonImg>
          </IonItem>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default Tile;
