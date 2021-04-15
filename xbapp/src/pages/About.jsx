import React, { Component, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonItemDivider,
  IonButton,
  IonItem,
} from "@ionic/react";
import XBHeader from "../components/XBHeader";
import "./Account.css";
import GenericAlert from "../components/GenericAlert";
import GenericModal from "../components/GenericModal";
import mobiscroll from "@mobiscroll/react-lite";
import "@mobiscroll/react-lite/dist/css/mobiscroll.min.css";
/**
 * Each slice exports some action creators that are used to push changes into the model
 */
import { LOG_IN, LOG_OUT } from "../model/slices/Account";

import "./About.scss";

/**
 * We use this later, it joins the component up to the state, held in Redux
 */
import { connect } from "react-redux";

const TabAccount = ({}) => {
  const [showAlert, setShowAlert] = useState(false);
  function toggleAlert() {
    setShowAlert(!showAlert);
  }
  const [showModal, setShowModal] = useState(false);
  function toggleModal() {
    setShowModal(!showModal);
  }

  var mbsc = useRef();

  return (
    <IonPage>
      <XBHeader title="About XB"></XBHeader>
      <IonContent id="about" fullscreen>
        <GenericAlert
          showAlert={showAlert}
          toggleAlert={toggleAlert}
          message={
            "If you have any questions, concerns, or want to feedback anything about the app, please contact us at gcm1u16@soton.ac.uk"
          }
        />
        <GenericModal
          showModal={showModal}
          toggleModal={toggleModal}
          title={"Privacy Notice"}
          message={privacy_notice}
        />

        <h4>What is XB?</h4>
        <IonButton type="button" class="btn btn-link" routerLink="/tutorial">
          Tutorial
        </IonButton>

        <IonItemDivider></IonItemDivider>

        <div id="moreInfo">
          <h4>More Information</h4>
          <p>
            <IonButton
              onClick={() => {
                toggleModal();
              }}
            >
              Privacy Notice
            </IonButton>
          </p>

          <p>
            <IonButton
              onClick={() => {
                toggleAlert();
              }}
            >
              Contact
            </IonButton>
          </p>
        </div>

        <IonItemDivider></IonItemDivider>
        <div id="corpInfo">
          <p>
            eXperiment in a Box
            <br />
            &copy; 2020-2021 University of Southampton
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TabAccount;

var privacy_notice = (
  <div id="privacyNotice">
    <b>What happens if there is a problem?</b>
    <br></br>
    If you have a concern about any aspect of this study, you should speak to
    the researchers who will do their best to answer your questions. <br></br>
    If you remain unhappy or have a complaint about any aspect of this study,
    please contact the University of Southampton Research Integrity and
    Governance Manager (023 8059 5058, rgoinfo@soton.ac.uk).<br></br>
    <br></br>
    <b>Data Protection Privacy Notice</b>
    <br></br>
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
    ). <br></br>
    <br></br>
    The information found in the XB Tutorial inside the app tells you what data
    will be collected for this project and whether this includes any personal
    data. Please ask the research team if you have any questions or are unclear
    what data is being collected about you. <br></br>
    <br></br>
    Our privacy notice for research participants provides more information on
    how the University of Southampton collects and uses your personal data when
    you take part in one of our research projects and can be found on{" "}
    <a href="http://www.southampton.ac.uk/assets/sharepoint/intranet/ls/Public/Research%20and%20Integrity%20Privacy%20Notice/Privacy%20Notice%20for%20Research%20Participants.pdf">
      here.
    </a>{" "}
    <br></br>
    <br></br>
    Any personal data we collect in this study will be used only for the
    purposes of carrying out our research and will be handled according to the
    University’s policies in line with data protection law. If any personal data
    is used from which you can be identified directly, it will not be disclosed
    to anyone else without your consent unless the University of Southampton is
    required by law to disclose it. <br></br>
    <br></br>
    Data protection law requires us to have a valid legal reason (‘lawful
    basis’) to process and use your Personal data. The lawful basis for
    processing personal information in this research study is for the
    performance of a task carried out in the public interest. Personal data
    collected for research will not be used for any other purpose.<br></br>
    <br></br>
    For the purposes of data protection law, the University of Southampton is
    the ‘Data Controller’ for this study, which means that we are responsible
    for looking after your information and using it properly. The University of
    Southampton will keep identifiable information about you for 1 year after
    the study has finished after which time any link between you and your
    information will be removed.<br></br>
    <br></br>
    To safeguard your rights, we will use the minimum personal data necessary to
    achieve our research study objectives. Your data protection rights – such as
    to access, change, or transfer such information - may be limited, however,
    in order for the research output to be reliable and accurate. The University
    will not do anything with your personal data that you would not reasonably
    expect. <br></br>
    <br></br>
    If you have any questions about how your personal data is used, or wish to
    exercise any of your rights, please consult the University’s data protection
    webpage (
    <a href="https://www.southampton.ac.uk/legalservices/what-we-do/data-protection-and-foi.page">
      here
    </a>
    ) where you can make a request using our online form. If you need further
    assistance, please contact the University’s Data Protection Officer
    (data.protection@soton.ac.uk).<br></br>
    <br></br>
    <b>Thank you.</b>
    <br></br>
    Thank you for taking the time to read the information sheet and considering
    taking part in the research.<br></br>
  </div>
);
