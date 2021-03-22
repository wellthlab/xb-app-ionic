import React, { Component, useState } from "react";
import { IonIcon, IonButton } from "@ionic/react";
import { peopleOutline, alertOutline, todayOutline, add } from "ionicons/icons";
import { Link } from "react-router-dom";

const ExperimentList = (props) => {
  const { teams } = props;

  //console.log("Render ExperimentList", props);

  return (
    <>
      {teams.map((group, i) => {
        var members = group.users.length;
        var missing = 0; // TODO: Look this up

        var memberchip;
        if (members > 1) {
          memberchip = (
            <ion-chip color="success">
              <ion-label>
                <IonIcon icon={peopleOutline} /> {members}
              </ion-label>
            </ion-chip>
          );
        } else {
          memberchip = (
            <ion-chip color="success">
              <ion-label>
                <IonIcon icon={peopleOutline} /> Private Experiment
              </ion-label>
            </ion-chip>
          );
        }

        var day = group.experiment.day;
        var daydesc =
          day == 0
            ? "Starts tomorrow"
            : day < 0
            ? "Starts in " + Math.abs(day) + " days"
            : "Day " + day;

        if (group.experiment.info === false) {
          return <p>This group has no experiment :(</p>;
        } else {
          return (
            <ion-card key={i}>
              <Link to={"/group/" + group._id}>
                <ion-card-header>
                  <ion-card-title>{group.name}</ion-card-title>
                  <ion-card-subtitle>
                    {group.experiment.info.title}
                  </ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-chip color="primary">
                    <ion-label>
                      <IonIcon icon={todayOutline} /> {daydesc}
                    </ion-label>
                  </ion-chip>
                  {/*<ion-chip color="danger">
                                <ion-label><IonIcon icon={alertOutline} /> {missing} overdue { missing > 1 ? "entries" : "entry" }</ion-label>
                            </ion-chip>*/}
                  {memberchip}
                </ion-card-content>
              </Link>
            </ion-card>
          );
        }
      })}
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <IonButton routerLink="/start">+</IonButton>
      </ion-fab>
    </>
  );
};
export default ExperimentList;
