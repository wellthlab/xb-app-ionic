import React, {Component} from 'react';
import { IonIcon } from '@ionic/react';
import { peopleOutline, alertOutline, todayOutline } from 'ionicons/icons';
import { Link } from "react-router-dom"

export default class ExperimentList extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {groups} = this.props;

        console.log("Render ExperimentList", this.props);

        return(
            <>
            {groups.map((group, i) => {

                var members = group.users.length;
                var missing = 1;

                if(members > 1) {
                    var memberchip = <ion-chip color="success">
                        <ion-label><IonIcon icon={peopleOutline} /> {members}</ion-label>
                    </ion-chip>
                }

                return <ion-card key={i}><Link to={"/group/" + group._group_id}>
                    <ion-card-header>
                        <ion-card-title>{group.name}</ion-card-title>
                        <ion-card-subtitle>{group.current_experiment.name}</ion-card-subtitle>
                    </ion-card-header>

                    <ion-card-content>
                        <ion-chip color="primary">
                            <ion-label><IonIcon icon={todayOutline} /> Day {group.current_experiment.day} of {group.current_experiment.maxdays}</ion-label>
                        </ion-chip>
                        <ion-chip color="danger">
                            <ion-label><IonIcon icon={alertOutline} /> {missing} overdue { missing > 1 ? "entries" : "entry" }</ion-label>
                        </ion-chip>
                        {memberchip}
                    </ion-card-content>
                </Link></ion-card>
            })}
            </>
        );
    }
}
