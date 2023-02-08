import { createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import { IBox } from '../models/Box';

interface ISelectorState {
    boxes: IBox[];
}

export const selectAllBoxes = (state: ISelectorState) => state.boxes;

export default createSlice({
    name: 'boxes',
    initialState: [] as IBox[],
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (_, action) => {
                return action.payload.boxes;
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
