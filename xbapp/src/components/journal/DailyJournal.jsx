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

import JournalFeed from "./JournalFeed";

import { getMove } from "../strength/MovementPicker";

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
} from "ionicons/icons";

import "./DailyJournal.css";

/**
 * Props:
    day: Day number to show
    date: Date of the day being shown
    responses: Responses to render in journal
    children: Child elements; rendered in a control area. Use for buttons etc.
 *
 */
const DailyJournal = ({ todayNumber, entries, children, group }) => {
  // Track the day we're displaying; default to current day
  const [activeDay, setActiveDay] = useState(todayNumber);

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

  const nextDayExists = dayList.includes(activeDay + 1);
  const prevDayExists = dayList.includes(activeDay - 1);

  var responses = entry.responses;

  return (
    <>
      <div className="journalHeader">
        <h3>
          Day {activeDay} : {entry.date}
          <span className="navbuttons">
            {
              <IonButton
                disabled={!prevDayExists}
                onClick={() => {
                  setActiveDay(activeDay - 1);
                }}
              >
                <IonIcon icon={caretBackCircle} />
              </IonButton>
            }
            {
              <IonButton
                disabled={!nextDayExists}
                onClick={() => {
                  setActiveDay(activeDay + 1);
                }}
              >
                <IonIcon icon={caretForwardCircle} />
              </IonButton>
            }
          </span>
        </h3>
        {children}
      </div>
      <JournalFeed responses={responses} />
    </>
  );
};

export default DailyJournal;
