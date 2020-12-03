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
    const data = {
        labels: ['22.11.2020', '23.11.2020', '24.11.2020', '25.11.2020', '26.11.2020', '27.11.2020', '28.11.2020'],
        datasets: [
            {
                label: 'Your progress',
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
            },
            {
                label: 'Group progress',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,0,0)',
                borderColor: 'rgba(255,0,0)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(255,0,0)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(255,0,0)',
                pointHoverBorderColor: 'rgba(255,0,0)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [9, 9, 8, 8, 5, 9, 6]
            }
        ]}

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


        return <div style={{
            display: 'flex',
            marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px',
            flexDirection: 'column',
            border: '1px solid #ccc',
            height: '300px',
            width: "500px"
        }}>
        <div style={{
            flex: '0 0 auto',
            padding: '10px',
            textAlign: 'center'
        }}>
        </div>
        <div style={{
            width: '400px',
            height: '300px',
            marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px'
        }}>


        <Bar data={data} options={options} />


        </div>
        </div>;
}


export default MinutesChart;
