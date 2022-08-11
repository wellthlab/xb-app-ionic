import {
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardContent,
  IonItemGroup,
  IonItem,
  IonText,
} from "@ionic/react";
import parse from "html-react-parser";

function Text({ task }) {
  let textArr = task.instructions.trim();

  // Each paragraph is assumed to be a separate element in an array.
  // It if is a string, then convert it to an array with one element.
  if (typeof textArr !== "string" && typeof textArr !== "object") {
    return (
      <>
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonText>
                <h1>There has been an issue getting the task instructions.</h1>
              </IonText>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </>
    );
  } else if (typeof textArr === "string") {
    textArr = textArr ? textArr.split("\n") : [null];
  }

  // Map array elements into something that can be rendered in an IonGroup where
  // each array element is on a separate row.
  const instructionText = textArr.map((text) => {
    return (
      <IonRow>
        <IonCol>
          <IonText>
            {text !== null
              ? parse(text)
              : "No instructions are available for this task."}
          </IonText>
        </IonCol>
      </IonRow>
    );
  });

  return (
    <IonCard>
      <IonCardContent>
        <IonGrid>
          <IonItem
            className="ion-text-justify"
            lines="none"
            style={{ "--padding-start": "10px" }}
          >
            <IonItemGroup>{instructionText}</IonItemGroup>
          </IonItem>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

export default Text;
