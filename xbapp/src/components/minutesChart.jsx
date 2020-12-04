import React, { Component, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';

function MinutesChart(props) {

    // //*
    // /*/retrieve number of minutes everyday for INDIVIDUALS
    // */

    function findCorrespondingResults(arr, propName, propValue) {
        var arrToReturn = [];
        for (var i = 0; i < arr.length; i++)
            if (arr[i][propName] == propValue)
                arrToReturn.push(arr[i]);

        return arrToReturn;
    }

    // //retreieve the results for the current user logged in
    // var arrayOfResults = account.results;
    // var arrayOfResultForCurrentIndividualExperiments = findCorrespondingResults(arrayOfResults, "experiment", group_id);

    // //extract the minutes and how do you feel question
    // var individualMinutes = [];
    // var individualHowDoYouFeel = [];
    // for (var i = 0; i < arrayOfResultForCurrentIndividualExperiments.length; i++) {
    //     individualMinutes.push(arrayOfResultForCurrentIndividualExperiments[i]["responses"]["minutes"]);
    //     individualHowDoYouFeel.push(arrayOfResultForCurrentIndividualExperiments[i]["responses"]["how_do_you_feel"]);
    // }

    // //*
    // /*/retrieve number of minutes everyday for GROUPS AVERAGE
    // */

    // var allUsers = groups.users;

    // var groupMinutes = [];
    // var groupHowDoYouFeel = [];
    // //goes through each user from this team/group

    // for (var i = 0; i < allUsers.length; i++) {
    //     var eachUser = allUsers[i];
    //     var arrayOfResultForCurrentIndividualExperiments = findCorrespondingResults(eachUser.results, "experiment", group_id);

    //     //for each user, retrieve the set of results for this experiment
    //     //adds the results to a sum, which is gonna become an average at the end
    //     for (var i = 0; i < arrayOfResultForCurrentIndividualExperiments.length; i++) {
    //         var dataMinutes = arrayOfResultForCurrentIndividualExperiments[i]["responses"]["minutes"];
    //         var dataFeeling = arrayOfResultForCurrentIndividualExperiments[i]["responses"]["how_do_you_feel"];
    //         if (dataMinutes != null) groupMinutes[i] = groupMinutes[i] + dataMinutes;
    //         if (dataFeeling != null) groupHowDoYouFeel[i] = groupHowDoYouFeel[i] + dataFeeling;

    //     }
    // }
    // for (var i = 0; i < groupMinutes.length; i++) {
    //     var eachMinuteValue = groupMinutes[i];
    //     var eachFeelingValue = groupHowDoYouFeel[i];

    //     groupMinutes[i] = eachMinuteValue / groupMinutes.length;
    //     eachFeelingValue[i] = eachFeelingValue / groupMinutes.length;
    // }

    /**
    * Set up chart
    */

    //we need 3 charts.
    // assume minutesIndividual, minutesGroup, feelingIndividual, feelingGroup, days
    var minutesIndividual = [20, 5, 15]
    var feelingIndividual = [2.3, 5.0, 4.2]
    //extra options
    var environmentIndividual = ["indoor", "outdoor","outdoor"];
    var timeOfDayIndividual = ["morning", "morning","morning"];
    var alarmIndividual = ["woke up with alarm", "woke up with alarm", "woke up with alarm"];
    var exposureIndividual = ["no sunlight", "no sunlight", "no sunlight"];

    var minutesGroup = [18, 17, 30]
    var feelingGroup = [1.5, 2.2, 3.6]

    var days = ['Day 1', 'Day 2', 'Day 3']

    const minutesData = {
        labels: days,
        datasets: [
            {
                label: 'Your minutes',
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
                data: minutesIndividual
            },
            {
                label: "Group's minutes",
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgb(179, 89, 0)',
                borderColor: 'rgb(179, 89, 0)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(179, 89, 0)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(179, 89, 0)',
                pointHoverBorderColor: 'rgb(179, 89, 0)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: minutesGroup
            }
        ]
    }

    const feelingData = {
        labels: days,
        datasets: [
            {
                label: 'Your mood',
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
                data: feelingIndividual
            },
            {
                label: "Group's mood",
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgb(179, 89, 0)',
                borderColor: 'rgb(179, 89, 0)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(179, 89, 0)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(179, 89, 0)',
                pointHoverBorderColor: 'rgb(179, 89, 0)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: feelingGroup
            }
        ]
    }

    const minutesFeelingData = {
        labels: days,
        datasets: [
            {
                label: 'Your minutes',
                yAxisID: 'minutes',
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
                data: minutesIndividual
            },
            {
                label: "Your mood",
                yAxisID: 'mood',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgb(179, 89, 0)',
                borderColor: 'rgb(179, 89, 0)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgb(179, 89, 0)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgb(179, 89, 0)',
                pointHoverBorderColor: 'rgb(179, 89, 0)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: feelingIndividual
            }
        ]
    }
    const optionsMinutesFeeling = {
        scales: {
            yAxes: [{
                id: 'minutes',
                type: 'linear',
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Minutes'
                },
                ticks: {
                    max: 50,
                    min: 0
                },
            }, {
                id: 'mood',
                type: 'linear',
                position: 'right',
                ticks: {
                    max: 5,
                    min: 0
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Mood'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Day'
                }
            }],
        }, tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItems, data) {

                    var label = data.datasets[tooltipItems.datasetIndex].label;
                    
                    var seriesText = "";
                    var multistringText = [];
                    if (label.includes("minutes")){
                        seriesText = "Your minutes: ";
                        multistringText = [seriesText + tooltipItems.yLabel];
                        multistringText.push(timeOfDayIndividual[tooltipItems.index]);
                        multistringText.push(environmentIndividual[tooltipItems.index]);
                    } else {
                        seriesText = "Your mood: ";
                        multistringText = [seriesText + tooltipItems.yLabel];
                        multistringText.push(exposureIndividual[tooltipItems.index]);
                        multistringText.push(alarmIndividual[tooltipItems.index]);
                    }
                    return multistringText;
                }
            }
        }
    }

    const optionsMinutes = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Minutes'
                },
                ticks: {
                    max: 50,
                    min: 0
                },
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Day'
                }
            }],
        }, tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItems, data) {

                    var label = data.datasets[tooltipItems.datasetIndex].label;
                    
                    var seriesText = "";
                    var multistringText = [];
                    if (label.includes("Your")){
                        seriesText = "Your minutes: ";
                        multistringText = [seriesText + tooltipItems.yLabel];
                        multistringText.push(timeOfDayIndividual[tooltipItems.index]);
                        multistringText.push(environmentIndividual[tooltipItems.index]);
                    } else {
                        seriesText = "Group's minutes: ";
                        multistringText = [seriesText + tooltipItems.yLabel];
                    }
                    return multistringText;
                }
            }
        }
    }
    const optionsFeeling = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Mood'
                },
                ticks: {
                    max: 5,
                    min: 0
                },
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Day'
                }
            }],
        }, tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItems, data) {

                    var label = data.datasets[tooltipItems.datasetIndex].label;
                    
                    var seriesText = "";
                    var multistringText = [];
                    if (label.includes("Your")){
                        seriesText = "Your mood: ";
                        multistringText = [seriesText + tooltipItems.yLabel];
                        multistringText.push(exposureIndividual[tooltipItems.index]);
                        multistringText.push(alarmIndividual[tooltipItems.index]);
                    } else {
                        seriesText = "Group's mood: ";
                        multistringText = [seriesText + tooltipItems.yLabel];
                    }
                    return multistringText;
                }
            }
        }
    }


    return <div>
        {/*bar chart 1 - movement minutes individual vs how do you feel individual*/}
        <div style={{ display: 'flex', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', flexDirection: 'column', border: '1px solid #ccc', height: '300px', width: "500px" }}>
            <div style={{ flex: '0 0 auto', padding: '10px', textAlign: 'center' }}>Individual: Movement Minutes vs. How do you feel?</div>
            <div style={{ width: '400px', height: '300px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
                <Bar data={minutesFeelingData} options={optionsMinutesFeeling} />
            </div>
        </div>

        {/*bar chart 2 - movement minutes individual vs group*/}
        <div style={{ display: 'flex', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', flexDirection: 'column', border: '1px solid #ccc', height: '300px', width: "500px" }}>
            <div style={{ flex: '0 0 auto', padding: '10px', textAlign: 'center' }}>Individual vs Group: Movement Minutes</div>
            <div style={{ width: '400px', height: '300px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
                <Bar data={minutesData} options={optionsMinutes} />
            </div>
        </div>

        {/*bar chart 2 - mhow do u feel individual vs group*/}
        <div style={{ display: 'flex', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', flexDirection: 'column', border: '1px solid #ccc', height: '300px', width: "500px" }}>
            <div style={{ flex: '0 0 auto', padding: '10px', textAlign: 'center' }}>Individual vs Group: How do you feel?</div>
            <div style={{ width: '400px', height: '300px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
                <Bar data={feelingData} options={optionsFeeling} />
            </div>
        </div>

    </div>;
}


export default MinutesChart;
