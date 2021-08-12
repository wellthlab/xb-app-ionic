import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  experiments: [],
  fetching: false,
};

/**
 * The experiment slice handles experiments that the user is part of.
 * ALL experiments are actually groups; even if the user is the only member!
 * So this slice most closely relates to the "group" collection in MongoDB
 *
 */
const Slice = createSlice({
  name: "experiments",
  initialState,
  reducers: {
    CLEAR_EXPERIMENTS(state, actions) {
      state.fetching = true;
      state.experiments = [];
    },
    // Add an experiment to the list
    SET_EXPERIMENTS(state, action) {
      state.fetching = false;
      const exps = action.payload.exps;
      state.experiments = exps;

      // Summarise experiments by type for easy lookup
      state.experiments.bybox = { eat: false, move: false};


      for(var e of state.experiments) {
        if(typeof e.info.boxType !== 'undefined') {
          state.experiments.bybox[e.info.boxType].push(e);
        }
      }
    },
  },
});

export const { CLEAR_EXPERIMENTS, SET_EXPERIMENTS } = Slice.actions;

export default Slice.reducer;
