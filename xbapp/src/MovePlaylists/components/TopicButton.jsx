import { IonItem, IonThumbnail, IonImg, IonLabel } from "@ionic/react";

/**
 * Get the thumbnail URL for a given topic
 * @param topic - the topic
 *
 */
function getTopicThumbnail(topic) {
  switch (topic) {
    default:
      return "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";
  }
}

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
    >
      <IonThumbnail slot="start">
        <IonImg src={getTopicThumbnail(topic)}></IonImg>
      </IonThumbnail>
      <IonLabel>{title}</IonLabel>
    </IonItem>
  );
}

export default TopicButton;
