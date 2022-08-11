import React from "react";
import {
  // IonContent,
  // IonPage,
  IonSpinner,
  IonCard,
  IonText,
  IonCardContent,
} from "@ionic/react";
// import XBHeader from "../util/XBHeader";
import ContentFeed from "./components/ContentFeed";

// import Timer from "../Instruments/Timer";
// import { Link } from "react-router-dom";

import "./Feed.css";

import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

const Feed = (props) => {
  let content; // Hold content

  const feed = props.feed;

  if (feed.fetching) {
    content = (
      <IonCard>
        <div className="ion-text-center">
          <IonSpinner name="crescent" />
        </div>
      </IonCard>
    );
  } else if (feed.feed.length < 1) {
    props.controllers.GET_FEED_IF_REQD();
    content = (
      <IonCard>
        <div className="ion-text-center">
          <IonSpinner name="crescent" />
        </div>
      </IonCard>
    );
  } else if (feed.feed === false) {
    content = (
      <IonCard>
        <IonCardContent>
          <IonText className="ion-text-center">
            <h1>The news feed failed to load</h1>
          </IonText>
        </IonCardContent>
      </IonCard>
    );
  } else {
    content = <ContentFeed feed={props.feed.feed} />;
  }

  return <>{content}</>;

  // return (
  //   <IonPage>
  //     <XBHeader title="Reference"></XBHeader>
  //     <IonContent fullscreen>
  //       {localStorage.getItem("countActive") != null ? (
  //         <div style={{ textAlign: "center" }}>
  //           <Timer buttonsOnShow={false} />
  //           <Link to={localStorage.getItem("locationOfTimer")}>
  //             Go To Timer{" "}
  //           </Link>
  //         </div>
  //       ) : (
  //         <></>
  //       )}
  //       {content}
  //     </IonContent>
  //   </IonPage>
  // );
};

export default connect((state) => {
  return {
    feed: state.feed,
  };
}, {})(addControllersProp(Feed));
