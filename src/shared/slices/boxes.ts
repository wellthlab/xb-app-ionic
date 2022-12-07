import { createSelector, createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import { IBox } from '../models/Box';
import { selectTeam } from './team';
import { idToTs } from '../models/utils';

interface IBoxesState extends Partial<Record<string, IBox>> {}

interface ISelectorState {
    boxes: IBoxesState;
}

export const selectBox = (state: ISelectorState, type: string) => state.boxes[type];

export const selectStage = createSelector(selectTeam, selectBox, (team, box) => {
    if (!team || !box) {
        return;
    }

    const now = Date.now();
    const createdAt = idToTs(team.id);
    const daysElapsed = Math.floor((now - createdAt) / 1000 / 3600 / 24);

    let prev;
    for (const stage of box.stages) {
        if (stage.day > daysElapsed) {
            return prev;
        }

        prev = stage;
    }

    return prev;
});

export default createSlice({
    name: 'boxes',
    initialState: {} as IBoxesState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {
                for (const box of action.payload.boxes) {
                    state[box.type] = box;
                }
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
