import React from "react";
import Moves from "../components/strength/moves.json";
import {
  IonContent,
  IonSlides,
  IonCard,
  IonCardContent,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
} from "@ionic/react";
import { BlockIndexContext } from "../context/BlockIndexContext";

import "./MovementPicker.scss";
import { useState } from "react";
import { useEffect } from "react";
import MovementSlide from "../components/strength/MovementSlide";
import DetailedMovementSlide from "../components/DetailedMovementSlide";
import { caretUp } from "ionicons/icons";

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
      spaceBetween: 200,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    },
  });

  const [blockIndex, setBlockIndex] = useState(
    props.location.state?.blockIndex
  );

  // TODO: Implement a method to deep clone this. There are problems otherwise
  const defaultOptions = {
    activeIndex: 0,
    options: {
      // The index of the intital slide
      initialSlide: 0,
      speed: 400,
      // Display two slides and center them
      slidesPerView: 2,
      centeredSlides: true,
      // The space between slides
      spaceBetween: 220,
      // Render 1 slide before and after
      addSlidesBefore: 1,
      addSlidesAfer: 1,
    },
  };

  const [rowSlideOpts, setRowSlideOpts] = useState({
    top: {
      activeIndex: 0,
      options: {
        // The index of the intital slide
        initialSlide: props.location.state?.initialSlideIndex.upperBody,
        speed: 400,
        // Display two slides and center them
        slidesPerView: 2,
        centeredSlides: true,
        // The space between slides
        spaceBetween: 220,
        // Render 1 slide before and after
        addSlidesBefore: 1,
        addSlidesAfer: 1,
      },
    },
    middle: {
      activeIndex: 0,
      options: {
        // The index of the intital slide
        initialSlide: props.location.state?.initialSlideIndex.fullBody,
        speed: 400,
        // Display two slides and center them
        slidesPerView: 2,
        centeredSlides: true,
        // The space between slides
        spaceBetween: 220,
        // Render 1 slide before and after
        addSlidesBefore: 1,
        addSlidesAfer: 1,
      },
    },
    bottom: {
      activeIndex: 0,
      options: {
        // The index of the intital slide
        initialSlide: props.location.state?.initialSlideIndex.lowerBody,
        speed: 400,
        // Display two slides and center them
        slidesPerView: 2,
        centeredSlides: true,
        // The space between slides
        spaceBetween: 220,
        // Render 1 slide before and after
        addSlidesBefore: 1,
        addSlidesAfer: 1,
      },
    },
  });

  useEffect(() => {}, []);

  // Slide is clicked and the view changes to display DetailedTile
  // The state activeIndex is then updated to preserve the current index for the next render
  async function horizonalSlideSwiped(e, index, row) {
    // Gets the active index of the parent slide (which is the vertical index)
    try {
      const activeColumnIndex = await e.path[3].getActiveIndex();
      const columnOptions = columnSlideOpts;
      columnOptions.options.initialSlide = activeColumnIndex;
      setColumnSlideOpts(columnOptions);
    } catch (error) {
      console.log(error.message);
    }

    const rowOptions = rowSlideOpts;
    rowOptions[row].options.initialSlide = index;
    setRowSlideOpts(rowOptions);
  }

  async function updateExercise(_showDetailedTile, _exercise) {
    setShowDetailedTile(_showDetailedTile);
    setMovement(_exercise);
  }

  function verticalSlideSwiped(index) {
    const columnOptions = columnSlideOpts;
    columnOptions.options.initialSlide = index;
    setColumnSlideOpts(columnOptions);
  }

  function invalidMovements(movements) {
    if (typeof movements === "undefined") {
      return true;
    } else if (Object.entries(movements).length === 0) {
      return true;
    }
    return false;
  }

  const passedMovements = props.location.state?.movements;
  let screen;
  // Either render the slides filled with tiles or a detialed tile
  if (invalidMovements(passedMovements)) {
    screen = (
      <div id="movement-picker">
        <IonCard>
          <IonCardContent>There are no exercises to choose from</IonCardContent>
        </IonCard>
      </div>
    );
  } else if (!showDetailedTile) {
    screen = (
      <div id="movement-picker">
        <div id="slides">
          <IonSlides
            options={columnSlideOpts.options}
            onIonSlideDidChange={(event) => {
              event.target.getActiveIndex().then((index) => {
                verticalSlideSwiped(index);
              });
            }}
          >
            <MovementSlide
              horizonalSlideSwiped={horizonalSlideSwiped}
              row="top"
              // Considering passing rowSlideOpts[row].options instead
              options={rowSlideOpts}
              movements={passedMovements.upperBody}
              updateExercise={updateExercise}
            />
            <MovementSlide
              horizonalSlideSwiped={horizonalSlideSwiped}
              row="middle"
              options={rowSlideOpts}
              movements={passedMovements.fullBody}
              updateExercise={updateExercise}
            />
            <MovementSlide
              horizonalSlideSwiped={horizonalSlideSwiped}
              row="bottom"
              options={rowSlideOpts}
              movements={passedMovements.lowerBody}
              updateExercise={updateExercise}
            />
          </IonSlides>
          <div className="swiper-button-prev" id="vertical-prev"></div>
          <div className="swiper-button-next" id="vertical-next"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
        <div className="outer-slide">
          <IonList>
            <IonListHeader lines="inset">
              <IonLabel>Instructions (Scroll to view all)</IonLabel>
            </IonListHeader>
            <IonItem>
              <p>1. Add a movement to your block planner by clicking select</p>
            </IonItem>
            <IonItem>
              <p>
                2. To view the full description of the movement, click the image
              </p>
            </IonItem>
            <IonItem>
              <p>3. Swipe to view movements of different difficulties</p>
            </IonItem>
            <IonItem>
              <p>
                4. Laudantium eligendi ea et aut. Amet quia alias perspiciatis
                officiis unde. Aut perferendis est deleniti deserunt aut
                perspiciatis.
              </p>
            </IonItem>
            <IonItem>
              <p>
                5. Laudantium eligendi ea et aut. Amet quia alias perspiciatis
                officiis unde. Aut perferendis est deleniti deserunt aut
                perspiciatis. Eos corporis quae voluptas ex expedita non.
                Doloremque mollitia eius beatae tenetur tempora. Accusamus nihil
                repudiandae laborum eos dignissimos.
              </p>
            </IonItem>
          </IonList>
        </div>
      </div>
    );
  } else {
    screen = (
      <div id="movement-picker">
        <DetailedMovementSlide
          movement={movement}
          updateExercise={updateExercise}
        ></DetailedMovementSlide>
      </div>
    );
  }

  return (
    <IonContent>
      <BlockIndexContext.Provider value={blockIndex}>
        {screen}
      </BlockIndexContext.Provider>
    </IonContent>
  );
};

export default MovementPicker;
