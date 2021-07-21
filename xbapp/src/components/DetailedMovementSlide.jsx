import { IonSlide, IonSlides, IonText } from "@ionic/react";
import { breakpoints } from "@material-ui/core/node_modules/@material-ui/system";
import React from "react";
import DetailedTile from "./DetailedTile";
import Moves from "./strength/moves.json";

const DetailedMovementSlide = (props) => {
  const movements = [];

  movements.push(
    <IonSlide key="0">
      <DetailedTile
        style={{
          borderStyle: "solid",
          borderWidth: "5px",
          borderColor: "gold",
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
            movement={movement}
            updateExercise={props.updateExercise}
          ></DetailedTile>
        </IonSlide>
      );
    }
  }

  function getMovementFromId(id) {
    const movement = Moves.moves.find((alternative, index) => {
      return alternative.id === id;
    });
    return movement || false;
  }

  return (
    <div>
      <IonSlides
        options={{
          slidesPerView: 2,
          centeredSlides: true,
          spaceBetween: 150,
        }}
      >
        {movements}
      </IonSlides>
      <IonText>Swipe for alternate exercises</IonText>
    </div>
  );
};

export default DetailedMovementSlide;
