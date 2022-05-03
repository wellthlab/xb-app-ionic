import React from "react";
import { IonContent, IonPage, IonSpinner } from "@ionic/react";
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
    content = <IonSpinner name="crescent" className="center-spin" />;
  } else if (feed.feed.length < 1) {
    props.controllers.GET_FEED();
    content = <IonSpinner name="crescent" className="center-spin" />;
  } else {
    content = <ContentFeed feed={props.feed.feed} />;
  }

  return (
    <IonPage>
      <XBHeader title="Reference"></XBHeader>
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
