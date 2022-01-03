import React, { Component } from "react";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonItem,
  IonIcon,
} from "@ionic/react";

import { pin } from "ionicons/icons";

import dateFromTS from "../../util_lib/dateFromTS";

export default class OverdueEntry extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;

    var when = dateFromTS(item.date);
    var link = "/box/move/" + item.groupid + "/" + item.day;

    return (
      <>
        <IonCardHeader>
          <IonCardSubtitle>News - {when}</IonCardSubtitle>
          <IonCardTitle>{item.title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>{item.content}</p>
          <p>
            {item.link ? (
              <IonButton slot="end" href={item.link}>
                Read More
              </IonButton>
            ) : (
                ""
              )}
          </p>
        </IonCardContent>
      </>
    );
  }
}
