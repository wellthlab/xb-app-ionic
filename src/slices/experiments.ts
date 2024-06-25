import { createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import { GenericExperiment, IBox, IDay, IExperiment, IParentExperiment, ITask } from '../models/Experiment';
import { selectSubscriptions, ISelectorState as IAccountSelectorState, selectResponses } from './account';

export interface ISelectorState {
    experiments: IExperimentState;
}

interface IExperimentState {
    experiments: Record<string, GenericExperiment>;
    boxes: Record<string, IBox>;
}

export const selectAllBoxes = (state: ISelectorState) => Object.values(state.experiments.boxes);

export const selectAllExperiments = (state: ISelectorState) => state.experiments.experiments;

export const selectExperimentByBoxName = (state: ISelectorState, boxName: string) => {
    const boxId = state.experiments.boxes[boxName].id;
    const experiments =  Object.values(selectAllExperiments(state));
    return experiments.filter((experiment) => experiment.boxId === boxId);
}

export const selectExperimentById = (state: ISelectorState, experimentId: string) => state.experiments.experiments[experimentId];

export const selectBoxByType = (state: ISelectorState, type: string) => state.experiments.boxes[type];

export const selectBoxByExperimentId = (state: ISelectorState, experimentId: string) => {
    const boxId = state.experiments.experiments[experimentId].boxId;
    return Object
            .entries(selectAllBoxes(state))
            .filter(([boxName, box]) => box.id === boxId)
            .map(([boxName, box]) => box)[0];
}

export const selectTask = (state: ISelectorState, experimentId: string, dayNum: number, taskNum: number) =>
    (state.experiments.experiments[experimentId] as IExperiment).days[dayNum].tasks[taskNum];

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

export const selectProgressByDayNumAndTasks = (state: IAccountSelectorState & ISelectorState, tasks: ITask[], dayNum: number) => {
    const responses = selectResponses(state);
    const responseCountByDayNumAndTaskIds: number[] = [];

    tasks.forEach(task => {
        const responseCount = Object
            .values(responses)
            .flat()
            .filter(response => response.taskId ===  task.taskId && response.dayNum === dayNum &&
                (response.inactiveSubscription !== undefined && !response.inactiveSubscription)).length;
        responseCountByDayNumAndTaskIds.push(responseCount);
    })
    return responseCountByDayNumAndTaskIds;
};

export const selectDayProgress = (state: IAccountSelectorState & ISelectorState, experimentId: string) => {
    const experiment = selectExperimentById(state, experimentId) as IExperiment;
    const subscription = selectSubscriptions(state)[experimentId];

    if (subscription &&  selectResponses(state)[subscription.id]) {
        const dayProgress: boolean[] = Array(experiment.days.length).fill(true);
        const responses = selectResponses(state)[subscription.id];

        experiment.days.forEach((day, dayIndex) => {
            if (day.tasks.length === 0) {
                dayProgress[dayIndex] = false;
            } else {
                day.tasks.forEach((task) => {
                    const responseCount = responses
                        .filter(response => response.taskId === task.taskId && response.dayNum === dayIndex &&
                            (response.inactiveSubscription !== undefined && !response.inactiveSubscription)).length;
                     const taskCompleted = task.isRepeatable && task.minRepeats &&  responseCount >= task.minRepeats
                         || responseCount === 1 ;
                    dayProgress[dayIndex] = taskCompleted;
                })
            }
        });
        return dayProgress;
    } else {
        return Array(experiment.days.length).fill(false);
    }
};

export const selectCompletionForAllExperiments = (state: IAccountSelectorState & ISelectorState) => {
    const percentages: Record<string, number> = {};
    for (const [experimentId, experiment] of Object.entries(state.experiments.experiments)) {
        if (!('children' in experiment)) {
            const dayProgress = selectDayProgress(state, experimentId);
            const daysCompleted =   dayProgress.filter(isComplete => isComplete).length;
            percentages[experimentId] = (daysCompleted / (experiment as IExperiment).days.length) * 100;
        }
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
        const experiment = selectExperimentById(state, experimentId) as IExperiment;

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

            const parent = selectExperimentById(state, experiment.parent) as IParentExperiment;

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
        tasksByExperiment.unshift(...children.filter((child) => child));
    }

    return tasksByExperiment;
};

export default createSlice({
    name: 'experiments',
    initialState: { experiments: {}, boxes: {} } as IExperimentState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {

                for (const box of action.payload.boxes) {
                    state.boxes[box.name] = box;
                }

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
                    state.experiments[experiment.id] = experiment;
                }
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
