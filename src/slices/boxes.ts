import { createSelector, createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import { IBox } from '../models/Box';
import { selectSubscribedBoxes } from './account';

interface ISelectorState {
    boxes: IBoxesState;
}

interface IBoxesState {
    items: Record<string, IBox>;
    all: string[];
}

export const selectAllBoxes = (state: ISelectorState) => state.boxes.all.map((name) => selectBoxByName(state, name));
export const selectAllBoxesByName = (state: ISelectorState) => state.boxes.items;
export const selectBoxByName = (state: ISelectorState, name: string) => state.boxes.items[name];
export const selectTask = (state: ISelectorState, name: string, dayId: number, taskId: number) =>
    state.boxes.items[name].days[dayId].tasks[taskId];

export const selectCurrentDay = createSelector(
    selectSubscribedBoxes,
    (_: ISelectorState, name: string) => name,
    (subs, name) => {
        const subscription = subs.find((sub) => sub.box === name);
        if (!subscription) {
            return 0;
        }

        const startOfCurrentDayTs = new Date().setUTCHours(0, 0, 0, 0);
        const startOfSubscriptionDayTs = new Date(subscription.subscribedAt).setUTCHours(0, 0, 0, 0);

        const oneDay = 24 * 60 * 60 * 1000;
        return (startOfCurrentDayTs - startOfSubscriptionDayTs) / oneDay;
    },
);

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
