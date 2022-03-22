import { useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import {
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonText,
  IonGrid,
  IonCol,
  IonRow,
  IonButton,
} from "@ionic/react";
import { CheckmarkSharp, CloseSharp } from "react-ionicons";

function KnowledgeQuiz({ statement, choices, correct, explanation, onSubmit }) {
  const [confettiOn, setConfettiOn] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [value, setValue] = useState(null);
  const { width, height } = useWindowSize();

  console.log("explanation", explanation, typeof explanation);

  const choiceItems = choices.map((choice, index) => {
    return (
      <IonItem>
        <IonLabel>
          <IonText>{choice}</IonText>
        </IonLabel>
        <IonRadio slot="start" disabled={answered} value={choice} />
        {answered ? (
          choice === correct ? (
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

  function handleChange(e) {
    setValue(e.detail.value);
  }

  return (
    <>
      <Confetti
        width={width}
        height={height}
        tweenDuration={9000}
        numberOfPieces={300}
        recycle={false}
        run={confettiOn}
      />

      <IonItem>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel>
                <IonText style={{ fontSize: "1.2em" }}>{statement}</IonText>
              </IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonRadioGroup
                allowEmptySelection={true}
                value={value}
                onIonChange={handleChange}
              >
                {choiceItems}
              </IonRadioGroup>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              {answered ? (
                <>
                  <IonText style={{ fontSize: "1.2em" }}>
                    {value === correct
                      ? "That's correct! "
                      : "That's not quite right, because..."}
                    <br />
                    <br />
                  </IonText>
                  <IonText>{explanation}</IonText>
                </>
              ) : (
                <IonButton
                  expand="block"
                  disabled={!value}
                  onClick={() => {
                    setAnswered(true);
                  }}
                >
                  Submit
                </IonButton>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </>
  );
}

export default KnowledgeQuiz;
