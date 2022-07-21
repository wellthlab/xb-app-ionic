import { combineReducers } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import Account from "./slices/Account";
import Teams from "./slices/Teams";
import Experiments from "./slices/Experiments";
import Feed from "./slices/Feed";
import Modules from "./slices/Modules";
import UserProfile from "./slices/Users";
import Library from "./slices/Library";

import {
  modulesReducer,
  enrollmentsReducer,
  responsesReducer,
  lockInvalidatorsReducer,
} from "../move";

var store = configureStore({
  reducer: {
    account: Account,
    teams: Teams,
    experiments: Experiments,
    feed: Feed,
    modules: Modules,
    userProfile: UserProfile,
    library: Library,

    $s22: combineReducers({
      modules: modulesReducer,
      enrollments: enrollmentsReducer,
      responses: responsesReducer,
      _lockInvalidators: lockInvalidatorsReducer,
    }),
  },

  // Disable warnings about passing nonserializable values into actions
  // see: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // Ignore these field paths in all actions
      ignoredActionPaths: ["payload.*._id"], // Doesn't work :(
      // Ignore these paths in the state
      ignoredPaths: [],
    },
  }),
});

export default store;
