import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenuButton,
  IonButtons,
} from "@ionic/react";
import React from "react";

var parse = require("html-react-parser");

const Instructions = (props) => {
  return <div>{parse(props.html)}</div>;
};

export default Instructions;
