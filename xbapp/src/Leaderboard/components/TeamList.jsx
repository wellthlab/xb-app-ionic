import './TeamList.css';

import React from 'react';
import { IonCard, IonLabel, IonItem } from '@ionic/react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

const strokeColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

const TeamList = function ({ teams }) {

  return (
    <div className="team-list">
      {teams.map((team, i) => (
        <IonCard key={team._id} className="team-card">
          <IonItem>
            <div className="progress-wrapper">
              <CircularProgressbarWithChildren
                value={team.overall.completion * 100}
                styles={{
                  path: {
                    stroke: strokeColors[i] || 'var(--ion-color-success)',
                    strokeLinecap: 'butt',
                  },
                  trail: {
                    stroke: 'var(--ion-color-light)',
                  },
                }}
              >
                {i + 1}
              </CircularProgressbarWithChildren>
            </div>
            <IonLabel>
              <h2>{team.name}</h2>
              <p>{team.userCount} member(s)</p>
            </IonLabel>
            <IonLabel slot="end" className="progress ion-text-end">
              <h2>{Math.round(team.overall.completion * 100)}%</h2>
              <p>{Math.round(team.overall.cappedMinutes)} mins / {Math.round(team.overall.target)} mins target</p>
            </IonLabel>
          </IonItem>
        </IonCard>
      ))}
    </div>
  );
};

export default TeamList;