import { useState, useEffect } from "react";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
import { connect } from "react-redux";

import "./Journal22.css";

import XBHeader from "../util/XBHeader";
import { addControllersProp } from "../util_model/controllers";
import CalendarView from "./components/CalendarView";
import MinuteSummary from "./components/MinuteSummary";
import TabFeed from "./components/TabFeed";
import AddNoteButton from "./components/AddNoteButton";
import Enroller from "../Boxes/components/Enroller";

/**
 * Journal entries for people to reflect on their movement
 * @param props.teams - the team object for the person
 * @param props.match.params.isoDate - the date (in iso format) to show as default
 * @param props.match.params.feed - the default feed to show (notes or activity)
 * @param props.controllers - controller functions
 *
 */
function JournalMainPage(props) {
  const [loadingContent, setLoadingContent] = useState(false);
  const [activityForUser, setActivityForUser] = useState([]);
  const [segmentChoice, setSegmentChoice] = useState(props.match.params.feed);
  const urlDate =
    props.match.params.isoDate === "null"
      ? new Date()
      : new Date(props.match.params.isoDate);
  const [dateSelected, setDateSelected] = useState(urlDate);

  // Handle date selection, do not allow undefined (i.e. no selection) to be
  // set
  function handleDateChange(date) {
    if (date) {
      setDateSelected(date);
    }
  }

  // Get the activity history for a person -- this is reloaded using useEffect
  // whenever props.teams changes
  function getActivityDaysForPerson(team) {
    setLoadingContent(true);
    const activityForDifferentDays = [];

    for (const entry of team.entries) {
      const dateObj = new Date(Date.parse(entry.date));

      let minutes = 0;
      const responses = [];

      // go through each response, and record minutes and any activity which
      // recorded minutes or is a note for the journal
      for (const response of entry.responses) {
        if (response.minutes > 1e-10) {
          minutes += parseInt(response.minutes, 10);
        }
        responses.push(response);
      }

      // If there are responses for this day, push to the array
      if (responses.length > 0) {
        activityForDifferentDays.push({
          date: dateObj,
          className: "dayHasActivity",
          responses: responses,
          minutes: minutes,
        });
      }
    }

    setActivityForUser(activityForDifferentDays);
    setLoadingContent(false);
  }

  // Load times and reload activity for user
  props.controllers.LOAD_TEAMS_IF_REQD();
  useEffect(() => {
    if (props.teams.loaded && props.teams.teams.bybox["move"]) {
      getActivityDaysForPerson(props.teams.teams.bybox["move"][0]);
    }
  }, [props.teams]);

  // Return a spinner icon if the content is loading
  if (loadingContent || !props.teams.loaded) {
    return <IonSpinner className="center-spin" name="crescent" />;
  }

  // Most of these variables are needed for the CalendarView
  const team = props.teams.teams.bybox["move"][0];
  const experimentStart = new Date(
    new Date(team.experiment.start).getTime() - 24 * 60 * 60 * 1000
  );
  const experimentDay = Math.ceil(
    (dateSelected - experimentStart) / 1000 / 3600 / 24
  );
  const dateToday = new Date();
  const dateTomorrow = new Date(dateToday.getTime() + 24 * 60 * 60 * 1000);
  const monthStart = new Date(
    experimentStart.getFullYear(),
    experimentStart.getMonth(),
    1
  );
  const monthLimit = new Date(
    dateToday.getFullYear(),
    dateToday.getMonth() + 1,
    0
  );

  // To display the activity feeds we do the following:
  // - get a list of dates where movement happened (for highlighting on the calendar)
  // - get a list of the activity responses and notes for the selected date
  // - set the responseToShow depending on the tab chosen, or if there is no activity

  // activity only happened with movement, so filter out any days zero minutes.
  // this is used to highlight days where movement happened on the calendar
  const daysWhenActivityHappened = activityForUser
    .filter((response) => response.minutes > 0) // remove days with no minutes
    .map((response) => response.date); // get the date for each day with minutes

  // create an array of activities(responses) and notes for the selected date
  const tasksForDate = activityForUser.find(
    (response) => dateSelected.toDateString() === response.date.toDateString()
  );

  let responsesToShow;
  if (!tasksForDate) {
    // If there has been no activity at all (????), set variable as empty array
    // so that the calendar view will show no activity
    responsesToShow = [];
  } else if (segmentChoice === "notes") {
    // If we are looking ate notes, return the notes
    responsesToShow = tasksForDate.responses.filter(
      (response) =>
        response.intype === "note" || response.intype === "s22journal"
    );
  } else {
    // Return everything other than notes, as this will be movement
    responsesToShow = tasksForDate.responses.filter(
      (response) =>
        response.intype !== "note" && response.intype !== "s22journal"
    );
  }

  return (
    <IonPage>
      <XBHeader title="Journal" />
      <IonContent>
        {/* Calendar */}
        <CalendarView
          dateSelected={dateSelected}
          handleDateChange={handleDateChange}
          monthStart={monthStart}
          monthLimit={monthLimit}
          experimentStart={experimentStart}
          dateTomorrow={dateTomorrow}
          daysWhenActivityHappened={daysWhenActivityHappened}
        />
        {/* Summary of day */}
        <MinuteSummary tasksForDate={tasksForDate} />
        {/* tabs to switch between showing notes and activity */}
        <TabFeed
          segmentChoice={segmentChoice}
          setSegmentChoice={setSegmentChoice}
          responsesToShow={responsesToShow}
        />
      </IonContent>
      {/* Show button to add notes */}
      <AddNoteButton
        segmentChoice={segmentChoice}
        dateSelected={dateSelected}
        team={team}
        experimentDay={experimentDay}
      />
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    teams: state.teams,
  };
}, {})(addControllersProp(JournalMainPage));
