import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  IonItem,
  IonListHeader,
  IonContent,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonPage,
  IonHeader,
  IonRange,
  IonItemDivider,
  IonButton,
} from "@ionic/react";

const unansweredState = [
  {
    id: 0,
    questionName: "At my work, I feel bursting with energy.",
    questionAnswer: -1,
    required: true
  },
  {
    id: 1,
    questionName: "I am enthusiastic about my job.",
    questionAnswer: -1,
    required: true
  },
  {
    id: 2,
    questionName: "I am immersed in my work.",
    questionAnswer: -1,
    required: true
  },
  {
    id: 3,
    questionName: "At my job, I feel strong and vigorous.",
    questionAnswer: -1,
    required: false
  },
  {
    id: 4,
    questionName: "My job inspires me.",
    questionAnswer: -1,
    required: false
  },
  {
    id: 5,
    questionName: "When I get up in the morning, I feel like going to work.",
    questionAnswer: -1,
    required: false
  },
  {
    id: 6,
    questionName: "I feel happy when I am working intensely.",
    questionAnswer: -1,
    required: false
  },
  {
    id: 7,
    questionName: "I am proud of the work that I do.",
    questionAnswer: -1,
    required: false
  },
  {
    id: 8,
    questionName: "I get carried away when I am working.",
    questionAnswer: -1,
    required: false
  }
];

const answers = ["Never",
  "Almost Never: A few times a year or less",
  "Rarely: Once a month or less",
  "Sometimes: a few times a month",
  "Often: A few times a month",
  "Very often: A few times a week",
  "Always: every day"];

const WorkAssessment = (props) => {

  const [allQuestions, setAllQuestions] = useState(unansweredState);
  const [isReadyForSubmission, setIsReadyForSubmission] = useState(false);

  function updateQuestion(id, answer) {

    var updatedSet = allQuestions;
    updatedSet[id].questionAnswer = answer;
    setAllQuestions(updatedSet);
    if ((allQuestions[0].questionAnswer != -1) && (allQuestions[1].questionAnswer != -1) && (allQuestions[2].questionAnswer != -1)) setIsReadyForSubmission(true);
  }
  function submit() {

    var responseString ="";
    allQuestions.map((question, i) => {
      if (question.questionAnswer != -1){
        responseString = responseString + question.questionName + ": "+ answers[question.questionAnswer] + "; "
      }
    });
    var response = {};
    response.type = "work-assessment";
    response.explanation = responseString;

    props.onSubmit(response);
  }

  return (
    <IonContent>
      <p style={{ padding: "5px 8px 5px 8px" }}>
        The following statements are about how you feel at work. Please read each statement carefully and decide if you ever feel this way about your job. Answering the first 3 questions is required. The rest is optional.
      </p>
      <p>Important Questions</p>
      {allQuestions.map((question, i) => {

        const content = <IonRadioGroup key={i}>
          <IonListHeader>
            <IonLabel>
              {question.questionName}
            </IonLabel>
          </IonListHeader>
          {answers.map((answer, i) =>
            <IonItem key={i + 10}>
              <IonRadio value={i} onClick={() => updateQuestion(question.id, i)} />
              <IonLabel>{answer}</IonLabel>
            </IonItem>
          )}
        </IonRadioGroup>;
                  if ((i == 3)){
                    return <div key={i}><p>Optional Questions</p>{content}<IonItemDivider></IonItemDivider></div>
                  } else {
                    return <div key={i}>{content}<IonItemDivider></IonItemDivider></div>
                  }
      })}
      {isReadyForSubmission ? <IonButton onClick={submit}>Submit</IonButton> : <></>}

    </IonContent>
  );
};

export default WorkAssessment;
