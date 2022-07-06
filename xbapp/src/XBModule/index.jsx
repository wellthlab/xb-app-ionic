import React from "react";
import { IonPage, IonSpinner, IonRouterOutlet, IonContent } from "@ionic/react";
import { useParams, useRouteMatch, Redirect, Route } from "react-router-dom";

import ModuleOverview from "./ModuleOverview";
import Playlist from "./Playlist";
import * as Summer22Controller from "../controllers/summer22";
import XBHeader from "../util/XBHeader";
import useAsync from "../util/useAsync";

const XBModule = function () {
  const { id } = useParams();
  const { path } = useRouteMatch();

  const {
    l,
    e,
    result: [userSubscriptions, xbModule],
    setResult,
    act,
  } = useAsync({ initialResult: [null, null, null] });

  React.useEffect(() => {
    // Temporarily fetch user profiles for prototyping

    act(
      Promise.all([
        Summer22Controller.getSubscriptions(),
        Summer22Controller.getModule(id),
      ])
    );
  }, [id]);

  const handleResponseUpdate = function (playlistIdx, taskIdx, newResponse) {
    const newResponses = [...xbModule.responses];
    const newResponsesByTask = newResponses[playlistIdx]
      ? [...newResponses[playlistIdx]]
      : [];
    newResponsesByTask[taskIdx] = newResponse;
    newResponses[playlistIdx] = newResponsesByTask;

    // Calculate completion (NEEDS REFACTOR TO REUSE CODE FROM Summer22Controller)

    const newPlaylists = [...xbModule.playlists];

    for (let i = 0; i < newPlaylists.length; i++) {
      const newTasks = [...newPlaylists[i].tasks];
      newPlaylists[i].tasks = newTasks;

      let locked = false;
      for (let j = 0; j < newTasks.length; j++) {
        const task = { ...newTasks[j] };
        newTasks[j] = task;

        const response = newResponses[i] ? newResponses[i][j] : null;

        if (response) {
          task.status = "completed";
          continue;
        }

        if (locked) {
          task.status = "locked";
          continue;
        }

        task.status = "incomplete";

        if (task.constraint) {
          if (task.constraint.type === "DELAY") {
            // Ignore DELAY constraint type if on the first task - Likely to be an error

            if (j === 0) {
              continue;
            }

            const prevResponse = newResponses[i]
              ? newResponses[i][j - 1]
              : null;

            const previousTimestamp = prevResponse
              ? prevResponse._id.getTimestamp().getTime()
              : null;

            console.log(
              prevResponse,
              previousTimestamp,
              Date.now(),
              previousTimestamp + task.constraint.ms
            );

            if (
              !previousTimestamp ||
              Date.now() < previousTimestamp + task.constraint.ms
            ) {
              task.constraint.previousTimestamp = previousTimestamp;
              task.status = "locked";
              locked = true;
              continue;
            }

            delete task.constraint;
          }
        }
      }
    }

    const newXbModule = {
      ...xbModule,
      responses: newResponses,
      playlists: newPlaylists,
    };

    setResult([userSubscriptions, newXbModule]);
  };

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

  // TODO: Re-organise nested routes + refactor state to redux

  return (
    <IonPage>
      <XBHeader title={xbModule.name} colour={xbModule.colour} />
      <IonContent>
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
            path={`${path}/:playlistIdx/:taskIdx?`}
            render={() => (
              <Playlist
                playlists={xbModule.playlists}
                responses={xbModule.responses}
                onResponseUpdate={handleResponseUpdate}
              />
            )}
          />
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
  );
};

export default XBModule;
