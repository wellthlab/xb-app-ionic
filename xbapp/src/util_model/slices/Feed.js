import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feed: [],
  fetching: false,
  loaded: false,
};

/**
 * The feed slice handles content for the content feed.
 */
const Slice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    // Clear the feed and set the fetching flags
    CLEAR_FEED(state, actions) {
      state.fetching = true;
      state.feed = [];
      state.loaded = false;
    },
    // Replace the contents of the feed with the payload
    SET_FEED(state, action) {
      state.fetching = false;
      state.feed = action.payload;
      state.loaded = true;
    },
    // Add an array of items to the feed
    ADD_FEED(state, action) {
      for (var i of action.payload) state.feed.push(i);
    },
    // Remove items from the feed
    // Payload is an array of items to remove
    // Matching is dne based on id
    REMOVE_FEED(state, action) {
      for (var i in state.feed) {
        for (var j of action.payload) {
          if (j.id == state.feed[i].id) {
            state.feed[i] = undefined;
          }
        }
      }
    },
  },
});

export const { CLEAR_FEED, SET_FEED, ADD_FEED } = Slice.actions;

export default Slice.reducer;
