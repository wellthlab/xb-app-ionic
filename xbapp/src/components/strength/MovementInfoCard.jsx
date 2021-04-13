import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";

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
  return (
    <IonCard>
      <img src={"assets/moves/" + props.images[0]} alt="" />
      <IonCardHeader>
        <IonCardTitle>{props.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>{props.text}</p>
        {props.children}
      </IonCardContent>
    </IonCard>
  );
};

export default MovementInfoCard;
