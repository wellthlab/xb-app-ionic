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
  const completedCount = getTimesCompleted(movement);

  // TODO: implement later
  function getTimesCompleted(movement) {
    const id = movement.id;
    return Math.floor(Math.random() * 999);
  }

  return (
    <div id="tile" className="centering">
      <IonCard
        onClick={() => {
          // props.updateExercise(true, movement);
        }}
        style={{
          width: width,
          height: width,
          margin: "10px",
        }}
      >
        <IonCardHeader className="tile-header">
          <div className="tile-title-container">
            <IonCardTitle className="tile-title">{name}</IonCardTitle>
            <IonCardSubtitle>Level {progressionLevel}</IonCardSubtitle>
          </div>
          <div className="completed-container">
            <p>* {completedCount}</p>
          </div>
        </IonCardHeader>
        <IonCardContent className="tile-content">
          <IonCard
            color="light"
            className="bg-transparent tile-item"
            lines="none"
            color="none"
          >
            <div
              className="card-container"
              onClick={(event) => {
                // event.nativeEvent.path[13]
                //   .getActiveIndex()
                //   .then((index) => {
                //     console.log(index);
                //   })
                //   .catch((err) => {
                //     console.log(err.message);
                //   });

                // event.nativeEvent
                //   .composedPath()[13]
                //   .getActiveIndex()
                //   .then((index) => {
                console.log("Clicked");
                props.updateExercise(true, movement);
                // props.setDisableSlides(true);
                // })
                // .catch((err) => {
                //   console.log(err.message);
                // });
              }}
            >
              <IonImg
                src={process.env.PUBLIC_URL + "/assets/moves/" + image}
                alt="No Image"
                className="tile-image"
              ></IonImg>
              <div className="tile-description-container">
                <IonCardContent className="tile-description">
                  {movement.description}
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
