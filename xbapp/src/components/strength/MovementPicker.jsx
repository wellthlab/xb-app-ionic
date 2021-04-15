import React, { useState, useEffect } from "react";
import { IonButton, IonItem, IonTitle } from "@ionic/react";
import { connect } from "react-redux";

import MovementInfoCard from "./MovementInfoCard";

import "./MovementPicker.css";

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

  function change(list) {
    if (props.onChange) {
      console.log("New selection", list);
      props.onChange(list);
    }
  }

  var movements = [];
  for (var m of moves) {
    (function (m) {
      // Trap m in a closure
      var selected = picked.includes(m.id);
      movements.push(
        <MovementInfoCard
          key={m.id}
          className={!selected ? "" : "selected"}
          name={m.name}
          text={m.text}
          images={m.images}
        >
          <IonButton
            onClick={() => {
              // Onclick, toggle whether this move is in the list
              if (selected) {
                console.log("Remove", m);
                var newpicked = [];
                for (var p of picked) {
                  if (p != m.id) {
                    newpicked.push(p);
                  }
                }
                setPicked(newpicked);
                change(newpicked);
              } else {
                var newpicked = picked.concat([m.id]);
                setPicked(newpicked);
                change(newpicked);
              }
            }}
          >
            {!selected ? "Add to Selection" : "Remove from Selection"}
          </IonButton>
        </MovementInfoCard>
      );
    })(m);
  }

  var rem = number - picked.length;

  var msg;

  if (rem == 0) {
    msg = false;
  } else if (rem == 1) {
    msg = <>Choose {rem} more movement</>;
  } else if (rem < number) {
    msg = <>Choose {rem} more movements</>;
  } else {
    msg = <>Choose {number} movements</>;
  }

  var mbox = "";
  if (msg !== false) {
    mbox = (
      <div className="instruction" slot="fixed">
        <p>{msg}</p>
      </div>
    );
  }

  return (
    <>
      {mbox}
      <div className="MovementPicker">{movements}</div>
    </>
  );
};

export default MovementPicker;

var getMove = function(id) {
  for(var i in moves) {
    var m = moves[i];

    if(m.id == id) {
      return m;
    }
  }

  return false;
}

export { moves, getMove };
