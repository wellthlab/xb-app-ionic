import { configureStore, combineReducers } from '@reduxjs/toolkit';
import Account from './slices/Account';
import Groups from './slices/Groups';
import Boxes from './slices/Boxes';

import XBClient from './client'

// See: https://redux-toolkit.js.org/api/configureStore
export default configureStore({
    reducer: combineReducers({account: Account, groups: Groups, boxes: Boxes})
});


    var client = new XBClient();
    client.setUser('test@xebre.net', 'AJ>#<{Z6`~uPN{ca').then( (u) => {
        console.log("Logged in to realm", u);

        // Test group fetching
        client.getGroups().then((g) => {
            console.log("Got groups", g);
        });


    } );


//export {};
