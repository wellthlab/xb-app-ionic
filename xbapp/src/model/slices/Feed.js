import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    feed: [
        {
            type: 'team_update', // Required
            id: '23823752365675213', // required, must be unique
            content: "Brenda Q logged 15 box squats" // Example - individual types can have their own fields
        }
    ],
    fetching: false
};

/**
 * The experiment slice handles experiments that the user is part of.
 * ALL experiments are actually groups; even if the user is the only member!
 * So this slice most closely relates to the "group" collection in MongoDB
 *
 */
const Slice = createSlice({
    name: 'experiments',
    initialState,
    reducers: {
        // Clear the feed and set the fetching flags
        CLEAR_FEED(state, actions) {
            state.fetching = true;
            state.feed = [];
        },
        // Replace the contents of the feed with the payload
        SET_FEED(state, action) {
            state.fetching = false;
            const feed = action.payload;
            state.feed = feed;
        },
        // Add an array of items to the feed
        ADD_FEED(state, action) {
            for(var i of action.payload)
                state.feed.push(i);
        },
        // Remove items from the feed
        // Payload is an array of items to remove
        // Matching is dne based on id
        REMOVE_FEED(state, action) {
            for(var i in state.feed) {
                for(var j of action.payload) {
                    if(j.id == state.feed[i].id) {
                        state.feed[i] = undefined;
                    }
                }
            }
        }
    }
})

export const { CLEAR_FEED, SET_FEED } = Slice.actions

export default Slice.reducer
