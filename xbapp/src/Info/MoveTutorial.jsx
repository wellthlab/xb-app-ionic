import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonItem,
  IonList,
  IonLabel,
  IonPage,
  IonContent,
} from "@ionic/react";
import { connect } from "react-redux";

import MovementPicker, {
  getMove,
} from "../DEPRECATED/components/OLDMovementPicker";
import MovementInfoCard from "../components/strength/MovementInfoCard";
import MovementTimer from "../components/strength/MovementTimer";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import mobiscroll from "@mobiscroll/react-lite";
import CountDown from "../components/instruments/CountDown";

import "./MoveTutorial.scss";

const MoveTutorial = ({ week, onSubmit, countdownID }) => {
  const [stage, setStage] = useState(0);

  var moveA = getMove("boxsquat");
  var moveB = getMove("verticalpull");
  var exercises = [];
  exercises.push("boxsquat");
  exercises.push("verticalpull");

  /**
   * Content contains all the pages, plus functions for checking if the stage is complete
   */
  var content = [];

  content[0] = { placeholder: true }; // A placeholder for the real first page, which we'll assemble later

  /**
   * What is a MOVE?
   */

  content.push({
    el: (
      <>
        <h3>This is a move</h3>
        <p>
          A MOVE or MOVEMENT here is a particular action that usually has at
          least two main parts: getting from a START position to a FINISH
          position.
        </p>
        <MovementInfoCard
          titleSize={"normal"}
          key={moveA.id}
          images={moveA.images}
          name={moveA.name}
        >
          <p>{moveA.difficulty ? moveA.difficulty : ""}</p>
        </MovementInfoCard>
        <p>
          For example, a BOX SQUAT (above) - starts with the butt touching the
          box. The finish position is standing up straight.
        </p>
      </>
    ),
    next: true,
    previous: true,
    rule: function () {
      return true;
    },
    title: "What is a MOVE? (30 sec.)",
  });

  content.push({
    el: (
      <>
        <h3>Try to do this once. THIS is a rep!</h3>
        <MovementInfoCard
          titleSize={"normal"}
          key={moveA.id}
          images={moveA.images}
          name={moveA.name}
        >
          <p>{moveA.difficulty ? moveA.difficulty : ""}</p>
        </MovementInfoCard>
        <p>
          A REP or REPETITION is a single complete movement. So from the start
          to the finish position is one rep.
        </p>
      </>
    ),
    next: true,
    previous: true,
    rule: function () {
      return true;
    },
    title: "What is a REP? (30 sec.)",
  });

  content.push({
    el: (
      <>
        <h3>What would a SET be?</h3>
        <p>
          A SET represents a collection of reps. Most often a set has
          repetitions of only one movement. BUT, in our case, ONE SET will
          consist of 5 REPS of move A, and 5 REPS of move B.
        </p>
        <p>For example, let's say we have the 2 moves, below:</p>
        <IonGrid>
          <IonRow>
            <IonCol>
              <MovementInfoCard
                accordion={false}
                titleSize={"small"}
                key={moveA.id}
                images={moveA.images}
                name={moveA.name}
              ></MovementInfoCard>
            </IonCol>
            <IonCol>
              <MovementInfoCard
                accordion={false}
                titleSize={"small"}
                key={moveB.id}
                images={moveB.images}
                name={moveB.name}
              ></MovementInfoCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <p>
          Do 5 REPS of the first. PAUSE to recover – with the minimum recovery
          you need. Now do 5 REPS of the second.
        </p>
        <p>AND THAT'S A SET!</p>
      </>
    ),
    next: true,
    previous: true,
    rule: function () {
      return true;
    },
    title: "What is a SET? (1 min.)",
  });

  content.push({
    el: (
      <>
        <h3>Getting it all together..</h3>
        <p>
          A BLOCK - in our case we are using block as a TIME container in which
          to perform sets. So our BLOCKS in this study are 7 mins.
        </p>
        <p>
          Inside the BLOCK - we have SETS! As many as you can fit in just 7
          minutes!
        </p>
        <p>
          When recording your exercising, a BLOCK contains a number of SETS plus
          any additional REPS for that block (i.e. you may complete 5 full sets
          + 2 additional reps of move B)
        </p>
        <p>
          NOW, let's give it a go! Start the timer below, and try to do as many
          sets as you can in 7 minutes!
        </p>

        <CountDown minutes={7} />
        <IonGrid>
          <IonRow>
            <IonCol>
              <MovementInfoCard
                accordion={false}
                titleSize={"small"}
                key={moveA.id}
                images={moveA.images}
                name={moveA.name}
              ></MovementInfoCard>
            </IonCol>
            <IonCol>
              <MovementInfoCard
                accordion={false}
                titleSize={"small"}
                key={moveB.id}
                images={moveB.images}
                name={moveB.name}
              ></MovementInfoCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </>
    ),
    next: true,
    previous: true,
    rule: function () {
      return true;
    },
    title: "What is a BLOCK? (7 min.)",
  });

  /**
   * Instructions and stage list
   */

  content[0] = {
    el: (
      <>
        <p>
          Welcome to the Movement Tutorial! This is a 7-to-8 minute tutorial
          that will take you through the basics of what you need to know in
          order to complete the movement exercises within the app. Here are the
          chapters below!
        </p>
        <IonList>
          {content.map((stage, i) => {
            if (stage.title)
              return (
                <IonItem key={i}>
                  <IonLabel>{stage.title}</IonLabel>
                </IonItem>
              );
          })}
        </IonList>
      </>
    ),
    rule: function () {
      return true;
    },
  };

  /**
   * Final stage, save button!
   */

  content.push({
    el: (
      <>
        <h3>Great work!</h3>
        <p>Now let's do a quick re-iteration:</p>
        <ul>
          <li>Doing one MOVE one time - is called a REP</li>
          <li>5 REPS of move A + 5 REPS of MOVE B - is called a SET</li>
          <li>
            A number of SETS + any remaining REPS done to fill 7 minutes - is
            called a BLOCK
          </li>
        </ul>
        <IonButton onClick={function () {}} routerLink={"/settings"}>
          Finish
        </IonButton>
      </>
    ),
    next: true,
    previous: true,
    rule: () => {
      return true;
    },
  });

  /**
   * Wire the stages together so we can progress from one to the next
   *
   */

  // Work out the maximum stage that's allowed
  var maxStage = 0;
  for (var i in content) {
    maxStage = i;

    if (!content[i].rule()) {
      // console.log("Stage", i, "is not complete");
      break;
    }
  }

  // console.log("Max stage is", maxStage, "of", content.length);

  // Wrap all the content into slides, with next buttons
  var slides = [];

  var nextSlide = () => {
    setStage(stage + 1);
  };

  var prevSlide = () => {
    setStage(stage - 1);
  };

  for (var i in content) {
    var c = content[i];
    var nextExists = i < content.length - 1;

    slides.push(
      <div key={"slide" + i}>
        {c.el}
        <div className="buttons">
          {c.previous ? (
            <IonButton onClick={prevSlide} className="back">
              Back
            </IonButton>
          ) : (
            ""
          )}
          {nextExists &&
          c.rule() &&
          (typeof c.next == "undefined" || c.next != false) ? (
            <IonButton onClick={nextSlide} className="next">
              Next
            </IonButton>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }

  var slide = slides[Math.min(stage, maxStage)];

  return (
    <IonPage>
      <IonContent>
        <div className="StrengthWizard">{slide}</div>
      </IonContent>
    </IonPage>
  );
};

export default MoveTutorial;
