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
    },
  },
});

export const { CLEAR_EXPERIMENTS, SET_EXPERIMENTS } = Slice.actions;

export default Slice.reducer;
