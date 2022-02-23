import React from 'react';
import { IonCard, IonItem, IonProgressBar, IonLabel } from '@ionic/react';

const TeamCard = function ({ team, order }) {

  return (
    <IonCard>
      <IonItem>
        <IonLabel>{order}. {team.name}</IonLabel>
        <IonLabel>{team.userCount} member(s)</IonLabel>
        <IonLabel>{Math.round(team.overall.cappedMinutes)} minutes exercised / {Math.round(team.overall.target)} minutes target</IonLabel>
        <IonLabel>
          {Math.round(team.overall.completion * 100)}%
          <IonProgressBar color="success" value={team.overall.completion} />
        </IonLabel>
      </IonItem>
    </IonCard>
  );
};

export default TeamCard;