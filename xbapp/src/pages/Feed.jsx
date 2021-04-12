import React, { Component } from "react";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import XBHeader from "../components/XBHeader";
import ContentFeed from "../components/feed/ContentFeed";
import "./Feed.css";

import { connect } from "react-redux";

const autoBindReact = require("auto-bind/react");

class Feed extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this); // Binds 'this' to this object in all methods
  }

  render() {
    return (
      <IonPage>
        <XBHeader title="Updates"></XBHeader>
        <IonContent fullscreen>
          <ContentFeed feed={this.props.feed} />
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
)(Feed);
