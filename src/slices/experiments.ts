import { createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import { IExperiment } from '../models/Experiment';
import { selectSubscriptions, ISelectorState as IAccountSelectorState, selectProgress } from './account';

interface ISelectorState {
    experiments: IExperimentState;
}

interface IExperimentState {
    items: Record<string, IExperiment>;
    all: string[];
}

export const selectAllExperiments = (state: ISelectorState) =>
    state.experiments.all.map((experimentId) => selectExperiment(state, experimentId));
export const selectExperimentByBox = (state: ISelectorState, type: string) =>
    selectAllExperiments(state).filter(({ box }) => box === type);
export const selectAllExperimentsById = (state: ISelectorState) => state.experiments.items;
export const selectExperiment = (state: ISelectorState, experimentId: string) => state.experiments.items[experimentId];
export const selectTask = (state: ISelectorState, experimentId: string, dayId: number, taskId: number) =>
    state.experiments.items[experimentId].days[dayId].tasks[taskId];

export const selectCurrentDay = (state: IAccountSelectorState & ISelectorState, experimentId: string) => {
    const subscriptions = selectSubscriptions(state);
    const subscription = subscriptions[experimentId];
    if (!subscription) {
        return 0;
    }

    const startOfCurrentDayTs = new Date().setUTCHours(0, 0, 0, 0);
    const startOfSubscriptionDayTs = new Date(subscription.subscribedAt).setUTCHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000;
    return (startOfCurrentDayTs - startOfSubscriptionDayTs) / oneDay;
};

const getDayProgress = function (progress: boolean[][]) {
    return progress.map((dayProgress) => dayProgress.reduce((acc, curr) => acc && curr, true));
};

export const selectDayProgress = (state: IAccountSelectorState & ISelectorState, experimentId: string) => {
    const progress = selectProgress(state, experimentId);
    return getDayProgress(progress);
};

export const selectCompletionByExperimentId = (state: IAccountSelectorState & ISelectorState) => {
    const subscriptions = selectSubscriptions(state);
    const percentages: Record<string, number> = {};

    for (const [key, { progress }] of Object.entries(subscriptions)) {
        const experiment = selectExperiment(state, key);
        const dayCompleted = getDayProgress(progress).filter((day) => day).length;
        percentages[key] = (dayCompleted / experiment.days.length) * 100;
    }

    return percentages;
};

export default createSlice({
    name: 'experiments',
    initialState: { items: {}, all: [] } as IExperimentState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {
                state.items = {};
                state.all = [];

                for (const experiment of action.payload.experiments) {
                    const originalLength = experiment.days.length;
                    if (originalLength < experiment.duration) {
                        let day = 0;

                        for (let i = 0; i < experiment.duration - originalLength; i++) {
                            experiment.days.push(experiment.days[day]);
                            day++;

                            if (day === originalLength) {
                                day = 0;
                            }
                        }
                    }

                    state.items[experiment.id] = experiment;
                    state.all.push(experiment.id);
                }
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
