import React, { Component } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import XBHeader from "../util/XBHeader";
import ContentFeed from "./components/ContentFeed";

import Timer from "../Instruments/Timer";
import { Link } from "react-router-dom";

import "./Feed.css";

import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

const autoBindReact = require("auto-bind/react");

class Feed extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this); // Binds 'this' to this object in all methods
  }

  render() {
    var c; // Hold content

    var feed = this.props.feed;

    if (feed.fetching) {
      c = <ion-spinner name="crescent" />;
    } else if (feed.feed.length < 1) {
      this.props.controllers.GET_FEED();
      c = <ion-spinner name="crescent" />;
    } else {
      c = <ContentFeed feed={this.props.feed.feed} />;
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
          {c}
        </IonContent>
      </IonPage>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return {
      feed: state.feed,
    };
  },
  {
    pure: false,
  }
)(addControllersProp(Feed));
