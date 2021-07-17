import React, { Component, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
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

function Tile(props) {
  const letter = props.letter;
  // Default to green
  const colour = props.colour || "green";
  const exercise = props.exercise || {};
  const name = exercise.name || "Exercise";
  const progressionLevel = exercise.progressionLevel || 1;
  const image = exercise.images[0] || "";
  const width = "250px";
  console.log("Image", exercise.images);
  return (
    <div id="tile" className="centering">
      <IonCard
        style={{
          width: width,
          height: width,
          margin: "10px",
          backgroundColor: colour,
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
