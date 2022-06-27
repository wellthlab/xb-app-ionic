import React from "react";
import { IonPage, IonSpinner, IonRouterOutlet } from "@ionic/react";
import { useParams, useRouteMatch, Redirect, Route } from "react-router-dom";

import ModuleOverview from "./ModuleOverview";
import Task from "./Task";
import * as Summer22Controller from "../controllers/summer22";
import useAsync from "../util/useAsync";

const XBModule = function () {
  const { id } = useParams();
  const { path } = useRouteMatch();

  const {
    l,
    e,
    result: [userSubscriptions, xbModule],
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

  if (l) {
    return <IonSpinner className="center-spin" name="crescent" />;
  }

  if (e) {
    return <div>Errored whilst loading module</div>;
  }

  // Module not found

  if (!xbModule) {
    return <Redirect to="/move" />;
  }

  // User not subscribed

  const subscription = userSubscriptions.subscriptions[xbModule._id.valueOf()];

  if (!subscription) {
    return <Redirect to={`/move/module-subscriber/${xbModule.topic}`} />;
  }

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route
          path={path}
          render={() => (
            <ModuleOverview
              xbModule={xbModule}
              currentPlaylist={subscription.currentPlaylist}
            />
          )}
          exact
        />
        <Route
          path={`${path}/:playlistIdx/:taskIdx`}
          component={() => <Task playlists={xbModule.playlists} />}
        />
      </IonRouterOutlet>
    </IonPage>
  );
};

export default XBModule;
