import React, { Component } from "react";
import { IonCard } from "@ionic/react";
import { connect } from "react-redux";

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
