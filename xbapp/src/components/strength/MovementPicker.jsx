import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonItem,
  IonTitle
} from "@ionic/react";
import { connect } from "react-redux";

import MovementInfoCard from "./MovementInfoCard";

/**
 * The list of moves.
 * TODO: Make this not hard-coded!
 */
const moves = [
  {
    id: "angledbridge",
    name: "Angled Bridge",
    description:
      "Lorem ipsum dolor sit amet. Consecteteur in illis, ad vernacula istrum.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
  },
  {
    id: "angledbridge1",
    name: "Angled Bridge 1",
    description:
      "Lorem ipsum dolor sit amet. Consecteteur in illis, ad vernacula istrum.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
  },
  {
    id: "angledbridge2",
    name: "Angled Bridge 2",
    description:
      "Lorem ipsum dolor sit amet. Consecteteur in illis, ad vernacula istrum.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
  },
  {
    id: "angledbridge3",
    name: "Angled Bridge 3",
    description:
      "Lorem ipsum dolor sit amet. Consecteteur in illis, ad vernacula istrum.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
  },
];

/**
 * Pick movements from a list
 * Props:
    onSubmit: a callback that's fired when a list of movements has been chosen
    number: The number of movements to choose
 */
const MovementPicker = (props) => {
  const [rate, setRate] = useState(null);

  // Number of movements to pick
  var number = props.number;

  const [picked, setPicked] = useState([]);

  function save() {
    if (props.onSubmit) {
      props.onSubmit(picked);
    }
  }

  function togglePicked(id) {

  }

  var movements = [];
  for (var m of moves) {
    (function (m) { // Trap m in a closure
      var selected = picked.contains(m.id);
      movements.push(
        <MovementInfoCard name={m.name} text={m.text} images={m.images}>
          <IonButton className={ !selected ? "" : "selected"}
            onClick={() => { // Onclick, toggle whether this move is in the list
              if(selected) {
                var newpicked = [];
                for(var p of picked) {
                  if(p != m.id) {
                    newpicked.push(m.id);
                  }
                }
                setPicked(newpicked);
              } else {
                setPicked(picked.concat([m.id]));
              }
            }}
          >
            { !selected ? "Add to Selection" : "Remove from Selection" }
          </IonButton>;
        </MovementInfoCard>
      );
    })(m);
  }

  var rem = number - picked.length;

  var msg;

  if (rem == 0) {
    msg = (
      <>
        <IonButton onClick={save}>Save Choices</IonButton>
      </>
    );
  } else if (rem < number) {
    msg = <>Choose {rem} more movements</>;
  } else {
    msg = <>Choose {number} movements</>;
  }

  return (
    <>
      <div slot="fixed">
        <p>{msg}</p>
      </div>
      <div className="MovementPicker">{movements}</div>
    </>
  );
};

export default MovementPicker;
