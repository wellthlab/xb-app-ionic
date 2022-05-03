import {
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonItemGroup,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import parse from "html-react-parser";

function TaskInstructions({ task }) {
  let textArr = task.text;

  // Each paragraph is assumed to be a separate element in an array.
  // It if is a string, then convert it to an array with one element.
  if (typeof textArr !== "string" && typeof textArr !== "object") {
    console.error("Unknown type for task.text: " + typeof textArr);
    return (
      <>
        <IonCard>
          <IonCardContent>
            <IonItem>
              <div class="ion-text-justify">
                There has been an issue getting the task instructions.
              </div>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </>
    );
  } else if (typeof textArr === "string") {
    textArr = [textArr];
  }

  // Map array elements into something that can be rendered in an IonGroup where
  // each array element is on a separate row.
  const instructionText = task.text.map((text) => {
    return (
      <IonRow>
        <IonCol>
          <IonText>{parse(text)}</IonText>
        </IonCol>
      </IonRow>
    );
  });

  return (
    <IonCard>
      <IonCardContent>
        <IonGrid>
          <IonItem className="ion-text-justify" lines="none">
            <IonItemGroup>{instructionText}</IonItemGroup>
          </IonItem>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

export default TaskInstructions;
