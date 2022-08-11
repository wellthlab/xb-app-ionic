import "./TeamList.css";

import React from "react";
import { IonCard, IonLabel, IonItem } from "@ionic/react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

const strokeColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CircularProgress = function ({ value, color, content }) {
  return (
    <CircularProgressbarWithChildren
      value={value * 100}
      styles={{
        path: {
          stroke: color || "var(--ion-color-success)",
          strokeLinecap: "butt",
        },
        trail: {
          stroke: "var(--ion-color-light)",
        },
      }}
    >
      {content}
    </CircularProgressbarWithChildren>
  );
};

const TeamList = function ({ teams }) {
  return (
    <div className="team-list">
      {teams.map((team, i) => (
        <IonCard key={team._id} className="team-card">
          <IonItem>
            <div className="progress-wrapper">
              <CircularProgress
                value={team.overall.completion}
                color={strokeColors[i]}
                content={i + 1}
              />
            </div>
            <IonLabel>
              <h2>{team.name}</h2>
              <p>{team.userCount} member(s)</p>
            </IonLabel>
            {team.overall.dailyBreakdown && (
              <div className="breakdown-wrapper">
                {daysOfWeek.map((day, i) => (
                  <div className="breakdown-progress" key={i}>
                    {day}
                    <CircularProgress
                      value={team.overall.dailyBreakdown[i] || 0}
                      content={
                        team.overall.dailyBreakdown[i]
                          ? Math.round(team.overall.dailyBreakdown[i] * 100)
                          : "N/A"
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            <IonLabel className="progress ion-text-end">
              <h2>{Math.round(team.overall.completion * 100)}%</h2>
              <p>
                {Math.round(team.overall.cappedMinutes)} mins /{" "}
                {Math.round(team.overall.target)} mins target
              </p>
            </IonLabel>
          </IonItem>
        </IonCard>
      ))}
    </div>
  );
};

export default TeamList;
