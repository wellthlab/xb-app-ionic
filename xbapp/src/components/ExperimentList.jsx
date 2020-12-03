import React, {Component} from 'react';
import { IonIcon } from '@ionic/react';
import { peopleOutline, alertOutline, todayOutline, add } from 'ionicons/icons';
import { Link } from "react-router-dom"

export default class ExperimentList extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const {teams} = this.props;

        console.log("Render ExperimentList", this.props);

        return(
            <>
            {teams.map((group, i) => {

                var members = group.users.length;
                var missing = 1;

                if(members > 1) {
                    var memberchip = <ion-chip color="success">
                        <ion-label><IonIcon icon={peopleOutline} /> {members}</ion-label>
                    </ion-chip>
                }

                if(group.experiment.info === false) {
                    return <p>This group has no experiment :(</p>
                } else {
                    return <ion-card key={i}><Link to={"/group/" + group._id}>
                        <ion-card-header>
                            <ion-card-title>{group.name}</ion-card-title>
                            <ion-card-subtitle>{group.experiment.info.name}</ion-card-subtitle>
                        </ion-card-header>

                        <ion-card-content>
                            <ion-chip color="primary">
                                <ion-label><IonIcon icon={todayOutline} /> Day {group.experiment.current_day} of {group.experiment.info.maxdays}</ion-label>
                            </ion-chip>
                            <ion-chip color="danger">
                                <ion-label><IonIcon icon={alertOutline} /> {missing} overdue { missing > 1 ? "entries" : "entry" }</ion-label>
                            </ion-chip>
                            {memberchip}
                        </ion-card-content>
                    </Link></ion-card>
                }
            })}

            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
              <ion-fab-button  href="/experiment">
                <ion-icon icon={add} />
              </ion-fab-button>
            </ion-fab>

            </>
        );
    }
}
