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

import MovementInfoCard from "../../Strength/MovementInfoCard";

import { createNoSubstitutionTemplateLiteral } from "typescript";

/**
 * The list of moves.
 * TODO: Make this not hard-coded!
 */
const moves = [
  /**
   * Squats
   **/

  {
    id: "boxsquat",
    name: "Box Squat",
    category: "squat",
    type: "push",
    progressionLevel: 1,
    description:
      "Find a sturdy chair. Face away, extend your arms, feet spaced shoulder-width apart, bottom pushed outwards. Bring your body down and angled forwards until your bottom touches the chair. Don't rest on the chair, just use it as your stopping point.",
    images: ["box_squat_rest.png", "box_squat_engaged.png"],
    difficulty:
      "Use a lower chair to make this harder. Try a Supported Squat if this is too easy.",
    warning:
      "Make sure there's nothing behind you that you could fall and injure yourself on.",
    alternative: ["supportedsquat"],
    technique: "bilateral",
  },
  {
    id: "supportedsquat",
    name: "Supported Squat",
    category: "squat",
    type: "push",
    progressionLevel: 1,
    description:
      "Face a high object like a chair or table. Place both hands on the object and lean forward slightly to rest some of your weight on it. Bring your body down by bending your knees until your bottom nearly touches the ground. Drive upwards by pushing your hips inwards and keep going until stood upright.",
    images: ["supported_squat_rest.png", "supported_squat_engaged.png"],
    difficulty:
      "Adjust your load by the amount you lean on your object, working towards squatting unaided. Try a box squat if this is too difficult.",
    warning:
      "Ensure the object is sturdy enough not to move or tilt under your weight. Make sure there's nothing behind you that you could fall and injure yourself on.",
    alternative: ["boxsquat"],
    technique: "bilateral",
  },
  {
    id: "shoulderstandsquat",
    name: "Shoulder Stand Squat",
    category: "squat",
    type: "push",
    progressionLevel: 2,
    description:
      "Lay face up on the ground. Push your entire body upwards from below the neck, supported with both arms, knees tucked as close as possible to your face. Extend your legs out fully with your toes pointing vertically upwards, than return your knees back to rest position.",
    images: [
      "shoulder_stand_squat_rest.png",
      "shoulder_stand_squat_engaged.png",
    ],
    difficulty:
      "Focus on form over speed, keeping your lower body as vertical as possible throughout the movement. Try the Full Squat if this is too easy.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["fullsquat"],
    technique: "bilateral",
  },
  {
    id: "fullsquat",
    name: "Full Squat",
    category: "squat",
    type: "push",
    progressionLevel: 2,
    description:
      "Extend your arms, feet spaced shoulder-width apart, push your bum outwards, and bring your body down and angled forwards as far as possible. Drive your hips forwards until stood upright.",
    images: ["full_squat_rest.png", "full_squat_engaged.png"],
    difficulty:
      "Get your bottom as low as possible; if that's difficult, hang on to a door handle and lower yourself to feel the back of your legs hit the back of your calves. Try a Shoulder Stand Squat if this is too difficult.",
    warning:
      "Make sure there's nothing behind you that you could fall and injure yourself on.",
    alternative: ["shoulderstandsquat"],
    technique: "bilateral",
  },
  {
    id: "stepup",
    name: "Step Up",
    category: "squat",
    type: "push",
    progressionLevel: 2,
    description:
      "Stand in front of a sturdy object/staircase. Place one leg on the object (your bent leg) and lift your body through it - just like climbing stairs. Extend your arms and lean forward slightly for balance.",
    images: ["step_up_rest.png", "step_up_engaged.png"],
    difficulty:
      "Use a higher object to increase difficulty (and don't underestimate the challenge of a higher object - this is just one leg working!). Use your unbent leg as little as possible for the movement.",
    warning:
      "Check your object is sturdy enough not to move or lift under your weight. Make sure there's nothing behind you that you could fall and injure yourself on.",
    alternative: [],
    technique: "isolateral",
  },
  {
    id: "middlesplit",
    name: "Middle Split",
    category: "squat",
    type: "pull",
    progressionLevel: 3,
    description:
      "Stand legs wide apart feet pointing outwards in a split stance. Keep your legs straight, and increase the angle as far as comfortable. Slowly bring legs together until your body is stood upright, using wall for support.",
    images: ["middle_split_rest.png", "middle_split_engaged.png"],
    difficulty:
      "Remove footwear if creating too much friction with the floor during the movement. Progress to Cossack Squats if these are too easy.",
    warning:
      "Make sure there's nothing around you could fall on and injure yourself. Beware your feet being injured if you remove protective footwear.",
    alternative: ["cossacksquat"],
    technique: "bilateral",
  },
  {
    id: "cossacksquat",
    name: "Cossack Squat",
    category: "squat",
    type: "push",
    progressionLevel: 3,
    description:
      "Stand with your legs in a wide split, feet facing forward. Lean your body towards one knee, until your bottom is nearly touching the ground, and your other leg is fully extended. Return to neutral, and repeat for the other leg to complete the rep.",
    images: ["cossack_squat_rest.png", "cossack_squat_engaged.png"],
    difficulty:
      "Widen your stance slightly to increase difficulty. Go slowly and don't rely on momentum to complete the movement. Try the Bulgarian Split Squat if this is too easy.",
    warning:
      "Make sure there's nothing around you that you could fall and injure yourself on.",
    alternative: ["bulgariansplitsquat"],
    technique: "isolateral",
  },
  {
    id: "bulgariansplitsquat",
    name: "Bulgarian Split Squat",
    category: "squat",
    type: "push",
    progressionLevel: 3,
    description:
      "Find a sturdy box or chair. Rest the leg you aren't using on the object. Kneel downwards on your other leg keeping your body fairly straight until your knees are at a 45 degree angle. Push upwards through your leg until fully extended.",
    images: [
      "bulgarian_split_squat_rest.png",
      "bulgarian_split_squat_engaged.png",
    ],
    difficulty:
      "Try a Cossack Squat if this is too hard; or try a KJ Squat if this is too easy",
    warning:
      "Check your object is sturdy enough not to move or lift under your weight. Make sure there's nothing around you that you could fall and injure yourself on.",
    alternative: ["cossacksquat", "kjsquat"],
    technique: "isolateral",
  },
  {
    id: "kjsquat",
    name: "KJ Squat",
    category: "squat",
    type: "push",
    progressionLevel: 3,
    description:
      "Step one foot forward. Squat on your back leg, pivoting on the heel of your leading foot.",
    images: [
      "alternative_pistol_squat_rest.png",
      "alternative_pistol_squat_engaged.png",
    ],
    difficulty: "Try a Bulgarian Split Squat if this is too difficult.",
    warning:
      "Make sure there's nothing around you that you could fall and injure yourself on.",
    alternative: ["bulgariansplitsquat"],
    technique: "isolateral",
  },
  {
    id: "boxpistolsquat",
    name: "Box Pistol Squat",
    category: "squat",
    type: "push",
    progressionLevel: 4,
    description:
      "Find a sturdy box or chair. If using a box, step on and squat your leg, angling your body forward with extended hands for balance. If using a chair, face away and squat with one leg, extending the other leg forward, until your bum touches the chair.",
    images: ["box_pistol_squat_rest.png", "box_pistol_squat_engaged.png"],
    difficulty:
      "Use a higher object to increase difficulty. Try the Pistol Squat if this is too easy.",
    warning:
      "Check your object is sturdy enough not to move or lift under your weight. Make sure there's nothing around you that you could fall and injure yourself on.",
    alternative: ["pistolsquat"],
    technique: "isolateral",
  },
  /*
  {
    id: "pistolsquat",
    name: "Pistol Squat",
    category: "squat",
    type: "push",
    progressionLevel: 4,
    description:
      "Stand with one leg stuck outwards, fully extended and lifed off the ground. Lower your body on your other leg until your bottom touched the ground. Drive through your leg until stood upright. Lean forwards and stretch out your arms for balance.",
    images: [
      // To do
    ],
    difficulty: "Try the Box Pistol Squat if this is too hard.",
    warning:
      "Make sure there's nothing around you that you could fall and injure yourself on.",
    alternative: [
      "boxpistolsquat"
    ],
    technique: "isolateral",
  },
  */

  /**
   * Hinges
   **/

  {
    id: "wallrdlprep",
    name: "Wall RDL Prep",
    category: "hinge",
    type: "push",
    progressionLevel: 1,
    description:
      "Stand away from a wall. Push your bottom back to touch it, then stand up straight again. Use your legs as much as possible to manage the load.",
    images: ["wall_rdl_prep_rest.png", "wall_rdl_prep_engaged.png"],
    difficulty:
      "Watch your form - keep your knees above your ankles at all times to work the correct muscles. Try the Glute Raise if you find lying down more practical.",
    warning:
      "Make sure there's nothing around you that you could fall and injure yourself on.",
    alternative: ["gluteraise"],
    technique: "bilateral",
  },
  {
    id: "gluteraise",
    name: "Glute Raise",
    category: "hinge",
    type: "push",
    progressionLevel: 1,
    description:
      "Lay on your back, arms flat either side, knees bent pointing upwards. Drive your hips upwards until your back is nearly straight, pivoting from your shoulder blades.",
    images: ["glute_raise_rest.png", "glute_raise_engaged.png"],
    difficulty: "Try a Short Bridge if this is too easy.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["shortbridge"],
    technique: "bilateral",
  },
  {
    id: "shortbridge",
    name: "Short Bridge",
    category: "hinge",
    type: "push",
    progressionLevel: 1,
    description:
      "Lay on your back, knees bent upwards, arms laying either side of your body or resting on your belly. Drive your hips upwards, forming a bridge shape with your back, pivoting from as close to your neck as possible.",
    images: ["short_bridge_rest.png", "short_bridge_engaged.png"],
    difficulty:
      "Very similar to a Glute Raise - the difference is you're curving your body to form a bridge shape rather than keeping a straight back. Try a Glute Raise if this is too difficult.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["gluteraise"],
    technique: "bilateral",
  },
  {
    id: "singlelegpikelift",
    name: "Single Leg Pike Lift",
    category: "hinge",
    type: "pull",
    progressionLevel: 2,
    description:
      "Sit on the floor in an upright position, legs fully extended, stabilising your body with both hands on the floor either side. Raise your working leg as far as you can, keeping it as straight as possible, then pause and squeeze your thigh at the top. Bring down slowly to rest.",
    images: ["single_leg_pike_rest.png", "single_leg_pike_engaged.png"],
    difficulty:
      "Endeavor not to let the leg drop, but to control that lowering. Lift both legs at the same time to increase challenge (bilateral).",
    warning:
      "If in a public space, make sure you're clearly visible to others when sat on the ground.",
    alternative: [],
    technique: "isolateral",
  },
  {
    id: "singlelegromaniandeadlift",
    name: "Single Leg Romanian Deadlift",
    category: "hinge",
    type: "pull",
    progressionLevel: 2,
    description:
      "Stand upright, facing forwards. Bring one leg backwards as you pivot your body forwards until almost facing straight down, slightly bending your other leg. Bring your body back vertically to rest.",
    images: [
      "single_leg_romanian_deadlift_rest.png",
      "single_leg_romanian_deadlift_engaged.png",
    ],
    difficulty:
      "Place your hands on the back of a chair if balance is a challenge, or go hands-free to make this harder.",
    warning:
      "Make sure there's nothing around you that you could fall and injure yourself on. If using an object, ensure it's sturdy enough to not move or tip with your body weight.",
    alternative: [],
    technique: "isolateral",
  },
  /*
  {
    id: "singlelegglutebridge",
    name: "Single Leg Glute Bridge",
    category: "hinge",
    type: "pull",
    progressionLevel: 2,
    description:
      // To do
    ,
    images: [
      // To do
    ],
    difficulty:
      // To do
    ,
    warning:
      // To do
    ,
    alternative: [],
    technique: "isolateral",
  },
  */
  {
    id: "swimmer",
    name: "The Swimmer",
    category: "hinge",
    type: "pull",
    progressionLevel: 2,
    description:
      "Start laying face down on the floor, legs and arms fully extended so you look like a green bean. For the movement, simultaneously bring both legs up, as well as your upper body (pivot from the diaphragm), and bring both arms backwards and inwards pressing your shoulder blades together.",
    images: ["the_swimmer_rest.png", "the_swimmer_engaged.png"],
    difficulty: "This pairs very well with the Hollow Body Position.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: [],
    technique: "bilateral",
  },
  {
    id: "hollowbody",
    name: "Hollow Body Position",
    category: "hinge",
    type: "pull",
    progressionLevel: 2,
    description:
      "With knees up back in contact always with the floor, arms reach straight up for the sky. Pulse up – it’s a very small movement, but doing it you’ll feel it. From strength developing working this movement, you can begin to bring your arms overhead, reaching behind you. After that feels strong, extend your legs and always keep your back in contact with the ground.",
    images: ["hollow_body_rest.png", "hollow_body_engaged.png"],
    difficulty: "This pairs very well with The Swimmer.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: [],
    technique: "bilateral",
  },
  {
    id: "reverseplank",
    name: "Reverse Plank",
    category: "hinge",
    type: "push",
    progressionLevel: 3,
    description:
      "Start sitting upright. Bring your arms down beside you, and push your body up through the shoulders and your arms are fully extended, pivoting from your ankles. Lean your head back as you do so, bringing your spine upwards to form a slight bridge. Hold for 15 seconds.",
    images: ["reverse_plank_rest.png", "reverse_plank_engaged.png"],
    difficulty:
      "Form is more important than speed. Slowly move into position and gradually bring your spine up as your rotate your head back. Progress to the Full Bridge if these are becoming too easy.",
    warning:
      "If in a public space, make sure you're clearly visible to others when sat on the ground.",
    alternative: ["fullbridge"],
    technique: "bilateral",
  },
  {
    id: "angledbridge",
    name: "Angled Bridge",
    category: "hinge",
    type: "push",
    progressionLevel: 3,
    description:
      "Find a sturdy box or chair. Lie back on the object, keeping feet flat and shoulder width apart. Place hands either side of your head, palms flat on object, fingers pointing at your toes. Press through the hands, pushing your hips up and arcing your back as far as you can.",
    images: ["angled_bridge_rest.png", "angled_bridge_engaged.png"],
    difficulty:
      "Use a lower object to increase difficulty - but watch the angle for your back is comfortable.",
    warning:
      "Make sure your object is sturdy enough so it won't move or tilt under your weight. If in a public space, make sure you're clearly visible to others when sat on the ground.",
    alternative: [],
    technique: "bilateral",
  },
  {
    id: "fullbridge",
    name: "Full Bridge",
    category: "hinge",
    type: "push",
    progressionLevel: 4,
    description:
      "Start off laying on your back. Lift your entire body up in a reverse plank with both hands (facing forwards) and legs. Form a bridge shape by walking your hands back slightly, walking your legs towards you to be at right angles with the ground, and bringing your head back as far as it goes. Hold for 15 seconds.",
    images: ["full_bridge.png", "full_bridge.png"],
    difficulty:
      "Reduce difficulty by lowering the height of your bridge (reduce the angles). If too difficult, try the Reverse Plank instead.",
    warning:
      "If in a public space, make sure you're clearly visible to others when sat on the ground.",
    alternative: ["reverseplank"],
    technique: "bilateral",
  },

  /**
   * Pushes
   **/

  {
    id: "cobrapushup",
    name: "Cobra Push Up",
    category: "push",
    type: "push",
    progressionLevel: 1,
    description:
      "Lay on the floor belly first, elbows back and fairly tight against your body, hands flat below your shoulders. Keeping your body below your hips flat on the floor, drive your entire upper body upwards, engaging your core and fully extending your arms.",
    images: ["push_up_rest.png", "cobra_push_up_engaged.png"],
    difficulty:
      "Space your hands nearer or further apart to alter the muscle groups you use. Try a Wall Push Up if this is too challenging for your shoulders.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["wallpushup"],
    technique: "bilateral",
  },
  /*
  {
    id: "wallpushup",
    name: "Wall Push Up",
    category: "push",
    type: "push",
    progressionLevel: 1,
    description:
      "Stand facing a wall. Place both hands flat on the wall about shoulder width apart. Gently lean towards the wall until just touching. Push through both arms and fully extend until your body is vertical.",
    images: [
      //to do
    ],
    difficulty:
      "Space your hands nearer or further apart to alter the muscle groups you use. Try a Cobra Push Up if this is too challenging for your wrists.",
    warning:
      "Check for objects behind that could injure you in a fall.",
    alternative: [
      "cobrapushup"
    ],
    technique: "bilateral",
  },
  */
  {
    id: "hindupushup",
    name: "Hindu Push Up",
    category: "push",
    type: "push",
    progressionLevel: 2,
    description:
      "This is a single, fluid movement from an inverted V into the cobra. Start by bringing your upper body down and bottom pointing upwards (V shape), with both arms extended, and hands resting on the ground just forward and 1 foot either side of your head. Glide into the cobra position by swinging your head upwards to a near vertical position, whilst simultaneously bringing your bottom and legs down until almost flat against the floor.",
    images: ["hindu_push_up_rest.png", "hindu_push_up_engaged.png"],
    difficulty:
      "Technique is more important than speed here. Start this movement slowly until you become comfortable gliding between both positions. Try the Elevated Push Up if you can't get the hang of this.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["elevatedpushup"],
    technique: "bilateral",
  },
  {
    id: "elevatedpushup",
    name: "Elevated Push Up",
    category: "push",
    type: "push",
    progressionLevel: 2,
    description:
      "Face towards a pair of sturdy chairs or tables (2 objects are better for body position than 1). Place both hands flat against the object, just below the shoulders, and carefully lean forwards. Push through your arms until fully extended and your body is vertical.",
    images: ["elevated_push_up_rest.png", "elevated_push_up_engaged.png"],
    difficulty:
      "Pivot from your knees instead of your toes to reduce difficulty. Try a Hindu Push Up if this movement is too hard on your wrists or shoulders.",
    warning:
      "Make sure your objects are sturdy enough to not move or tilt under your weight.",
    alternative: ["hindupushup"],
    technique: "bilateral",
  },
  {
    id: "flatpushup",
    name: "Flat Push Up",
    category: "push",
    type: "push",
    progressionLevel: 3,
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands flat and below the shoulders. Drive through your arms until fully extended, pivoting from your toes.",
    images: ["push_up_rest.png", "push_up_engaged.png"],
    difficulty:
      "Check your form, your elbows should stay directly above your wrists the entire movement. Try Tricep Dips if you're finding these difficult.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["tricepdip"],
    technique: "bilateral",
  },
  {
    id: "tricepdip",
    name: "Tricep Dips",
    category: "push",
    type: "push",
    progressionLevel: 3,
    description:
      "Kneel between two sturdy chairs or tables. Place one hand on each object, slightly in front of your shoulders. Drive up through your arms until fully extended.",
    images: ["tricep_dip_rest.png", "tricep_dip_engaged.png"],
    difficulty:
      "Adjust the load on your arms by placing some of your body weight onto your feet/knees. Try Flat Push Ups if you find these too difficult",
    warning:
      "Make sure your objects are sturdy enough not to move or tilt under your body weight.",
    alternative: ["flatpushup"],
    technique: "bilateral",
  },
  {
    id: "diamondpushup",
    name: "Diamond Push Up",
    category: "push",
    type: "push",
    progressionLevel: 4,
    description:
      "Lay on the floor belly first, elbows back fairly tight against the body, hands pushed together flat below the breastplate, fingers and thumbs touching to form a diamond shape. Drive through your arms until fully extended, pivoting from your toes.",
    images: ["diamond_push_up_rest.png", "diamond_push_up_engaged.png"],
    difficulty:
      "Bring your feet and body forward relative to your arms to further emphasise shoulder muscles.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["archerpushup", "lionpushup", "pikepushup"],
    technique: "bilateral",
  },
  {
    id: "archerpushup",
    name: "Archer Push Up",
    category: "push",
    type: "push",
    progressionLevel: 4,
    description:
      "Start face down, arms fully extended and spaced apart at shoulder level to form an inverted V shape. Keeping one arm fully extended, bring your other arm down until your body is nearly flat with the ground. Push yourself back off that arm until you return to your inverted V, then repeat the movement on the other side to finish your rep.",
    images: ["diamond_push_up_rest.png", "diamond_push_up_engaged.png"],
    difficulty:
      "The form on this is tricky to get right so start slowly. You should not be relying on momentum to complete the movement.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["diamondpushup", "lionpushup", "pikepushup"],
    technique: "bilateral",
  },
  /*
  {
    id: "lionpushup",
    name: "Lion Push Up",
    category: "push",
    type: "push",
    progressionLevel: 4,
    description:
      "Lay on the floor belly first, elbows directly below your shoulders, with your upper arm straight out and flat against the floor. Drive through your shoulders until your arms are fully extended, pushing through your hands, pivoting from your toes.",
    images: [
      // To do
    ],
    difficulty:
      "Bring your feet forward and your bottom upwards to increase load on your shoulders.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: [
      "diamondpushup",
      "archerpushup",
      "pikepushup"
    ],
    technique: "bilateral",
  },
  */
  {
    id: "pikepushup",
    name: "Pike Push Up",
    category: "push",
    type: "push",
    progressionLevel: 4,
    description:
      "Start in an inverted V (bottom up, head facing down and arms outstretched, hands flat on the floor slightly in front of your shoulders). Slowly bring your head down to the ground with both arms flexed outwards. Drive through your arms and shoulders until fully extended.",
    images: ["pike_push_up_rest.png", "pike_push_up_engaged.png"],
    difficulty:
      "Bring your feet forward and your bottom upwards to increase load on your shoulders.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["diamondpushup", "archerpushup", "lionpushup"],
    technique: "bilateral",
  },
  /*
  {
    id: "handstandpushup",
    name: "Hand Stand Push Up",
    category: "push",
    type: "pull",
    progressionLevel: 4,
    description:
      "",
    images: [
      // To Do
    ],
    difficulty:
      "",
    warning:
      "",
    alternative: [],
    technique: "bilateral",
  },
  */

  /**
   * Pulls
   **/

  {
    id: "verticalpull",
    name: "Vertical Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 1,
    description:
      "Stand facing a doorframe or other solid vertical object. Grip the object with both hands level with your upper chest. Lean your body backwards until your arms fully extend, then pull your body back to an upright position.",
    images: ["vertical_pull_rest.png", "vertical_pull_engaged.png"],
    difficulty:
      "Step towards the doorframe to increase the angle and make this harder, or away to make it easier.",
    warning:
      "If stood inside a doorframe, do this movement slowly to avoid banging your head.",
    alternative: [],
    technique: "bilateral",
  },
  {
    id: "tethereddoorpull",
    name: "Tethered Door Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 2,
    description:
      "Face towards a door and stand upright (or bend your legs), firmly grip your tether at chest height and gently lean backwards until arms are fully extended. Pull yourself towards the door with both arms, pivoting from your feet, until vertical again.",
    images: ["tethered_door_pull_rest.png", "tethered_door_pull_engaged.png"],
    difficulty:
      "Step towards the door frame to increase the angle and make this harder, or away to make it easier.",
    warning:
      "Make sure your doorframe supports your weight, your tugging object shows no signs of deterioration, and there's nothing behind you that could cause injury if you fell backwards.",
    alternative: ["facepull"],
    technique: "bilateral",
  },
  {
    id: "facepull",
    name: "Face Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 2,
    description:
      "Face towards a door and stand upright (or bend your legs), firmly grip your tether at face height and gently lean backwards until arms are fully extended. Pull yourself towards the door with both arms, pivoting from your feet, until vertical again.",
    images: ["face_pull_rest.png", "face_pull_engaged.png"],
    difficulty:
      "Step towards the door frame to increase the angle and make this harder, or away to make it easier. If you're struggling with reps, ease into the movement with Door Hang Holds.",
    warning:
      "Make sure your doorframe supports your weight, your tugging object shows no signs of deterioration, and there's nothing behind you that could cause injury if you fell backwards.",
    alternative: ["doorhanghold", "tethereddoorpull"],
    technique: "bilateral",
  },
  {
    id: "pronatedaustralianpull",
    name: "Pronated Australian Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 3,
    description:
      "Lay between two sturdy chairs or tables, shoulders slightly forward of both edges. Firmly grip the edge of each object in one hand, palms facing away from you. Pull upwards with your arms until level with your hands, pivoting from your ankles.",
    images: [
      "pronated_australian_pull_rest.png",
      "pronated_australian_pull_engaged.png",
    ],
    difficulty:
      "Widen your grip to increase the angle and difficulty. Try a Suppinated Austrialian Pull or Horizontal Pull if this is too easy!",
    warning:
      "Make sure your chairs/tables are sturdy enough that they won't tilt under your weight (chairs facing towards you will help).",
    alternative: ["suppinatedaustralianpull", "horizontalpull"],
    technique: "bilateral",
  },
  {
    id: "suppinatedaustralianpull",
    name: "Suppinated Australian Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 3,
    description:
      "Rest a stiff stick between two sturdy objects. Lay beneath, shoulders slightly forward of the stick, firmly gripping the stick with both hands, palms facing towards you. Pull upwards with your arms until you meet the object, pivoting from your ankles.",
    images: [
      "suppinated_australian_pull_rest.png",
      "suppinated_australian_pull_engaged.png",
    ],
    difficulty:
      "Try a Pronated Austrialian Pull or Horizontal Pull if this is too easy!",
    warning:
      "Make sure your stick is perfectly horizontal so it won't slip, and tough enough to not flex under your weight.",
    alternative: ["pronatedaustralianpull", "horizontalpull"],
    technique: "bilateral",
  },
  {
    id: "horizontalpull",
    name: "Horizontal Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 3,
    description:
      "Find a sturdy table. Lay beneath it, shoulders slightly forward of the edge, firmly gripping about shoulder width apart with both hands. Pull your body upwards with your arms until you meet the object, pivoting from your ankles.",
    images: ["horizontal_pull_rest.png", "horizontal_pull_engaged.png"],
    difficulty:
      "Widen your grip to increase the angle and difficulty. Try a Pronated Austrialian Pull or Suppinated Austrialian Pull if this is too easy!",
    warning:
      "Make sure your table is sturdy enough that it won't tilt under your weight.",
    alternative: ["pronatedaustralianpull", "suppinatedaustralianpull"],
    technique: "bilateral",
  },
  {
    id: "assistedpullup",
    name: "Assisted Pull Up",
    category: "pull",
    type: "pull",
    progressionLevel: 4,
    description:
      "Grab a pull up bar with both hands, shoulder width apart and palms facing towards you. Rest your feet or knees on an object beneath your bar to take some of your body weight. Pull yourself up until your chin is above your hands",
    images: ["assisted_pull_up_rest.png", "assisted_pull_up_engaged.png"],
    difficulty:
      "Widen your grip to increase the angle and difficulty. Try a Suppinated Pull Up if this is too easy!",
    warning:
      "If using a home pull up bar, make sure it is installed securely and won't slip or flex under your weight. Check for objects behind that could injure you in a fall.",
    alternative: [
      //"suppinatedpullup",
      "pronateddoorhangpull",
    ],
    technique: "bilateral",
  },
  {
    id: "pronateddoorhangpull",
    name: "Pronated Door Hang Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 4,
    description:
      "Grab the top of a door, hands shoulder width apart and palms facing forwards. Pull yourself up until your chin is above your hands.",
    images: ["door_hang_pull_rest.png", "door_hang_pull_engaged.png"],
    difficulty:
      "Widen your grip to increase the angle and difficulty. If you're struggling with reps then ease into the movement with Door Hang Holds. Otherwise try Suppinated Pull Ups or One Arm Door Pulls if this is too easy!",
    warning:
      "Make sure your door is securely wedged and won't move under your weight. Check for objects behind that could injure you in a fall. You can put a towel over the door for comfort",
    alternative: [
      //"suppinatedpullup",
      "doorhanghold",
      "onearmdoorpull",
    ],
    technique: "bilateral",
  },
  {
    id: "onearmdoorpull",
    name: "One Arm Door Pull",
    category: "pull",
    type: "pull",
    progressionLevel: 4,
    description:
      "Stand facing a doorframe, with the edge aligned with your working shoulder. Grab the edge of the frame with your working hand and gently lean back and fully extended. Pull yourself towards the doorframe until vertical.",
    images: ["one_arm_door_pull_rest.png", "one_arm_door_pull_engaged.png"],
    difficulty:
      "Step towards the door frame to increase the angle and make this harder, or away to make it easier.",
    warning:
      "Make sure the doorframe is strong enough to support your weight. Check for objects behind that could injure you in a fall.",
    alternative: [
      //"suppinatedpullup",
      "pronateddoorhangpull",
    ],
    technique: "isolateral",
  },
  /*
  {
    id: "suppinatedpullup",
    name: "Suppinated Pull Up",
    category: "pull",
    type: "pull",
    progressionLevel: 4,
    description:
      "Grab a pull up bar with both hands, shoulder width apart and palms facing towards you. Pull yourself up until your chin is above your hands.",
    images: [
      // To Do
    ],
    difficulty:
      "Widen your grip to increase the angle and difficulty. Try an Assisted Pull Up if this is too difficult!",
    warning:
      "If using a home pull up bar, make sure it is installed securely and won't slip or flex under your weight. Check for objects behind that could injure you in a fall.",
    alternative: [
      "pronateddoorhangpull",
      "onearmdoorpull"
    ],
    technique: "bilateral",
  },
  */

  /**
   * Holds
   **/

  {
    id: "tablebridge",
    name: "Isometric Table Bridge",
    category: "hold",
    type: "push",
    progressionLevel: 1,
    description:
      "Sit on the ground. Place your arms behind you hands facing forward. Bring your butt off the ground so your legs are right angles and your arms straight. Hold for 15 seconds.",
    images: ["isometric_table_bridge.png", "isometric_table_bridge.png"],
    difficulty:
      "If these are too difficult, start off with Glute Raises. Progress on to Angled Bridges.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["gluteraise", "angledbridge"],
    technique: "bilateral",
  },
  {
    id: "pikehold",
    name: "Pike Hold",
    category: "hold",
    type: "push",
    progressionLevel: 1,
    description:
      "Stand legs close together. Fold your upper body over with your arms stretched out until hands touch the floor, with your butt sticking up. Hold for 15 seconds.",
    images: ["pike_hold_engaged.png", "pike_hold_engaged.png"],
    difficulty:
      "Once you've mastered these, progress to Cobra Push Ups or Hindu Push Ups.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["cobrapushup", "hindupushup"],
    technique: "bilateral",
  },
  {
    id: "superman",
    name: "Superman",
    category: "hold",
    type: "pull",
    progressionLevel: 2,
    description:
      "Lay flat on the ground. Raise both arms up and straight forward. Raise both legs pivoting as far above the knees as possible. Hold for 15 seconds.",
    images: ["superman_hold.png", "superman_hold.png"],
    difficulty:
      "Try The Swimmer instead if you prefer reps to holds. Pairs very well with Hollow Body Holds.",
    warning:
      "If in a public space, make sure you're clearly visible to others when lying on the ground.",
    alternative: ["swimmer", "hollowbodyhold"],
    technique: "bilateral",
  },
  {
    id: "hollowbodyhold",
    name: "Hollow Body Hold",
    category: "hold",
    type: "pull",
    progressionLevel: 2,
    description:
      "Lay on your back, bring your knees up at right angles to the ground. Reach your arms straight up to the sky. Hold for 15 seconds.",
    images: ["hollow_body_engaged.png", "hollow_body_engaged.png"],
    difficulty:
      "Try Hollow Body Position instead if you prefer reps to holds. Pairs very well with Superman.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: ["hollowbody", "superman"],
    technique: "bilateral",
  },
  {
    id: "doorhanghold",
    name: "Door Hang",
    category: "hold",
    type: "pull",
    progressionLevel: 2,
    description:
      "Firmly grasp the top of the door with both hands, with both feet touching the ground. Engage your biceps to lift your entire body off the ground until your throat is level with the top and your toes can just touch the ground. Hold for 15 seconds.",
    images: ["door_hang_hold.png", "door_hang_hold.png"],
    difficulty:
      "If you want to reduce difficulty (or you're too short compared to the height of the door), rest your feet on a sturdy object instead of the ground. Progress to reps of Door Hang Pulls or Face Pulls.",
    warning:
      "Make sure the door is securely wedged and won't move under your weight. Check for objects behind that could injure you in a fall.",
    alternative: ["doorhangpull", "facepull"],
    technique: "bilateral",
  },
  {
    id: "horsestance",
    name: "Horse Stance",
    category: "hold",
    type: "push",
    progressionLevel: 2,
    description:
      "Stand legs wide apart feet pointing outwards. Bend your knees at right angles and stick your butt out, leaning your upper body forwards. Hold for 15 seconds.",
    images: ["horse_stance_hold.png", "horse_stance_hold.png"],
    difficulty:
      "If 15 seconds is too challenging, ease into the movement with easier squat movements such as Box Squats and Supported Squats.",
    warning: "Check for objects behind that could injure you in a fall.",
    alternative: ["boxsquat", "supportedsquat"],
    technique: "bilateral",
  },
  {
    id: "tricepdiphold",
    name: "Tricep Dip Hold",
    category: "hold",
    type: "push",
    progressionLevel: 3,
    description:
      "Position yourself between two objects. Place a hand flat on each one about level with your body. Push yourself upwards until your arm is fully extended and your toes brush the ground. Hold for 15 seconds.",
    images: ["tricep_dip_hold.png", "tricep_dip_hold.png"],
    difficulty:
      "Change difficulty by increasing/reducing the load taken by your feet. Progress to Tricep Dips which are the reps version of this movement.",
    warning:
      "Make sure your objects are sturdy enough to not move or tilt under your weight. Check for objects behind that could injure you in a fall.",
    alternative: ["tricepdip"],
    technique: "bilateral",
  },
  {
    id: "shallowpushup",
    name: "Shallow Push Up",
    category: "hold",
    type: "push",
    progressionLevel: 3,
    description:
      "Lay face down on the floor, hands below the shoulders. Push your body up about 6 inches off the ground, pivoting from your toes. Hold for 15 seconds.",
    images: ["shallow_push_up_hold.png", "shallow_push_up_hold.png"],
    difficulty: "If these are too easy, progress to Flat Push Ups.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: ["flatpushup"],
    technique: "bilateral",
  },
  {
    id: "sideplank",
    name: "Side Plank",
    category: "hold",
    type: "push",
    progressionLevel: 3,
    description:
      "Lay on your side leaning on your arm. Raise your entire body with your arm, keeping it straight and pivoting from your heel. Hold for 15 seconds. Repeat laying on your other side.",
    images: ["side_plank_engaged.png", "side_plank_rest.png"],
    difficulty:
      "If these are too difficult, try the Short Bridge as an alternative to strengthen your core muscles.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: ["shortbridge"],
    technique: "isolateral",
  },
  {
    id: "vsit",
    name: "V Sit",
    category: "hold",
    type: "pull",
    progressionLevel: 4,
    description:
      "Sit on the floor. Bring your body back and simultaneously raise your straight legs (use hands for support) until at a 45 degree angle. Hold for 15 seconds.",
    images: ["v_sit_hold.png", "v_sit_hold.png"],
    difficulty:
      "If these are too difficult, try the Single Leg Pike as an alternative to strengthen your leg and core muscles.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: ["singlelegpikelift"],
    technique: "bilateral",
  },
  {
    id: "lsit",
    name: "L Sit",
    category: "hold",
    type: "push",
    progressionLevel: 4,
    description:
      "Sit on the floor both hands flat on the ground either side. Raise your body on both hands, and hold both legs out straight and raised. Hold for 15 seconds.",
    images: ["l_sit.png", "l_sit.png"],
    difficulty:
      "Reduce difficulty by allowing your ankles to touch the ground to takes some load. If these are too difficult, try the Reverse Plank.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: ["reverseplank"],
    technique: "bilateral",
  },
  {
    id: "planchelean",
    name: "Planche Lean",
    category: "hold",
    type: "push",
    progressionLevel: 4,
    description:
      "Lay flat on the floor. Push yourself off the ground (like a push up) and gradually lean your body forward so your arms are angled and your back is arched with your feet brushing the ground. Hold for 15 seconds.",
    images: ["planche_lean_engaged.png", "planche_lean_engaged.png"],
    difficulty:
      "Reduce difficulty by lowering the angle of your lean. If these are too difficult, try the Shallow Push Up.",
    warning:
      "If in a public space, make sure you're clearly visible to others when laying on the ground.",
    alternative: ["shallowpushup"],
    technique: "isolateral",
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
      if (m.technique == "isolateral" && props.week >= 4) {
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
