import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { ACCEPT_LOGIN } from "../model/slices/Account";
import {
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonCard,
  IonItemDivider,
} from "@ionic/react";

import getXBClient from "../model/client";
import XBHeader from "./XBHeader";
import "./Register.scss";
import { useHistory } from "react-router-dom";

import { NavContext } from "@ionic/react";
import GenericModal from "./GenericModal";
import PIS from "./PIS";
import { Search } from "@material-ui/icons";
import { searchCircleOutline } from "ionicons/icons";

const autoBindReact = require("auto-bind/react");

const Register = ({ query }) => {
  console.log("Token", query)
  const [state1, setState] = useState({
    pw: "",
    pw2: "",
    error: false,
  });
  const history = useHistory();

  const [showModal, setShowModal] = useState(false);
  function toggleModal() {
    setShowModal(!showModal);
  }

  var err = "";
  var btn = "";

  console.log("Reset password", state1);

  if (state1.pw.length < 8) {
    err = <>Enter a password of at least 8 characters</>;
  } else if (state1.pw !== state1.pw2) {
    err = <>Please enter matching passwords</>
  } else {
    // TODO: have a confirmatory err message here
    err = "";
    btn = (
      <IonButton onclick={() => resetPassword()} slot="end">
        Reset Password
      </IonButton>
    );
  }

  if (err == "" && state1.error !== false) {
    switch (state1.error.statusCode) {
      case 409:
        err = (
          <ion-text color="danger">
            That email address is already registered
          </ion-text>
        );
        break;
      default:
        err = <ion-text color="danger">{state1.error.error}</ion-text>;
    }
  }

  function getQueryParamsFromSearch(query) {
    const regex = /token=([^&]*)&tokenId=([^&]*)/g;
    // Extract matches and capturing groups from string
    // Query expected in the form /?token=<tokenString>&tokenId=<tokenIdString>
    const matches = [...query.matchAll(regex)][0];
    const queryParams = {};
    queryParams.token = matches[1];
    queryParams.tokenId = matches[2];
    return queryParams;
  }

  function resetPassword(e) {
    const queryParams = getQueryParamsFromSearch(query);
    var client = getXBClient();
    const token = queryParams.token;
    const tokenId = queryParams.tokenId;
    const newPassword = state1.pw;
    client.resetPassword(token, tokenId, newPassword).then(() => {
      console.log("Reset password");
    });
  }

  var pis = <PIS />;

  return (
    <IonContent>
      <GenericModal
        showModal={showModal}
        toggleModal={toggleModal}
        title={"Participant Information Sheet"}
        message={pis}
      />

      <IonCard>
        <IonItem>
          <IonInput
            placeholder="Password"
            type="password"
            onIonChange={(e) => {
              setState({
                pw: e.detail.value,
                pw2: state1.pw2,
                error: state1.error,
              });
            }}
          ></IonInput>
        </IonItem>
        <IonItem>
          <IonInput
            placeholder="Confirm Password"
            type="password"
            onIonChange={(e) => {
              setState({
                pw: state1.pw,
                pw2: e.detail.value,
                error: state1.error,
              });
            }}
          ></IonInput>
        </IonItem>
        <IonItem>{err}</IonItem>
      </IonCard>

      <div className="centering">{btn}</div>
    </IonContent>
  );
};

export default connect(
  (state, ownProps) => {
    return { account: state.account };
  },
  {
    // Actions to include as props
    ACCEPT_LOGIN,
  }
)(Register);
