import React, { Component } from 'react';
import { IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import { peopleOutline, alertOutline, todayOutline } from 'ionicons/icons';
import { Link } from "react-router-dom"

export default class BoxesList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { boxes } = this.props;
        console.log("Render Boxes List", this.props);

        var box_move_info =[], box_engage_info = [], box_eat_info = [], box_cogitate_info = [], box_sleep_info = [];

        for (const [index, box] of boxes.entries()) {
            if (box.category == "Move") {
                box_move_info.push(<IonItem>
                    <img src="assets/move.png" alt="XB Logo" />
                    <IonLabel>Pokémon Yellow</IonLabel>
                </IonItem>)
            } else if (box.category == "Engage") {
                box_engage_info.push(<IonItem>
                <img src="assets/engage.png" alt="XB Logo" />
                <IonLabel>Pokémon Yellow</IonLabel>
            </IonItem>)
            } else if (box.category == "Eat") {
                box_eat_info.push(<IonItem>
                <img src="assets/eat.png" alt="XB Logo" />
                <IonLabel>Pokémon Yellow</IonLabel>
            </IonItem>)
            } else if (box.category == "Cogitate") {
                box_cogitate_info.push(<IonItem>
                <img src="assets/cogitate.png" alt="XB Logo" />
                <IonLabel>Pokémon Yellow</IonLabel>
            </IonItem>)
            } else if (box.category == "Sleep") {
                box_sleep_info.push(<IonItem>
                <img src="assets/sleep.png" alt="XB Logo" />
                <IonLabel>Pokémon Yellow</IonLabel>
            </IonItem>)
            }
        }

        return (
            <div><p>MOVE</p>
                    <IonList>
                    {box_move_info}
                  </IonList>
                  <p>ENGAGE</p>
                    <IonList>
                    {box_engage_info}
                  </IonList>
                  <p>EAT</p>
                    <IonList>
                    {box_eat_info}
                  </IonList>
                  <p>COGITATE</p>
                    <IonList>
                    {box_cogitate_info}
                  </IonList>
                  <p>SLEEP</p>
                    <IonList>
                    {box_sleep_info}
                  </IonList></div>

                    // return <ion-card key={i}><Link to={"/group/" + group._group_id}>
                    //     <ion-card-header>
                    //         <ion-card-title>{group.name}</ion-card-title>
                    //         <ion-card-subtitle>{group.current_experiment.name}</ion-card-subtitle>
                    //     </ion-card-header>

                    //     <ion-card-content>
                    //         <ion-chip color="primary">
                    //             <ion-label><IonIcon icon={todayOutline} /> Day {group.current_experiment.day} of {group.current_experiment.maxdays}</ion-label>
                    //         </ion-chip>
                    //         <ion-chip color="danger">
                    //             <ion-label><IonIcon icon={alertOutline} /> {missing} overdue {missing > 1 ? "entries" : "entry"}</ion-label>
                    //         </ion-chip>
                    //         {memberchip}
                    //     </ion-card-content>
                    // </Link></ion-card>
        );
    }
}
