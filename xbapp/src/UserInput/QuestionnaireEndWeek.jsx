import React, { useState, useEffect } from "react";
import {
  IonItem,
  IonListHeader,
  IonTextarea,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonPage,
  IonHeader,
  IonRange,
  IonItemDivider,
  IonButton,
} from "@ionic/react";

import TagsInput from "./TagsInput";

const FeltScale = {
  0: "(0) Not at all",
  1: "(1)",
  2: "(2)",
  3: "(3)",
  4: "(4)",
  5: "(5) So and so",
  6: "(6)",
  7: "(7)",
  8: "(8)",
  9: "(9)",
  10: "(10) A lot",
};

const EasierScale = {
  0: "(0) No problem",
  1: "(1)",
  2: "(2)",
  3: "(3) Getting Easier",
  4: "(4)",
  5: "(5) Same challenge as last week",
  6: "(6)",
  7: "(7) Harder",
  8: "(8)",
  9: "(9)",
  10: "(10) Impossible/Didn't happen",
};


const QuestionnaireEndWeek = (props) => {

  const [valueBenefit, setValueBenefit] = useState(0);
  const [valueEasier, setValueEasier] = useState(0);
  const [valueScheduling, setValueScheduling] = useState(0);
  const [whyScheduling, setWhyScheduling] = useState("");
  const [building, setBuilding] = useState("");
  const [buildingWhy, setBuildingWhy] = useState("");
  const [busy, setBusy] = useState("");

  const [showTags, setShowTags] = useState(false);

  function processData() {

    var response = {};
    response.type = "questionnaire-endWeek";
    response.benefit = "The Strength study is having a benefit: rated " + valueBenefit + "/10; ";
    response.easier = "Daily strength sessions are making work easier: rated " + valueEasier + "/10; ";
    response.scheduling = "Scheduling workouts this week is " + EasierScale[valueScheduling] + "(out of 10)" + (whyScheduling != "" ? (" because of - " + whyScheduling + ";") : ";");
    response.building = "On building strength -  confidence on doing the exercise - overall I’m feeling " + building + " because of - " + buildingWhy + ";";
    response.busy = "In terms of how busy I am, I am " + busy;

    if (props.onSubmit) {
      props.onSubmit(response);
    }
  }

  return (
    <>
      <div>
        <h4>Rate the following statement on the scale from 0 to 10:</h4>

        <p>I feel like the strength practice is having a benefit</p>
        <IonItemDivider></IonItemDivider>
        <IonItem style={{ textAlign: "center" }}>
        <IonLabel>{FeltScale[valueBenefit]}</IonLabel>
      </IonItem>
      <IonItem>
        <IonRange
          min={0}
          max={10}
          step={1}
          snaps={true}
          ticks={true}
          color="secondary"
          value={valueBenefit}
          onIonChange={(e) => setValueBenefit(e.detail.value)}
        />
      </IonItem>
      
        <IonItemDivider></IonItemDivider>

        <p>Daily strength sessions are making work easier</p>
        <IonItemDivider></IonItemDivider>
        <IonItem style={{ textAlign: "center" }}>
        <IonLabel>{EasierScale[valueEasier]}</IonLabel>
      </IonItem>
      <IonItem>
        <IonRange
          min={0}
          max={10}
          step={1}
          snaps={true}
          ticks={true}
          color="secondary"
          value={valueEasier}
          onIonChange={(e) => setValueEasier(e.detail.value)}
        />
      </IonItem>


      <IonItemDivider></IonItemDivider>

        <p>Scheduling workouts this week is:</p>
        <IonItemDivider></IonItemDivider>
        <IonItem style={{ textAlign: "center" }}>
        <IonLabel>{EasierScale[valueScheduling]}</IonLabel>
      </IonItem>
      <IonItem>
        <IonRange
          min={0}
          max={10}
          step={1}
          snaps={true}
          ticks={true}
          color="secondary"
          value={valueScheduling}
          onIonChange={(e) => {setValueScheduling(e.detail.value); if (e.detail.value >= 5) {setShowTags(true)} else {setShowTags(false)}}}
        />
      </IonItem>
        
        {showTags ?
        <>
        <p>Why? (tap on tag to select)</p>
            <IonItem>
            
            <br></br>
            <TagsInput tagType="whyScheduling" onChange={(tag) => {
              setWhyScheduling(tag)
            }} /></IonItem>
            <br></br>
            <p>Selected: {whyScheduling}</p></>
            :
            <></>}
        

        <IonItemDivider></IonItemDivider>
        <IonRadioGroup
          allow-empty-selection="true"
          value={building}
          onIonChange={(e) => { setBuilding(e.detail.value) }}
        >
          <IonListHeader>
            <p>
            On building strength -  confidence on doing the exercise - overall I’m feeling
            </p>
          </IonListHeader>

          <IonItem>
            <IonLabel>More confident this week</IonLabel>
            <IonRadio slot="start" value="More confident this week" />
          </IonItem>

          <IonItem>
            <IonLabel>The same as last week</IonLabel>
            <IonRadio slot="start" value="The same as last week" />
          </IonItem>

          <IonItem>
            <IonLabel>Less confident this week</IonLabel>
            <IonRadio slot="start" value="Less confident this week" />
          </IonItem>

        </IonRadioGroup>

        {building != "" ?
        <>
        <p>Why? (tap on tag to select)</p>
            <IonItem>
            
            <br></br>
            <TagsInput tagType="whyBuilding" onChange={(tag) => {
              setBuildingWhy(tag)
            }} /></IonItem>
            <br></br>
            <p>Selected: {buildingWhy}</p></>
            :
            <></>}

        <IonItemDivider></IonItemDivider>
        <IonRadioGroup
          allow-empty-selection="true"
          value={busy}
          onIonChange={(e) => { setBusy(e.detail.value) }}
        >
          <IonListHeader>
            <p>
            How busy are you?
            </p>
          </IonListHeader>

          <IonItem>
            <IonLabel>Busier this week</IonLabel>
            <IonRadio slot="start" value="Busier this week" />
          </IonItem>

          <IonItem>
            <IonLabel>The same as last week</IonLabel>
            <IonRadio slot="start" value="The same as last week" />
          </IonItem>

          <IonItem>
            <IonLabel>Less busy this week</IonLabel>
            <IonRadio slot="start" value="Less busy this week" />
          </IonItem>

        </IonRadioGroup>


        <IonItemDivider></IonItemDivider>

        <IonButton
          onClick={() => {
            processData();
          }}
        >
          Submit
        </IonButton>
      </div>
    </>
  );
};

export default QuestionnaireEndWeek;
