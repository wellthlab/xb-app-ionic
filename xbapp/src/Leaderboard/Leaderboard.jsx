import React, { Component } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import XBHeader from "../util/XBHeader";

import { addControllersProp } from "../util_model/controllers";

const Leaderboard = function (props) {

    React.useEffect(() => {

        const loadTeams = async function () {

            const test = await props.controllers.client.getAllTeams();
            console.log(test);
        }

        loadTeams();
    }, []);

    return (
        <IonPage>
            <XBHeader title="News &amp; Updates"></XBHeader>
            <IonContent fullscreen>
                Leaderboard
            </IonContent>
        </IonPage>
    );
};

export default addControllersProp(Leaderboard);
