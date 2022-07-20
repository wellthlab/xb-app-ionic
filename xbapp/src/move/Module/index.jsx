import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Redirect, useRouteMatch, Route } from "react-router-dom";
import { IonRouterOutlet, IonPage, IonContent, IonSpinner } from "@ionic/react";

import EnrollmentsList from "./EnrollmentsList";
import ModuleContents from "./ModuleContents";
import EnrollmentIndexGuard from "./EnrollmentIndexGuard";
import PlaylistAndTaskIndexGuard from "./PlaylistAndTaskIndexGuard";
import PlaylistPlayer from "./PlaylistPlayer";
import {
  selectModuleById,
  loadModules,
  selectModulesStatus,
  enrollToModule,
} from "../slice";
import XBHeader from "../../util/XBHeader";

const Module = function () {
  const { path } = useRouteMatch();
  const { moduleId } = useParams();

  // Fetch modules if not fetched

  const modulesStatus = useSelector(selectModulesStatus);
  React.useEffect(() => {
    if (modulesStatus === "idle") {
      dispatch(loadModules());
    }
  }, [modulesStatus]);

  // Enroll

  const xbModule = useSelector((state) => selectModuleById(state, moduleId));
  const [enrollmentStatus, setEnrollmentStatus] = React.useState("idle");
  const dispatch = useDispatch();

  React.useEffect(() => {
    const automaticallyEnroll = async function () {
      // Either not loaded, or not found

      if (!xbModule) {
        return;
      }

      // Already enrolled

      if (xbModule.enrollments.length) {
        setEnrollmentStatus("fulfilled");
        return;
      }

      setEnrollmentStatus("pending");
      try {
        await dispatch(enrollToModule(moduleId)).unwrap();
      } catch (error) {
        setEnrollmentStatus("rejected");
        console.log(error);
        return;
      }

      setEnrollmentStatus("fulfilled");
    };

    automaticallyEnroll();
  }, [moduleId, xbModule]);

  // TODO: Error pages, redirect to 404

  if (modulesStatus === "fulfilled" && !xbModule) {
    return <Redirect to="/move" />;
  }

  let content;

  if (modulesStatus === "pending" || modulesStatus === "idle") {
    content = <IonSpinner name="crescent" />;
  } else if (modulesStatus === "rejected") {
    content =
      "Sorry, cannot retrieve active modules at the moment. Please try again";
  } else {
    content = (
      <React.Fragment>
        <XBHeader title={xbModule.name} colour={xbModule.colour} />

        {enrollmentStatus === "pending" || enrollmentStatus === "idle" ? (
          <IonSpinner name="crescent" />
        ) : enrollmentStatus === "rejected" ? (
          "Sorry, cannot enroll you to this module at the moment. Please try again"
        ) : (
          <IonContent>
            <IonRouterOutlet>
              <Route path={path} render={() => <EnrollmentsList />} exact />
              <Route
                path={`${path}/:enrollmentIndex`}
                render={() => (
                  <EnrollmentIndexGuard>
                    <ModuleContents />
                  </EnrollmentIndexGuard>
                )}
                exact
              />
              <Route
                path={`${path}/:enrollmentIndex/:playlistIndex/:taskIndex`}
                render={() => (
                  <EnrollmentIndexGuard>
                    <PlaylistAndTaskIndexGuard>
                      <PlaylistPlayer />
                    </PlaylistAndTaskIndexGuard>
                  </EnrollmentIndexGuard>
                )}
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
