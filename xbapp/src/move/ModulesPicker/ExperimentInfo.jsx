import React from "react";

import XBInfo from "../../util/XBInfo";

const ExperimentInfo = function () {
  return (
    <XBInfo title="Welcome to XB!">
      Welcome to the XB{" "}
      <strong>
        <u>beta</u>
      </strong>{" "}
      app, we're glad you're here! Please report any bugs and share any
      feedback/suggestions in Microsoft Teams
    </XBInfo>
  );
};

export default ExperimentInfo;
