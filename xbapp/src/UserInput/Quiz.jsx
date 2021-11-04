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
import React, { Component } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { CheckmarkSharp, CloseSharp } from "react-ionicons";


const quizes = [
  {
    week: 0, //id is week. 0 means the whole week
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
    week: 1, //id is week and day
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
  {
    week: 3, //id is week and day
    question: "What is an Isolateral exercise?",
    answers: [
      "Creating tension in a muscle without moving a joint",
      "Alternating moves between a push and a pull",
      "Strength move done on one side of the body",
      "Focusing on one movement per day of the week",
    ],
    correctAnswer: "Strength move done on one side of the body",
    explanation:
      "An isolateral exercise is the Strength move done on one side of the body. Creating tension in a muscle without moving a joint is called an isometric. Alternating moves between a push and a pull is a great idea for complementing muscle work in a practice but is not an isolateral. Moreover, isolateral movements focus on what is moved in one side of the body, rather than the program of moves over any time period.",
  },
  {
    week: 4, //id is week and day
    question: "What is an isometric exercise?",
    answers: [
      "Using small handheld weights for workouts",
      "Creating tension in a muscle without moving joints",
      "Exercises done outside of a group",
      "Maximal single lift",
    ],
    correctAnswer: "Creating tension in a muscle without moving joints",
    explanation:
      "Creating tension in a muscle without moving joints is correct. Using small handheld weights for workouts would be a focus on the equipment rather than type of exercise. Exercises done outside of a group would be isolation - where a movement is done - rather than a type of exercise. Maximal single lift is usually done with weights to find out what the maximum load one can lift with one big rep only.",
  },
  {
    week: 5, //id is week and day
    question: "What is time under tension (TuT)?",
    answers: [
      "The total time a workout takes",
      "The time in one's day one feels stressed",
      "The total time one is actually working during the workout",
      "The total number of blocks done in a workout",
    ],
    correctAnswer: "The total time one is actually working during the workout",
    explanation:
      "The total time one is actually working during the workout is correct, excluding breaks - how long in a workout you are actually working rather than recovering. TuT is a measure actually within the total workout time, but is not itself the total workout time. In terms of the time in one's day when they feel stressed, there should be a name for that, and TuT may help mitigate that, but that's not it. The total number of blocks done in a workout would be the total number of blocks rather than the time spent in blocks doing work.",
  },
  {
    week: 6, //id is week and day
    question: "What is an examples of a bilateral pull exercise?",
    answers: ["Bulgarian split squat", "Pull up", "Horse stance", "Superman"],
    correctAnswer: "Pull up",
    explanation:
      "A pull up is correct. A bulgarian split squat is, in fact, a great lower body isolateral. A horse stance is a classic lower body isometric, and superman is a great back-working isometric.",
  },
];

const Quiz = (props) => {
  useEffect(() => {}, []);
  const history = useHistory();

  const [selected, setSelected] = React.useState("");
  const [reply, setReply] = React.useState(
    "Answer the question to reveal the answer and the explanation!"
  );
  const [answered, setAnswered] = React.useState(false);
  const [confettiOn, setconfettiOn] = React.useState(false);
  const { width, height } = useWindowSize();
  
  var quizToShow = quizes.filter(function (item) {
          return item.week === props.week; //checking for weekly quizes i.e. 5, 6
        });



  function answerQuiz() {
    setAnswered(true);
    if (selected == quizToShow[0].correctAnswer) {
      setconfettiOn(true);
    }
    setReply(quizToShow[0].explanation);
  }
  function exitQuiz() {

    var response = {};
    response.type = "quiz";
    response.isRightAnswer = (selected == quizToShow[0].correctAnswer ? "correct" : "not quite correct");
    response.question = quizToShow[0].question;
    response.answer = quizToShow[0].correctAnswer;
    response.explanation = quizToShow[0].explanation;

    props.onSubmit(response);
  }
  return (
      <IonContent>
        <Confetti
          width={width}
          height={height}
          tweenDuration={9000}
          numberOfPieces={300}
          recycle={false}
          run={confettiOn}
        />
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
              <IonButton onClick={exitQuiz}>Exit Quiz</IonButton>
            ) : (
              <IonButton onClick={answerQuiz}>Submit</IonButton>
            )}
            <IonItemDivider></IonItemDivider>
            <IonLabel>{reply}</IonLabel>
      </IonContent>
      

  );
};

export default Quiz;

var getQuiz = function (id) {
  //returning quiz based onn it
  for (var i in quizes) {
    var q = quizes[i];

    if (q.id == id) {
      return q;
    }
  }

  return false;
};
export { quizes, getQuiz };

