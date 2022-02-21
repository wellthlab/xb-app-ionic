import './Podium.css';

import React from 'react';
import { star } from "ionicons/icons";
import { IonIcon } from '@ionic/react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

const Spotlight = function ({ value, label }) {

    return (
        <div className="spotlight">
            <CircularProgressbarWithChildren
                value={value}
                styles={{
                    path: {
                        stroke: 'var(--ion-color-success-shade)',
                        width: 8,
                        strokeLinecap: 'butt',
                    },
                    trail: {
                        stroke: 'var(--ion-color-light)',
                    },
                }}
            >
                <span className="score">{value}%</span>
                {label}
            </CircularProgressbarWithChildren>
        </div>
    );
};

const Podium = function ({ items }) {

    return (
        <div className="podium-wrapper">
            {items[1] && (
                <div className="secondary-spotlight">
                    <div className="stars">
                        <IonIcon icon={star} />
                        <IonIcon icon={star} />
                    </div>
                    <Spotlight {...items[1]} />
                </div>
            )}
            <div className="primary-spotlight">
                <div className="stars">
                    <IonIcon icon={star} />
                    <IonIcon icon={star} />
                    <IonIcon icon={star} />
                </div>
                <Spotlight {...items[0]} />
            </div>
            {items[2] && (
                <div className="secondary-spotlight">
                    <div className="stars">
                        <IonIcon icon={star} />
                    </div>
                    <Spotlight {...items[2]} />
                </div>
            )}
        </div>
    );
};

export default Podium;