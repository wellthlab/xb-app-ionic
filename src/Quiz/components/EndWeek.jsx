import { useState } from "react";
import { IonText } from "@ionic/react";

import AgreeSlider from "./AgreeSlider";
import MultipleChoice from "./MultipleChoice";

const QuestionnaireEndWeek = ({ onSubmit }) => {
  const [schedulingWhy, setSchedulingWhy] = useState(false);

  return (
    <>
      {/* <IonText>Rate the following statements on a scale from 0 to 10</IonText> */}
      <AgreeSlider
        tag={"strength-benefit"}
        statement="I feel like the strength practice is having a benefit,"
        min={0}
        max={10}
        onSubmit={onSubmit}
      />
      <AgreeSlider
        tag={"easier-workout"}
        statement="Daily strength sessions are making work easier,"
        min={0}
        max={10}
        onSubmit={onSubmit}
      />
      <AgreeSlider
        tag={"scheduling-workout"}
        statement="Scheduling workouts was,"
        min={0}
        max={10}
        onSubmit={(response) => {
          onSubmit(response);
          setSchedulingWhy(response["scheduling-workout"] < 5);
        }}
      />
      {schedulingWhy ? (
        <>
          <MultipleChoice
            tag="scheduling-why"
            statement="Scheduling workouts was more difficult because,"
            choices={[
              "Unusual deadline",
              "Injury",
              "Family emergency",
              "Newborn",
              "Other",
            ]}
            onSubmit={onSubmit}
          />
        </>
      ) : (
        ""
      )}
      {/* tag, statement, choices, onSubmit */}
      <MultipleChoice
        tag={"exercise-confidence"}
        statement="My confidence in doing these exercises is,"
        choices={[
          "More confident now",
          "The same as before",
          "Less confident than before",
        ]}
        onSubmit={onSubmit}
      />
      <MultipleChoice
        tag={"how-busy"}
        statement="My schedule is,"
        choices={[
          "Busier than usual",
          "About the same",
          "Less busy than usual",
        ]}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default QuestionnaireEndWeek;
