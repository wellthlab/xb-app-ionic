import { configureStore, combineReducers } from '@reduxjs/toolkit';
import accountReducer from './reducers/accountReducer';


// See: https://redux-toolkit.js.org/api/configureStore
export default configureStore({
    reducer: combineReducers({account: accountReducer})
});
