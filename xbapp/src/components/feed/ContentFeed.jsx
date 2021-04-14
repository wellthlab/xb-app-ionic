import React, { Component } from "react";
import { Link } from "react-router-dom";
import { IonCard, IonButton } from "@ionic/react";
import { connect } from "react-redux";
import Timer from "../user_input/Timer";

import OverdueEntry from "./OverdueEntry";
import News from "./News";
//import TeamUpdate from './LiveUpdate';
//import LiveUpdate from './LiveUpdate';

export default class ContentFeed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { feed } = this.props;
    return (
      <>
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
        {Object.keys(feed).map((key, i) => {
          var content;

          var item = feed[key];

          console.log("Render content", item);

          switch (item.type) {
            /*case 'team_update':
                        content = <TeamUpdate item={item} />
                        break;
                    case 'live_update':
                        content = <LiveUpdate item={item} />
                        break;*/
            case "overdue_entry":
              content = <OverdueEntry item={item} key={item.id} />;
              break;
            case "news":
              content = <News item={item} key={item.id} />;
              break;
          }

          return <IonCard key={item.id}>{content}</IonCard>;
        })}
      </>
    );
  }
}
