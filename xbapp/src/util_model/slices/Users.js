import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userProfile: null,
    fetching: false,
    loaded: false,
}

const UserProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        CLEAR_USER(state, action) {
            state.userProfile = null;
            state.fetching = true;
            state.loaded = false;
        },
        SET_USER(state, action) {
            state.userProfile = action.payload.userProfile;;
            state.fetching = false;
            state.loaded = true;
        }
    }
})

export const {
    CLEAR_USER,
    SET_USER,
} = UserProfileSlice.actions;

export default UserProfileSlice.reducer;
