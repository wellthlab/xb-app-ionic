import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedin: false,
  email: null,
  password: null,
  name: "",
  loginerror: false,
  fetching: false,
};

// See: https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#using-createslice
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    START_LOGIN(state, action) {
      // When a login request starts
      state.loggedin = false;
      state.fetching = true;
      state.loginerror = false;
    },
    REJECT_LOGIN(state, action) {
      // When a login request is rejected; must receive an error message
      state.loggedin = false;
      state.fetching = false;
      state.email = null;
      state.name = "";
      state.password = null;
      state.loginerror = true;
      state.loginerrormsg = action.payload;
    },
    ACCEPT_LOGIN(state, action) {
      // When a login request succeeds
      state.loggedin = true;
      state.fetching = false;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.name = "";
      state.loginerror = false;
    },
    LOG_OUT(state, action) {
      console.log("logging out");
      state.loggedin = false;
      state.fetching = false;
      state.email = null;
      state.name = "";
      state.password = null;
      state.loginerror = false;
    },
  },
});

export const {
  START_LOGIN,
  REJECT_LOGIN,
  ACCEPT_LOGIN,
  LOG_OUT,
} = accountSlice.actions;

export default accountSlice.reducer;
