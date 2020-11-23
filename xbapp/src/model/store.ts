import { configureStore, combineReducers } from '@reduxjs/toolkit';
import Account from './slices/Account';
import Groups from './slices/Groups';
import Boxes from './slices/Boxes';

// See: https://redux-toolkit.js.org/api/configureStore
export default configureStore({
    reducer: combineReducers({account: Account, groups: Groups, boxes: Boxes})
});
