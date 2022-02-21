import React from 'react';
import { IonCard, IonItem, IonProgressBar, IonLabel } from '@ionic/react';

const TeamCard = function ({ team, order }) {

  return (
    <IonCard>
      <IonItem>
        <IonLabel>{order}. {team.name}</IonLabel>
        <IonLabel>{team.userCount} member(s)</IonLabel>
        <IonLabel>{Math.round(team.overall.minutes)} minutes exercised</IonLabel>
        <IonLabel>
          {Math.round(team.overall.percentage * 100)}%
                    <IonProgressBar color="success" value={team.overall.percentage} />
        </IonLabel>
      </IonItem>
    </IonCard>
  );
};

export default TeamCard;