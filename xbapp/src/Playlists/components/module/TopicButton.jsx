import { IonItem, IonThumbnail, IonImg, IonLabel } from "@ionic/react";

import { getTopicThumbnail } from "../util";

/**
 * A button to press to open a new page showing the modules in a topic
 *
 * @param topic - the main topic
 * @param title - the title of button
 * @param img - the image to display to represent the topic
 */
function TopicButton({ topic, title }) {
  return (
    <IonItem
      button
      detail={true}
      expand="full"
      size="normal"
      routerLink={"/move/module-subscriber/" + topic}
      lines="none"
    >
      <IonThumbnail slot="start">
        <IonImg src={getTopicThumbnail(topic)} />
      </IonThumbnail>
      <IonLabel>{title}</IonLabel>
    </IonItem>
  );
}

export default TopicButton;
