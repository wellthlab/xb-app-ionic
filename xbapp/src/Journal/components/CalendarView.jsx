import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";
import "./CalendarView.css";
/**
 * Display a interactive calendar to select a date, with days with movement
 * highlighted.
 *
 * @param dateSelected - the current date selected on the calendar
 * @param handleDateChange - a function to handle when the date is changed
 * @param monthStart - the first month to show on the calendar
 * @param monthLimit - the last month to show on the calendar
 * @param experimentStart - the start date of the experiment
 * @param dateTomorrow - the date of tomorrow
 * @param activity - an array of dates with movement used to highlight movement days
 */
function CalendarView({
  dateSelected,
  handleDateChange,
  monthStart,
  monthLimit,
  experimentStart,
  dateTomorrow,
  activity,
}) {
  const daysWithActivity = [];
  const daysWithJournal = [];

  for (const entry of activity) {
    if (entry.hasActivity) {
      daysWithActivity.push(entry.date);
    }

    if (entry.hasJournal) {
      daysWithJournal.push(entry.date);
    }
  }

  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol className="calendarStyle">
          <DayPicker
            mode="single"
            selected={dateSelected}
            onSelect={handleDateChange}
            weekStartsOn={1}
            modifiers={{
              hasActivity: daysWithActivity,
              hasJournal: daysWithJournal,
            }}
            modifiersStyles={{
              hasActivity: {
                border: "2px solid white",
                fontWeight: "bold",
              },
            }}
            modifiersClassNames={{
              hasJournal: "day-has-journal",
            }}
            fromMonth={monthStart}
            toDate={monthLimit}
            disabled={[
              { from: monthStart, to: experimentStart },
              { from: dateTomorrow, to: monthLimit },
            ]}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

export default CalendarView;
