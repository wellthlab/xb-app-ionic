import { IonItem, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import JournalFeed from "../JournalFeed";

/**
 * Display a tab bar to select between a feed type, and the feed itself.
 *
 * @param segmentChoice - the current segment chosen for the tab bar
 * @param setSegmentChoice - a function to handle when the segment is changed
 * @param responsesToShow - the responses to show in the feed
 */
function TabFeed({ segmentChoice, setSegmentChoice, responsesToShow }) {
  return (
    <>
      <IonItem mode="md" lines="none" style={{ "--ion-padding": "0px" }}>
        <IonSegment
          value={segmentChoice}
          onIonChange={(e) => setSegmentChoice(e.detail.value)}
        >
          <IonSegmentButton value="notes">
            <IonLabel>Notes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="activity">
            <IonLabel>Movement</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonItem>
      <JournalFeed responses={responsesToShow} />
    </>
  );
}

export default TabFeed;
