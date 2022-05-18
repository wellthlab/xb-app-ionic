import { IonPage, IonContent } from "@ionic/react";

import XBHeader from "../util/XBHeader";
import TaskMovementPicker from "../MovementPuzzlePicker/TaskMovementPicker";
import XBInfo from "../util/XBInfo";
import { connect } from "react-redux";

function MoveLibrary(props) {
  const library = props.library.library.find((lib) => lib.topic === "moves");
  return (
    <IonPage>
      <XBHeader title="Strength & Balance" />
      <IonContent>
        <XBInfo title="REVISION" desc={library.desc} />
        {/* exercises need to be defined because a later component tries to
        index into it, even though it's not used */}
        <TaskMovementPicker
          explorer={true}
          showBackButton={false}
          exercises={[[]]}
        />
      </IonContent>
    </IonPage>
  );
}

export default connect((state, ownProps) => {
  return {
    library: state.library,
  };
})(MoveLibrary);
