import './TeamCard.css';

import React from 'react';
import { IonCard, IonLabel, IonItem } from '@ionic/react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

const strokeColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };

const TeamCard = function ({ team, order }) {

  return (
    <IonCard className="team-card">
      <IonItem>
        <div className="progress-wrapper">
          <CircularProgressbarWithChildren
            value={team.overall.completion * 100}
            styles={{
              path: {
                stroke: strokeColors[order] || 'var(--ion-color-success)',
                strokeLinecap: 'butt',
              },
              trail: {
                stroke: 'var(--ion-color-light)',
              },
            }}
          >
            {order}
          </CircularProgressbarWithChildren>
        </div>
        <IonLabel>
          <h2>{team.name}</h2>
          <p>{team.userCount} member(s)</p>
        </IonLabel>
        <IonLabel slot="end" className="progress ion-text-end">
          <h2>{Math.round(team.overall.completion * 100)}%</h2>
          <p>{Math.round(team.overall.minutes)} mins / {Math.round(team.overall.target)} mins target</p>
        </IonLabel>
      </IonItem>
    </IonCard>
  );
};

export default TeamCard;