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
  IonText,
  IonIcon,
  IonLabel,
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

    switch (r.intype) {
      case "s22journal":
      case "note":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="ion-text-justify">
              <IonText>{r.note}</IonText>
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
                <IonItem>Rated DOMS: {r.doms}</IonItem>
                <IonItem>
                  Did this exercise {r.workQ}, whilst being in the next
                  location: {r.workQ2}.
                </IonItem>
                {r.sets == null ? (
                  <>
                    {/* it means it's aerobic day */}
                    <IonItem>{r.aerobic}</IonItem>
                  </>
                ) : (
                  Object.keys(r.sets).map((type, i) => {
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
                              {"× " +
                                Math.floor(number / 5) +
                                " sets and " +
                                (number % 5) +
                                " reps"}
                            </strong>
                          </span>
                        </IonItem>
                      );
                    }
                  })
                )}
                {"balance" in r ? (
                  "EOHS" in r.balance ? (
                    <>
                      <h3>
                        <strong>Balance Assessment Results</strong>
                      </h3>
                      <IonItem>
                        <p>
                          <strong>Eyes Open Head Still</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Capability: {r.balance.EOHS.completed}
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Comfort: {r.balance.EOHS.comfort}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Time: {r.balance.EOHS.time}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <p>
                          <strong>Eyes Closed Head Still</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Capability: {r.balance.ECHS.completed}
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Comfort: {r.balance.ECHS.comfort}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Time: {r.balance.ECHS.time}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <p>
                          <strong>Eyes Open Head Rotation</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Capability: {r.balance.EOHR.completed}
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Comfort: {r.balance.EOHR.comfort}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Time: {r.balance.EOHR.time}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <p>
                          <strong>Eyes Closed Head Rotation</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Capability: {r.balance.ECHR.completed}
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Comfort: {r.balance.ECHR.comfort}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Time: {r.balance.ECHR.time}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <p>
                          <strong>Eyes Open Head Nod</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Capability: {r.balance.EOHN.completed}
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Comfort: {r.balance.EOHN.comfort}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Time: {r.balance.EOHN.time}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <p>
                          <strong>Eyes Closed Head Nod</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Capability: {r.balance.ECHN.completed}
                        </IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Comfort: {r.balance.ECHN.comfort}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Time: {r.balance.ECHN.time}</IonLabel>
                      </IonItem>
                    </>
                  ) : (
                    <>
                      <h3>
                        <strong>Balance Practice Results</strong>
                      </h3>
                      <IonItem>
                        <p>
                          <strong>Head Rotation</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Eyes: {r.balance.rotation.eye}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Sets/Reps: {Math.trunc(r.balance.rotation.reps / 5)}{" "}
                          sets and {r.balance.rotation.reps % 5} reps
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <p>
                          <strong>Head Nod</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Eyes: {r.balance.nod.eye}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Sets/Reps: {Math.trunc(r.balance.nod.reps / 5)} sets
                          and {r.balance.nod.reps % 5} reps
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <p>
                          <strong>Head Diagonal Nod (1)</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Eyes: {r.balance.diag_left.eye}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Sets/Reps: {Math.trunc(r.balance.diag_left.reps / 5)}{" "}
                          sets and {r.balance.diag_left.reps % 5} reps
                        </IonLabel>
                      </IonItem>

                      <IonItem>
                        <p>
                          <strong>Head diagonal Nod (2)</strong>
                        </p>
                      </IonItem>
                      <IonItem>
                        <IonLabel>Eyes: {r.balance.diag_right.eye}</IonLabel>
                      </IonItem>
                      <IonItem>
                        <IonLabel>
                          Sets/Reps: {Math.trunc(r.balance.diag_right.reps / 5)}{" "}
                          sets and {r.balance.diag_right.reps % 5} reps
                        </IonLabel>
                      </IonItem>
                    </>
                  )
                ) : (
                  <></>
                )}
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
                        {type} <strong>{r.poms[type]}</strong>
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
              <IonCardSubtitle>{time} &nbsp; WORK ASSESSMENT</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {r.explanation.split(";").map((explanation, i) => (
                <p key={i}>{explanation}</p>
              ))}
            </IonCardContent>
          </>
        );
        break;

      case "scheduler":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; SCHEDULING</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>{r.scheduling}</IonCardContent>
          </>
        );
        break;

      case "poms":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; POMS</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
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
            </IonCardContent>
          </>
        );
        break;

      case "plank":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; The Plank</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem key="plank">
                <span>
                  Plank Time <strong>{r.plankTime} secs</strong>{" "}
                </span>
              </IonItem>
            </IonCardContent>
          </>
        );
        break;

      case "heartrate":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Heart Rate</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                <span>
                  Have learnt how to do a heart rate!
                  <br></br>
                  <IonIcon icon={heart} />
                </span>
                <IonIcon icon={arrowForward} /> <span>{r.heartrate}</span>
              </p>
            </IonCardContent>
          </>
        );
        break;

      case "wallsit":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Wall Sit</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem key="wall">
                <span>
                  Wall Sit Time <strong>{r.wallTime} secs</strong>{" "}
                </span>
              </IonItem>
            </IonCardContent>
          </>
        );
        break;

      case "quiz":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; This week's quiz!</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <span>
                  You answered <strong>{r.isRightAnswer}</strong> to this week's
                  quiz: {r.question} {r.answer}. {r.explanation}
                </span>
              </IonItem>
            </IonCardContent>
          </>
        );
        break;

      case "pushpull":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>
                {time} &nbsp; You read about Pushes and Pulls
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <span>
                  You have read about pushes and pulls and are now ready to
                  proceed to next week, where you will be using this knowledge
                  further!
                </span>
              </IonItem>
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

      case "questionnaire-evening":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>
                {time} &nbsp; DAILY EVENING REVIEW
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem key="felt">
                  In general, I felt good today.
                  <br></br>
                  Rating {r.felt} on a scale from 0 (not at all) to 10 (a lot).
                </IonItem>
              </IonList>
            </IonCardContent>
          </>
        );
        break;

      case "questionnaire-endWeek":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; WEEKLY REFLECTION</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                <IonItem>{r.benefit}</IonItem>
                <IonItem>{r.easier}</IonItem>
                <IonItem>{r.scheduling}</IonItem>
                <IonItem>{r.building}</IonItem>
                <IonItem>{r.busy}</IonItem>
              </IonList>
            </IonCardContent>
          </>
        );
        break;

      // Stuff added for Strength22

      case "s22other":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Your own thing</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              For {r.minutes} minutes, you did some {r.movement}
            </IonCardContent>
          </>
        );
        break;

      case "s22video":
      case "s22assessedvideo":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Video</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              You watched a video and recorded some movement
            </IonCardContent>
          </>
        );
        break;

      case "s22weblink":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Weblink</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>You visited {r.link} on the web</IonCardContent>
          </>
        );
        break;

      case "s22edtset":
        const moveA = r.exercises[0].name;
        const moveB = r.exercises[1].name;
        const technique = r.exercises[0].technique;
        const type = r.exercises[0].type;
        const reps = r.reps;
        const sets = r.sets;
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>
                {time} &nbsp; {technique[0].toUpperCase() + technique.slice(1)}{" "}
                {type} EDT set
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              You did {sets} sets and {reps} reps of {moveA}s and {moveB}s in{" "}
              {r.minutes} minutes!
            </IonCardContent>
          </>
        );
        break;

      case "s22questions":
        const atHome = r.atHomeOrWork;
        const indoors = r.indoorsOrOutdoors;
        const timeOfDay = r.timeOfDay;
        const whoWith = r.whoWith;
        // const workDay = r.workDay;

        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>
                {time} &nbsp; Movement questions
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {atHome && indoors && timeOfDay && whoWith ? (
                <>
                  {" "}
                  {timeOfDay === "Midday"
                    ? "At midday"
                    : "In the " + timeOfDay.toLowerCase()}
                  , you did some movement {indoors.toLowerCase()} at{" "}
                  {atHome.toLowerCase()}{" "}
                  {whoWith === "Alone" ? "by yourself" : "with others"}.
                </>
              ) : (
                "You told us a bit about how you moved"
              )}
            </IonCardContent>
          </>
        );
        break;

      case "s22quiz":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Quiz</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>You answered some quiz questions</IonCardContent>
          </>
        );
        break;

      case "s22manage":
        const attempts = [r["attempt-1"], r["attempt-2"], r["attempt-3"]];
        const successes = attempts.filter((e) => e === "yes").length;

        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Video</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              You watched a video and tried some movement
              {successes > 0 ? (
                <>
                  {successes === 1 ? (
                    <>, which you successfully did once</>
                  ) : (
                    <>, which you successfully did {successes} times</>
                  )}
                </>
              ) : (
                ""
              )}
            </IonCardContent>
          </>
        );
        break;

      case "s22instructions":
        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Movement task</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              You followed along with some movement instructions
            </IonCardContent>
          </>
        );
        break;

      case "previous-day":
        let subContent;
        if (r.playlistName) {
          subContent = (
            <>
              You entered {r.minutes} movement minutes for the {r.playlistName}{" "}
              playlist in the {r.moduleName} module
            </>
          );
        } else {
          subContent = (
            <>You entered some movement minutes for a playlist you did past</>
          );
        }

        content = (
          <>
            <IonCardHeader>
              <IonCardSubtitle>{time} &nbsp; Manual movement</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>{subContent}</IonCardContent>
          </>
        );
        break;

      default:
        content = (
          <>
            <IonCardContent>Unknown task type {r.intype}</IonCardContent>
          </>
        );
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
      {sresponses.length ? (
        <>
          {sresponses.map((item, i) => {
            const content = renderItem(item);
            return (
              <IonCard key={item.intype + "-" + item.submitted}>
                {content}
              </IonCard>
            );
          })}
        </>
      ) : (
        <>
          <IonCard>
            <IonCardContent>
              <IonText className="ion-text-center">
                <h1>There is nothing to show</h1>
              </IonText>
            </IonCardContent>
          </IonCard>
        </>
      )}
    </div>
  );
};

export default JournalFeed;
