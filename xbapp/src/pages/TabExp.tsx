import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './TabExp.css';

const TabExp: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Experiments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Experiments</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Experiments page" />
      </IonContent>
    </IonPage>
  );
};

export default TabExp;
