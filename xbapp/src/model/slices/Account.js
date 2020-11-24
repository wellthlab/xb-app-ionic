import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loggedin: true,
    email: null,
    password: null,
    name: ""
}

// See: https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#using-createslice
const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        LOG_IN(state, action) {
            //createSlice allows us to safely mutate state, because it's really a proxy ;)
            state.loggedin = true;
            state.email = action.payload.email;
            state.password = action.payload.password;
            state.name = "Anonymous Test User";

            //
        },
        LOG_OUT(state, action) {
            state.loggedin = false;
            state.email = null;
            state.name = "";
            state.password = null;
        }
    }
})

export const { LOG_IN, LOG_OUT } = accountSlice.actions

export default accountSlice.reducer
