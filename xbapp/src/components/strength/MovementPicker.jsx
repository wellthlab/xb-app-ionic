import React, { useState, useEffect } from "react";
import {
  IonSlides,
  IonSlide,
  IonButton,
  IonItem,
  IonTitle,
  IonItemDivider,
} from "@ionic/react";
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
      "Find a sturdy box or chair. Lie back on object, keeping feet flat and shoulder width apart. Place hands either side of your head, palms flat on object, fingers pointing at your toes. Press through the hands, pushing your hips up and arcing your back as far as you can.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
    type: "upper",
  },
  {
    id: "boxpistolsquat",
    name: "Box Pistol Squat",
    description:
      "Find a sturdy box or chair. If using a box, step on and squat your leg, angling your body forward with extended hands for balance. If using a chair, face away and squat with one leg, extending the other leg forward, until your bum touches the chair.",
    images: ["box_pistol_squat_rest.png", "box_pistol_squat_engaged.png"],
    type: "lower",
  },
  {
    id: "boxsquat",
    name: "Box Squat",
    description:
      "Find a sturdy box or chair. Facing away, extend your arms, feet spaced shoulder-width apart, push your bum outwards, and bring your body down and angled forwards until your bum touches the chair. Widen stance to increase difficulty.",
    images: ["box_squat_rest.png", "box_squat_engaged.png"],
    type: "lower",
  },
  {
    id: "bulgariansplitsquat",
    name: "Bulgarian Split Squat",
    description:
      "Find a sturdy box or chair. Rest the leg you aren't using on the object. Kneel downwards on your other leg keeping your body fairly straight until your knees are at a 45 degree angle.",
    images: [
      "bulgarian_split_squat_rest.png",
      "bulgarian_split_squat_engaged.png",
    ],
    type: "lower",
  },
  {
    id: "fullsquat",
    name: "Full Squat",
    description:
      "Extend your arms, feet spaced shoulder-width apart, push your bum outwards, and bring your body down and angled forwards as far as possible. Widen stance to increase difficulty.",
    images: ["full_squat_rest.png", "full_squat_engaged.png"],
    type: "lower",
  },
  {
    id: "pushup",
    name: "Flat Push Up",
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands flat below the shoulders, pivoting from your toes. Drive through your arms until fully extended. Reduce difficulty by pivoting from your knees instead.",
    images: ["push_up_rest.png", "push_up_engaged.png"],
    type: "upper",
  },
  {
    id: "cobrapushup",
    name: "Cobra Push Up",
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands flat below the shoulders. Keeping your body below your hips flat on the floor, drive your entire upper body upwards, engaging your core and fully extending your arms.",
    images: ["push_up_rest.png", "cobra_push_up_engaged.png"],
    type: "upper",
  },
  {
    id: "elevatedpushup",
    name: "Elevated Push Up",
    description:
      "Find a sturdy box or chair. Carefully lean forwards, elbows back fairly tight against the body, hands flat on the object below the shoulders, pivoting from your toes. Drive through your arms until fully extended. Reduce difficulty by pivoting from your knees instead.",
    images: ["elevated_push_up_rest.png", "elevated_push_up_engaged.png"],
    type: "upper",
  },
  {
    id: "gluteraise",
    name: "Glute Raise",
    description:
      "Lay on your back, arms flat either side, knees bent pointing upwards. Drive your hips upwards until your back is nearly straight, pivoting from your shoulder blades. Rest a weight on your body to increase difficulty.",
    images: ["glute_raise_rest.png", "glute_raise_engaged.png"],
    type: "lower",
  },
  {
    id: "horizontalpull",
    name: "Horizontal Pull",
    description:
      "Find a sturdy table or chair. Lay beneath it, shoulders slightly forward of the lip of the object, firmly gripping the lip with both hands. Pull your body upwards with your arms to meet the object, pivoting from your ankles. Bend knees and pivot from your bum to reduce difficulty.",
    images: ["horizontal_pull_rest.png", "horizontal_pull_engaged.png"],
    type: "upper",
  },
  {
    id: "pronatedaustralianpull",
    name: "Pronated Australian Pull",
    description:
      "Rest a stiff stick between two sturdy objects (or use a table). Lay beneath it, shoulders slightly forward of the stick, firmly gripping the stick with both hands facing forwards. Pull your body upwards with your arms to meet the object, pivoting from your ankles.",
    images: [
      "pronated_australian_pull_rest.png",
      "pronated_australian_pull_engaged.png",
    ],
    type: "upper",
  },
  {
    id: "shortbridge",
    name: "Short Bridge",
    description:
      "Lay on your back, knees bent upwards, arms laying either side of your body or resting on your belly. Drive your hips upwards, forming a bridge shape with your back, pivoting from your upper back. Hold a weight to increase difficulty.",
    images: ["short_bridge_rest.png", "short_bridge_engaged.png"],
    type: "lower",
  },
  {
    id: "singlelegromaniandeadlift",
    name: "Single Leg Romanian Deadlift",
    description:
      "Stand upright, facing forwards. Bring one leg backwards as you pivot your body forwards until almost facing straight down, slightly bending your other leg. Hold a weight to increase difficulty.",
    images: [
      "single_leg_romanian_deadlift_rest.png",
      "single_leg_romanian_deadlift_engaged.png",
    ],
    type: "lower",
  },
  {
    id: "suppinatedaustralianpull",
    name: "Suppinated Australian Pull",
    description:
      "Rest a stiff stick between two sturdy objects (or use a table). Lay beneath it, shoulders slightly forward of the stick, firmly gripping the stick with your palms facing towards you (if using a table, lay with your body below the table and grip the edge). Pull your body upwards with your arms to meet the object, pivoting from your ankles.",
    images: [
      "suppinated_australian_pull_rest.png",
      "suppinated_australian_pull_engaged.png",
    ],
    type: "upper",
  },
  {
    id: "tricepdip",
    name: "Tricep Dip",
    description:
      "Bring together two raised objects such as chairs. Sit on the edge of on object, and rest your ankles on the other. Bring your arms behind your body either side of you, firmly grip the object, and edge off the chair until supporting your body weight through your arms. Lower your body until your elbows are close to a 45 degree angle, then push through your arms until fully extended.",
    images: ["tricep_dip_rest.png", "tricep_dip_engaged.png"],
    type: "upper",
  },
  {
    id: "verticalpull",
    name: "Vertical Pull",
    description:
      "Stand facing a door frame or other solid vertical object. Grip the object with both hands level with your upper chest. Lean your body backwards until your arms fully extend, then pull your body back to an upright position. Bring both feet further forward to angle your body and increase difficulty.",
    images: ["vertical_pull_rest.png", "vertical_pull_engaged.png"],
    type: "upper",
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

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  var movementsUpper = [];
  var movementsLower = [];
  for (var m of moves) {
    (function (m) {
      // Trap m in a closure
      var selected = picked.includes(m.id);
      var movementCard = (
        <IonSlide className="movementSlides">
          <div
            style={{
              width: "400px",
              height: "300px",
              marginTop: "20px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "1px",
            }}
          >
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
          </div>
        </IonSlide>
      );
      if (m.type == "upper") {
        movementsUpper.push(movementCard);
      } else {
        movementsLower.push(movementCard);
      }
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
      <div id="movementChoices">
        <h3>Choose Today's Routine</h3>
        <p>
          Please select one <span>upper body</span> movement and one <span>lower body</span> movement.
        </p>
        <h4>Upper Body Movements</h4>
        <IonSlides pager={true} options={slideOpts} className="slidesCharts">
          {movementsUpper}
        </IonSlides>
        <IonItemDivider></IonItemDivider>
        <h4>Lower Body Movements</h4>
        <IonSlides pager={true} options={slideOpts} className="slidesCharts">
          {movementsLower}
        </IonSlides>
      </div>
    </>
  );
};

export default MovementPicker;

var getMove = function (id) {
  for (var i in moves) {
    var m = moves[i];

    if (m.id == id) {
      return m;
    }
  }

  return false;
};

export { moves, getMove };
