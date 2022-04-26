import "./Visualisation.css";

import React from "react";
import { IonSpinner, IonButton, IonIcon } from "@ionic/react";
import { chevronForwardOutline, chevronBackOutline } from "ionicons/icons";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";

import { addControllersProp } from "../util_model/controllers";
import dateFromTs from "../util_lib/dateFromTS";

const getCurrentMonday = function () {
  const today = new Date();
  const thisMonday = new Date(today);
  const dayOfWeek = today.getUTCDay();
  const normalisedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  thisMonday.setUTCDate(today.getUTCDate() - (normalisedDayOfWeek - 1));
  thisMonday.setUTCHours(0, 0, 0, 0);

  return thisMonday;
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Visualisation = function (props) {
  const [zoomedNode, setZoomedNode] = React.useState();
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isErrored, setIsErrored] = React.useState(false);

  const [currentMonday, setCurrentMonday] = React.useState(getCurrentMonday());
  const [selectedDay, setSelectedDay] = React.useState(0);

  const handleZoom = function (node) {
    if (zoomedNode && node.id === zoomedNode.id) {
      return;
    }

    setZoomedNode(node);
  };

  const fetchTeamsForWeek = async function (monday) {
    setIsLoading(true);
    setIsErrored(false);

    let raw;
    try {
      raw = await props.controllers.client.sortTeams(monday);
    } catch (error) {
      console.log(error);
      setIsErrored(true);
    } finally {
      setIsLoading(false);
    }

    if (!raw) {
      return;
    }

    setData(JSON.parse(raw));
  };

  React.useEffect(() => {
    fetchTeamsForWeek(currentMonday);
  }, []);

  const createHandleMoveWeek = function (direction) {
    return () => {
      const newMonday = new Date(currentMonday);
      newMonday.setDate(currentMonday.getDate() + direction * 7);

      setSelectedDay(0);
      setCurrentMonday(newMonday);
      fetchTeamsForWeek(newMonday);
    };
  };

  const createHandleDayChange = function (i) {
    return () => {
      setSelectedDay(i);
    };
  };

  let content;

  if (isLoading || !data) {
    content = <IonSpinner name="crescent" className="center-spin" />;
  } else if (isErrored) {
    content = "Sorry, something went wrong";
  } else {
    const dayData = data[selectedDay];

    if (!dayData.data.completion) {
      content = "Sorry, there's nothing to show for the selected date";
    } else {
      content = (
        <ResponsiveCirclePacking
          data={dayData.data}
          id="name"
          value="completion"
          valueFormat={(value) => `${value}%`}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          colors={{ scheme: "spectral" }}
          childColor={{ from: "color", modifiers: [["brighter", 0.4]] }}
          padding={8}
          zoomedId={zoomedNode ? zoomedNode.id : null}
          onClick={handleZoom}
          labelsFilter={(label) =>
            label.node.depth === (zoomedNode ? zoomedNode.depth : 0)
          }
          enableLabels
        />
      );
    }
  }

  return (
    <>
      <div className="week-picker">
        <IonButton onClick={createHandleMoveWeek(-1)}>
          <IonIcon icon={chevronBackOutline} />
        </IonButton>

        <div className="week-range">
          {dateFromTs(currentMonday)} -{" "}
          {dateFromTs(
            new Date(currentMonday).setDate(currentMonday.getDate() + 6)
          )}
        </div>

        <IonButton
          onClick={createHandleMoveWeek(1)}
          disabled={currentMonday.getTime() === getCurrentMonday().getTime()}
        >
          <IonIcon icon={chevronForwardOutline} />
        </IonButton>
      </div>

      <div className="day-picker">
        {daysOfWeek.map((day, i) => (
          <IonButton
            key={day}
            fill="clear"
            disabled={selectedDay === i}
            onClick={createHandleDayChange(i)}
          >
            {day}
          </IonButton>
        ))}
      </div>

      {content}
    </>
  );
};

export default addControllersProp(Visualisation);
