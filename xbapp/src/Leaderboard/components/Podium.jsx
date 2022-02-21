import './Podium.css';

import React from 'react';
import {
    star
} from "ionicons/icons";
import { IonIcon } from '@ionic/react';

const Podium = function ({ items }) {

    return (
        <div className="podium-wrapper">
            {items[1] && (
                <div className="secondary-spotlight">
                    <div className="stars">
                        <IonIcon icon={star} />
                        <IonIcon icon={star} />
                    </div>
                    <div className="spotlight">
                        <span className="score">{items[1].value}</span>
                        {items[1].label}
                    </div>
                </div>
            )}
            <div className="primary-spotlight">
                <div className="stars">
                    <IonIcon icon={star} />
                    <IonIcon icon={star} />
                    <IonIcon icon={star} />
                </div>
                <div className="spotlight">
                    <span className="score">{items[0].value}</span>
                    {items[0].label}
                </div>
            </div>
            {items[2] && (
                <div className="secondary-spotlight">
                    <div className="stars">
                        <IonIcon icon={star} />
                    </div>
                    <div className="spotlight">
                        <span className="score">{items[2].value}</span>
                        {items[2].label}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Podium;