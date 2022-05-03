import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    modules: [],
    fetching: false,
    loaded: false,
}

const ModuleSlice = createSlice({
    name: "modules",
    initialState,
    reducers: {
        CLEAR_MODULES(state, action) {
            state.fetching = true;
            state.modules = [];
            state.loaded = false;
        },
        GET_MODULES(state, action) {
            const modules = action.payload.modules;
            state.modules = modules;
            state.fetching = false;
            state.loaded = true;
        }
    }
});

export const {
    CLEAR_MODULES,
    GET_MODULES,
} = ModuleSlice.actions;

export default ModuleSlice.reducer;
