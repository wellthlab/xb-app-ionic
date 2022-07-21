import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import WithXBSlice from "../util/WithXBSlice";
import {
  IonContent,
  IonList,
  IonItem,
  IonCardHeader,
  IonCardContent,
  IonCard,
  IonCardTitle,
  IonSpinner,
  IonPage,
} from "@ionic/react";
import { connect } from "react-redux";

import { addControllersProp } from "../util_model/controllers";

import "./Settings.scss";
import PIS from "../Account/components/PIS";
import DeleteDisclaimer from "./components/DeleteDisclaimer";
import XBHeader from "../util/XBHeader";
import GenericModal from "../Info/components/GenericModal";

import { LOG_OUT } from "../util_model/slices/Account";

const OptionTabs = (props) => {
  const history = useHistory();

  props.controllers.LOAD_TEAMS_IF_REQD();

  const [showModal, setShowModal] = useState(false);
  function togglePrivacyModal() {
    setShowModal(!showModal);
  }

  const [showPISModal, setShowPISModal] = useState(false);
  function togglePISModal() {
    setShowPISModal(!showPISModal);
  }

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const toggleDisclaimerModal = function () {
    setShowDisclaimerModal(!showDisclaimerModal);
  };

  const [errored, setErrored] = useState(false);

  const handleDeleteAccount = async function () {
    setErrored(false);

    try {
      await props.controllers.client.deleteAccount();
    } catch (error) {
      console.error(error);
      setErrored(true);
      setShowDisclaimerModal(false);
      return;
    }

    setShowDisclaimerModal(false);
    props.LOG_OUT({});
    localStorage.clear();
    history.push("/");
  };

  if (!props.teams.loaded) {
    return (
      <IonPage>
        <XBHeader title="Settings" />
        <IonContent>
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <XBHeader title="Settings" />
      <IonContent id="settings" fullscreen>
        {errored && (
          <strong>
            Sorry, we cannot remove your personal details at the moment
          </strong>
        )}
        {/*About*/}
        <IonCard>
          <IonCardHeader style={{ textAlign: "left" }}>
            <IonCardTitle>About</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem button onClick={togglePrivacyModal}>
                Privacy Notice
              </IonItem>
              <IonItem button onClick={togglePISModal}>
                Participant Information
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        {/*Settings*/}
        <IonCard>
          <IonCardHeader style={{ textAlign: "left" }}>
            <IonCardTitle>Settings</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem routerLink="/settings/user-profile">
                Update Profile
              </IonItem>
              <IonItem routerLink={"/settings/change-team"}>
                Change Team
              </IonItem>
              <IonItem routerLink="/account">Log Out</IonItem>
              <IonItem button color="danger" onClick={toggleDisclaimerModal}>
                Delete personal information
              </IonItem>
              {/* <IonItem routerLink="/notifications">Notifications</IonItem> */}
            </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
      {/*Modals for about*/}
      <GenericModal
        showModal={showModal}
        toggleModal={() => {
          togglePrivacyModal();
        }}
        title={"Privacy Notice"}
        message={privacy_notice}
      />
      <GenericModal
        showModal={showPISModal}
        toggleModal={() => {
          togglePISModal();
        }}
        title={"Participant Information"}
        message={<PIS />}
      />
      <GenericModal
        showModal={showDisclaimerModal}
        toggleModal={toggleDisclaimerModal}
        title="Disclaimer"
        message={
          <DeleteDisclaimer
            onReject={toggleDisclaimerModal}
            onProceed={handleDeleteAccount}
          />
        }
      />
    </IonPage>
  );
};

export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      experiments: state.experiments,
      boxes: state.boxes,
    };
  },
  {
    LOG_OUT,
  }
)(
  addControllersProp(
    WithXBSlice(OptionTabs, "teams", (props) => {
      props.controllers.LOAD_TEAMS_IF_REQD();
    })
  )
);

var privacy_notice = (
  <div id="privacyNotice" className="ion-text-justify">
    <br />
    <b>What happens if there is a problem?</b>
    <br />
    If you have a concern about any aspect of this study, you should speak to
    the researchers who will do their best to answer your questions. <br />
    If you remain unhappy or have a complaint about any aspect of this study,
    please contact the University of Southampton Research Integrity and
    Governance Manager (023 8059 5058,{" "}
    <a href={"mailto:rgoinfo@soton.ac.uk"}>rgoinfo@soton.ac.uk</a>).
    <br />
    <br />
    <b>Data Protection Privacy Notice</b>
    <br />
    The University of Southampton conducts research to the highest standards of
    research integrity. As a publicly-funded organisation, the University has to
    ensure that it is in the public interest when we use personally-identifiable
    information about people who have agreed to take part in research. This
    means that when you agree to take part in a research study, we will use
    information about you in the ways needed, and for the purposes specified, to
    conduct and complete the research project. Under data protection law,
    ‘Personal data’ means any information that relates to and is capable of
    identifying a living individual. The University’s data protection policy
    governing the use of personal data by the University can be found on its
    website (
    <a href="https://www.southampton.ac.uk/legalservices/what-we-do/data-protection-and-foi.page">
      here
    </a>
    ). <br />
    <br />
    The information found in the XB Tutorial inside the app tells you what data
    will be collected for this project and whether this includes any personal
    data. Please ask the research team if you have any questions or are unclear
    what data is being collected about you. <br />
    <br />
    Our privacy notice for research participants provides more information on
    how the University of Southampton collects and uses your personal data when
    you take part in one of our research projects and can be found on{" "}
    <a href="http://www.southampton.ac.uk/assets/sharepoint/intranet/ls/Public/Research%20and%20Integrity%20Privacy%20Notice/Privacy%20Notice%20for%20Research%20Participants.pdf">
      here.
    </a>{" "}
    <br />
    <br />
    Any personal data we collect in this study will be used only for the
    purposes of carrying out our research and will be handled according to the
    University’s policies in line with data protection law. If any personal data
    is used from which you can be identified directly, it will not be disclosed
    to anyone else without your consent unless the University of Southampton is
    required by law to disclose it. <br />
    <br />
    Data protection law requires us to have a valid legal reason (‘lawful
    basis’) to process and use your Personal data. The lawful basis for
    processing personal information in this research study is for the
    performance of a task carried out in the public interest. Personal data
    collected for research will not be used for any other purpose.
    <br />
    <br />
    For the purposes of data protection law, the University of Southampton is
    the ‘Data Controller’ for this study, which means that we are responsible
    for looking after your information and using it properly. The University of
    Southampton will keep identifiable information about you for 1 year after
    the study has finished after which time any link between you and your
    information will be removed.
    <br />
    <br />
    To safeguard your rights, we will use the minimum personal data necessary to
    achieve our research study objectives. Your data protection rights – such as
    to access, change, or transfer such information - may be limited, however,
    in order for the research output to be reliable and accurate. The University
    will not do anything with your personal data that you would not reasonably
    expect. <br />
    <br />
    If you have any questions about how your personal data is used, or wish to
    exercise any of your rights, please consult the University’s data protection
    webpage (
    <a href="https://www.southampton.ac.uk/legalservices/what-we-do/data-protection-and-foi.page">
      here
    </a>
    ) where you can make a request using our online form. If you need further
    assistance, please contact the University’s Data Protection Officer (
    <a href={"mailto:data.protection@soton.ac.uk"}>
      data.protection@soton.ac.uk
    </a>
    ).
    <br />
    <br />
    <b>Thank you.</b>
    <br />
    Thank you for taking the time to read the information sheet and considering
    taking part in the research.
    <br />
  </div>
);
