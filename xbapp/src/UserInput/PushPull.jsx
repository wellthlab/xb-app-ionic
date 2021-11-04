import {
  IonBackButton,
  IonButton,
  IonSlides,
  IonSlide,
  IonContent,
  IonInput,
  IonTitle,
} from "@ionic/react";
import React, { Component } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Timer, { resetTimer } from "../Instruments/Timer";
import MovementPicker, {
  getMove,
} from "../DEPRECATED/components/OLDMovementPicker";
import MovementInfoCard from "../Strength/MovementInfoCard";

const slideOpts = {
  initialSlide: 1,
  speed: 400
};

const PushPull = (props) => {
  useEffect(() => {}, []);
  const history = useHistory();

  const [plankTime, setPlankTime] = React.useState(null);
  //expecting week to be passed as prop
  let week = props.week;

  var movePushA = getMove("cobrapushup");
  var movePushB = getMove("hindupushup");
  var movePushC = getMove("flatpushup");

  var movePullA = getMove("verticalpull");
  var movePullB = getMove("tethereddoorpull");
  var movePullC = getMove("pronatedaustralianpull");

  var movepullFull = getMove("superman");
  var movepullLower= getMove("vsit");
  var movepullUpper = getMove("verticalpull");

  var movepushFullUni = getMove("pikehold");
  var movepushLowerUni= getMove("stepup");
  var movepushUpperUni = getMove("onearmdoorpull");

  return (
    <IonContent>
   
   <h3>Pushes? Pulls? How to use the Move Explorer</h3>
        <p>
        Fundamental concepts to strength training – or resistance training, or body weight work, or calisthenics – are The Push and The Pull. These are two basic human movements that we do all the time, every day of our lives.
        </p>
        <p>
        So let's scroll through a few moves shall we!
        <br></br>
        <strong>Let's start with Pushes</strong>
        <br></br>
        Here's a push. Swipe right for decreasing difficulty, or left for increasing difficulty.
        <br></br>
        </p>
        <div>
        <IonSlides pager={true} options={slideOpts}>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movePushA.id}
          images={movePushA.images}
          name={movePushA.name}
        >
          <p>{movePushA.difficulty ? movePushA.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movePushB.id}
          images={movePushB.images}
          name={movePushB.name}
        >
          <p>{movePushB.difficulty ? movePushB.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movePushC.id}
          images={movePushC.images}
          name={movePushC.name}
        >
          <p>{movePushC.difficulty ? movePushC.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
    </IonSlides>
        </div>

        <p>
        <strong>Now let's see some pulls!</strong>
        <br></br>
        Here's a pull. Swipe right for decreasing difficulty, or left for increasing difficulty.
        <br></br>
        </p>
        <div>
        <IonSlides pager={true} options={slideOpts}>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movePullA.id}
          images={movePullA.images}
          name={movePullA.name}
        >
          <p>{movePullA.difficulty ? movePullA.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movePullB.id}
          images={movePullB.images}
          name={movePullB.name}
        >
          <p>{movePullB.difficulty ? movePullB.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movePullC.id}
          images={movePullC.images}
          name={movePullC.name}
        >
          <p>{movePullC.difficulty ? movePullC.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
    </IonSlides>
        </div>

        <p>
        Of course, as you have read on the wellthlab page, each of these moves can be categorised further, based on the part of your body which you are exercising.
        </p>
        <p>
        <strong>For eaxmple:</strong>
        <br></br>
        Here's a full body pull. Swipe right for a lower body pull, or left for an upper body pull.
        <br></br>
        </p>
        <IonSlides pager={true} options={slideOpts}>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movepullLower.id}
          images={movepullLower.images}
          name={movepullLower.name}
        >
          <p>{movepullLower.difficulty ? movepullLower.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movepullFull.id}
          images={movepullFull.images}
          name={movepullFull.name}
        >
          <p>{movepullFull.difficulty ? movepullFull.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movepullUpper.id}
          images={movepullUpper.images}
          name={movepullUpper.name}
        >
          <p>{movepullUpper.difficulty ? movepullUpper.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
    </IonSlides>


    <p>
       Now, as a last categorisation, we split these moves into isolateral and bilateral exercises. Isolateral refers to using only one part of your body (i.e. leg, arm), whereas bilaterals train both sides of your body.
        </p>
        <p>
        <strong>For eaxmple:</strong>
        <br></br>
        Here's an isolateral full body push. Swipe right for a isolateral lower body push, or left for an isolateral upper body push.
        <br></br>
        </p>

        <IonSlides pager={true} options={slideOpts}>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movepushLowerUni.id}
          images={movepushLowerUni.images}
          name={movepushLowerUni.name}
        >
          <p>{movepushLowerUni.difficulty ? movepushLowerUni.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movepushFullUni.id}
          images={movepushFullUni.images}
          name={movepushFullUni.name}
        >
          <p>{movepushFullUni.difficulty ? movepushFullUni.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
      <IonSlide>
      <MovementInfoCard
          titleSize={"normal"}
          key={movepushUpperUni.id}
          images={movepushUpperUni.images}
          name={movepushUpperUni.name}
        >
          <p>{movepushUpperUni.difficulty ? movepushUpperUni.difficulty : ""}</p>
        </MovementInfoCard>
      </IonSlide>
    </IonSlides>

    <p>
       And that's all! Throughout this study, you will be selecting either a push, a pull, of one of those types: lower, upper, or full body exercises, isolateral or bilateral.
        </p>
        <p>
        <strong>When you are going to explore the movements in the app, or set them for your blocks:</strong>
        <br></br>
        You will be guided to choose the exercise for that particular week. You will enter a page on the app where you will be able to swipe: up/down to adjust the exercising area (upper, full, lower body), and swiping left or right for choosing the difficulty!
        <br></br>
        </p>

        <IonButton
          onClick={function () {
            var res = {};
            res.type = "pushpull";
            props.onSubmit(res);
          }}
        >
          Finish Tutorial
        </IonButton>

  </IonContent>

  );
};

export default PushPull;
