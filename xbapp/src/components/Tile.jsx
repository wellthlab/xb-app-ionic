import React from "react";
import {
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
} from "@ionic/react";
import "./Tile.scss";
import SelectExerciseButton from "./SelectExerciseButton";

function Tile(props) {
  const movement = props.movement || {};
  const name = movement.name || "Exercise";
  const progressionLevel = movement.progressionLevel || 1;
  const imageName = movement?.images[0] || "";
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
                props.updateExercise(true, movement);
              }}
            >
              <IonImg
                src={process.env.PUBLIC_URL + "/assets/moves/" + imageName}
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
              <SelectExerciseButton movement={movement}></SelectExerciseButton>
            </div>
          </IonCard>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

export default Tile;
