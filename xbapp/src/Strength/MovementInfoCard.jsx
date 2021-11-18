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

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  // console.log(props);
  function power() {}
  return (
    <>
      {props.accordion ? (
        <Accordion className="titleDrop">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            className={props.titleSize}
          >
            <Typography className={props.titleSize}>{props.name}</Typography>
          </AccordionSummary>
          <AccordionDetails className="detailsAcc" style={{padding: "0px"}}>
            <figure id="promo" style={{marginTop: "0px", marginBottom: "0px"}}>
              <img src={"assets/moves/" + props.images[0]} className="A" />
              <img src={"assets/moves/" + props.images[1]} className="B" />
            </figure>
          </AccordionDetails>
        </Accordion>
      ) : (
        <IonCard style={{margin: "0px"}}>
          <IonCardHeader>
            <IonCardTitle className={props.titleSize}>
              {props.name}
            </IonCardTitle>
            <figure id="promo" style={{marginTop: "0px", marginBottom: "0px"}}>
              <img src={"assets/moves/" + props.images[0]} className="A" />
              <img src={"assets/moves/" + props.images[1]} className="B" />
            </figure>
          </IonCardHeader>
          <IonCardContent>
            <p>{props.text}</p>
            {props.children}
          </IonCardContent>
        </IonCard>
      )}
    </>
  );
};

export default MovementInfoCard;
