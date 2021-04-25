import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import {
  IonCard,
  IonButton,
  IonList,
  IonItem,
  IonItemGroup,
  IonItemDivider,
  IonListHeader,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { connect } from "react-redux";

import {
  heart,
  arrowForward,
  caretForward,
  timer,
  caretBackCircle,
  caretForwardCircle,
  checkmarkCircleOutline,
  closeCircleOutline,
  add,
  addCircle,
  listOutline,
  checkboxOutline,
  squareOutline,
  arrowForwardOutline,
} from "ionicons/icons";

/**
 * Props:
 *
 */
const DailyActions = ({ group, activeDay }) => {
  var entries = group.entries;

  // Look up the daily entry we need to render
  var entry;
  var dayList = [];
  for (var i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  if (typeof entry == "undefined") {
    return <>Can't find entry for day {activeDay}</>;
  }

  var icon_done = checkboxOutline;
  var icon_missing = squareOutline;

  /**
   * Daily task list and buttons
   */
  var qreq = [
    { type: "questionnaire", desc: "Fill in the Daily Review", verb: "DO IT" }
  ];

  // Other tasks that can be done, but optionally
  var others = [
    { type: "note", desc: "Add Notes", verb: "ADD NOTES" },
    { type: "minutes", desc: "Add Movement Minutes", verb: "ADD" }
  ];

  // Strength exercise only on week days
  var day = (new Date()).getDay();
  if( day == 0 || day == 6) {
    others.push({ type: "strength", desc: "Do your Daily Strength Exercise", verb: "DO IT" });
  } else {
    qreq.push({ type: "strength", desc: "Do your Daily Strength Exercise", verb: "DO IT" });
  }

  var day = entry.day;
  if (day == 1 || day == 22 || day == 36) {
    qreq.push({
      type: "assessment",
      desc: "Do a Strength Assessment",
      verb: "DO IT",
    });
  } else {
    others.push({
      type: "assessment",
      desc: "Do a Strength Assessment",
      verb: "DO IT",
    });
  }

  var tasks = qreq.map((type) => {
    var done = typeof entry.responseTypes[type.type] !== "undefined";

    console.log(type.type, done);

    return (
      <IonItem color={done ? "neutral" : "warning"} key={type.type} routerLink={"/group/" + group._id + "/" + activeDay + "/add/" + type.type} detail={true} detailIcon={arrowForwardOutline}>
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {type.desc}
        {/* <span slot="end">{type.verb} NOW <IonIcon icon={arrowForward} /></span> */}
      </IonItem>
    );
  });

  var otheractions = others.map((type) => {
    var done = typeof entry.responseTypes[type.type] !== "undefined";
    return (
      <IonItem
        key={type.type}
        routerLink={
          "/group/" + group._id + "/" + activeDay + "/add/" + type.type
        }
        detail={true}
        detailIcon={arrowForwardOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {type.desc}
        {/* span slot="end">{type.verb} NOW <IonIcon icon={arrowForward} /></span> */}
      </IonItem>
    );
  });

  var responses = entry.responses;

  return (
    <div className="dailyActions">
      <IonList lines="full" className="journalTasks">
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Today's Tasks</IonLabel>
          </IonItemDivider>
          {tasks}
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Other Activities</IonLabel>
          </IonItemDivider>
          {otheractions}
        </IonItemGroup>
      </IonList>
    </div>
  );
};

export default DailyActions;
