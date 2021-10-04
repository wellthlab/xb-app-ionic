import React from "react";
import { IonSlides, IonSlide } from "@ionic/react";

import Tile from "./Tile";

const MovementSlide = (props) => {
  return (
    <IonSlide>
      <IonSlides
        pager={false}
        options={props.options[props.row].options}
        // When the slide changes, update the initial slide for this row to current slide
        onIonSlideDidChange={(event) => {
          event.target.getActiveIndex().then((index) => {
            props.horizonalSlideSwiped(event, index, props.row);
          });
        }}
      >
        {props.movements.map((exercise, index) => (
          <IonSlide key={index}>
            <Tile movement={exercise} updateExercise={props.updateExercise} />
          </IonSlide>
        ))}
      </IonSlides>
    </IonSlide>
  );
};

export default MovementSlide;
