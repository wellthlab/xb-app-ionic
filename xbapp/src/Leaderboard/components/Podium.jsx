import './Podium.css';

import React from 'react';
import { star } from "ionicons/icons";
import { IonIcon } from '@ionic/react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

const Spotlight = function ({ overall, name }) {

  return (
    <div className="spotlight">
      <CircularProgressbarWithChildren
        value={overall.percentage * 100}
        styles={{
          path: {
            stroke: 'var(--ion-color-success)',
            width: 8,
            strokeLinecap: 'butt',
          },
          trail: {
            stroke: 'var(--ion-color-light)',
          },
        }}
      >
        <span className="score">{Math.round(overall.percentage * 100)}%</span>
        {name}
      </CircularProgressbarWithChildren>
    </div>
  );
};

const Podium = function ({ teams }) {

  return (
    <div className="podium-wrapper">
      {teams[1] && (
        <div className="secondary-spotlight">
          <div className="stars">
            <IonIcon icon={star} />
            <IonIcon icon={star} />
          </div>
          <Spotlight {...teams[1]} />
        </div>
      )}
      <div className="primary-spotlight">
        <div className="stars">
          <IonIcon icon={star} />
          <IonIcon icon={star} />
          <IonIcon icon={star} />
        </div>
        <Spotlight {...teams[0]} />
      </div>
      {teams[2] && (
        <div className="secondary-spotlight">
          <div className="stars">
            <IonIcon icon={star} />
          </div>
          <Spotlight {...teams[2]} />
        </div>
      )}
    </div>
  );
};

export default Podium;