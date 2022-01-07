import React from "react";
import { IonCard } from "@ionic/react";

import OverdueEntry from "./OverdueEntry";
import TeamUpdate from "./TeamUpdate";
import News from "./News";

const ContentFeed = (props) => {

  return (
    <>
      {Object.keys(props.feed).map((key) => {

        const item = props.feed[key];
        const content = renderItem(item);

        return <IonCard key={item.id}>{content}</IonCard>;
      })}
    </>
  );
};

const renderItem = (item) => {

  console.log("Render content", item);

  let content;
  switch (item.type) {
    case "overdue_entry":
      content = <OverdueEntry item={item} />;
      break;
    case "team_update":
      content = <TeamUpdate item={item} />;
      break;
    case "news":
      content = <News item={item} />;
      break;
    default:
      throw new Error(`Invalid feed type ${item.type}`);
  }

  return content;
};

export default ContentFeed; 