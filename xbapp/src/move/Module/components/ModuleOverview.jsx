import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectModuleById } from "../../slice";
import XBInfo from "../../../util/XBInfo";

const ModuleOverview = function () {
  const { moduleId } = useParams();

  const xbModule = useSelector((state) => selectModuleById(state, moduleId));

  return (
    <XBInfo
      title={xbModule.name.toUpperCase()}
      desc={xbModule.desc || "No description avaiable"}
    />
  );
};

export default ModuleOverview;
