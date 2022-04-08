import React from "react";
import Moves from "../Strength/moves.json";
import {
  IonContent,
  IonSlides,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonBackButton,
  IonHeader,
  IonButtons,
  IonTitle,
} from "@ionic/react";
import { BlockIndexContext } from "./context/BlockIndexContext";

import "./MovementPicker.scss";
import { useState } from "react";
import { useEffect } from "react";
import MovementSlide from "./components/MovementSlide";
import DetailedMovementSlide from "./components/DetailedMovementSlide";
import { caretUp, caretDown, caretForward, caretBack } from "ionicons/icons";
import XBHeader from "../util/XBHeader";
import { useLocation, useHistory } from "react-router";

const MovementPicker = (props) => {
  const location = useLocation();
  const history = useHistory();
  var isExplorer = location.pathname.includes("explore");

  // Used for the page heading
  const rowHeadings = ["", "", ""];
  const [rowIndex, setRowIndex] = useState(1);
  // Setup states to control the active slide
  const [showDetailedTile, setShowDetailedTile] = useState(false);
  const [movement, setMovement] = useState(Moves.moves[0]);
  const [columnSlideOpts, setColumnSlideOpts] = useState({
    activeIndex: 0,
    options: {
      initialSlide: rowIndex,
      speed: 400,
      direction: "vertical",
      slidesPerView: 2,
      centeredSlides: true,
      spaceBetween: 100,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    },
  });

  const [blockIndex, setBlockIndex] = useState(props.blockIndex);

  const [rowSlideOpts, setRowSlideOpts] = useState({
    top: {
      activeIndex: 0,
      options: {
        // The index of the intital slide
        initialSlide: props.initialSlideIndex.upperBody,
        speed: 400,
        // Display two slides and center them
        slidesPerView: props.numberOfItems.topRow > 1 ? 2 : 1,
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
        initialSlide: props.initialSlideIndex.fullBody,
        speed: 400,
        // Display two slides and center them
        slidesPerView: props.numberOfItems.middleRow > 1 ? 2 : 1,
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
        initialSlide: props.initialSlideIndex.lowerBody,
        speed: 400,
        // Display two slides and center them
        slidesPerView: props.numberOfItems.bottomRow > 1 ? 2 : 1,
        centeredSlides: true,
        // The space between slides
        spaceBetween: 220,
        // Render 1 slide before and after
        addSlidesBefore: 1,
        addSlidesAfer: 1,
      },
    },
  });

  // Slide is clicked and the view changes to display DetailedTile
  // The state activeIndex is then updated to preserve the current index for the next render
  async function horizonalSlideSwiped(e, index, row) {
    // Gets the active index of the parent slide (which is the vertical index)
    let activeColumnIndex;
    try {
      activeColumnIndex = await e.path[3].getActiveIndex();
      const columnOptions = columnSlideOpts;
      columnOptions.options.initialSlide = activeColumnIndex;
      setColumnSlideOpts(columnOptions);
    } catch (error) {
      console.log(error.message);
    }

    const rowOptions = rowSlideOpts;
    rowOptions[row].options.initialSlide = index;
    setRowSlideOpts(rowOptions);

    // Update all slide positions to display the slide at current index
    const slides = document.getElementsByClassName(
      "swiper-container-horizontal"
    );
    for (let i = 0; i < slides.length; ++i) {
      // Skips the slide that has been swiped
      if (i === activeColumnIndex) {
        continue;
      }
      const slide = slides[i].swiper;
      slide.slideTo(index, 400, 0);
    }
  }

  async function updateExercise(_showDetailedTile, _exercise) {
    setShowDetailedTile(_showDetailedTile);
    setMovement(_exercise);
  }

  function verticalSlideSwiped(index) {
    const columnOptions = columnSlideOpts;
    columnOptions.options.initialSlide = index;
    setColumnSlideOpts(columnOptions);
    setRowIndex(index);
    // document.getElementById("movement-type").innerText = rowHeadings[index];
  }

  function invalidMovements(movements) {
    if (typeof movements === "undefined") {
      return true;
    } else if (Object.entries(movements).length === 0) {
      return true;
    }
    return false;
  }

  const passedMovements = props.movements;

  // debugger;

  let screen;
  // Either render the slides filled with tiles or a detialed tile
  if (invalidMovements(passedMovements)) {
    screen = (
      <div id="movement-picker" style={{ padding: "0px" }}>
        <IonCard>
          <IonCardContent>There are no exercises to choose from</IonCardContent>
        </IonCard>
      </div>
    );
  } else if (!showDetailedTile) {
    screen = (
      // <div id="movement-picker" style={{ padding: "0px" }}>
      <>
        <div id="tile-gui">
          <IonIcon icon={caretUp} id="up" className="caret-row"></IonIcon>
          <IonIcon
            icon={caretBack}
            id="left"
            className="caret-column"
          ></IonIcon>
          <div id="slides">
            <IonSlides
              options={columnSlideOpts.options}
              onIonSlideDidChange={(event) => {
                event.target.getActiveIndex().then((index) => {
                  // So that function is only called when the outer most slide is changed
                  // Needs testing on mobile
                  if (event.path && event.path.length === 17) {
                    verticalSlideSwiped(index);
                  }
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
                isExplorer={isExplorer}
                setContent={props.setContent}
              />
              <MovementSlide
                horizonalSlideSwiped={horizonalSlideSwiped}
                row="middle"
                options={rowSlideOpts}
                movements={passedMovements.fullBody}
                updateExercise={updateExercise}
                isExplorer={isExplorer}
                setContent={props.setContent}
              />
              <MovementSlide
                horizonalSlideSwiped={horizonalSlideSwiped}
                row="bottom"
                options={rowSlideOpts}
                movements={passedMovements.lowerBody}
                updateExercise={updateExercise}
                isExplorer={isExplorer}
                setContent={props.setContent}
              />
            </IonSlides>
          </div>
          <IonIcon
            icon={caretForward}
            id="right"
            className="caret-column"
          ></IonIcon>
          <IonIcon icon={caretDown} id="down" className="caret-row"></IonIcon>
        </div>
        {/* </div> */}
      </>
    );
  } else {
    screen = (
      <div id="movement-picker" style={{ padding: "0px" }}>
        <DetailedMovementSlide
          movement={movement}
          updateExercise={updateExercise}
          isExplorer={isExplorer}
        ></DetailedMovementSlide>
      </div>
    );
  }

  return (
    <>
      {/* <XBHeader title={"Movement Picker"} /> */}

      {/* <IonContent> */}
      {/* <IonHeader title="Block Planner">
        <IonButtons>
          <IonBackButton defaultHref="/"></IonBackButton>
          <IonTitle className="header-title" id="movement-type" color="dark">
            {rowHeadings[rowIndex]}
          </IonTitle>
        </IonButtons>
      </IonHeader> */}
      <BlockIndexContext.Provider value={blockIndex}>
        {screen}
      </BlockIndexContext.Provider>

      {/* </IonContent> */}
    </>
  );
};

export default MovementPicker;
