import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Redirect, useRouteMatch, Route } from "react-router-dom";
import { IonRouterOutlet, IonPage, IonContent, IonSpinner } from "@ionic/react";

import ModuleContents from "./ModuleContents";
import PlaylistAndTaskIndexGuard from "./PlaylistAndTaskIndexGuard";
import PlaylistPlayer from "./PlaylistPlayer";
import {
  selectModuleById,
  loadModules,
  selectModulesStatus,
  enrollToModule,
} from "../slice";
import * as RealmController from "../../controllers/realm";
import XBHeader from "../../util/XBHeader";

const Module = function () {
  const { path } = useRouteMatch();
  const { moduleId } = useParams();

  const dispatch = useDispatch();

  // Fetch modules if not fetched

  const modulesStatus = useSelector(selectModulesStatus);
  React.useEffect(() => {
    if (modulesStatus === "idle") {
      dispatch(loadModules());
    }
  }, [modulesStatus]);

  // Enroll

  const [enrollmentStatus, setEnrollmentStatus] = React.useState("idle");
  React.useEffect(() => {
    const automaticallyEnroll = async function () {
      setEnrollmentStatus("pending");
      try {
        await dispatch(enrollToModule(moduleId)).unwrap();
      } catch (error) {
        // Module not found, handled below

        if (error instanceof RealmController.ModuleNotFoundError) {
          return;
        }

        setEnrollmentStatus("rejected");
        console.log(error);
        return;
      }

      setEnrollmentStatus("fulfilled");
    };

    automaticallyEnroll();
  }, [moduleId]);

  // TODO: Error pages, redirect to 404

  const xbModule = useSelector((state) => selectModuleById(state, moduleId));
  if (modulesStatus === "fulfilled" && !xbModule) {
    return <Redirect to="/move" />;
  }

  let content;

  if (modulesStatus === "pending" || modulesStatus === "idle") {
    content = <IonSpinner className="center-spin" name="crescent" />;
  } else if (modulesStatus === "rejected") {
    content =
      "Sorry, cannot retrieve active modules at the moment. Please try again";
  } else {
    content = (
      <React.Fragment>
        <XBHeader title={xbModule.name} colour={xbModule.colour} />

        {enrollmentStatus === "pending" || enrollmentStatus === "idle" ? (
          <IonSpinner className="center-spin" name="crescent" />
        ) : enrollmentStatus === "rejected" ? (
          "Sorry, cannot enroll you to this module at the moment. Please try again"
        ) : (
          <IonContent>
            <IonRouterOutlet>
              <Route path={path} render={() => <ModuleContents />} exact />
              <Route
                path={`${path}/:playlistIndex/:taskIndex`}
                render={() => (
                  <PlaylistAndTaskIndexGuard>
                    <PlaylistPlayer />
                  </PlaylistAndTaskIndexGuard>
                )}
                exact
              />
            </IonRouterOutlet>
          </IonContent>
        )}
      </React.Fragment>
    );
  }

  return <IonPage>{content}</IonPage>;
};

export default Module;
