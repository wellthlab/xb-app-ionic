import React from "react";
import parse from "html-react-parser";
import { IonText } from "@ionic/react";

const Instructions = (props) => {
  return (
    <IonText class="ion-text-justify" className="instructions">
      {parse(props.html)}
    </IonText>
  );
};

export default Instructions;
