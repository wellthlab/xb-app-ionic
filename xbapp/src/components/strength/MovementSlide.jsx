import React, { Component } from "react";
import { IonContent, IonSlides, IonSlide } from "@ionic/react";

import { useState } from "react";
import { useEffect } from "react";
import Tile from "../Tile";

const MovementSlide = (props) => {
  return (
    <IonSlide>
      <IonSlides
        pager={false}
        options={props.options[props.row].options}
        onIonSlideTap={(event) => {
          event.target.getActiveIndex().then((index) => {
            props.slideClicked(event, index, props.row);
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
