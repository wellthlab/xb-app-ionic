import React, {Component} from 'react';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel, IonButton } from '@ionic/react';
import { pin, wifi, wine, warning, walk } from 'ionicons/icons';

import dateFromTS from '../../lib/dateFromTS'


export default class OverdueEntry extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {item} = this.props;

        var when = dateFromTS(item.date);
        var link = "/group/" + item.groupid + "/" + item.day;

        return (
            <>
                <IonCardHeader>
                    <IonCardSubtitle>Missing Journal</IonCardSubtitle>
                    <IonCardTitle>{when}</IonCardTitle>
                    <IonButton href={link}>Add Journal</IonButton>
                </IonCardHeader>
            </>
        );
    }
}
