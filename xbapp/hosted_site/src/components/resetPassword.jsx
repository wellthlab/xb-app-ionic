import React, { Component, useState } from "react";
import { connect } from "react-redux";
import {
    IonContent,
    IonButton,
    IonItem,
    IonInput,
    IonCard,
} from "@ionic/react";

// import getXBClient from "../model/client";
import "./Register.scss";



const ResetPassword = ({ query }) => {
    console.log("Token", query)
    const [state1, setState] = useState({
        pw: "",
        pw2: "",
        error: false,
        tokenError: false,
    });

    const [showModal, setShowModal] = useState(false);
    function toggleModal() {
        setShowModal(!showModal);
    }

    var err = "";
    var btn = "";

    console.log("Reset password", state1);

    if (state1.tokenError) {
        err = (
            <ion-text color="danger">
                Token expired, please request another password reset
            </ion-text>
        );
    } else if (state1.pw.length < 8) {
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
        // var client = getXBClient();
        const token = queryParams.token;
        const tokenId = queryParams.tokenId;
        const newPassword = state1.pw;
        // client.resetPassword(token, tokenId, newPassword)
        //     .then((success) => {
        //         if (success) {
        //             console.log("Password reset");
        //             history.push("/");
        //         } else {
        //             console.log("Password reset failed");
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         const isTokenInvalid = err.message.includes("invalid token data (status 400)");
        //         if (isTokenInvalid) {
        //             console.log("Invalid token used");
        //             setState({
        //                 pw: state1.pw,
        //                 pw2: state1.pw2,
        //                 error: state1.error,
        //                 tokenError: true,
        //             });
        //         }
        //     });
    }


    return (
        <IonContent>
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
                <IonItem>{err}</IonItem>
            </IonCard>

            <div className="centering">{btn}</div>
            <div className="centering"><IonButton routerLink={"/"}> Home </IonButton></div>

        </IonContent>
    );
};

export default connect(
    (state, ownProps) => {
        return { account: state.account };
    },
    {
        // Actions to include as props
    }
)(ResetPassword);
