import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouteMatch } from "react-router-dom";
import {
  IonPage,
  IonLabel,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonFab,
  IonFabButton,
  IonIcon,
  IonContent,
  useIonToast,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import dateFormat from "dateformat";

import ModuleOverview from "./components/ModuleOverview";
import { selectEnrollmentsForModule, enrollToModule } from "../slice";
import * as RealmController from "../../controllers/realm";

const EnrollmentsList = function () {
  const { url } = useRouteMatch();
  const { moduleId } = useParams();

  const enrollments = useSelector((state) =>
    selectEnrollmentsForModule(state, moduleId)
  );

  const [status, setStatus] = React.useState("idle");
  const [present] = useIonToast();
  const dispatch = useDispatch();
  const handleAddEnrollment = async function () {
    setStatus("pending");
    try {
      await dispatch(enrollToModule(moduleId));
    } catch (error) {
      console.log(error);
      setStatus("rejected");
      present({
        duration: 2000,
        message:
          "Cannot re-enroll you to this module at the moment. Please try again",
        color: "danger",
      });
      return;
    }

    setStatus("fulfilled");
  };

  return (
    <IonPage>
      <IonContent>
        <ModuleOverview />
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Enrollments</IonCardTitle>
            <IonCardSubtitle>
              Previous and current attempts at this module. Please select one to
              start, or click the add button to add a new attempt
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {enrollments.map(({ id }) => (
                <IonItem key={id} lines="none" routerLink={`${url}/${id}`}>
                  <IonThumbnail slot="start">
                    <img
                      src={`https://avatars.dicebear.com/api/identicon/${id}.svg`}
                      alt={`Thumbnail for enrollment ${id}`}
                    />
                  </IonThumbnail>
                  <IonLabel>
                    <h2>Enrollment {id}</h2>
                    <p>
                      Enrolled on{" "}
                      {dateFormat(
                        RealmController.idToCreationTs(id),
                        "ddd, dd/mm/yyyy"
                      )}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={handleAddEnrollment}
            disabled={status === "pending"}
          >
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default EnrollmentsList;
