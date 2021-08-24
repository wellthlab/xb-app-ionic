import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  experiments: [],
  fetching: false,
};

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
      state.experiments.bybox = { eat: false, move: false };

      for(var e of state.experiments) {
        if(typeof e.info.boxType !== 'undefined') {
          if(typeof state.experiments.bybox[e.info.boxType] == 'undefined')
            state.experiments.bybox[e.info.boxType] = [];
          state.experiments.bybox[e.info.boxType].push(e);
        }
      }
    },
  },
});

export const { CLEAR_EXPERIMENTS, SET_EXPERIMENTS } = Slice.actions;

export default Slice.reducer;
