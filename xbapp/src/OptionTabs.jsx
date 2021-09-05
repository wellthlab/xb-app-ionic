import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import WithXBSlice from "./components/util/WithXBSlice";
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonToolbar,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonButton,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  IonAlert,
} from "@ionic/react";
import XBHeader from "./components/XBHeader";

//css
import "./OptionTabs.scss";

import { addControllersProp } from "./model/controllers";
import { connect } from "react-redux";
const autoBindReact = require("auto-bind/react");

//code for cancelling notifications
//   LocalNotifications.getPending().then( res => {
//     var index = res.notifications.map(x => {
//       return x["id"];
//     }).indexOf("10000000");
//     res.notifications.splice(index, 0);
//     LocalNotifications.cancel(res);
//   }, err => {
//     console.log(err);
//   })

class OptionTabs extends Component {
  // function check() {
  //   console.log(LocalNotifications.getPending());
  // }
  // function trig() {
  //const areEnabled = LocalNotifications.requestPermissions();
  // if (LocalNotifications.checkPermissions()){
  // console.log("notifications enabled");
  // LocalNotifications.schedule({
  // notifications: [
  //   { //this one works daily with repeats - but it gets triggered at the time of creation...
  //     title: '19',
  //     body: '19',
  //     id: 19,
  //     schedule: {
  //       at: {
  //         hour: 3,
  //         minute: 12
  //       },
  //       repeats: true,

  //     }
  //   }
  // { //this goes once
  //   title: 'Get 20% off daily',
  //   body: 'Swipe to learn more',
  //   id: 2,
  //   schedule: {
  //     on: {
  //       minute: new Date().getUTCMinutes()+1
  //     }
  //   }
  // },
  // { //this goes every minute
  //   title: 'Happy Holidays! Last minute.',
  //   body: 'Swipe to learn more',
  //   id: 3,
  //   schedule: {
  //     every: 'minute'
  //   }
  // },
  // { //this goes every minute without the first 3 mins
  //   title: 'Happy Holidays! Last couple minutes.',
  //   body: 'Swipe to learn more',
  //   id: 4,
  //   schedule: {
  //     every: 'minute',
  //     count: 3
  //   }
  // }
  // { //this was triggered straight away
  //   title: "1",
  //   body: "1",
  //   id: 1,
  //   schedule: {
  //     repeats: true,
  //     every: { hour: 22, minute: 10 }, count: 365
  //    },
  //   sound: null,
  //   attachments: null,
  //   actionTypeId: "",
  //   extra: null
  // },
  // {
  //   title: "2",
  //   body: "2",
  //   id: 2,
  //   schedule: {
  //     repeats: true,
  //     on: {
  //       hour: 22,
  //       minute: 10
  //     },
  //     every: 24*60
  //    },
  //   sound: null,
  //   attachments: null,
  //   actionTypeId: "",
  //   extra: null
  // },
  // {
  //   title: "3",
  //   body: "3",
  //   id: 3,
  //   schedule: {
  //     repeats: true,
  //     on: {
  //       hour: 22,
  //       minute: 10
  //     }
  //    },
  //   sound: null,
  //   attachments: null,
  //   actionTypeId: "",
  //   extra: null
  // },
  // { //this triggered right away
  //   title: "4",
  //   body: "4",
  //   id: 4,
  //   schedule: {
  //     repeats: true,
  //     at: {
  //       hour: 22,
  //       minute: 10
  //     }
  //    },
  //   sound: null,
  //   attachments: null,
  //   actionTypeId: "",
  //   extra: null
  // },
  // {
  //   title: "5",
  //   body: "5",
  //   id: 5,
  //   schedule: {
  //     repeats: true,
  //     every: 'day',
  //     on: {
  //       hour: 22,
  //       minute: 10
  //     }
  //    },
  //   sound: null,
  //   attachments: null,
  //   actionTypeId: "",
  //   extra: null
  // }
  //     ]
  //   });
  //   // }
  // }

  constructor(props) {
    super(props);
    autoBindReact(this); // Binds 'this' to this object in all methods
  }

  render() {
    var week =
      Math.floor((this.props.teams.teams[0].experiment.day - 1) / 7) + 1;

    return (
      <>
        <XBHeader title="Settings"></XBHeader>
        <IonContent id="settings" fullscreen>
          <IonList>
            <IonItem>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={{
                  pathname: `/timeline`,
                  weekNo: week,
                }}
              >
                Timeline
              </Link>
            </IonItem>

            <IonItem routerLink="/movetutorial">Movement Tutorial</IonItem>
            <IonItem routerLink="/about">About XB</IonItem>
            <IonItemDivider></IonItemDivider>
            <IonItem routerLink="/account">Log Out</IonItem>
            <IonItemDivider></IonItemDivider>
            {/* <IonItem routerLink="/notifications">Notifications</IonItem> */}
            {/* <IonItemDivider></IonItemDivider> */}
          </IonList>
          {/* <IonButton onClick={trig}>trig</IonButton>
        <IonButton onClick={check}>trig2</IonButton> */}
        </IonContent>
      </>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      experiments: state.experiments,
      boxes: state.boxes,
    };
  },
  {
    // Actions to include as props
  }
)(
  addControllersProp(
    withRouter(
      WithXBSlice(OptionTabs, "teams", (props) => {
        props.controllers.LOAD_TEAMS_IF_REQD();
      })
    )
  )
);
