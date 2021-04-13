import React, { Component } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import XBHeader from "../components/XBHeader";
import ContentFeed from "../components/feed/ContentFeed";
import "./Feed.css";

import { connect } from "react-redux";

import { addControllersProp } from "../model/controllers";

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
        <IonContent fullscreen>{c}</IonContent>
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
