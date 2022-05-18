import React, { useState } from "react";
import {
  IonSlides,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonButton,
} from "@ionic/react";
import {
  caretUp,
  caretDown,
  caretForward,
  caretBack,
  arrowBackOutline,
} from "ionicons/icons";

import "./MovementPicker.scss";
import { BlockIndexContext } from "./context/BlockIndexContext";
import Moves from "../Strength/moves.json";
import MovementSlide from "./components/MovementSlide";
import DetailedMovementSlide from "./components/DetailedMovementSlide";

const MovementPicker = (props) => {
  var isExplorer = props.explorer;
  const typeOfExercise = props.typeOfExercise;

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

    // // Update all slide positions to display the slide at current index
    // const slides = document.getElementsByClassName(
    //   "swiper-container-horizontal"
    // );
    // for (let i = 0; i < slides.length; ++i) {
    //   // Skips the slide that has been swiped
    //   if (i === activeColumnIndex) {
    //     continue;
    //   }
    //   const slide = slides[i].swiper;
    //   slide.slideTo(index, 400, 0);
    // }
  }

  async function updateDetailOnClick(_showDetailedTile, _exercise) {
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
      <div id="movement-picker" className="movement-picker">
        <div id="tile-gui" className="tile-gui">
          <IonIcon icon={caretUp} id="up" className="caret-row" />
          <IonIcon icon={caretBack} id="left" className="caret-column" />
          <div id="slides" className="slides">
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
                explorer={props.explorer}
                horizonalSlideSwiped={horizonalSlideSwiped}
                row="top"
                // Considering passing rowSlideOpts[row].options instead
                options={rowSlideOpts}
                movements={passedMovements.upperBody}
                updateDetailOnClick={updateDetailOnClick}
                updateExercise={props.updateExercise}
                isExplorer={isExplorer}
                setContent={props.setContent}
                typeOfExercise={typeOfExercise}
              />
              <MovementSlide
                explorer={props.explorer}
                horizonalSlideSwiped={horizonalSlideSwiped}
                row="middle"
                options={rowSlideOpts}
                movements={passedMovements.fullBody}
                updateDetailOnClick={updateDetailOnClick}
                updateExercise={props.updateExercise}
                isExplorer={isExplorer}
                setContent={props.setContent}
                typeOfExercise={typeOfExercise}
              />
              <MovementSlide
                explorer={props.explorer}
                horizonalSlideSwiped={horizonalSlideSwiped}
                row="bottom"
                options={rowSlideOpts}
                movements={passedMovements.lowerBody}
                updateDetailOnClick={updateDetailOnClick}
                updateExercise={props.updateExercise}
                isExplorer={isExplorer}
                setContent={props.setContent}
                typeOfExercise={typeOfExercise}
              />
            </IonSlides>
          </div>
          <IonIcon icon={caretForward} id="right" className="caret-column" />
          <IonIcon icon={caretDown} id="down" className="caret-row" />
        </div>
      </div>
    );
  } else {
    screen = (
      <div id="movement-picker" style={{ padding: "0px" }}>
        <DetailedMovementSlide
          setContent={props.setContent}
          typeOfExercise={props.typeOfExercise}
          movement={movement}
          updateDetailOnClick={updateDetailOnClick}
          updateExercise={props.updateExercise}
          isExplorer={isExplorer}
        />
      </div>
    );
  }

  return (
    <>
      {props.explorer ? (
        <div style={{ textAlign: "center", "--padding-top": "10px" }}>
          <IonText className="ion-text-header">
            Click on a move for more detail
          </IonText>
        </div>
      ) : (
        ""
      )}

      <BlockIndexContext.Provider value={blockIndex}>
        {screen}
      </BlockIndexContext.Provider>

      <IonCard color="transparent">
        <IonButton expand="block" onClick={() => props.setContent(undefined)}>
          <IonIcon icon={arrowBackOutline} />
        </IonButton>
      </IonCard>
    </>
  );
};

export default MovementPicker;
