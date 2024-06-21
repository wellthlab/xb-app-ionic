import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import Study, { IStudy } from '../models/Study';

export const loadStudy = createAsyncThunk('study/loaded', () => {
    return Study.getCurrentStudy();
});

interface ISelectorState {
    study: IStudy | null;
}

export const selectStudy = (state: ISelectorState) => state.study;

export default createSlice({
    name: 'study',
    initialState: null as IStudy | null,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(loadStudy.fulfilled, (_, action) => action.payload);
    },
}).reducer;
