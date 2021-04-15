import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  CreateAnimation,
  Animation,
} from "@ionic/react";
import "./MovementInfoCard.css";

/**
 * Show info about a specific movement
 * props:
    text: a text description
    name: a short name for the movement
    images: a list of images to show what to do
 * Supports composition, so child elements can be added (appear after the text description)
 */
const MovementInfoCard = (props) => {
  // TODO: Show more than one image; use a carousel? Or just fade nicely every second?
  function power() {}
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{props.name}</IonCardTitle>
        <figure id="promo">
          <img src={"assets/moves/" + props.images[0]} className="A" />
          <img src={"assets/moves/" + props.images[1]} className="B" />
        </figure>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </IonCardHeader>
      <IonCardContent>
        <p>{props.text}</p>
        {props.children}
      </IonCardContent>
    </IonCard>
  );
};

export default MovementInfoCard;
