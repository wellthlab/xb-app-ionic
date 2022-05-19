import { useState } from "react";
import { IonCheckbox, IonCol, IonItem, IonRow, IonText } from "@ionic/react";

import GenericModal from "../../Info/components/GenericModal";
import PIS from "../../Account/components/PIS";

function Consent(props) {
  const [consentStaff, setConsentStaff] = useState(false);
  const [consentFaculty, setConsentFaculty] = useState(false);
  const [consentPIS, setConsentPIS] = useState(false);

  const [showModal, setShowModal] = useState(false);
  function toggleModal() {
    setShowModal(!showModal);
  }

  props.setConsented(consentStaff && consentFaculty && consentPIS);

  return (
    <div>
      <GenericModal
        showModal={showModal}
        toggleModal={toggleModal}
        title="Participant Information Sheet"
        message={<PIS />}
      />
      <IonRow>
        <IonCol>
          <IonItem lines="none" className={"ion-text-justify"}>
            <IonText style={{ fontSize: "1.1em" }}>
              Before deciding to take part in this research study, you should
              read the{" "}
              <u>
                <a onClick={toggleModal}>participant information sheet</a>
              </u>
              .
            </IonText>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              color="danger"
              checked={consentStaff}
              onIonChange={() => {
                setConsentStaff(!consentStaff);
              }}
            />
            <p>
              I am a member of staff at the University of Southampton, and I am
              at least 18 years old.
            </p>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              color="danger"
              checked={consentFaculty}
              onIonChange={() => {
                setConsentFaculty(!consentFaculty);
              }}
            />
            <p>
              I understand that I must be employed in a participating faculty or
              service, and that in some faculties or services I should discuss
              or raise participation with my line manager, as directed by my
              faculty or service.
            </p>
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            <IonCheckbox
              slot="start"
              color="danger"
              checked={consentPIS}
              onIonChange={() => {
                setConsentPIS(!consentPIS);
              }}
            />
            <p>
              I have read the provided participant information and consent to
              take part in the study.
            </p>
          </IonItem>
        </IonCol>
      </IonRow>
    </div>
  );
}

export default Consent;
