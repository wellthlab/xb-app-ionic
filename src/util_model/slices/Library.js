import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    library: [],
    fetching: false,
    loaded: false,
}

const LibrarySlice = createSlice({
    name: 'library',
    initialState,
    reducers : {
        CLEAR_LIBRARY(state, action) {
            state.fetching = true;
            state.loaded = false;
            state.library = [];
        },
        SET_LIBRARY(state, action) {
            state.fetching = false;
            state.loaded = true;
            state.library = action.payload.library;
        },
    }
});

export const {
    CLEAR_LIBRARY,
    SET_LIBRARY,
} = LibrarySlice.actions;

export default LibrarySlice.reducer;