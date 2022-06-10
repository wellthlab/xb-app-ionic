/**
 * Present enrollment options for a box/experiment. This is a convenience widget
 * that kicks off the /start/ flow.
 *
 * @arg boxtype: The box type that can be enrolled in
 */

import React, { useState } from "react";

import {
  IonIcon,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonCheckbox,
} from "@ionic/react";
import { warning } from "ionicons/icons";

const Disclaimer = ({ checkbox, onToggle }) => {
  const [checked, setChecked] = useState(false);

  function change(e) {
    var checked = e.currentTarget.checked;
    setChecked(checked);
    onToggle(checked);
  }

  let check = "";
  if (checkbox) {
    check = (
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              color="danger"
              checked={checked}
              onIonChange={change}
            />
            <p>
              I understand that physical activity can pose the risk of injury,
              and I have checked that it is safe for me to take part
            </p>
          </IonItem>
        </IonCol>
      </IonRow>
    );
  }

  return (
    <IonGrid className="disclaimer">
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            <IonIcon icon={warning} slot="start" />
            <div className="ion-text-justify">
              <p>
                Exercise is safe and beneficial for most people, but some people
                should check with their doctor before changing their physical
                activity patterns. Use the{" "}
                <a href="https://forms.office.com/r/gnYJRRAkRd" target="_blank">
                  PAR Questionnaire
                </a>{" "}
                and/or consult your GP before engaging in physical activity.
              </p>
            </div>
          </IonItem>
        </IonCol>
      </IonRow>
      {check}
    </IonGrid>
  );
};

export default Disclaimer;
