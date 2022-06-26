import React from "react";
import { IonPage, IonSpinner } from "@ionic/react";
import { useParams, Redirect } from "react-router-dom";

import Playlist from "./Playlist";
import * as Summer22Controller from "../controllers/summer22";
import XBHeader from "../util/XBHeader";
import useAsync from "../util/useAsync";

const XBModule = function () {
  const { id } = useParams();
  const { l, e, result: xbModule, act } = useAsync();

  React.useEffect(() => {
    act(Summer22Controller.getModule(id));
  }, [id]);

  let content;

  if (l) {
    return <IonSpinner className="center-spin" name="crescent" />;
  }

  if (e) {
    content = <div>Errored whilst loading module</div>;
  } else {
    // Module not found

    if (!xbModule) {
      return <Redirect to="/move" />;
    }

    content = (
      <React.Fragment>
        <XBHeader title={xbModule.name} colour={xbModule.colour} />
        <Playlist />
      </React.Fragment>
    );
  }

  return <IonPage>{content}</IonPage>;
};

export default XBModule;
