import { IonPage, IonContent, IonCard } from "@ionic/react";
import { connect } from "react-redux";

import XBHeader from "../util/XBHeader";
import XBInfo from "../util/XBInfo";
import LibraryAccordion from "./components/LibraryAccordion";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function TutorialLibrary(props) {
  const library = props.library.library.find((lib) => lib.topic === "tutorial");
  const items = [...library.content].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });

  const videoList = items.map((term, index) => {
    return <LibraryAccordion item={term} index={index} />;
  });

  return (
    <IonPage>
      <XBHeader title="Tutorials" />
      <IonContent>
        <XBInfo title="REVISION" desc={library.desc} />
        <IonCard>{videoList}</IonCard>
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    library: state.library,
  };
})(TutorialLibrary);
