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
import { Body } from "react-ionicons";
import { useEffect } from "react";

const autoBindReact = require("auto-bind/react");

const MovementPicker = (props) => {
  const [tileClicked, setTileClicked] = useState(false);
  const [movement, setMovement] = useState({});
  const [columnSlideOpts, setColumnSlideOpts] = useState({
    activeIndex: 0,
    options: { initialSlide: 0, speed: 400, direction: "vertical" },
  });
  const [topRowSlideOpts, setTopRowSlideOpts] = useState({
    activeIndex: 0,
    options: { initialSlide: 0, speed: 400 },
  });

  const [middleRowSlideOpts, setMiddleRowSlideOpts] = useState({
    activeIndex: 0,
    options: { initialSlide: 0, speed: 400 },
  });

  useEffect(() => {
    console.log("Top row", topRowSlideOpts.options);
  }, []);

  // Slide is clicked and the view changes to display DetailedTile
  // The state activeIndex is then updated to preserve the current index for the next render
  async function slideClicked(e, index, row) {
    // Gets the active index of the parent slide (which is the vertical index)
    const activeColumnIndex = await e.path[3].getActiveIndex();
    if (row === "top") {
      const options = topRowSlideOpts;
      options.options.initialSlide = index;
      setTopRowSlideOpts(options);
    } else if (row === "middle") {
      const options = middleRowSlideOpts;
      options.options.initialSlide = index;
      setMiddleRowSlideOpts(options);
    }
    const options = columnSlideOpts;
    options.options.initialSlide = activeColumnIndex;
    setColumnSlideOpts(options);
  }

  async function updateExercise(_tileClicked, _exercise) {
    setTileClicked(_tileClicked);
    setMovement(_exercise);
  }

  const rows = 3;
  const exercises = [];
  for (let i = 0; i < rows; ++i) {
    exercises.push(Moves.moves.slice(i * 10, i * 10 + 10));
  }
  let screen;
  // Either render the slides filled with tiles or a detialed tile
  if (!tileClicked) {
    screen = (
      <IonSlides
        options={columnSlideOpts.options}
        // onIonSlideTap={(event) => {
        //   console.log("Clicked a slide");
        // }}
      >
        <IonSlide>
          <IonSlides
            pager={false}
            options={topRowSlideOpts.options}
            onIonSlideTap={(event) => {
              event.target.getActiveIndex().then((index) => {
                slideClicked(event, index, "top");
              });
            }}
          >
            {exercises[0].map((exercise, index) => (
              <IonSlide key={index}>
                <Tile
                  exercise={exercise}
                  // state={this.state}
                  updateExercise={updateExercise}
                />
              </IonSlide>
            ))}
          </IonSlides>
        </IonSlide>

        <IonSlide>
          <IonSlides
            pager={false}
            options={middleRowSlideOpts.options}
            onIonSlideTap={(event) => {
              event.target.getActiveIndex().then((index) => {
                slideClicked(event, index, "middle");
              });
            }}
          >
            {exercises[1].map((exercise, index) => (
              <IonSlide key={index}>
                <Tile
                  exercise={exercise}
                  // state={this.state}
                  updateExercise={updateExercise}
                />
              </IonSlide>
            ))}
          </IonSlides>
        </IonSlide>
        <IonSlide></IonSlide>
      </IonSlides>
    );
  } else {
    screen = (
      <DetailedTile exercise={movement} updateExercise={updateExercise} />
    );
  }

  return (
    <IonContent>
      <div id="movement-picker">{screen}</div>
    </IonContent>
  );
};

export default MovementPicker;
