import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonContent,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonItemDivider,
  IonItem,
  IonText,
} from "@ionic/react";
import React from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { CheckmarkSharp, CloseSharp } from "react-ionicons";

const Quiz = ({ onSubmit, task }) => {
  const [selected, setSelected] = React.useState(null);
  const [reply, setReply] = React.useState(null);
  const [replyTitle, setReplyTitle] = React.useState(null);
  const [answered, setAnswered] = React.useState(false);
  const [confettiOn, setConfettiOn] = React.useState(false);
  const { width, height } = useWindowSize();

  const question = task.question;
  const answers = task.answers;
  const correctAnswer = answers[task.correctAnswer];
  const explanation = task.explanation;

  function answerQuiz() {
    setAnswered(true);

    if (selected === correctAnswer) {
      setConfettiOn(true);
      setReplyTitle("That's correct!");
    } else {
      setReplyTitle("That's not quite correct...");
    }
    setReply(explanation);
    onSubmit({ minutes: 1e-10 });
  }

  const answerItems = answers.map((answer, index) => {
    return (
      <IonItem>
        <IonLabel style={{ whiteSpace: "normal" }}>{answer}</IonLabel>
        <IonRadio slot="start" disabled={answered} value={answer} />
        {answered ? (
          answer === correctAnswer ? (
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
    );
  });

  return (
    <>
      {/* Confetti when people give the correct answer */}
      <Confetti
        width={width}
        height={height}
        tweenDuration={9000}
        numberOfPieces={300}
        recycle={false}
        run={confettiOn}
      />

      {/* Ask questions */}
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{question}</IonCardTitle>
          <IonCardSubtitle>
            Answer the question to reveal the answer and the explanation
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonRadioGroup
            value={selected}
            onIonChange={(e) => setSelected(e.detail.value)}
          >
            {answerItems}
          </IonRadioGroup>

          {!answered ? (
            <IonButton
              expand={"full"}
              onClick={answerQuiz}
              disabled={!selected}
            >
              Submit
            </IonButton>
          ) : (
            ""
          )}

          {reply ? (
            <>
              <IonCardTitle>{replyTitle}</IonCardTitle>
              <IonText style={{ fontSize: "1.1rem" }}>{reply}</IonText>
            </>
          ) : (
            ""
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default Quiz;
