import React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectEnrollments } from "../slice";

const EnrollmentIdGuard = function ({ children }) {
  const { moduleId, enrollmentIndex } = useParams();

  const enrollments = useSelector((state) =>
    selectEnrollments(state, moduleId)
  );

  if (!enrollments[enrollmentIndex]) {
    return <Redirect to={`/move/${moduleId}`} />;
  }

  return children;
};

export default EnrollmentIdGuard;
