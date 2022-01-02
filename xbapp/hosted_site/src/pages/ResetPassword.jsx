import { React, useState } from "react";
import {
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonCard,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";

import "./ResetPassword.scss";

import getXBClient from "../model/client";
import { useEffect } from "react";

function ResetPassword(props) {
  const [state1, setState] = useState({
    pw: "",
    pw2: "",
    error: false,
    tokenError: false,
  });

  // Used to display error messages and disable the reset password button
  const [state2, setState2] = useState({
    err: "",
    enableButton: false,
  });

  // Get url parameters token and tokenId
  const query = props.location.search;
  const params = getQueryParamsFromSearch(query);

  useEffect(() => {
    if (state1.tokenError) {
      setState2({
        err: (
          <ion-text color="danger">
            Token expired, please request another password reset
          </ion-text>
        ),
        enableButton: false,
      });
    } else if (state1.pw.length < 8) {
      setState2({
        err: <>Enter a password of at least 8 characters</>,
        enableButton: false,
      });
    } else if (state1.pw !== state1.pw2) {
      setState2({
        err: <>Please enter matching passwords</>,
        enableButton: false,
      });
    } else {
      setState2({
        err: "Passwords match",
        enableButton: true,
      });
    }
  }, [state1]);

  function getQueryParamsFromSearch(query) {
    const regex = /token=([^&]*)&tokenId=([^&]*)/g;
    // Extract matches and capturing groups from string
    // Query expected in the form /?token=<tokenString>&tokenId=<tokenIdString>
    const matches = [...query.matchAll(regex)][0];
    // console.log(matches);
    const queryParams = {};
    if (matches !== undefined) {
      queryParams.token = matches[1];
      queryParams.tokenId = matches[2];
    }
    return queryParams;
  }

  function resetPassword(e) {
    const queryParams = params;
    var client = getXBClient();
    const token = queryParams.token;
    const tokenId = queryParams.tokenId;
    const newPassword = state1.pw;
    client
      .resetPassword(token, tokenId, newPassword)
      .then((success) => {
        if (success) {
          // console.log("Password reset");
          setState2({
            err: <>Password successfully reset</>,
            enableButton: false,
          });
        } else {
          // console.log("Password reset failed");
          setState2({
            err: <>Password not reset</>,
            enableButton: true,
          });
        }
      })
      .catch((error) => {
        // console.log(error);
        const isTokenInvalid = error.message.includes(
          "invalid token data (status 400)"
        );
        if (isTokenInvalid) {
          // console.log("Invalid token used");
          setState({
            pw: state1.pw,
            pw2: state1.pw2,
            error: state1.error,
            tokenError: true,
          });
        }
        setState2({
          err: <>Password not reset</>,
          enableButton: true,
        });
      });
  }

  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

  let form;
  if (isEmptyObject(params)) {
    form = (
      <IonContent>
        <IonItem>No tokens found</IonItem>
      </IonContent>
    );
  } else {
    form = (
      <IonContent>
        <IonCard>
          <IonItem>Reset password</IonItem>
          <IonItem>
            <IonInput
              placeholder="Password"
              type="password"
              onIonChange={(e) => {
                setState({
                  pw: e.detail.value,
                  pw2: state1.pw2,
                  error: state1.error,
                  tokenError: state1.tokenError,
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
                  tokenError: state1.tokenError,
                });
              }}
            ></IonInput>
          </IonItem>
          <IonItem>{state2.err}</IonItem>
          <div className="centering">
            <IonButton
              onclick={() => resetPassword()}
              slot="end"
              disabled={!state2.enableButton}
            >
              Reset Password
            </IonButton>
          </div>
        </IonCard>
      </IonContent>
    );
  }

  return (
    <IonPage id="reset-password">
      <IonHeader>
        <IonToolbar>
          <IonTitle>XB: Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"></IonTitle>
          </IonToolbar>
        </IonHeader>
        {form}
      </IonContent>
    </IonPage>
  );
}

export default ResetPassword;
