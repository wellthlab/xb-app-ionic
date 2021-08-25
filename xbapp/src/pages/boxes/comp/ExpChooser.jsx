/**
 * Choose and enrol in sub-experiments
 */

import { connect } from "react-redux";
import WithXBSlice from "../../components/util/WithXBSlice";
import { addControllersProp } from "../../model/controllers";

const ExpChooser = ({ experiment }) => {

  // Find eligible experiments
  // These should be assembled in the model

}


export default connect(
  (state, ownProps) => {
    return {
      teams: state.teams,
      experiments: state.experiments,
    };
  },
  {
    // Actions to include as props
  }
)(addControllersProp(WithXBSlice("teams", ExpChooser, ({controllers}) => { controllers.LOAD_TEAMS_IF_REQD(); })));
