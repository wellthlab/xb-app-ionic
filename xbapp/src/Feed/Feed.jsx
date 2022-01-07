import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import XBHeader from "../util/XBHeader";
import ContentFeed from "./components/ContentFeed";

import Timer from "../Instruments/Timer";
import { Link } from "react-router-dom";

import "./Feed.css";

import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

const Feed = (props) => {

  let content; // Hold content

  const feed = props.feed;

  if (feed.fetching) {
    content = <ion-spinner name="crescent" />;
  } else if (feed.feed.length < 1) {
    props.controllers.GET_FEED();
    content = <ion-spinner name="crescent" />;
  } else {
    content = <ContentFeed feed={props.feed.feed} />;
  }

  return (
    <IonPage>
      <XBHeader title="News &amp; Updates"></XBHeader>
      <IonContent fullscreen>
        {localStorage.getItem("countActive") != null ? (
          <div style={{ textAlign: "center" }}>
            <Timer buttonsOnShow={false} />
            <Link to={localStorage.getItem("locationOfTimer")}>
              Go To Timer{" "}
            </Link>
          </div>
        ) : (
            <></>
          )}
        {content}
      </IonContent>
    </IonPage>
  );
};

export default connect(
  (state) => {
    return {
      feed: state.feed,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(Feed));
