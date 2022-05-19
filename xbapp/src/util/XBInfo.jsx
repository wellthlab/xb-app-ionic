import {
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonText,
} from "@ionic/react";

/**
 * Component to display a title and description/instructions/information in
 * an Ion Item. Tends to be used at the top of the page.
 * TODO: put styling in css
 *
 * @param title
 * @param desc
 * @param opt
 *
 * @returns {JSX.Element}
 */
function XBInfo({ title, desc, opt }) {
  return (
    <IonGrid className="ion-no-padding" style={{ "--padding-bottom": "10px" }}>
      {title ? (
        <IonItem lines="none">
          <IonLabel className="ion-text-center">
            <IonText className="ion-text-big">
              <strong>{title}</strong>
            </IonText>
          </IonLabel>
        </IonItem>
      ) : (
        ""
      )}
      {desc ? (
        <IonItem
          lines="none"
          className="ion-text-justify"
          style={{
            "--padding-bottom": "10px",
            "--padding-start": "25px",
            "--inner-padding-end": "25px",
          }}
        >
          <IonRow>
            <IonCol>
              <IonText>{desc}</IonText>
            </IonCol>
          </IonRow>
        </IonItem>
      ) : (
        ""
      )}
      {opt ? <IonItem lines="none">{opt}</IonItem> : ""}
    </IonGrid>
  );
}

export default XBInfo;
