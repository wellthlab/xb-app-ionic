import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import XBHeader from "../util/XBHeader";

import { addControllersProp } from "../util_model/controllers";

const Leaderboard = (props) => {

    React.useEffect(() => {

        const loadTeams = async function () {

            const teams = await props.controllers.client.getAllTeams();
            console.log(teams);
        };

        loadTeams();
    }, []);

    return (
        <IonPage>
            <XBHeader title="Leaderboard"></XBHeader>
            <IonContent fullscreen>
                Leaderboard
            </IonContent>
        </IonPage>
    );
};

export default addControllersProp(Leaderboard);
