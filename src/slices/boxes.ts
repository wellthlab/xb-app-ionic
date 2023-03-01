import { createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import { IBox } from '../models/Box';

interface ISelectorState {
    boxes: IBoxesState;
}

interface IBoxesState {
    items: Record<string, IBox>;
    all: string[];
}

export const selectAllBoxes = (state: ISelectorState) => state.boxes.all.map((name) => selectBoxByName(state, name));
export const selectBoxByName = (state: ISelectorState, name: string) => state.boxes.items[name];

export default createSlice({
    name: 'boxes',
    initialState: { items: {}, all: [] } as IBoxesState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {
                state.items = {};
                state.all = [];

                for (const box of action.payload.boxes) {
                    const originalLength = box.days.length;
                    if (originalLength < box.duration) {
                        let day = 0;

                        for (let i = 0; i < box.duration - originalLength; i++) {
                            box.days.push({ ...box.days[day] });
                            day++;

                            if (day === originalLength) {
                                day = 0;
                            }
                        }
                    }

                    for (let i = 0; i < box.days.length; i++) {
                        const isFirstDay = i === 0;
                        const isLastDay = i === box.days.length - 1;

                        box.days[i].tasks = box.days[i].tasks.filter(
                            (task) =>
                                !task.hideIf ||
                                (task.hideIf === 'isFirstDay' && !isFirstDay) ||
                                (task.hideIf === 'isLastDay' && !isLastDay),
                        );
                    }

                    state.items[box.name] = box;
                    state.all.push(box.name);
                }
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
