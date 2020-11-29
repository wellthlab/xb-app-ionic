import React, { Component } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import XBHeader from '../components/XBHeader'

import { connect } from 'react-redux'
import { Line } from 'react-chartjs-2';

const autoBindReact = require('auto-bind/react');

const Group = ({ match, groups }) => {
    //class Group extends Component {
    // constructor(props) {
    //     super(props);
    //     autoBindReact(this); // Binds 'this' to this object in all methods
    // }



    // render() {

        const data = {
            labels: ['22.11.2020', '23.11.2020', '24.11.2020', '25.11.2020', '26.11.2020', '27.11.2020', '28.11.2020'],
            datasets: [
              {
                label: 'Series 1 placeholder',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [6, 5, 8, 8, 5, 5, 4]
              }
            ]
          };

          
          const options = {
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Completion'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Time'
                }
              }],
            }     
          }
    var gid = match.params.id;
    //var gid = this.props.match.params.id;

    for (var g of groups.groups) {
        if (g._group_id == gid) {
            var group = g;
        }
    }

    if (group === false) {
        return <IonPage>Nope :(</IonPage>
    }

    console.log("group", group);

    var exp = group.current_experiment;

    var entries = [{ day: 3, missing: false, vars: { minutes: 12 } }, { day: 2, missing: true, vars: {} }];

    return (
        <IonPage>
            <XBHeader title={group.name}></XBHeader>
            <IonContent>
                <div style={{
                    display: 'flex',
                    marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px',
                    flexDirection: 'column',
                    border: '2px solid black',
                    height: '300px',
                    width: "500px"
                }}>
                    <div style={{
                        flex: '0 0 auto',
                        padding: '10px',
                        textAlign: 'center'
                    }}><b>Chart Name</b>
                    </div>
                    <div style={{
                        width: '400px',
                        height: '300px',
                        marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px'
                    }}>
                      
                      
                      <Line data={data} options={options} />
 

                    </div>
                </div>
                <ion-item><ion-heading><strong>{exp.name}</strong></ion-heading><ion-chip slot="end" color="primary">Day {exp.day}</ion-chip></ion-item>
                <ion-item>{exp.instructions}</ion-item>

                {entries.map((entry, i) => {

                    return <ion-card key={i}>
                        <ion-card-header>
                            <ion-card-title>Day {entry.day}</ion-card-title>
                            <ion-card-subtitle>{entry.missing ? "Missing Entry" : "Done"}</ion-card-subtitle>
                        </ion-card-header>

                        <ion-card-content>

                        </ion-card-content>
                    </ion-card>
                })}

            </IonContent>
        </IonPage>
    );
    //}
};

class EntryCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const entry = this.props.entry;

        return (
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Day {entry.day}</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                    <p>foo bar</p>
                </ion-card-content>
            </ion-card>
        );
    }
}




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

)(Group);
