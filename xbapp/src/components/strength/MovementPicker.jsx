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
    id: "boxsquat",
    name: "Squat 1: Box Squat",
    type: "push",
    description:
      "Find a sturdy box or chair. Facing away, extend your arms, feet spaced shoulder-width apart, push your bum outwards, and bring your body down and angled forwards until your bum touches the chair. Widen stance to increase difficulty.",
    images: ["box_squat_rest.png", "box_squat_engaged.png"],
    type: "push",
    difficulty: "Don't rest on the box, just use it as your stopping point. Try a full squat if this is too easy. Lower the box to make this harder."
  },
  {
    id: "fullsquat",
    name: "Squat 2: Full Squat",
    type: "push",
    description:
      "Extend your arms, feet spaced shoulder-width apart, push your bum outwards, and bring your body down and angled forwards as far as possible. Widen stance to increase difficulty.",
    images: ["full_squat_rest.png", "full_squat_engaged.png"],
    type: "push",
    difficulty: "Get your bum as low as possible; if that's difficult, hang on to a door handle and lower yourself to feel the back of your legs hit the back of your calves."
  },
  {
    id: "bulgariansplitsquat",
    name: "Squat 3: Bulgarian Split Squat",
    type: "push",
    description:
      "Find a sturdy box or chair. Rest the leg you aren't using on the object. Kneel downwards on your other leg keeping your body fairly straight until your knees are at a 45 degree angle.",
    images: [
      "bulgarian_split_squat_rest.png",
      "bulgarian_split_squat_engaged.png",
    ],
    type: "push",
    difficulty: "Try a full squat if this is too hard; or a box pistol squat if this is too easy"
  },
  {
    id: "boxpistolsquat",
    name: "Squat 4: Box Pistol Squat",
    type: "push",
    description:
      "Find a sturdy box or chair. If using a box, step on and squat your leg, angling your body forward with extended hands for balance. If using a chair, face away and squat with one leg, extending the other leg forward, until your bum touches the chair.",
    images: ["box_pistol_squat_rest.png", "box_pistol_squat_engaged.png"],
    type: "push",
    difficulty: ""
  },
  {
    id: "stepup",
    name: "Squat 5: Step Up",
    type: "push",
    description:
      "The FOCUS in the movement is to LIFT your body with the bent leg, by using the bent leg and straightening it – just like we do climbing up stairs. You can lean forward over the bent leg to help lift the back leg up. PRACTICE USING AS LITTLE of the straight leg foot as possible. From standing on the box, reverse the movement, to lower the straight leg back down to the ground. Again, use the bent leg side to do the work.",
    images: ["step_up_rest.png", "step_up_engaged.png"],
    type: "push",
    difficulty: ""
  },
  {
    id: "supportedsquat",
    name: "Squat 6: Supported Squat",
    type: "push",
    description:
      "HANG ONTO something – a banister, door jam, door handles, your partner graciously hanging onto your mitts – whatever and AS LONG AS THERE’S NO PAIN – get down there, and get on up out of there.",
    images: ["supported_squat_rest.png", "supported_squat_engaged.png"],
    type: "push",
    difficulty: ""
  },
  {
    id: "gluteraise",
    name: "Hinge 1: Glute Raise",
    type: "push",
    description:
      "Lay on your back, arms flat either side, knees bent pointing upwards. Drive your hips upwards until your back is nearly straight, pivoting from your shoulder blades. Rest a weight on your body to increase difficulty.",
    images: ["glute_raise_rest.png", "glute_raise_engaged.png"],
    type: "push",
    difficulty: "Try a short bridge if this is too easy."
  },
  {
    id: "shortbridge",
    name: "Hinge 2: Short Bridge",
    type: "push",
    description:
      "Lay on your back, knees bent upwards, arms laying either side of your body or resting on your belly. Drive your hips upwards, forming a bridge shape with your back, pivoting from your upper back. Hold a weight to increase difficulty.",
    images: ["short_bridge_rest.png", "short_bridge_engaged.png"],
    type: "push",
    difficulty: "Try a single leg romanian deadlift if this is too easy."
  },
  {
    id: "singlelegromaniandeadlift",
    name: "Hinge 3: Single Leg Romanian Deadlift",
    type: "pull",
    description:
      "Stand upright, facing forwards. Bring one leg backwards as you pivot your body forwards until almost facing straight down, slightly bending your other leg. Hold a weight to increase difficulty.",
    images: [
      "single_leg_romanian_deadlift_rest.png",
      "single_leg_romanian_deadlift_engaged.png",
    ],
    type: "push",
    difficulty: "Place your hands on the back of a chair if balance is a challenge, or go hands-free to make this harder."
  },
  {
    id: "angledbridge",
    name: "Hinge 4: Angled Bridge",
    type: "push",
    description:
      "Find a sturdy box or chair. Lie back on object, keeping feet flat and shoulder width apart. Place hands either side of your head, palms flat on object, fingers pointing at your toes. Press through the hands, pushing your hips up and arcing your back as far as you can.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
    type: "push",
    difficulty: "Try one of the easier squats if this is too hard."
  },
  {
    id: "swimmer",
    name: "Hinge 5: The Swimmer",
    type: "hinge",
    description:
      "Start laying face down on the floor, legs and arms fully extended so you look like a green bean. For the movement, simultaneously bring both legs up, as well as your upper body (pivot from the diaphragm), and bring both arms backwards and inwards pressing your shoulder blades together.",
    images: ["the_swimmer_rest.png", "the_swimmer_engaged.png"],
    type: "pull",
    difficulty: ""
  },
  {
    id: "wallrdlprep",
    name: "Hinge 6: Wall RDL Prep",
    type: "hinge",
    description:
      "This drill is basically stand away from a wall, and reach back to touch it with your butt, then stand up straight – where you use your legs as much as possible to manage the load. That is avoid falling towards the wall, or pushing with your butt to throw yourself forward from the wall. Keep your knees at your ankles – this helps work the right muscles.",
    images: ["wall_rdl_prep_rest.png", "wall_rdl_prep_engaged.png"],
    type: "pull",
    difficulty: ""
  },
  {
    id: "cobrapushup",
    name: "Push 1: Cobra Push Up",
    type: "push",
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands flat below the shoulders. Keeping your body below your hips flat on the floor, drive your entire upper body upwards, engaging your core and fully extending your arms.",
    images: ["push_up_rest.png", "cobra_push_up_engaged.png"],
    type: "pull",
    difficulty: "Try a flat push up if this is too easy"
  },
  {
    id: "pushup",
    name: "Push 2: Flat Push Up",
    type: "push",
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands flat below the shoulders, pivoting from your toes. Drive through your arms until fully extended. Reduce difficulty by pivoting from your knees instead.",
    images: ["push_up_rest.png", "push_up_engaged.png"],
    type: "pull",
    difficulty: "Try an elevated push up if this is too easy; or a cobra push up if this is too hard"
  },
  {
    id: "elevatedpushup",
    name: "Push 3: Elevated Push Up",
    type: "push",
    description:
      "Find a sturdy box or chair. Carefully lean forwards, elbows back fairly tight against the body, hands flat on the object below the shoulders, pivoting from your toes. Drive through your arms until fully extended. Reduce difficulty by pivoting from your knees instead.",
    images: ["elevated_push_up_rest.png", "elevated_push_up_engaged.png"],
    type: "pull",
    difficulty: "Move your feet apart to make this easier, or try a flat push up if this is too hard."
  },
  {
    id: "verticalpull",
    name: "Pull 1: Vertical Pull",
    type: "pull",
    description:
      "Stand facing a door frame or other solid vertical object. Grip the object with both hands level with your upper chest. Lean your body backwards until your arms fully extend, then pull your body back to an upright position. Bring both feet further forward to angle your body and increase difficulty.",
    images: ["vertical_pull_rest.png", "vertical_pull_engaged.png"],
    type: "pull",
    difficulty: "Step towards the door frame to make this harder, or away to make it easier"
  },
  {
    id: "pronatedaustralianpull",
    name: "Pull 2: Pronated Australian Pull",
    type: "pull",
    description:
      "Rest a stiff stick between two sturdy objects (or use a table). Lay beneath it, shoulders slightly forward of the stick, firmly gripping the stick with both hands facing forwards. Pull your body upwards with your arms to meet the object, pivoting from your ankles.",
    images: [
      "pronated_australian_pull_rest.png",
      "pronated_australian_pull_engaged.png",
    ],
    type: "pull",
    difficulty: "Try a Suppinated Austrialian Pull or Horizontal Pull if this is too easy!"
  },
  {
    id: "suppinatedaustralianpull",
    name: "Pull 3: Suppinated Australian Pull",
    type: "pull",
    description:
      "Rest a stiff stick between two sturdy objects (or use a table). Lay beneath it, shoulders slightly forward of the stick, firmly gripping the stick with your palms facing towards you (if using a table, lay with your body below the table and grip the edge). Pull your body upwards with your arms to meet the object, pivoting from your ankles.",
    images: [
      "suppinated_australian_pull_rest.png",
      "suppinated_australian_pull_engaged.png",
    ],
    type: "pull",
    difficulty: ""
  },
  {
    id: "horizontalpull",
    name: "Pull 4: Horizontal Pull",
    type: "pull",
    description:
      "Find a sturdy table or chair. Lay beneath it, shoulders slightly forward of the lip of the object, firmly gripping the lip with both hands. Pull your body upwards with your arms to meet the object, pivoting from your ankles. Bend knees and pivot from your bum to reduce difficulty.",
    images: ["horizontal_pull_rest.png", "horizontal_pull_engaged.png"],
    type: "pull",
    difficulty: ""
  },
  {
    id: "tethereddoorpull",
    name: "Pull 5: Tethered Door Pull",
    type: "pull",
    description:
      "Facing towards the door and standing upright or bending your legs, firmly grip your tether at about chest height and gently lean backwards into your resting position (where your arms are fully extended). Pull yourself towards the door with both arms, pivoting from your feet, until vertical again.",
    images: ["tethered_door_pull_rest.png", "tethered_door_pull_engaged.png"],
    type: "pull",
    difficulty: ""
  }
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

  var type = props.type ? props.type : false;

  var showPush = false, showPull = false;

  if(type === false) {
    showPush = true;
    showPull = true;
  } else if(type == 'pull') {
    showPush=false;
    showPull=true;
  } else if(type == 'push') {
    showPush=true;
    showPull=false;
  }

  var txtAdd = number > 1 ? "Add to Selection" : "Select";
  var txtRem = "Remove from Selection";

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

  var movesPull = [];
  var movesPush = [];
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
                {!selected ? txtAdd : txtRem}
              </IonButton>
            </MovementInfoCard>
          </div>
        </IonSlide>
      );
      if (m.type == "push") {
        movesPush.push(movementCard);
      } else {
        movesPull.push(movementCard);
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

  var push = "";
  if (showPush) {
      push = (
        <>
          <IonSlides pager={true} options={slideOpts} className="slidesCharts">
            {movesPush}
          </IonSlides>
        </>
      );
  }

  var pull = "";
  if (showPull) {
      var pull = (
        <>
          <IonSlides pager={true} options={slideOpts} className="slidesCharts">
            {movesPull}
          </IonSlides>
        </>
      );
  }

  return (
    <>
      {mbox}
      <div id="movementChoices">
        {push}
        {showPush && showPull ? <IonItemDivider></IonItemDivider> : ""}
        {pull}
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
