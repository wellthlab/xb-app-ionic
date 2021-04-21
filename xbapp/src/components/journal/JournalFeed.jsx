import React, { Component } from "react";
import { Link } from "react-router-dom";
import { IonCard, IonButton, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle, IonList, IonItem, IonIcon } from "@ionic/react";
import { connect } from "react-redux";

import { getMove } from "../strength/MovementPicker"

import { heart, arrowForward, caretForward, timer } from "ionicons/icons";

import "./JournalFeed.css";

import { MoodImages, MoodStringsAbsolute } from "../user_input/MoodPicker";

const JournalFeed = ({responses}) => {

  function renderItem( r ) {

    var content;

    var time = r.submitted.substring(11, 16);

    switch (r.type) {
      case 'note':
        content = <>
          <IonCardHeader>
            <IonCardSubtitle>{time} &nbsp; NOTE</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{r.note}</p>
          </IonCardContent>
        </>;
        break;

      case 'minutes':

        if(r.minutes < 1)
          return false;

        content = <>
          <IonCardHeader>
            <IonCardSubtitle>{time} &nbsp; MOVEMENT MINUTES</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>You added <strong>{r.minutes} minutes of { r.location ? r.location : ""} movement</strong></p>
          </IonCardContent>
        </>;
        break;

      case 'strength':
        content = <>
          <IonCardHeader>
            <IonCardSubtitle>{time} &nbsp; DAILY STRENGTH EXERCISE</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
            {
              Object.keys(r.sets).map((type, i) => {
                var move = getMove(type);
                if(move == false) {
                  move = {
                    name: "Unknown move, " + type
                  }
                }
                var mname = move.name.split(/:/).pop();
                var number = r.sets[type];
                console.log(type, number);
                return <IonItem key={i}>
                  <span>{number == 'explore' ? ('Tried out') : ("")} {mname} <strong>{number == 'explore' ? ('') : ("× " + number)}</strong></span>
                </IonItem>
              })
            }
            </IonList>
            <p style={{fontWeight: "bold", fontSize: "1.2em"}}><span><IonIcon icon={heart} /> {r.preHeartrate}</span>
            <IonIcon icon={arrowForward} /> <span>{r.heartrate}</span></p>
          </IonCardContent>
        </>;
        break;

      case 'assessment':
        content = <>
        <IonCardHeader>
          <IonCardSubtitle>{time} &nbsp; STRENGTH ASSESSMENT</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem key="plank">
              <span>Plank Time <strong>{r.plankTime} secs</strong> </span>
            </IonItem>

            <IonItem key="wall">
              <span>Wall Sit Time <strong>{r.wallTime} secs</strong> </span>
            </IonItem>

            <IonItem key="poms">
              <span>POMS Mood Disturbance <strong>{r.poms["Total Mood Disturbance"]}</strong></span>
            </IonItem>

            {
              Object.keys(r.poms).map((type, number) => {
                if(type == "Total Mood Disturbance") {  return; } // Skip; this is the headline number

                return <IonItem key={"poms-" + number}>
                  <IonIcon icon={caretForward} slot="start" /><span>{type} <strong>{number}</strong></span>
                </IonItem>
              })
            }
          </IonList>
        </IonCardContent>
        </>;
        break;

      case 'questionnaire':



        content = <>
          <IonCardHeader>
            <IonCardSubtitle>{time} &nbsp; DAILY REVIEW</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem key="light">
                { r.sunlight == "sunlight" ? "Got some sunlight today" : "Did not get any sunlight today" }
              </IonItem>

              <IonItem key="alarm">
                { r.alarm == "woke up with no alarm" ? "Woke up without an alarm" : "Woke up with an alarm" }
              </IonItem>

              { r.mood > 0 ?
                <IonItem key="mood">
                  <img src={ "assets/mood/" + MoodImages[r.mood] } />
                  Your mood was {MoodStringsAbsolute[r.mood]}
                </IonItem>
                : ""
              }

            </IonList>
          </IonCardContent>
        </>;
        break;

      default:
        content = <>Unknown response type: {r.type}</>;
    }

    return content;
  }


  // Sort responses into reverse date order
  var sresponses = [...responses].sort( (a,b) => {
    var btime = Date.parse(b.submitted);
    var atime = Date.parse(a.submitted);

    console.log(a.submitted, atime, b.submitted, btime);

    return btime - Date.parse(a.submitted);
  });

  console.log(sresponses);

  return (
    <div className="journalfeed">
      {sresponses.map((item, i) => {
        var content;

        var content = renderItem(item);

        return <IonCard key={item.type + "-" + item.submitted}>{content}</IonCard>;
      })}
    </div>
  );
}

export default JournalFeed;
