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
import { createNoSubstitutionTemplateLiteral } from "typescript";

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
    difficulty:
      "Don't rest on the box, just use it as your stopping point. Try a full squat if this is too easy. Lower the box to make this harder.",
    technique: "bilateral",
  },
  {
    id: "fullsquat",
    name: "Squat 2: Full Squat",
    type: "push",
    description:
      "Extend your arms, feet spaced shoulder-width apart, push your bum outwards, and bring your body down and angled forwards as far as possible. Widen stance to increase difficulty.",
    images: ["full_squat_rest.png", "full_squat_engaged.png"],
    difficulty:
      "Get your bum as low as possible; if that's difficult, hang on to a door handle and lower yourself to feel the back of your legs hit the back of your calves.",
    technique: "bilateral",
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
    difficulty:
      "Try a full squat if this is too hard; or a box pistol squat if this is too easy",
    technique: "isolateral",
  },
  {
    id: "boxpistolsquat",
    name: "Squat 4: Box Pistol Squat",
    type: "push",
    description:
      "Find a sturdy box or chair. If using a box, step on and squat your leg, angling your body forward with extended hands for balance. If using a chair, face away and squat with one leg, extending the other leg forward, until your bum touches the chair.",
    images: ["box_pistol_squat_rest.png", "box_pistol_squat_engaged.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "stepup",
    name: "Squat 5: Step Up",
    type: "push",
    description:
      "The FOCUS in the movement is to LIFT your body with the bent leg, by using the bent leg and straightening it – just like we do climbing up stairs. You can lean forward over the bent leg to help lift the back leg up. PRACTICE USING AS LITTLE of the straight leg foot as possible. From standing on the box, reverse the movement, to lower the straight leg back down to the ground. Again, use the bent leg side to do the work.",
    images: ["step_up_rest.png", "step_up_engaged.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "supportedsquat",
    name: "Squat 6: Supported Squat",
    type: "push",
    description:
      "HANG ONTO something – a banister, door jam, door handles, your partner graciously hanging onto your mitts – whatever and AS LONG AS THERE’S NO PAIN – get down there, and get on up out of there.",
    images: ["supported_squat_rest.png", "supported_squat_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "shoulderstandsquat",
    name: "Squat 7: Shoulder Stand Squat",
    type: "push",
    description:
      "Another variant just to work the movement without as much load can be done from a shoulder stand – if you feel comfy with that. Get into your shoulder stand – have your hands on your back for support – that’s fine, and bring your legs down into a tuck, and then back up straight again.",
    images: [
      "shoulder_stand_squat_rest.png",
      "shoulder_stand_squat_engaged.png",
    ],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "kj",
    name: "Squat 8: KJs",
    type: "push",
    description:
      "Step one foot forward. Squat on your back leg, pivoting on the heel of your leading foot.",
    images: [
      "alternative_pistol_squat_rest.png",
      "alternative_pistol_squat_engaged.png",
    ],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "gluteraise",
    name: "Hinge 1: Glute Raise",
    type: "push",
    description:
      "Lay on your back, arms flat either side, knees bent pointing upwards. Drive your hips upwards until your back is nearly straight, pivoting from your shoulder blades. Rest a weight on your body to increase difficulty.",
    images: ["glute_raise_rest.png", "glute_raise_engaged.png"],
    difficulty: "Try a short bridge if this is too easy.",
    technique: "bilateral",
  },
  {
    id: "shortbridge",
    name: "Hinge 2: Short Bridge",
    type: "push",
    description:
      "Lay on your back, knees bent upwards, arms laying either side of your body or resting on your belly. Drive your hips upwards, forming a bridge shape with your back, pivoting from your upper back. Hold a weight to increase difficulty.",
    images: ["short_bridge_rest.png", "short_bridge_engaged.png"],
    difficulty: "Try a single leg romanian deadlift if this is too easy.",
    technique: "bilateral",
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
    difficulty:
      "Place your hands on the back of a chair if balance is a challenge, or go hands-free to make this harder.",
    technique: "isolateral",
  },
  {
    id: "angledbridge",
    name: "Hinge 4: Angled Bridge",
    type: "push",
    description:
      "Find a sturdy box or chair. Lie back on object, keeping feet flat and shoulder width apart. Place hands either side of your head, palms flat on object, fingers pointing at your toes. Press through the hands, pushing your hips up and arcing your back as far as you can.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
    difficulty: "Try one of the easier squats if this is too hard.",
    technique: "bilateral",
  },
  {
    id: "swimmer",
    name: "Hinge 5: The Swimmer",
    type: "hinge",
    description:
      "Start laying face down on the floor, legs and arms fully extended so you look like a green bean. For the movement, simultaneously bring both legs up, as well as your upper body (pivot from the diaphragm), and bring both arms backwards and inwards pressing your shoulder blades together.",
    images: ["the_swimmer_rest.png", "the_swimmer_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "wallrdlprep",
    name: "Hinge 6: Wall RDL Prep",
    type: "hinge",
    description:
      "This drill is basically stand away from a wall, and reach back to touch it with your butt, then stand up straight – where you use your legs as much as possible to manage the load. That is avoid falling towards the wall, or pushing with your butt to throw yourself forward from the wall. Keep your knees at your ankles – this helps work the right muscles.",
    images: ["wall_rdl_prep_rest.png", "wall_rdl_prep_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "hollowbody",
    name: "Hinge 7: Hollow Body Position",
    type: "hinge",
    description:
      "With knees up back in contact ALWAYS with the floor, arms reach straight up for the sky. Pulse up – it’s a very small movement, but doing it you’ll feel it. From strength developing working this movement, you can begin to bring your arms overhead, reaching behind you. After that feels strong, extend your legs ALWAYS KEEP YOUR BACK in contact with the ground.",
    images: ["hollow_body_rest.png", "hollow_body_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "singlelegpike",
    name: "Hinge 8: Single Leg Pike",
    type: "hinge",
    description:
      "Sit on the floor in an upright position, legs fully extended, stabilising your body with both hands on the floor either side. Keeping your leg as straight as possible, raise one upwards as far as you can, pause and squeeze your thigh at the top, then bring down again to rest. Endeavor NOT to let the leg drop, but to control that lowering.",
    images: ["single_leg_pike_rest.png", "single_leg_pike_engaged.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "cobrapushup",
    name: "Push 1: Cobra Push Up",
    type: "push",
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands flat below the shoulders. Keeping your body below your hips flat on the floor, drive your entire upper body upwards, engaging your core and fully extending your arms.",
    images: ["push_up_rest.png", "cobra_push_up_engaged.png"],
    difficulty: "Try a flat push up if this is too easy",
    technique: "bilateral",
  },
  {
    id: "pushup",
    name: "Push 2: Flat Push Up",
    type: "push",
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands flat below the shoulders, pivoting from your toes. Drive through your arms until fully extended. Reduce difficulty by pivoting from your knees instead.",
    images: ["push_up_rest.png", "push_up_engaged.png"],
    difficulty:
      "Try an elevated push up if this is too easy; or a cobra push up if this is too hard",
    technique: "bilateral",
  },
  {
    id: "elevatedpushup",
    name: "Push 3: Elevated Push Up",
    type: "push",
    description:
      "Find a sturdy box or chair. Carefully lean forwards, elbows back fairly tight against the body, hands flat on the object below the shoulders, pivoting from your toes. Drive through your arms until fully extended. Reduce difficulty by pivoting from your knees instead.",
    images: ["elevated_push_up_rest.png", "elevated_push_up_engaged.png"],
    difficulty:
      "Move your feet apart to make this easier, or try a flat push up if this is too hard.",
    technique: "bilateral",
  },
  {
    id: "hindupushup",
    name: "Push 4: Hindu Push Up",
    type: "push",
    description:
      "You’ll notice in the Hindu Push up that it MOVES – there’s a nice flow from a kind of what in Yoga is a downward dog position (an inverted V) into the cobra. See how that feels doing 10 in a row of these as an option for one of the blocks. If this combo move is too effortful to get a comfy 10, then let’s look at the flat push up progressions.",
    images: ["hindu_push_up_rest.png", "hindu_push_up_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "diamondpushup",
    name: "Push 5: Diamond Push Up",
    type: "push",
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands pushed together flat below the breastplate, pivoting from your toes. Drive through your arms until fully extended. Reduce difficulty by pivoting from your knees instead.",
    images: ["diamond_push_up_rest.png", "diamond_push_up_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "verticalpull",
    name: "Pull 1: Vertical Pull",
    type: "pull",
    description:
      "Stand facing a door frame or other solid vertical object. Grip the object with both hands level with your upper chest. Lean your body backwards until your arms fully extend, then pull your body back to an upright position. Bring both feet further forward to angle your body and increase difficulty.",
    images: ["vertical_pull_rest.png", "vertical_pull_engaged.png"],
    difficulty:
      "Step towards the door frame to make this harder, or away to make it easier",
    technique: "bilateral",
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
    difficulty:
      "Try a Suppinated Austrialian Pull or Horizontal Pull if this is too easy!",
    technique: "bilateral",
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
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "horizontalpull",
    name: "Pull 4: Horizontal Pull",
    type: "pull",
    description:
      "Find a sturdy table or chair. Lay beneath it, shoulders slightly forward of the lip of the object, firmly gripping the lip with both hands. Pull your body upwards with your arms to meet the object, pivoting from your ankles. Bend knees and pivot from your bum to reduce difficulty.",
    images: ["horizontal_pull_rest.png", "horizontal_pull_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "tethereddoorpull",
    name: "Pull 5: Tethered Door Pull",
    type: "pull",
    description:
      "Facing towards the door and standing upright or bending your legs, firmly grip your tether at about chest height and gently lean backwards into your resting position (where your arms are fully extended). Pull yourself towards the door with both arms, pivoting from your feet, until vertical again.",
    images: ["tethered_door_pull_rest.png", "tethered_door_pull_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "doorhangpull",
    name: "Pull 6: Door Hang Pull",
    type: "pull",
    description:
      "Grab the top of a door, hand shoulder width apart, and pull yourself up, and lower yourself back down. If you wish, put a towel at the top of the door for comfort.",
    images: ["door_hang_pull_rest.png", "door_hang_pull_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "onearmdoorpull",
    name: "Pull 7: One Arm Door Pull",
    type: "pull",
    description:
      "A way to start exploring single arm pulls is to go back to the doorway and see how that feels with one arm. If that feels good you can explore what are called “archer rows” with the sheets or pillow cases in the doors. In the archer you move one arm out to the side and pull mainly with the other arm you keep in the normal pull position.",
    images: ["one_arm_door_pull_rest.png", "one_arm_door_pull_engaged.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "onearmdoorpull",
    name: "Pull 8: Assisted Pull",
    type: "pull",
    description:
      "A way to practice full pull ups with managed load. Rest your feet or knees on an object beneath your beam/door frame to take some of your body weight whilst pulling up with your arms.",
    images: ["assisted_pull_up_rest.png", "assisted_pull_up_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "doorhanghold",
    name: "Hold 1: Door Hang",
    type: "pull",
    description:
      "Firmly grasp the top of a door with both hands. Engage your biceps to lift your entire body off the ground until your throat is level with the top and your toes can just touch the ground. Hold for 15 seconds.",
    images: ["door_hang_hold.png", "door_hang_hold.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "horsestance",
    name: "Hold 2: Horse Stance",
    type: "push",
    description:
      "Stand legs wide apart feet pointing outwards. Bend your knees at right angles and stick your butt out, leaning your upper body forwards. Hold for 15 seconds.",
    images: ["horse_stance_hold.png", "horse_stance_hold.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "middlesplit",
    name: "Hold 3: Middle Split",
    type: "push",
    description:
      "Stand legs wide apart feet pointing outwards in a split stance. Keep your legs straight, and increase the angle as far as comfortable. Slowly bring legs together, using wall for support.",
    images: ["middle_split_rest.png", "middle_split_engaged.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "pikehold",
    name: "Hold 4: Pike Hold",
    type: "pull",
    description:
      "Stand legs close together. Fold your upper body over with your arms stretched out until hands touch the floor, with your butt sticking up. Hold for 15 seconds.",
    images: ["pike_hold_engaged.png", "pike_hold_engaged.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "planchelean",
    name: "Hold 5: Planche Lean",
    type: "push",
    description:
      "Lay flat on the floor. Push yourself off the ground (like a push up) and gradually lean your body forward so your arms are angled and your back is arched with your feet brushing the ground. Hold for 15 seconds.",
    images: ["planche_lean_engaged.png", "planche_lean_engaged.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "tablebridge",
    name: "Hold 6: Isometric Table Bridge",
    type: "push",
    description:
      "Sit on the ground. Place your arms behind you hands facing forward. Bring your butt off the ground so your legs are right angles and your arms straight. Hold for 15 seconds.",
    images: ["isometric_table_bridge.png", "isometric_table_bridge.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "sideplank",
    name: "Hold 7: Side Plank",
    type: "push",
    description:
      "Lay on your side leaning on your arm. Raise your entire body with your arm, keeping it straight and pivoting from your heel. Hold for 15 seconds. Repeat the other side.",
    images: ["side_plank_engaged.png", "side_plank_rest.png"],
    difficulty: "",
    technique: "isolateral",
  },
  {
    id: "chairdiphold",
    name: "Hold 8: Chair Dip Hold",
    type: "push",
    description:
      "Position yourself between two objects. Place a hand flat on each one about level with your body. Push yourself upwards until your arm is fully extended and your toes brush the ground. Hold for 15 seconds.",
    images: ["chair_dip_hold.png", "chair_dip_hold.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "superman",
    name: "Hold 9: Superman",
    type: "pull",
    description:
      "Lay flat on the ground. Raise both arms up and straight forward. Raise both legs pivoting as far above the knees as possible. Hold for 15 seconds.",
    images: ["superman_hold.png", "superman_hold.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "lsit",
    name: "Hold 10: L Sit",
    type: "pull",
    description:
      "Sit on the floor both hands flat on the ground either side. Raise your body on both hands, and hold both legs out straight and raised. Hold for 15 seconds.",
    images: ["l_sit.png", "l_sit.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "shallowpushup",
    name: "Hold 11: Shallow Push Up",
    type: "push",
    description:
      "Lay face down on the floor, hands below the shoulders. Push your body up about 6 inches off the ground, pivoting from your toes. Hold for 15 seconds.",
    images: ["shallow_push_up_hold.png", "shallow_push_up_hold.png"],
    difficulty: "",
    technique: "bilateral",
  },
  {
    id: "vsit",
    name: "Hold 12: V Sit",
    type: "pull",
    description:
      "Sit on the floor. Bring your body back and simultaneously raise your straight legs (use hands for support) until at a 45 degree angle. Hold for 15 seconds.",
    images: ["v_sit_hold.png", "v_sit_hold.png"],
    difficulty: "",
    technique: "bilateral",
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
  const [corrRefSelected, setCorrRefSelected] = useState([]);

  // Number of movements to pick
  var number = props.number;

  var type = props.type ? props.type : false;

  var showPush = false,
    showPull = false;

  if (type === false) {
    showPush = true;
    showPull = true;
  } else if (type == "pull") {
    showPush = false;
    showPull = true;
  } else if (type == "push") {
    showPush = true;
    showPull = false;
  }

  var txtAdd = number > 1 ? "Add to Selection" : "Select";
  var txtRem = "Remove from Selection";

  const [picked, setPicked] = useState([]);

  function change(list) {
    if (props.onChange) {
      // console.log("New selection", list);
      props.onChange(list);
    }
  }

  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  var movesPull = [];
  var movesPush = [];

  var toUpdate = [];
  for (var m of moves) {
    if (m.technique != "isolateral") {
      toUpdate.push({ id: m.id, selection: "false" });
    } else {
      toUpdate.push({ id: m.id + "1", selection: "false" });
      toUpdate.push({ id: m.id + "2", selection: "false" });
    }
  }
  for (var m of moves) {
    (function (m) {
      // Trap m in a closure

      //check the week for moves to exclude
      if (props.week) {
        // console.log("checking move");
        if (props.week == 3) {
          if (
            m.technique == "isolateral" ||
            m.name == "Hinge 5: The Swimmer" ||
            m.name == "Hinge 7: Hollow Body Position"
          ) {
            // console.log("move excluded");
            return;
          }
        } else if (props.week == 4 || props.week == 5) {
          if (
            (props.blocknum == 1 || props.blocknum == 2) &&
            m.technique == "bilateral"
          ) {
            //excluding bilateral from block 1 and 2
            return;
          } else if (props.blocknum == 3 && m.technique == "isolateral") {
            //excluding isolateral from block 3
            return;
          }
        }
      }

      //if we are in week 4/5, it means we can give folks the chance of doing the SAME isolateral move in a block
      if (m.technique == "isolateral" && (props.week == 4 || props.week == 5)) {
        /*so instead of adding the same isolateral move to both sliders,
         * we are going to create 2 of the same kind, change their keys, and add them to the sliders
         * it seems the key that we create here at the top remains as the LAST value
         * so when re-checking whether a move is "selected", we will be using the BUTTON classNAme rather than the computed key
         * these KEYS will have a 1 and a 2 at the end (for each isolateral move)
         */
        for (var i = 1; i < 3; i++) {
          //computed key
          var keyForId = m.id + i.toString();

          //selected value to update the buton text
          var selected = picked.includes(keyForId);
          var card = (
            <IonSlide className="movementSlides">
              <div
                style={{
                  overflow: "auto",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: "40px",
                }}
              >
                <MovementInfoCard
                  titleSize={"normal"}
                  key={keyForId}
                  className={!selected ? "" : "selected"}
                  name={m.name}
                  text={m.text}
                  images={m.images}
                >
                  <IonButton
                    key={keyForId}
                    className={keyForId}
                    onClick={(event) => {
                      //since keyForId cannot be retrieved, we can retrieve the classNAme
                      var referenceKey = event.target.className.split(" ")[0];
                      selected = picked.includes(referenceKey);
                      //Onclick, toggle whether this move is in the list
                      if (selected) {
                        //console.log("Remove", referenceKey);
                        var newpicked = [];
                        for (var p of picked) {
                          if (p != referenceKey) {
                            newpicked.push(p);
                          }
                        }
                        setPicked(newpicked);
                        //before updating the list back through props, we remove teh 1s and 2s at the end of the move name
                        var toUpdate = [];
                        for (var i = 0; i < newpicked.length; i++) {
                          var mov2 = newpicked[i];
                          var lastString = mov2.charAt(mov2.length - 1);
                          if (/\d/.test(lastString)) {
                            //if the last char is a digit
                            mov2 = mov2.slice(0, -1);
                          }
                          toUpdate.push(mov2);
                        }
                        change(toUpdate);
                      } else {
                        //adding the move to the list
                        var newpicked = picked.concat([referenceKey]);
                        setPicked(newpicked);
                        var toUpdate = [];
                        for (var i = 0; i < newpicked.length; i++) {
                          var mov2 = newpicked[i];
                          var lastString = mov2.charAt(mov2.length - 1);
                          if (/\d/.test(lastString)) {
                            //if the last char is a digit
                            mov2 = mov2.slice(0, -1);
                          }
                          toUpdate.push(mov2);
                        }
                        change(toUpdate);
                      }
                    }}
                  >
                    {!selected ? txtAdd : txtRem}
                  </IonButton>
                </MovementInfoCard>
              </div>
            </IonSlide>
          );
          if (i == 1) {
            movesPush.push(card);
          } else {
            movesPull.push(card);
          }
        }
      } else {
        //for all other moves that are non isolateral (in week 4/5) or ALL MOVES (non week 4/5), we just add them where they belong
        var selected = picked.includes(m.id);

        var movementCard = (
          <IonSlide className="movementSlides">
            <div
              style={{
                overflow: "auto",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "40px",
              }}
            >
              <MovementInfoCard
                titleSize={"normal"}
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
                      // console.log("Remove", m);
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
  //checking to see if there are 2 isolateral moves i.e. pull1, pull2 or pull2, push1
  var idToUse = id;
  var lastString = id.charAt(id.length - 1);
  if (/\d/.test(lastString)) {
    //if the last char is a digit
    idToUse = idToUse.slice(0, -1);
  }
  for (var i in moves) {
    var m = moves[i];

    if (m.id == idToUse) {
      return m;
    }
  }

  return false;
};

export { moves, getMove };
