import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import Experiment, { IExperiment, IBox, IResponse } from '../models/Experiment';

export interface ISelectorState {
    experiments: IExperimentState;
}

interface IExperimentState {
    experiments: Record<string, IExperiment>;
    boxes: Record<string, IBox>;
    responses: IResponse[];
}

export const saveResponse = createAsyncThunk('responses/saved', (response: Omit<IResponse, 'createdAt'>) => {
    return Experiment.saveResponse(response);
});

// Content from the prep box displayed within the experiments in other boxes as preparation content. So the
// prep box doesn't need to be displayed in the boxlist
export const selectAllBoxes = (state: ISelectorState) =>
    Object.values(state.experiments.boxes).filter((box) => box.name !== 'prep');

export const selectAllExperiments = (state: ISelectorState) => state.experiments.experiments;

export const selectExperimentByBoxName = (state: ISelectorState, boxId: string) => {
    const experiments = Object.values(selectAllExperiments(state));
    return experiments.filter((experiment) => experiment.boxId === boxId);
};

export const selectExperimentById = (state: ISelectorState, experimentId: string) =>
    state.experiments.experiments[experimentId];

export const selectBoxByType = (state: ISelectorState, type: string) => state.experiments.boxes[type];

export const selectBoxByExperimentId = (state: ISelectorState, experimentId: string) => {
    const boxId = state.experiments.experiments[experimentId].boxId;
    return Object.values(state.experiments.boxes).filter((box) => box.id === boxId)[0];
};

export const selectResponses = (state: ISelectorState) => state.experiments.responses;

export const selectTask = (state: ISelectorState, experimentId: string, dayNum: number, taskNum: number) => {
    return (state.experiments.experiments[experimentId] as IExperiment).days[dayNum].tasks[taskNum];
};

export default createSlice({
    name: 'experiments',
    initialState: { experiments: {}, boxes: {}, responses: [] } as IExperimentState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {
                for (const box of action.payload.boxes) {
                    state.boxes[box.id] = box;
                }

                for (const experiment of action.payload.experiments) {
                    state.experiments[experiment.id] = experiment;
                }
            })
            .addCase(saveResponse.fulfilled, (state, action) => {
                state.responses = action.payload;
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
