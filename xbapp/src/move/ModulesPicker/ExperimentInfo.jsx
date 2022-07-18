import React from "react";

import XBInfo from "../../util/XBInfo";

const teamsLink =
  "https://teams.microsoft.com/l/channel/19%3ab869ef6a42f14acd95036bd40" +
  "5f131c7%40thread.tacv2/app%2520discussion?groupId=11c4aee6-b0d1-4221" +
  "-adbe-1350280f6ef0&tenantId=4a5378f9-29f4-4d3e-be89-669d03ada9d8";

const ExperimentInfo = function () {
  return (
    <XBInfo title="Welcome to XB!">
      Welcome to the XB{" "}
      <strong>
        <u>beta</u>
      </strong>{" "}
      app, we're glad you're here! Please report any bugs and share any
      feedback/suggestions in the{" "}
      <a href={teamsLink}>sinwork-discussion team</a>
    </XBInfo>
  );
};

export default ExperimentInfo;
