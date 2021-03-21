import React, { useState } from "react";
import { IonList, IonItem, IonLabel, IonModal, IonButton } from "@ionic/react";

var chosen_box = [];
const BoxesList = ({ boxes }) => {
  const [myModal, setMyModal] = useState({ isOpen: false });
  var box_move_info = [],
    box_engage_info = [],
    box_eat_info = [],
    box_cogitate_info = [],
    box_sleep_info = [];

  for (const [index, box] of boxes.entries()) {
    if (box.category == "Move") {
      box_move_info.push(
        <IonItem
          onClick={() => {
            setMyModal({ isOpen: true });
            chosen_box = box;
          }}
        >
          <img
            style={{ width: "100px", resize: "both" }}
            src="assets/move.png"
            alt="XB Logo"
          />
          <IonLabel>
            <b>{box.name}</b>
            <br></br>
            {box.blurb}
          </IonLabel>
        </IonItem>
      );
    } else if (box.category == "Engage") {
      box_engage_info.push(
        <IonItem
          onClick={() => {
            setMyModal({ isOpen: true });
            chosen_box = box;
          }}
        >
          <img
            style={{ width: "100px", resize: "both" }}
            src="assets/engage.png"
            alt="XB Logo"
          />
          <IonLabel>
            <b>{box.name}</b>
            <br></br>
            {box.blurb}
          </IonLabel>
        </IonItem>
      );
    } else if (box.category == "Eat") {
      box_eat_info.push(
        <IonItem
          onClick={() => {
            setMyModal({ isOpen: true });
            chosen_box = box;
          }}
        >
          <img
            style={{ width: "100px", resize: "both" }}
            src="assets/eat.png"
            alt="XB Logo"
          />
          <IonLabel>
            <b>{box.name}</b>
            <br></br>
            {box.blurb}
          </IonLabel>
        </IonItem>
      );
    } else if (box.category == "Cogitate") {
      box_cogitate_info.push(
        <IonItem
          onClick={() => {
            setMyModal({ isOpen: true });
            chosen_box = box;
          }}
        >
          <img
            style={{ width: "100px", resize: "both" }}
            src="assets/cogitate.png"
            alt="XB Logo"
          />
          <IonLabel>
            <b>{box.name}</b>
            <br></br>
            {box.blurb}
          </IonLabel>
        </IonItem>
      );
    } else if (box.category == "Sleep") {
      box_sleep_info.push(
        <IonItem
          onClick={() => {
            setMyModal({ isOpen: true });
            chosen_box = box;
          }}
        >
          <img
            style={{ width: "100px", resize: "both" }}
            src="assets/sleep.png"
            alt="XB Logo"
          />
          <IonLabel>
            <b>{box.name}</b>
            <br></br>
            {box.blurb}
          </IonLabel>
        </IonItem>
      );
    }
  }

  return (
    <div>
      <IonModal isOpen={myModal.isOpen}>
        <h1 style={{ textAlign: "center" }}>
          <b>{chosen_box.name}</b>
        </h1>
        <h2>{chosen_box.description}</h2>
        <h2>{chosen_box.warning}</h2>
        <IonButton
          onClick={() => setMyModal({ isOpen: false })}
          routerLink={"/experiment/yourself/" + chosen_box._box_id}
        >
          Choose Experiment
        </IonButton>
        <IonButton onClick={() => setMyModal({ isOpen: false })}>
          Close
        </IonButton>
      </IonModal>
      <p>MOVE</p>
      <IonList>{box_move_info}</IonList>
      <p>ENGAGE</p>
      <IonList>{box_engage_info}</IonList>
      <p>EAT</p>
      <IonList>{box_eat_info}</IonList>
      <p>COGITATE</p>
      <IonList>{box_cogitate_info}</IonList>
      <p>SLEEP</p>
      <IonList>{box_sleep_info}</IonList>
    </div>
  );
};
export default BoxesList;
