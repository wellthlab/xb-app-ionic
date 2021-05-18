import React, { Component, useState } from "react";
import {
  IonButton,
  IonContent,
  IonLabel,
  IonRadio,
  IonModal,
  IonRadioGroup,
  IonItemDivider,
  IonItem,
} from "@ionic/react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { CheckmarkSharp, CloseSharp } from "react-ionicons";

const quizes = [
  {
    id: "5", //id is week
    question: "A complementary move to a PUSH movement would be:",
    answers: [
      "Pull movements",
      "Squat variants",
      "Push up variants",
      "Sit ups",
    ],
    correctAnswer: "Pull movements",
    explanation:
      "PULL movements complement PUSHes. Pushes and pulls relate to the direction of force - where a push is pushing something AWAY from the locus of force, a PULL brings the object towards the force. In strength work also, muscles worked in most pushes are dominantly at the front of the body and the pulls mainly work the muscles along the back of the body. Finally, pushes and pulls work the agonist and antagonist muscles of a movement - the squat as a PUSH when looking at the legs, primarily works the top of the legs; hinges primarily work the muscles on the back of the legs. These muscles are complementary agonist/antagonist to each other (quads front; hamstrings back). Thus balanced strength will work pushes and complementary pulls. WIth respect to the other choices: SQUATS are pushes, push up variants are more pushes and sit ups are just evil.",
  },
  {
    id: "6", //id is week
    question: "WHAT is a REPETITION (or Rep)?",
    answers: [
      "A measure of boredom",
      "A measure of skill",
      "A single performance of both the negative and positive parts of a given movement",
      "A negative component of a single performance of a movement",
    ],
    correctAnswer:
      "A single performance of both the negative and positive parts of a given movement",
    explanation:
      "A Repetition/Rep is: the single performance of both the negative and positive part of a movement - so a squat includes getting down into the squat position (back of legs touching, the negative part of the movement) - and the return to the standing position (the positive part of the movement).",
  },
];
function GenericModal(props) {
  const [selected, setSelected] = useState("");
  const [reply, setReply] = useState(
    "Answer the question to reveal the answer and the explanation!"
  );
  const [answered, setAnswered] = useState(false);
  const [confettiOn, setconfettiOn] = useState(false);
  const { width, height } = useWindowSize();

  if (!props.showModal) {
    return null;
  }

  var quizToShow = props.quiz
    ? quizes.filter(function (item) {
        return item.id === props.message;
      })
    : {};

  function answerQuiz() {
    setAnswered(true);
    if (selected == quizToShow[0].correctAnswer) {
      setconfettiOn(true);
    }
    setReply(quizToShow[0].explanation);
  }
  return (
    <div>
      <IonModal isOpen={props.showModal}>
        <IonContent>
          <Confetti
            width={width}
            height={height}
            tweenDuration={9000}
            numberOfPieces={300}
            recycle={false}
            run={confettiOn}
          />
          {props.quiz ? (
            <>
              <h1 style={{ textAlign: "center" }}>
                <b>{props.title}</b>
              </h1>
              {quizToShow[0].question}
              <IonRadioGroup
                value={selected}
                onIonChange={(e) => setSelected(e.detail.value)}
              >
                <IonItem>
                  <IonLabel style={{ whiteSpace: "normal" }}>
                    {quizToShow[0].answers[0]}
                  </IonLabel>
                  <IonRadio
                    disabled={answered}
                    slot="start"
                    value={quizToShow[0].answers[0]}
                  />
                  {answered ? (
                    quizToShow[0].answers[0] == quizToShow[0].correctAnswer ? (
                      <CheckmarkSharp
                        color={"#00a814"}
                        beat
                        title={"right"}
                        height="40px"
                        width="40px"
                      />
                    ) : (
                      <CloseSharp
                        color={"#bda400"}
                        beat
                        title={"wrong"}
                        height="40px"
                        width="40px"
                      />
                    )
                  ) : (
                    <></>
                  )}
                </IonItem>

                <IonItem>
                  <IonLabel style={{ whiteSpace: "normal" }}>
                    {quizToShow[0].answers[1]}
                  </IonLabel>
                  <IonRadio
                    disabled={answered}
                    slot="start"
                    value={quizToShow[0].answers[1]}
                  />
                  {answered ? (
                    quizToShow[0].answers[1] == quizToShow[0].correctAnswer ? (
                      <CheckmarkSharp
                        color={"#00a814"}
                        beat
                        title={"right"}
                        height="40px"
                        width="40px"
                      />
                    ) : (
                      <CloseSharp
                        color={"#bda400"}
                        beat
                        title={"wrong"}
                        height="40px"
                        width="40px"
                      />
                    )
                  ) : (
                    <></>
                  )}
                </IonItem>

                <IonItem>
                  <IonLabel style={{ whiteSpace: "normal" }}>
                    {quizToShow[0].answers[2]}
                  </IonLabel>
                  <IonRadio
                    disabled={answered}
                    slot="start"
                    value={quizToShow[0].answers[2]}
                  />
                  {answered ? (
                    quizToShow[0].answers[2] == quizToShow[0].correctAnswer ? (
                      <CheckmarkSharp
                        color={"#00a814"}
                        beat
                        title={"right"}
                        height="40px"
                        width="40px"
                      />
                    ) : (
                      <CloseSharp
                        color={"#bda400"}
                        beat
                        title={"wrong"}
                        height="40px"
                        width="40px"
                      />
                    )
                  ) : (
                    <></>
                  )}
                </IonItem>

                <IonItem>
                  <IonLabel style={{ whiteSpace: "normal" }}>
                    {quizToShow[0].answers[3]}
                  </IonLabel>
                  <IonRadio
                    disabled={answered}
                    slot="start"
                    value={quizToShow[0].answers[3]}
                  />
                  {answered ? (
                    quizToShow[0].answers[3] == quizToShow[0].correctAnswer ? (
                      <CheckmarkSharp
                        color={"#00a814"}
                        beat
                        title={"right"}
                        height="40px"
                        width="40px"
                      />
                    ) : (
                      <CloseSharp
                        color={"#bda400"}
                        beat
                        title={"wrong"}
                        height="40px"
                        width="40px"
                      />
                    )
                  ) : (
                    <></>
                  )}
                </IonItem>
              </IonRadioGroup>
              <IonItemDivider></IonItemDivider>
              {answered ? (
                <></>
              ) : (
                <IonButton onClick={answerQuiz}>Submit</IonButton>
              )}
              <IonItemDivider></IonItemDivider>
              <IonLabel>{reply}</IonLabel>
              <br />
              <br />
              <br />
            </>
          ) : (
            <>
              <h1 style={{ textAlign: "center" }}>
                <b>{props.title}</b>
              </h1>
              {props.message}
              <br />
              <br />
              <br />
            </>
          )}
        </IonContent>
        <IonButton onClick={props.toggleModal}>Close</IonButton>
      </IonModal>
    </div>
  );
}

export default GenericModal;
