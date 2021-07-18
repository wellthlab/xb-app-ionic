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
  // const image = movement.images[0] || "";
  const description = movement.description || "New description";
  const width = "250px";
  const images = movement.images.map((image, index) => {
    return (
      <IonImg
        key={index}
        src={process.env.PUBLIC_URL + "/assets/moves/" + image}
        alt="No Image"
        className="tile-image"
      ></IonImg>
    );
  });
  console.log(images);
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
          {images}
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default DetailedTile;
