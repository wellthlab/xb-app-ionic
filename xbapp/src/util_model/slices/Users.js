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
            state.fetching = true;
            state.userProfile = null;
            state.loaded = false;
        },
        SET_USER(state, action) {
            const userProfile = action.payload.user;
            state.userProfile = userProfile;
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
