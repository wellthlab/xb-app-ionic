import { configureStore, combineReducers } from '@reduxjs/toolkit';
import Account from './slices/Account';


// See: https://redux-toolkit.js.org/api/configureStore
export default configureStore({
    reducer: combineReducers({account: Account})
});
