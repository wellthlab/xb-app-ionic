import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    fetching: false,
    loaded: false,
}

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        CLEAR_USER(state, action) {
            state.fetching = true;
            state.user = null;
            state.loaded = false;
        },
        SET_USER(state, action) {
            const user = action.payload.user;
            state.user = user;
            state.fetching = false;
            state.loaded = true;
        }
    }
})

export const {
    CLEAR_USER,
    SET_USER,
} = UserSlice.actions;

export default UserSlice.reducer;
