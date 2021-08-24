import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import Account from "./slices/Account";
import Teams from "./slices/Teams";
import Experiments from "./slices/Experiments";
import Feed from "./slices/Feed";

// See: https://redux-toolkit.js.org/api/configureStore
var store = configureStore({
  reducer: combineReducers({
    account: Account,
    teams: Teams,
    experiments: Experiments,
    feed: Feed
  }),

  // Disable warnings about passing nonserializable values into actions
  // see: https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
  middleware: getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: ["your/action/type"],
      // Ignore these field paths in all actions
      ignoredActionPaths: ["payload.*._id"], // Doesn't work :(
      // Ignore these paths in the state
      ignoredPaths: [],
    },
  }),
});

export default store;
