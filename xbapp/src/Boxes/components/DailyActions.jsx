import React, { useState } from "react";
import { IonList, IonItem, IonItemGroup, IonIcon } from "@ionic/react";

import {
  checkboxOutline,
  squareOutline,
  arrowForwardOutline,
} from "ionicons/icons";

//css
import "./DailyActions.css";

/**
 * Props:
 *    today: The day number to show tasks for
 *    group: The team object to show tasks from
 *    tabs: Whether to allow paging between days (True/False)
 */
const DailyActions = ({ group, today, tabs }) => {
  // Track the day we're displaying; default to current day
  const [activeDay, setActiveDay] = useState(today);

  var entries = group.entries;

  // Look up the daily entry we need to render
  var entry;
  var dayList = [];
  for (var i in entries) {
    if (entries[i].day === activeDay) {
      entry = entries[i];
    }
    dayList.push(entries[i].day);
  }

  debugger;

  if (typeof entry == "undefined") {
    return (
      <>
        <div className="center-message">
          Can't find an entry for day {activeDay}
        </div>
      </>
    );
  }

  // const nextDayExists = dayList.includes(activeDay + 1);
  // const prevDayExists = dayList.includes(activeDay - 1);

  var icon_done = checkboxOutline;
  var icon_missing = squareOutline;

  /**
   * Daily task list and buttons
   */

  // TODO: should be an array in the future already.. sigh this is a hack I need to fix
  var required = group.experiment.tasks[activeDay].required["progressTasks"];
  var optional = group.experiment.tasks[activeDay].optional;

  var requiredActions = required.map((type) => {
    if (type.onPlaylist) {
      return null;
    }

    var done = typeof entry.responseTypes[type.intype] !== "undefined";
    return (
      <IonItem
        color={done ? "neutral" : "warning"}
        key={type.type}
        routerLink={
          "/box/move/" + group._id + "/" + activeDay + "/add/" + type.intype
        }
        detail={true}
        detailIcon={arrowForwardOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {type.desc}
      </IonItem>
    );
  });

  var optionalActions = optional.map((type) => {
    if (type.onPlaylist) {
      return null;
    }

    var done = typeof entry.responseTypes[type.intype] !== "undefined";
    return (
      <IonItem
        key={type.type}
        routerLink={
          "/box/move/" + group._id + "/" + activeDay + "/add/" + type.intype
        }
        detail={true}
        detailIcon={arrowForwardOutline}
      >
        <IonIcon slot="start" icon={done ? icon_done : icon_missing} />
        {type.desc}
      </IonItem>
    );
  });

  const requiredActionsFiltered = requiredActions.filter((el) => el !== null);
  const optionalActionsFiltered = optionalActions.filter((el) => el !== null);

  // With new progression model, going back in time is not required.
  // var daytabs;
  // if (typeof tabs == "undefined" || tabs === true) {
  //   daytabs = (
  //     <div className="headerDay" style={{ display: "block", overflow: "auto" }}>
  //       <span className="text">
  //         <h3>{"Day " + activeDay + " : " + entry.date}</h3>
  //       </span>
  //       <span className="navbuttons">
  //         {
  //           <IonButton
  //             disabled={!prevDayExists}
  //             onClick={() => {
  //               setActiveDay(activeDay - 1);
  //             }}
  //           >
  //             <IonIcon icon={caretBackCircle} />
  //           </IonButton>
  //         }
  //         {
  //           <IonButton
  //             disabled={!nextDayExists}
  //             onClick={() => {
  //               setActiveDay(activeDay + 1);
  //             }}
  //           >
  //             <IonIcon icon={caretForwardCircle} />
  //           </IonButton>
  //         }
  //       </span>
  //     </div>
  //   );
  // } else {
  //   daytabs = <></>;
  // }

  debugger;

  return (
    <div className="dailyActions">
      <IonList lines="full" className="journalTasks">
        <IonItemGroup>
          {requiredActionsFiltered.length > 0 ? (
            requiredActionsFiltered
          ) : optionalActionsFiltered.length > 0 ? (
            "" // only display no task msg when there are no optional tasks either
          ) : (
            <IonItem>No tasks need your attention</IonItem>
          )}
        </IonItemGroup>
      </IonList>

      {optionalActionsFiltered.length > 0 ? (
        <IonList lines="full" className="journalTasks">
          <IonItemGroup>{optionalActionsFiltered}</IonItemGroup>
        </IonList>
      ) : (
        ""
      )}
    </div>
  );
};

export default DailyActions;
