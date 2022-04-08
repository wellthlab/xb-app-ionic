import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chosenMovements: [],
    fetching: false,
    loaded: false
}

const ChosenMovementSlice = createSlice({
    name: "chosenMovements",
    initialState,
    reducers: {
        CLEAR_MOVES(state, action) {
            state.fetching = true;
            state.loaded = false;
            state.chosenMovements = [];
        },
        SET_MOVES(state, action) {
            const moves = action.payload.moves;
            state.chosenMovements = moves;
            state.fetching = false;
            state.loaded = true;
        },
    }
});

export const {
    CLEAR_MOVES,
    SET_MOVES,
} = ChosenMovementSlice.actions;

export default ChosenMovementSlice.reducer;


