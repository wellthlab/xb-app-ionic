import React, { Component, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { IonSlides, IonSlide, IonContent } from "@ionic/react";
import "./Tile.scss";

function Tile(props) {
  const letter = props.letter;
  return (
    <div id="tile" className="centering">
      {letter}
    </div>
  );
}

export default Tile;
