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
function GlossaryLibrary(props) {
  const library = props.library.library.find((lib) => lib.topic === "glossary");
  const items = [...library.content].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });

  const termList = items.map((term, index) => {
    return <LibraryAccordion item={term} index={index} />;
  });

  return (
    <IonPage>
      <XBHeader title="Glossary" />
      <IonContent>
        <XBInfo title="REVISION" desc={library.desc} />
        <IonCard>{termList}</IonCard>
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    library: state.library,
  };
})(GlossaryLibrary);
