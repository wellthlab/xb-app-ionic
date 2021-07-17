import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Tile from "../components/Tile";
import Moves from "../components/strength/moves.json";
import {
  START_LOGIN,
  ACCEPT_LOGIN,
  REJECT_LOGIN,
} from "../model/slices/Account";
import {
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonCard,
  IonSpinner,
  IonSlides,
  IonSlide,
  IonVirtualScroll,
} from "@ionic/react";

import getXBClient from "../model/client";
import { addControllersProp } from "../model/controllers";

import "./MovementPicker.scss";
import { useState } from "react";

const autoBindReact = require("auto-bind/react");

const slideOpts = {
  initialSlide: 1,
  speed: 400,
};

const slideOpts2 = {
  initialSlide: 1,
  speed: 400,
  direction: "vertical",
};

class MovementPicker extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);
    console.log("Movement picker created with controllers", props.controllers);
  }

  componentDidMount() {
    console.log(Moves.moves[0]);
  }

  render() {
    const exercises = Moves.moves.slice(0, 5);
    console.log(exercises);
    return (
      <IonContent>
        <div id="movement-picker">
          <IonSlides options={slideOpts2}>
            <IonSlide>
              <IonSlides pager={false} options={slideOpts}>
                {exercises.map((exercise, index) => (
                  <IonSlide key={index}>
                    <Tile
                      letter={exercise.id}
                      exercise={exercise}
                      colour="pink"
                    />
                  </IonSlide>
                ))}
              </IonSlides>
            </IonSlide>
          </IonSlides>
        </div>
      </IonContent>
    );
  }
}

export default MovementPicker;
