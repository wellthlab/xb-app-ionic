import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons,
} from "@ionic/react";
import React from "react";

import parse from 'html-react-parser';

const Instructions = (props) => {
  return <div className="instructions">{parse(props.html)}</div>;
};

export default Instructions;
