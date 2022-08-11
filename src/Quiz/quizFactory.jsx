import AgreeSlider from "./components/AgreeSlider";
import FreeText from "./components/FreeText";
import MultipleChoice from "./components/MultipleChoice";
import QuestionnaireEvening from "./components/Evening";
import QuestionnaireEndWeek from "./components/EndWeek";
import KnowledgeQuiz from "./components/Test";
/*
 * The quiz factory is responsible for creating the quiz components.
 *  type: the type of quiz component to create
 *  info: required information for the component
 *  onSubmit: a callback that is called when the quiz is submitted *
 *
 */
function quizFactory(tag, type, info, onSubmit) {
  let input = null;

  switch (type) {
    // These next TWO types will return a pre-made questionnaire
    case "end-week":
      input = <QuestionnaireEndWeek onSubmit={onSubmit} />;
      break;
    case "evening":
      input = <QuestionnaireEvening onSubmit={onSubmit} />;
      break;
    // The follow types can be used to build a custom questionnaire
    case "test":
      input = (
        <KnowledgeQuiz
          tag={tag}
          statement={info.statement}
          choices={info.choices}
          correct={info.correct}
          explanation={info.explanation}
          onSubmit={onSubmit}
        />
      );
      break;
    case "agree-slider":
      input = (
        <AgreeSlider
          tag={tag}
          statement={info.statement}
          min={info.min}
          max={info.max}
          onSubmit={onSubmit}
        />
      );
      break;
    case "free-text":
      input = (
        <FreeText tag={tag} statement={info.statement} onSubmit={onSubmit} />
      );
      break;
    case "multiple-choice":
      input = (
        <MultipleChoice
          tag={tag}
          statement={info.statement}
          choices={info.choices}
          onSubmit={onSubmit}
        />
      );
      break;
    default:
      input = <div>Unknown quiz type: {type}</div>;
      break;
  }

  return input;
}

export default quizFactory;
