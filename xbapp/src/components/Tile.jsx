import React, { Component, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { IonSlides, IonSlide, IonContent } from "@ionic/react";
import "./Tile.scss";

function Tile(props) {
  const letter = props.letter;
  // Default to green
  const colour = props.colour || "green";
  return (
    <div
      id="tile"
      className="centering"
      style={{
        width: "250px",
        height: "250px",
        margin: "10px",
        backgroundColor: colour,
      }}
    >
      {letter}
    </div>
  );
}

export default Tile;
