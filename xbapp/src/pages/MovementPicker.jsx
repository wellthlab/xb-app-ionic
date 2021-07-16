import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Tile from "../components/Tile";
import {
  START_LOGIN,
  ACCEPT_LOGIN,
  REJECT_LOGIN,
} from "../model/slices/Account";
import {
  IonContent,
  IonButton,
  IonItem,
  IonInput,
  IonCard,
  IonSpinner,
  IonSlides,
  IonSlide,
  IonVirtualScroll,
} from "@ionic/react";

import getXBClient from "../model/client";
import { addControllersProp } from "../model/controllers";

import "./MovementPicker.scss";
import { useState } from "react";

const autoBindReact = require("auto-bind/react");

const slideOpts = {
  initialSlide: 1,
  speed: 400,
};

const slideOpts2 = {
  initialSlide: 1,
  speed: 400,
  direction: "vertical",
};
const data = ["A", "B", "C", "D", "E", "F"];

class MovementPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { scrollToIndex: 0 };
    autoBindReact(this);
    console.log("Movement picker created with controllers", props.controllers);
    this.inc = this.inc.bind(this);
    this.onScrollUpdateIndex = this.onScrollUpdateIndex.bind(this);
    this.startOffset = 0;
    this.endOffset = 0;
  }

  componentDidMount() {}

  inc(e) {
    console.log("HEllo", this.state.scrollToIndex);
    this.setState({ scrollToIndex: this.state.scrollToIndex + 1 });
  }
  onScrollUpdateIndex(n, e) {
    console.log(n, e);
    console.log(n % 125);
  }

  render() {
    const { scrollToIndex } = this.state;

    function test(n, e) {
      // console.log(n, e);
    }

    return (
      <IonContent>
        <div id="movement-picker">
          <IonSlides options={slideOpts2}>
            <IonSlide>
              <IonSlides pager={false} options={slideOpts}>
                <IonSlide>
                  <Tile letter="A" colour="brown" />
                </IonSlide>
                <IonSlide>
                  <Tile letter="B" colour="pink" />
                </IonSlide>
                <IonSlide>
                  <Tile letter="C" colour="red" />
                </IonSlide>
              </IonSlides>
            </IonSlide>
            <IonSlide>
              <IonSlides pager={false} options={slideOpts}>
                <IonSlide>
                  <Tile letter="D" />
                </IonSlide>
                <IonSlide>
                  <Tile letter="E" colour="purple" />
                </IonSlide>
              </IonSlides>
            </IonSlide>
            <IonSlide>
              <IonSlides pager={false} options={slideOpts}>
                <IonSlide>
                  <Tile letter="F" colour="blue" />
                </IonSlide>
              </IonSlides>
            </IonSlide>
          </IonSlides>
          <IonButton onClick={this.inc}>Click me</IonButton>
        </div>
      </IonContent>
    );
  }
}

export default connect(
  (state, ownProps) => {
    return { account: state.account };
  },
  {
    // Actions to include as props
    START_LOGIN,
    ACCEPT_LOGIN,
    REJECT_LOGIN,
    pure: false,
  }
)(addControllersProp(MovementPicker));
