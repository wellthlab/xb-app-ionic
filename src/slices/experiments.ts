import { createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import { GenericExperiment, IBox, IDay, IExperiment, IParentExperiment } from '../models/Experiment';
import { selectSubscriptions, ISelectorState as IAccountSelectorState, selectProgress } from './account';

export interface ISelectorState {
    experiments: IExperimentState;
}

interface IExperimentState {
    items: Record<string, GenericExperiment>;
    all: string[];
    boxes: IBox[];
}

export const selectBoxes = (state: ISelectorState) => state.experiments.boxes;

export const selectAllExperiments = (state: ISelectorState) =>
    state.experiments.all.map((experimentId) => selectExperiment(state, experimentId));

export const selectExperimentByBox = (state: ISelectorState, type: string) =>
    selectAllExperiments(state).filter(({ box }) => box === type);

export const selectAllExperimentsById = (state: ISelectorState) => state.experiments.items;

export const selectExperiment = (state: ISelectorState, experimentId: string) => state.experiments.items[experimentId];

export const selectTask = (state: ISelectorState, experimentId: string, dayId: number, taskId: number) =>
    (state.experiments.items[experimentId] as IExperiment).days[dayId].tasks[taskId];

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

const getDayProgress = (progress: boolean[][]) => {
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
        const experiment = selectExperiment(state, key) as IExperiment;
        const dayCompleted = getDayProgress(progress).filter((day) => day).length;
        percentages[key] = (dayCompleted / experiment.days.length) * 100;
    }

    return percentages;
};

interface ITodayTasks {
    id: string;
    name: string;
    day: number;
    content: IDay;
    instructions?: string[];
}

export const selectTodaysTasks = (state: IAccountSelectorState & ISelectorState) => {
    const subscriptions = selectSubscriptions(state);

    const tasksByExperiment: ITodayTasks[] = [];
    const experimentsByParent: Record<string, ITodayTasks[]> = {};

    for (const experimentId of Object.keys(subscriptions)) {
        const currentDay = selectCurrentDay(state, experimentId);
        const experiment = selectExperiment(state, experimentId) as IExperiment;

        if (currentDay > experiment.days.length - 1) {
            continue;
        }

        // Skip if the day is empty

        if (!experiment.days[currentDay].tasks.length) {
            continue;
        }

        // Deal with children experiments

        if (experiment.parent) {
            // First find the corresponding parent experiment

            const parent = selectExperiment(state, experiment.parent) as IParentExperiment;

            // Find the accummulated children array

            let children = experimentsByParent[experiment.parent];
            if (!children) {
                children = experimentsByParent[experiment.parent] = [];
            }

            // Insert to the correct position to preserve order of children experiments

            children[parent.children.indexOf(experiment.id)] = {
                id: experiment.id,
                name: experiment.name,
                day: currentDay,
                content: experiment.days[currentDay],
                instructions: experiment.instructions,
            };

            continue;
        }

        tasksByExperiment.push({
            id: experiment.id,
            name: experiment.name,
            day: currentDay,
            content: experiment.days[currentDay],
            instructions: experiment.instructions,
        });
    }

    // Deal with children experiments

    for (const children of Object.values(experimentsByParent)) {
        tasksByExperiment.unshift(...children);
    }

    return tasksByExperiment;
};

export default createSlice({
    name: 'experiments',
    initialState: { boxes: [], items: {}, all: [] } as IExperimentState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {
                state.boxes = action.payload.boxes;

                state.items = {};
                state.all = [];

                for (const experiment of action.payload.experiments) {
                    if (!('children' in experiment)) {
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
                    }

                    state.items[experiment.id] = experiment;
                    state.all.push(experiment.id);
                }
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
