import { IonSlide, IonSlides, IonText } from "@ionic/react";
import { breakpoints } from "@material-ui/core/node_modules/@material-ui/system";
import React from "react";
import DetailedTile from "./DetailedTile";
import Moves from "./strength/moves.json";

const DetailedMovementSlide = (props) => {
  const options = {
    initialSlide: 0,
    speed: 400,
    centeredSlides: true,
    spaceBetween: 420,
    slidesPerView: 2,
    direction: "vertical",
  };
  const movements = [];

  movements.push(
    <IonSlide key="0">
      <DetailedTile
        style={{
          borderStyle: "solid",
          borderWidth: "3px",
          borderColor: "gold",
          margin: 0,
        }}
        movement={props.movement}
        updateExercise={props.updateExercise}
      ></DetailedTile>
    </IonSlide>
  );
  for (let i = 0; i < props.movement.alternative.length; ++i) {
    const movementId = props.movement.alternative[i];
    const movement = getMovementFromId(movementId);
    // Added
    if (movement !== false) {
      movements.push(
        <IonSlide key={i + 1}>
          <DetailedTile
            style={{
              margin: 0,
            }}
            movement={movement}
            updateExercise={props.updateExercise}
          ></DetailedTile>
        </IonSlide>
      );
    }
  }

  let message = "";
  if (props.movement.alternative.length !== 0) {
    message = <IonText>Swipe up and down for alternative movements</IonText>;
  }

  function getMovementFromId(id) {
    const movement = Moves.moves.find((alternative, index) => {
      return alternative.id === id;
    });
    return movement || false;
  }

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <div style={{ height: "30px" }}>{message}</div>
      <IonSlides options={options}>{movements}</IonSlides>
    </div>
  );
};

export default DetailedMovementSlide;
