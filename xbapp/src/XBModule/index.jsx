import React from "react";
import { IonPage, IonSpinner, IonContent } from "@ionic/react";
import { useParams, Redirect } from "react-router-dom";

import ModuleDetail from "./ModuleDetail";
import * as Summer22Controller from "../controllers/summer22";
import XBHeader from "../util/XBHeader";
import useAsync from "../util/useAsync";

const XBModule = function () {
  const { id } = useParams();
  const {
    l,
    e,
    result: [userProfile, xbModule],
    act,
  } = useAsync({ initialResult: [null, null] });

  React.useEffect(() => {
    // Temporarily fetch user profiles for prototyping

    act(
      Promise.all([
        Summer22Controller.getSubscriptions(),
        Summer22Controller.getModule(id),
      ])
    );
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

    // User not subscribed

    const progress = userProfile.subscriptions[xbModule._id.valueOf()];

    if (!progress) {
      return <Redirect to={`/move/module-subscriber/${xbModule.topic}`} />;
    }

    content = (
      <React.Fragment>
        <XBHeader title={xbModule.name} colour={xbModule.colour} />
        <IonContent>
          <ModuleDetail
            xbModule={xbModule}
            currentPlaylist={progress.currentPlaylist}
          />
        </IonContent>
      </React.Fragment>
    );
  }

  return <IonPage>{content}</IonPage>;
};

export default XBModule;
