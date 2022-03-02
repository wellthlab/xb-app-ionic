import React, { useState } from "react";
import {
  IonItem,
  IonLabel,
  IonRange,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonRadio,
  IonRadioGroup,
} from "@ionic/react";

const FeltScale = ["1", "2", "3", "4", "5"];

const QuestionnaireEvening = ({ key, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  function submitResults() {
    setAnswered(true);
    onSubmit({ minutes: 1e-10 });
  }

  const selectionChoices = FeltScale.map((choice, index) => {
    return (
      <IonCol>
        <IonItem>
          <IonLabel>{choice}</IonLabel>
          <IonRadio slot="end" value={choice} />
        </IonItem>
      </IonCol>
    );
  });

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Rate the following statement on a scale from 1 to 5
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonItem>In general, I felt good today</IonItem>
            </IonRow>

            <IonRadioGroup
              value={selected}
              onIonChange={(e) => setSelected(e.detail.value)}
            >
              <IonRow>{selectionChoices}</IonRow>
            </IonRadioGroup>
          </IonGrid>

          {!answered ? (
            <IonButton
              expand={"full"}
              onClick={submitResults}
              disabled={!selected}
            >
              Submit
            </IonButton>
          ) : (
            ""
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default QuestionnaireEvening;

// return (
//   <>
//     <IonCard>
//       <IonCardHeader>
//         <IonCardTitle>
//           Rate the following statement on a scale from 0 to 10
//         </IonCardTitle>
//       </IonCardHeader>
//       <IonCardContent>
//         <IonItem>In general, I felt good today</IonItem>
//         <IonItem style={{ textAlign: "center" }}>
//           <IonLabel>{FeltScale[value]}</IonLabel>
//         </IonItem>
//         <IonItem>
//           <IonRange
//             min={0}
//             max={10}
//             step={1}
//             snaps={true}
//             ticks={true}
//             color="secondary"
//             value={value}
//             onIonChange={(e) => {
//               setValue(e.detail.value);
//             }}
//           />
//         </IonItem>
//         {/* <IonButton expand={"full"} onClick={() => {}}>
//           Submit
//         </IonButton> */}
//       </IonCardContent>
//     </IonCard>
//   </>
// );
