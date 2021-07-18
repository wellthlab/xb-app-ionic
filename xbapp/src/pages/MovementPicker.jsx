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
import DetailedTile from "../components/DetailedTile";

const autoBindReact = require("auto-bind/react");

class MovementPicker extends Component {
  constructor(props) {
    super(props);

    this.state = { tileClicked: false, exercise: {}, activeIndex: 3 };
    this.slideOpts = {
      initialSlide: this.state.activeIndex,
      speed: 400,
    };

    this.slideOpts2 = {
      initialSlide: 1,
      speed: 400,
      direction: "vertical",
    };
  }

  componentDidMount() {
    // Using this to update the inital slide passed to the slide component
    this.slideOpts.initialSlide = this.state.activeIndex;
  }

  componentDidUpdate() {
    // Using this to update the inital slide passed to the slide component
    this.slideOpts.initialSlide = this.state.activeIndex;
  }

  // Slide is clicked and the view changes to display DetailedTile
  // The state activeIndex is then updated to preserve the current index for the next render
  slideClicked(e) {
    e.target.getActiveIndex().then((index) => {
      this.updateActiveIndex(index);
    });
  }

  updateExercise = (tileClicked, exercise) => {
    this.setState({ tileClicked: tileClicked, exercise: exercise });
  };
  // Used to update the activeIndex state
  updateActiveIndex = (activeSlideIndex) => {
    this.setState({ activeIndex: activeSlideIndex });
  };

  render() {
    // const exercises = Moves.moves.slice(0, 20);

    const rows = 3;
    const exercises = [];
    for (let i = 0; i < rows; ++i) {
      exercises.push(Moves.moves.slice(i * 10, i * 10 + 10));
    }
    let screen;
    // Either render the slides filled with tiles or a detialed tile
    if (!this.state.tileClicked) {
      screen = (
        <IonSlides options={this.slideOpts2}>
          <IonSlide>
            <IonSlides
              pager={false}
              options={this.slideOpts}
              onIonSlideTap={(event) => {
                this.slideClicked(event);
              }}
            >
              {exercises[0].map((exercise, index) => (
                <IonSlide key={index}>
                  <Tile
                    exercise={exercise}
                    state={this.state}
                    updateExercise={this.updateExercise.bind(this)}
                  />
                </IonSlide>
              ))}
            </IonSlides>
          </IonSlide>
        </IonSlides>
      );
    } else {
      screen = (
        <DetailedTile
          exercise={this.state.exercise}
          updateExercise={this.updateExercise.bind(this)}
        />
      );
    }
    return (
      <IonContent>
        <div id="movement-picker">{screen}</div>
      </IonContent>
    );
  }
}

export default MovementPicker;
