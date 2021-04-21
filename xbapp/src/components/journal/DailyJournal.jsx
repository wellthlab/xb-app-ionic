import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { IonCard, IonButton, IonList, IonItem, IonListHeader, IonLabel, IonIcon } from "@ionic/react";
import { connect } from "react-redux";

import JournalFeed from './JournalFeed';

import { getMove } from "../strength/MovementPicker"

import { heart, arrowForward, caretForward, timer, caretBackCircle, caretForwardCircle,
  checkmarkCircleOutline, closeCircleOutline, add, listOutline } from "ionicons/icons";

import "./DailyJournal.css";

/**
 * Props:
    day: Day number to show
    date: Date of the day being shown
    responses: Responses to render in journal
    children: Child elements; rendered in a control area. Use for buttons etc.
 *
 */
const DailyJournal = ({todayNumber, entries, children, group}) => {

  // Track the day we're displaying; default to current day
  const [activeDay, setActiveDay] = useState(todayNumber);

  // Look up the daily entry we need to render
  var entry;
  var dayList = [];
  for(var i in entries) {
    if(entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  if(typeof entry == 'undefined') {
    return <>Can't find entry for day {activeDay}</>
  }

  const nextDayExists = dayList.includes(activeDay + 1);
  const prevDayExists = dayList.includes(activeDay - 1);

  var icon_done = checkmarkCircleOutline;
  var icon_missing = closeCircleOutline;

  /**
   * Daily task list and buttons
   */
  var qreq = [
    { type: "strength", desc: "Do your Daily Strength Exercise", verb: "DO IT" },
    { type: "minutes", desc: "Add Movement Minutes", verb: "ADD" },
    { type: "questionnaire", desc: "Fill in the Daily Review", verb: "DO IT" },
  ];

  var day = entry.day;
  if(day == 1 || day == 22 || day == 36) {
    qreq.push({ type: "assessment", desc: "Strength Assessment" })
  }

  var tasks = qreq.map((type) => {
    var done = typeof entry.responseTypes[type.type] !== "undefined";

    console.log(type.type, done);

    return (
      <IonItem color={done ? "success" : "danger"} key={type.type} routerLink={"/group/" + group._id + "/" + activeDay + "/add/" + type.type}>
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
          {type.desc}
        <span slot="end">{type.verb} NOW <IonIcon icon={arrowForward} /></span>
        </IonItem>
    );
  });

  // For today, show buttons
  if(activeDay == todayNumber) {
    var buttons = <div className="journalbuttons">
        <IonButton routerLink={"/group/" + group._id + "/" + activeDay + "/add/note"}>Add Note</IonButton>
      </div>
  }

  var responses = entry.responses;

  return (
    <>
      <div className="journalHeader">
        <h3>Day {day} : {entry.date}
        <span className="navbuttons">
        { prevDayExists ? <IonButton onClick={() => { setActiveDay(activeDay - 1); }}><IonIcon icon={caretBackCircle} /></IonButton> : "" }
        { nextDayExists ? <IonButton onClick={() => { setActiveDay(activeDay + 1); }}><IonIcon icon={caretForwardCircle} /></IonButton> : "" }
        </span></h3>
      </div>
      { activeDay == todayNumber ? <>
        <IonList className="journalTasks">
          <IonListHeader>
            <IonLabel>  <IonIcon icon={listOutline} /> Today's Tasks</IonLabel>
          </IonListHeader>
          { tasks }
        </IonList>
        { buttons }
        </> : ""
      }
      <JournalFeed responses={responses} />
    </>
  );
}

export default DailyJournal;
