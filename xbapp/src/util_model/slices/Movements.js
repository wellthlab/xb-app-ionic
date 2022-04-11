import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    movements: [],
    fetching: false,
    loaded: false
}

const MovementsSlice = createSlice({
    name: "movements",
    initialState,
    reducers: {
        CLEAR_MOVES(state, action) {
            state.fetching = true;
            state.loaded = false;
            state.movements = [];
        },
        SET_MOVES(state, action) {
            state.movements = action.payload.movements;
            state.fetching = false;
            state.loaded = true;
        },
    }
});

export const {
    CLEAR_MOVES,
    SET_MOVES,
} = MovementsSlice.actions;

export default MovementsSlice.reducer;


