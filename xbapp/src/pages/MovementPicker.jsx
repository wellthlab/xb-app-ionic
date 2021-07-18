import React, { Component } from "react";
import Tile from "../components/Tile";
import Moves from "../components/strength/moves.json";
import { IonContent, IonSlides, IonSlide } from "@ionic/react";

import "./MovementPicker.scss";
import { useState } from "react";
import DetailedTile from "../components/DetailedTile";
import { useEffect } from "react";
import MovementSlide from "../components/strength/MovementSlide";

const MovementPicker = (props) => {
  // Setup states to control the active slide
  const [showDetailedTile, setShowDetailedTile] = useState(false);
  const [movement, setMovement] = useState(Moves.moves[0]);
  const [columnSlideOpts, setColumnSlideOpts] = useState({
    activeIndex: 0,
    options: {
      initialSlide: 1,
      speed: 400,
      direction: "vertical",
      slidesPerView: 2,
      centeredSlides: true,
      spaceBetween: 50,
    },
  });

  const defaultOptions = {
    activeIndex: 0,
    options: {
      initialSlide: 0,
      speed: 400,
      slidesPerView: 2,
      centeredSlides: true,
      spaceBetween: 220,
    },
  };

  const [rowSlideOpts, setRowSlideOpts] = useState({
    top: defaultOptions,
    middle: defaultOptions,
    bottom: defaultOptions,
  });

  useEffect(() => {}, []);

  // Slide is clicked and the view changes to display DetailedTile
  // The state activeIndex is then updated to preserve the current index for the next render
  async function slideClicked(e, index, row) {
    // Gets the active index of the parent slide (which is the vertical index)
    const activeColumnIndex = await e.path[3].getActiveIndex();
    const columnOptions = columnSlideOpts;
    columnOptions.options.initialSlide = activeColumnIndex;
    setColumnSlideOpts(columnOptions);

    const rowOptions = rowSlideOpts;
    rowOptions[row].options.initialSlide = index;
    setRowSlideOpts(rowOptions);
  }

  async function updateExercise(_showDetailedTile, _exercise) {
    setShowDetailedTile(_showDetailedTile);
    setMovement(_exercise);
  }

  const rows = 3;
  const exercises = [];
  for (let i = 0; i < rows; ++i) {
    exercises.push(Moves.moves.slice(i * 10, i * 10 + 10));
  }
  let screen;
  // Either render the slides filled with tiles or a detialed tile
  if (!showDetailedTile) {
    screen = (
      <IonSlides options={columnSlideOpts.options}>
        <MovementSlide
          slideClicked={slideClicked}
          row="top"
          // Considering passing rowSlideOpts[row].options instead
          options={rowSlideOpts}
          movements={exercises[0]}
          updateExercise={updateExercise}
        />
        <MovementSlide
          slideClicked={slideClicked}
          row="middle"
          options={rowSlideOpts}
          movements={exercises[1]}
          updateExercise={updateExercise}
        />
        <MovementSlide
          slideClicked={slideClicked}
          row="bottom"
          options={rowSlideOpts}
          movements={exercises[2]}
          updateExercise={updateExercise}
        />
      </IonSlides>
    );
  } else {
    screen = (
      <DetailedTile movement={movement} updateExercise={updateExercise} />
    );
  }

  return (
    <IonContent>
      <div id="movement-picker">{screen}</div>
    </IonContent>
  );
};

export default MovementPicker;
