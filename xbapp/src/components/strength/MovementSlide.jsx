import React, { Component } from "react";
import { IonContent, IonSlides, IonSlide } from "@ionic/react";

import { useState } from "react";
import { useEffect } from "react";
import Tile from "../Tile";

const MovementSlide = (props) => {
  return (
    <IonSlide>
      <IonSlides
        id="87g"
        pager={false}
        options={props.options[props.row].options}
        // onIonSlidePrevEnd={(event) => {
        //   event.target.getActiveIndex().then((index) => {
        //     // props.slideClicked(event, index, props.row);
        //   });
        // }}
        onIonSlideDidChange={(event) => {
          // console.log("Slide changed", props.row);
          if (!props.disableSlides) {
            event.target.getActiveIndex().then((index) => {
              console.log(
                props.showDetailedTile,
                "Slide changed on row",
                props.row,
                "to",
                index
              );
              props.slideClicked(event, index, props.row);
            });
          } else {
            console.log("Slides disabled");
          }
        }}
        onIonSlidesDidLoad={(event) => {
          console.log("Loaded");
          props.setDisableSlides(false);
        }}
      >
        {props.movements.map((exercise, index) => (
          <IonSlide key={index}>
            <Tile
              movement={exercise}
              updateExercise={props.updateExercise}
              row={props.row}
              setDisableSlides={props.setDisableSlides}
            />
          </IonSlide>
        ))}
      </IonSlides>
    </IonSlide>
  );
};

export default MovementSlide;
