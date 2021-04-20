import React, { Component, useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonToolbar,
  IonHeader,
  IonContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge,
  IonAlert,
} from "@ionic/react";
import XBHeader from "./components/XBHeader";

//css
import "./OptionTabs.scss";

function OptionTabs() {
  return (
    <>
      <XBHeader title="Settings"></XBHeader>
      <IonContent id="settings" fullscreen>
        <IonList>
          <IonItem routerLink="/about">About XB</IonItem>
          <IonItemDivider></IonItemDivider>
          <IonItem routerLink="/account">Log Out</IonItem>
          <IonItemDivider></IonItemDivider>
        </IonList>
      </IonContent>
    </>
  );
}

export default OptionTabs;
