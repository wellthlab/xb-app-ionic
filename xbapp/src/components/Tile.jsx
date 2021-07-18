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
  IonButton,
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
        <IonCardContent className="tile-content">
          <IonCard
            color="light"
            className="bg-transparent tile-item"
            lines="none"
            color="none"
          >
            <div className="one">
              <IonImg
                src={process.env.PUBLIC_URL + "/assets/moves/" + image}
                alt="No Image"
                className="tile-image"
              ></IonImg>
              <div className="tile-description-container">
                <IonCardContent className="tile-description">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </IonCardContent>
              </div>
            </div>

            <div className="tile-button-container">
              <IonButton className="tile-button">Select</IonButton>
            </div>
          </IonCard>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default Tile;
