import React from "react";
import parse from "html-react-parser";

const Instructions = (props) => {
  return (
    <div class="ion-text-justify" className="instructions">
      {parse(props.html)}
    </div>
  );
};

export default Instructions;
