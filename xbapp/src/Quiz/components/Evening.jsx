import AgreeSlider from "./AgreeSlider";

const QuestionnaireEvening = ({ onSubmit }) => {
  return (
    <AgreeSlider
      tag={"questionnaire-evening"}
      statement="In general, I felt good today."
      min={0}
      max={10}
      onSubmit={onSubmit}
    />
  );
};

export default QuestionnaireEvening;
