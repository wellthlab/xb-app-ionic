import React from "react";
import {
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonText,
  IonIcon,
} from "@ionic/react";
import "./Tile.scss";
import SelectExerciseButton from "./SelectExerciseButton";
import { star } from "ionicons/icons";

function Tile(props) {
  const movement = props.movement || {};
  const name = movement.name || "Exercise";
  const progressionLevel = movement.progressionLevel || 1;
  const width = "250px";
  const completedCount = getTimesCompleted(movement);
  const alternativeExists = movement.alternative.length !== 0;
  let border;
  if (alternativeExists) {
    border = "gold 2px solid";
  } else {
    border = "black 2px solid";
  }
  // TODO: implement later
  function getTimesCompleted(movement) {
    const id = movement.id;
    return ""; // Math.floor(Math.random() * 999);
  }

  return (
    <div id="tile" className="centering">
      <IonCard
        style={{
          width: width,
          height: width,
          margin: "10px",
          border: border,
          borderRadius: "8px",
        }}
      >
        <IonCardHeader className="tile-header">
          <div className="tile-title-container">
            <IonCardTitle className="tile-title">{name}</IonCardTitle>
            <IonCardSubtitle>Level {progressionLevel}</IonCardSubtitle>
          </div>
          <div className="completed-container">
            <IonIcon
              icon={star}
              style={{
                marginBottom: "2px",
                height: "19px",
              }}
            ></IonIcon>
            <p style={{ height: "19px", marginLeft: "5px" }}>
              {String(getTimesCompleted(movement))}
            </p>
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
                props.updateExercise(true, movement);
              }}
            >
              <figure id="tile-image" className="tile-image">
                <img
                  src={"assets/moves/" + movement.images[0]}
                  className="A slide-img"
                />
                <img
                  src={"assets/moves/" + movement.images[1]}
                  className="B slide-img"
                />
              </figure>
              <div className="tile-description-container">
                <IonText color="dark">
                  <IonCardContent
                    className="tile-description"
                    id="small-tile-description"
                  >
                    {movement.description}
                  </IonCardContent>
                </IonText>
              </div>
            </div>
            {props.isExplorer ? (
              <></>
            ) : (
              <div className="tile-button-container">
                <SelectExerciseButton
                  movement={movement}
                  setContent={props.setContent}
                  typeOfExercise={props.typeOfExercise}
                  updateExercises={props.updateExercises}
                ></SelectExerciseButton>
              </div>
            )}
          </IonCard>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default Tile;
