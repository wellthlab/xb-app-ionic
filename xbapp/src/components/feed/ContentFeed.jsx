import React, { Component } from "react";
import { Link } from "react-router-dom";
import { IonCard, IonButton } from "@ionic/react";
import { connect } from "react-redux";

import OverdueEntry from "./OverdueEntry";
import News from "./News";
//import TeamUpdate from './LiveUpdate';
//import LiveUpdate from './LiveUpdate';

export default class ContentFeed extends Component {
  constructor(props) {
    super(props);
  }

  renderItem(item) {
    console.log("Render content", item);

    var content;
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

    return content;
  }

  render() {
    const { feed } = this.props;
    return (
      <>
        {Object.keys(feed).map((key, i) => {
          var content;

          var item = feed[key];
          var content = this.renderItem(item);

          return <IonCard key={item.id}>{content}</IonCard>;
        })}
      </>
    );
  }
}
