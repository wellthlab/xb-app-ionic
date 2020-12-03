import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
const autoBindReact = require('auto-bind/react');
//after clicking submit, it should retrieve the experiment that the group is doing and adds it to the list
var newGroups;

const ExperimentInGroup = (props, AddGroup) => {

    const [number, setNumber] = useState();
    
    function addTeam(group_id){
        var newGroup = {
            _group_id: group_id,
            name: "Movement Minutes Southampton",
            description: "Exercise everyday by running a small amount of minutes - and you'll improve your health!",
            current_experiment: {
                _experiment_id: 32,
                name: "Run more every week!",
                description: "Every week you would be given a different instruction - a certain amount of minutes to run everyday!",
                day: 1,
                maxdays: 28,
                instructions: ["The first week is for warming up, so we shall run at least 5 minutes everydat!", "In the first official week, we shall run at least 10 minutes everyday!", "In the second official week, we shall run at least 15 minutes everyday!", "In the fourth official week, we shall run at least 20 minutes everyday!"]
            },
            notifications: [],
            questions: [],
            users: [true]
        };
        newGroups = props.groups.groups;
    
        props.groups.groups.push(newGroup);
    }
    return (
        <IonPage>
            <XBHeader title="Join a Team"></XBHeader>
            <IonContent>
                <p style={{ textAlign: "center", margin: "20px 0 20px 0" }}>Please write the Team ID in the box below and press Submit. Your team will then be added to your list.</p>
                <div className="centering">
                    <IonInput type="number" value={number} placeholder="Enter Number" onIonChange={e => setNumber(parseInt(e.detail.value, 10))}></IonInput>
                </div>

                <div className="centering">
                    <IonButton onClick={() => addTeam(number)} >SUBMIT</IonButton>
                    
                </div>

            </IonContent>
        </IonPage>
    );
};
export default connect(
    (state, ownProps) => {
      return {
        account: state.account,
        groups: state.groups,
        boxes: state.boxes
      }
    },
    {
  
    }
  
  )(ExperimentInGroup);
