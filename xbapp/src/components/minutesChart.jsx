import React, { Component, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { IonSlides, IonSlide, IonContent } from "@ionic/react";
import "./minutesChart.css";
import { getMove } from "./strength/MovementPicker";

var _ = require("lodash");

function MinutesChart(props) {
  /**
   * Set up chart
   */

  console.log("PROPS ARE ", props);
  var days = [];
  var minutesIndividual = [];
  var unweightedFeelingIndividual = [];
  var minutesDescription = [];
  var strengthDescription = [];
  var questionnaireDescription = [];
  var notesDescription = [];

  var dayData = props.group.entries;

  for (var i = 0; i < dayData.length; i++) {
    var eachEntry = dayData[i];
    //adding day label
    days.push("Day " + eachEntry.day);
    //if minutes are added
    if (!eachEntry.missing && eachEntry.minutes != 0) {
      //adding minutes
      minutesIndividual.push(eachEntry.minutes);
      //analyse all entries hat day
      var responses = eachEntry.responses;

      var explanationString = "";
      for (var j = 0; j < responses.length; j++) {
        var eachResponse = responses[j];
        if (_.has(eachResponse, "minutes")) {
          explanationString += eachResponse.minutes.toString() + " min.";
          //if the user added a location and time of minutes
          if (eachResponse.location != undefined && eachResponse.time != undefined){
            explanationString += " " + eachResponse.location +
            " in " +
            eachResponse.time +
            "; ";
          } else {
            explanationString += "; ";
          }
        }
      }
      //adding info about the strength exercises at the end
      var setsExplanations = "";
      for (var j = 0; j < responses.length; j++) {
        var eachResponse = responses[j];
        //console.log("verifying", eachResponse, _.has(eachResponse, "strength"));
        if (_.has(eachResponse, "sets")) {

          //first - retrieve the name of the sets
          
          Object.keys(eachResponse.sets).map((type, i) => {
            var block, mtype;
            [mtype, block] = type.split(/-/);

            var move = getMove(mtype);
            if (move == false) {
              move = {
                name: "Unknown move, " + type,
              };
            }
            var mname = move.name.split(/:/).pop();
            var number = eachResponse.sets[type];
            
            number == "explore" ? (setsExplanations+= "Tried out") : (setsExplanations+= "");
            setsExplanations+= mname.toString();
            setsExplanations+= " ";
            number == "explore" ? (setsExplanations+= "") : (setsExplanations+= "× ");
            setsExplanations+= number.toString();
            setsExplanations+= "; ";

          })

          //now adding pre+post heart rate
          setsExplanations+= "Pre/Post Heart-Rate: ";
          setsExplanations+=  eachResponse.preHeartrate.toString() + "/" + eachResponse.heartrate.toString() + "; ";
        
           //now adding PER
           setsExplanations+= "Perceived Exertion: ";
           setsExplanations+= eachResponse.exertionValue + "; ";
        }
      }
      //if a strength exercise was found
      if (setsExplanations != ""){
        strengthDescription.push(setsExplanations);
      } else {
        strengthDescription.push(null);
      }
      minutesDescription.push(explanationString);
    } else { //minutes were not added
      minutesIndividual.push(null);
      minutesDescription.push(null);
      strengthDescription.push(null);
    }
    if (eachEntry.questionnaire) {
      //analyse all entries hat day
      var responses = eachEntry.responses;

      for (var j = 0; j < responses.length; j++) {
        var eachResponse = responses[j];
        if (_.has(eachResponse, "mood")) {
          unweightedFeelingIndividual.push(eachResponse.mood);
          questionnaireDescription.push(
            "Got " +
              eachResponse.sunlight +
              " exposure and " +
              eachResponse.alarm
          );
        }
      }
    } else {
      unweightedFeelingIndividual.push(null);
      questionnaireDescription.push(null);
    }

    //now add the notes 
    var notesExplanation="Notes: ";
    var responses = eachEntry.responses;

      for (var j = 0; j < responses.length; j++) {
        var eachResponse = responses[j];
        if (_.has(eachResponse, "note")) {
          notesExplanation+= eachResponse.note + "; ";
        }
      }

      if (notesExplanation != "Notes: "){
        notesDescription.push(notesExplanation);
      } else {
        notesDescription.push(null);
      }

  }

  //process feeling data with averaged weights making use of unweightedFeelingIndividual

  var feelingIndividual = [];
  let perceptionMovingAverage = 0;
  for (let eachMood of unweightedFeelingIndividual) {
    if (eachMood != null) {
      let currentValue = eachMood * 0.85;

      currentValue += perceptionMovingAverage * 0.15;

      perceptionMovingAverage = currentValue;
      feelingIndividual.push(currentValue.toFixed(2));
    } else {
      perceptionMovingAverage = 0;
      feelingIndividual.push(eachMood);
    }
  }

  // //*
  // /*/retrieve number of minutes everyday for GROUPS AVERAGE
  // */

  var minutesGroup = props.group.responses.groupMinuteAverage;
  var feelingGroup = props.group.responses.groupMoodAverage;

  //goes through each user from this team/group

  //we need 3 charts.
  // assume minutesIndividual, minutesGroup, feelingIndividual, feelingGroup, days

  /**
   * Set up chart
   */
  const minutesData = {
    labels: days,
    datasets: [
      {
        label: "Your minutes",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: minutesIndividual,
      },
      {
        label: "Team's minutes",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgb(179, 89, 0)",
        borderColor: "rgb(179, 89, 0)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(179, 89, 0)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(179, 89, 0)",
        pointHoverBorderColor: "rgb(179, 89, 0)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: minutesGroup,
      },
    ],
  };
  const optionsMinutes = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: "minutes",
          type: "linear",
          position: "left",
          scaleLabel: {
            display: true,
            labelString: "Minutes",
          },
          ticks: {
            max: 50,
            min: 0,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Day",
          },
        },
      ],
    },
    tooltips: {
      enabled: true,
      mode: "single",
      callbacks: {
        label: function (tooltipItems, data) {
          var label = data.datasets[tooltipItems.datasetIndex].label;

          var seriesText = "";
          var multistringText = [];
          if (label.includes("Your")) {
            seriesText = "Your minutes: ";
            multistringText = [seriesText + tooltipItems.yLabel];
            multistringText.push(minutesDescription[tooltipItems.index]);
            var strengthValue = strengthDescription[tooltipItems.index];
            if (strengthValue != null) multistringText.push(strengthValue);
            
          } else {
            seriesText = "Team's minutes (average): ";
            multistringText = [seriesText + tooltipItems.yLabel];
          }
          return multistringText;
        },
      },
    },
  };

  const feelingData = {
    labels: days,
    datasets: [
      {
        label: "Your mood",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: feelingIndividual,
      },
      {
        label: "Group's mood",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgb(179, 89, 0)",
        borderColor: "rgb(179, 89, 0)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(179, 89, 0)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(179, 89, 0)",
        pointHoverBorderColor: "rgb(179, 89, 0)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: feelingGroup,
      },
    ],
  };

  const optionsFeeling = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: "minutes",
          type: "linear",
          position: "left",
          scaleLabel: {
            display: true,
            labelString: "Mood",
          },
          ticks: {
            max: 2,
            min: -2,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Day",
          },
        },
      ],
    },
    tooltips: {
      enabled: true,
      mode: "single",
      callbacks: {
        label: function (tooltipItems, data) {
          var label = data.datasets[tooltipItems.datasetIndex].label;

          var seriesText = "";
          var multistringText = [];
          if (label.includes("Your")) {
            seriesText = "Your mood: ";
            multistringText = [seriesText + tooltipItems.yLabel];
            multistringText.push(minutesDescription[tooltipItems.index]);
            var notesValues = notesDescription[tooltipItems.index];
            if (notesValues != null) multistringText.push(notesValues);
          } else {
            seriesText = "Team's mood (Average): ";
            multistringText = [seriesText + tooltipItems.yLabel];
          }
          return multistringText;
        },
      },
    },
  };

  const minutesFeelingData = {
    labels: days,
    datasets: [
      {
        label: "Your minutes",
        yAxisID: "minutes",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: minutesIndividual,
      },
      {
        label: "Your mood",
        yAxisID: "mood",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgb(179, 89, 0)",
        borderColor: "rgb(179, 89, 0)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(179, 89, 0)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(179, 89, 0)",
        pointHoverBorderColor: "rgb(179, 89, 0)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: feelingIndividual,
      },
    ],
  };
  const optionsMinutesFeeling = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          id: "minutes",
          type: "linear",
          position: "left",
          scaleLabel: {
            display: true,
            labelString: "Minutes",
          },
          ticks: {
            max: 50,
            min: 0,
          },
        },
        {
          id: "mood",
          type: "linear",
          position: "right",
          ticks: {
            max: 2,
            min: -2,
          },
          scaleLabel: {
            display: true,
            labelString: "Mood",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Day",
          },
        },
      ],
    },
    tooltips: {
      enabled: true,
      mode: "single",
      callbacks: {
        label: function (tooltipItems, data) {
          var label = data.datasets[tooltipItems.datasetIndex].label;

          var seriesText = "";
          var multistringText = [];
          if (label.includes("minutes")) {
            seriesText = "Your minutes: ";
            multistringText = [seriesText + tooltipItems.yLabel];
            multistringText.push(minutesDescription[tooltipItems.index]);
            var strengthValue = strengthDescription[tooltipItems.index];
            if (strengthValue != null) multistringText.push(strengthValue);
            
          } else {
            seriesText = "Your mood: ";
            multistringText = [seriesText + tooltipItems.yLabel];
            multistringText.push(questionnaireDescription[tooltipItems.index]);
            var notesValues = notesDescription[tooltipItems.index];
            if (notesValues != null) multistringText.push(notesValues);
            
          }
          return multistringText;
        },
      },
    },
  };

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  return (
    <div>
      {/*bar chart 1 - movement minutes individual vs how do you feel individual*/}
      {props.individual ? (
        <div>
          <div
            style={{ flex: "0 0 auto", textAlign: "center", color: "black" }}
          >
            Your Minutes vs. Your Mood
          </div>
          <div
            style={{
              width: "100%",
              height: "280px",
              marginTop: "0px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "1px",
            }}
          >
            <Bar data={minutesFeelingData} options={optionsMinutesFeeling} />
          </div>
        </div>
      ) : (
        <div>
          <IonSlides pager={true} options={slideOpts} className="slidesCharts0">
            <IonSlide>
              <div
                style={{
                  width: "100%",
                  height: "280px",
                  marginTop: "0px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "1px",
                }}
              >
                <div
                  style={{
                    flex: "0 0 auto",
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  Your Minutes vs. Your Mood
                </div>
                <Bar
                  data={minutesFeelingData}
                  options={optionsMinutesFeeling}
                />
              </div>
            </IonSlide>
            <IonSlide>
              <div
                style={{
                  width: "100%",
                  height: "280px",
                  marginTop: "0px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "1px",
                }}
              >
                <div
                  style={{
                    flex: "0 0 auto",
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  Your Minutes vs. Team's Minutes
                </div>
                <Bar data={minutesData} options={optionsMinutes} />
              </div>
            </IonSlide>
            <IonSlide>
              <div
                style={{
                  width: "100%",
                  height: "280px",
                  marginTop: "0px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "1px",
                }}
              >
                <div
                  style={{
                    flex: "0 0 auto",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Your Mood vs. Team's Mood
                </div>
                <Bar data={feelingData} options={optionsFeeling} />
              </div>
            </IonSlide>
          </IonSlides>
        </div>
      )}

      {/* bar chart 2 - movement minutes individual vs group */}
      {/* <div style={{ display: 'flex', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', flexDirection: 'column', border: '1px solid #ccc', height: '300px', width: "500px" }}>
            <div style={{ flex: '0 0 auto', padding: '10px', textAlign: 'center' }}>Individual vs Group: Movement Minutes</div>
            <div style={{ width: '400px', height: '300px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
                <Bar data={minutesData} options={optionsMinutes} />
            </div>
        </div> */}

      {/*bar chart 2 - how do u feel individual vs group*/}
      {/* <div style={{ display: 'flex', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px', flexDirection: 'column', border: '1px solid #ccc', height: '300px', width: "500px" }}>
            <div style={{ flex: '0 0 auto', padding: '10px', textAlign: 'center' }}>Individual vs Group: How do you feel?</div>
            <div style={{ width: '400px', height: '300px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '20px' }}>
                <Bar data={feelingData} options={optionsFeeling} />
            </div>
        </div> */}
    </div>
  );
}

export default MinutesChart;
