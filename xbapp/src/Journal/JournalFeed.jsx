import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  IonCard,
  IonButton,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonIcon,
} from "@ionic/react";
import { connect } from "react-redux";

import { getMove } from "../DEPRECATED/components/OLDMovementPicker";

import { heart, arrowForward, caretForward, timer } from "ionicons/icons";

import "./JournalFeed.css";

import { MoodImages, MoodStringsRelative } from "../UserInput/MoodPicker";

const JournalFeed = ({ responses }) => {
  function renderItem(r) {
    var content;

    var time = r.submitted.substring(11, 16);

    switch (r.type) {
      case "note":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; NOTE</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{r.note}</p>
            </IonCardContent>
          </>
        );
        break;

      case "minutes":
        if (r.minutes < 1) return false;

        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; MOVEMENT MINUTES</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                You added{" "}
                <strong>
                  {r.minutes} minutes of {r.location ? r.location : ""} movement
                </strong>
              </p>
            </IonCardContent>
          </>
        );
        break;

      case "strength":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>
                {time} &nbsp; DAILY STRENGTH EXERCISE
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {Object.keys(r.sets).map((type, i) => {
                  var block, mtype;
                  [mtype, block] = type.split(/-/);

                  if (mtype.includes("+")) {
                    // there are 2 moves put together
                    var arrMoves = mtype.split("+");

                    var nameOfBothExercises = "";
                    for (var i = 0; i < 2; i++) {
                      var move = getMove(arrMoves[i]);
                      if (move == false) {
                        move = {
                          name: "Unknown move",
                        };
                      }
                      var mname = move.name;
                      nameOfBothExercises += mname + " and ";
                      var number = r.sets[type];
                    }
                    nameOfBothExercises = nameOfBothExercises.slice(0, -5);
                    return (
                      <IonItem key={i}>
                        <span>
                          {"Tried out "}
                          {nameOfBothExercises}{" "}
                          <strong>
                            {"× " +
                                Math.floor(number / 5) +
                                " sets and " +
                                (number % 5) +
                                " reps"}
                          </strong>
                        </span>
                      </IonItem>
                    );
                  } else {
                    var move = getMove(mtype);
                    if (move == false) {
                      move = {
                        name: "Unknown move",
                      };
                    }
                    var mname = move.name;
                    var number = r.sets[type];
                    return (
                      <IonItem key={i}>
                        <span>
                          {"Tried out "} {mname}{" "}
                          <strong>
                            {"× " + number}
                          </strong>
                        </span>
                      </IonItem>
                    );
                  }
                })}
              </IonList>
              <p style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                <span>
                  <IonIcon icon={heart} /> {r.preHeartrate}
                </span>
                <IonIcon icon={arrowForward} /> <span>{r.heartrate}</span>
              </p>
            </IonCardContent>
          </>
        );
        break;

      case "assessment":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>
                {time} &nbsp; STRENGTH ASSESSMENT
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem key="plank">
                  <span>
                    Plank Time <strong>{r.plankTime} secs</strong>{" "}
                  </span>
                </IonItem>

                <IonItem key="wall">
                  <span>
                    Wall Sit Time <strong>{r.wallTime} secs</strong>{" "}
                  </span>
                </IonItem>

                <IonItem key="poms">
                  <span>
                    POMS Mood Disturbance{" "}
                    <strong>{r.poms["Total Mood Disturbance"]}</strong>
                  </span>
                </IonItem>

                {Object.keys(r.poms).map((type, number) => {
                  if (type == "Total Mood Disturbance") {
                    return;
                  } // Skip; this is the headline number

                  return (
                    <IonItem key={"poms-" + number}>
                      <IonIcon icon={caretForward} slot="start" />
                      <span>
                        {type} <strong>{number}</strong>
                      </span>
                    </IonItem>
                  );
                })}
              </IonList>
            </IonCardContent>
          </>
        );
        break;

        case "work-assessment":
          content = (
            <>
              <IonCardHeader>
                <IonCardSubtitle>
                  {time} &nbsp; WORK ASSESSMENT
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                {r.explanation.split(";").map((explanation, i) => <p key={i}>{explanation}</p>)}
              </IonCardContent>
            </>
          );
          break;
  
      case "questionnaire":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; DAILY REVIEW</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem key="light">
                  {r.sunlight == "sunlight"
                    ? "Got some sunlight today"
                    : "Did not get any sunlight today"}
                </IonItem>

                <IonItem key="alarm">
                  {r.alarm == "woke up with no alarm"
                    ? "Woke up without an alarm"
                    : "Woke up with an alarm"}
                </IonItem>

                {/*if mood exists
                mood passed as argument falls within -2 and 2.
                SO we need to add + 3 in order to correspond to the values on MoodImages and MoodStringsRelative*/}
                {r.mood > -3 ? (
                  <>
                    <IonItem key="mood">
                      <img
                        style={{ width: "100px", height: "auto" }}
                        src={"assets/mood/" + MoodImages[r.mood + 3]}
                      />
                    </IonItem>
                    <IonItem key="mood">
                      Your mood was {MoodStringsRelative[r.mood + 3]} than the
                      previous day
                    </IonItem>
                  </>
                ) : (
                  ""
                )}
              </IonList>
            </IonCardContent>
          </>
        );
        break;

      default:
        content = <>Unknown response type: {r.type}</>;
    }

    return content;
  }

  // Sort responses into reverse date order
  var sresponses = [...responses].sort((a, b) => {
    var btime = Date.parse(b.submitted);
    var atime = Date.parse(a.submitted);

    // console.log(a.submitted, atime, b.submitted, btime);

    return btime - Date.parse(a.submitted);
  });

  // console.log(sresponses);

  return (
    <div className="journalfeed">
      {sresponses.map((item, i) => {
        // console.log(item);
        var content;

        var content = renderItem(item);

        return (
          <IonCard key={item.type + "-" + item.submitted}>{content}</IonCard>
        );
      })}
    </div>
  );
};

export default JournalFeed;
