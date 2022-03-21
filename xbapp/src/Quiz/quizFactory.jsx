import Slider from "./components/Slider";
import FreeText from "./components/FreeText";

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
    case "slider":
      input = (
        <Slider
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
    default:
      input = <div>Unknown quiz type: {type}</div>;
      break;
  }

  return input;
}

export default quizFactory;
