import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonTitle,
  IonDatetime,
  IonHeader,
} from "@ionic/react";
import "./RecordMovement.scss";
import { connect } from "react-redux";
import XBHeader from "../util/XBHeader";

function RecordMovement(props) {
  const [activeDay, setActiveDay] = useState(new Date());
  const [tasks, setTasks] = useState(null);

  // let entry;
  // let entries = group.entries;
  // let dayList = [];
  // for (var i in entries) {
  //   if (entries[i].day === activeDay) {
  //     entry = entries[i];
  //   }
  //   dayList.push(entries[i].day);
  // }
  //
  // if (typeof entry === "undefined") {
  //   return <>Can't find entry for day {activeDay}</>;
  // }

  const loadTasks = async function (dates) {};

  useEffect(() => {
    loadTasks(activeDay);
  }, []);

  let content;

  if (!tasks) {
    content = (
      <>
        <IonTitle>You have no tasks today.</IonTitle>
      </>
    );
  } else {
    content = "You have tasks today.";
  }

  const date = new Date().toString();

  return (
    <IonPage>
      <XBHeader title="Add Movement"></XBHeader>
      <IonContent fullscreen>
        <IonHeader>
          <IonDatetime value={date} color="light" />
        </IonHeader>
        {content}
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    account: state.account,
    teams: state.teams,
    boxes: state.boxes,
  };
}, {})(RecordMovement);
