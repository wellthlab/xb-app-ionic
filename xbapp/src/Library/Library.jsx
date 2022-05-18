import {
  IonPage,
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonImg,
  IonThumbnail,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import Feed from "../Feed/Feed";
import { connect } from "react-redux";

import XBHeader from "../util/XBHeader";
import XBInfo from "../util/XBInfo";
import { addControllersProp } from "../util_model/controllers";

/**
 * TODO: add more thumbnails for titles
 * Get the thumbnail URL for a given title
 * @param topic - the topic
 *
 */
function getItemThumbnail(title) {
  switch (title) {
    default:
      return "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";
  }
}

function LibraryItem({ title, link }) {
  return (
    <IonItem
      button
      detail={true}
      expand="full"
      size="normal"
      routerLink={"/library/" + link}
      lines="none"
    >
      <IonThumbnail slot="start">
        <IonImg src={getItemThumbnail(title)} />
      </IonThumbnail>
      <IonLabel>{title}</IonLabel>
    </IonItem>
  );
}

function Library(props) {
  props.controllers.GET_LIBRARY_IF_REQD();

  if (!props.library.loaded) {
    return (
      <IonPage>
        <XBHeader title={"Library"} />
        <IonContent>
          <IonSpinner name="crescent" className="center-spin" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Library" />
      <IonContent>
        <XBInfo
          title="KNOWLEDGE IS POWER"
          desc="The library contains a comprehensive list of terms, concepts and
          strength movements that you will encounter during the movement
          playlists. Use this page to refresh your memory, learn something
          new, or catch up with the latest news in the feed blow!"
        />
        {/* Tutorials, videos, etc. */}
        <IonCard>
          <IonGrid>
            <IonRow>
              <IonCol>
                <LibraryItem title="Glossary" link="glossary" />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <LibraryItem title="Neuromobility" link="neuro" />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <LibraryItem title="Playlists" link="playlists" />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <LibraryItem title="Strength & Balance" link="explorer" />
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <LibraryItem title="Tutorials" link="tutorials" />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        {/* Feed */}
        <Feed />
      </IonContent>
    </IonPage>
  );
}

// export default Library;

export default connect((state, ownProps) => {
  return {
    library: state.library,
  };
}, {})(addControllersProp(Library));
