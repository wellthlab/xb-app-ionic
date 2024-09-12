import { createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';

import { IExperiment, IBox, ITask } from '../models/Experiment';
import { selectSubscriptions, ISelectorState as IAccountSelectorState, selectResponses } from './account';

export interface ISelectorState {
    experiments: IExperimentState;
}

interface IExperimentState {
    experiments: Record<string, IExperiment>;
    boxes: Record<string, IBox>;
}

// Content from the prep box displayed within the experiments in other boxes as preparation content. So the
// prep box doesn't need to be displayed in the boxlist
export const selectAllBoxes = (state: ISelectorState) => Object.values(state.experiments.boxes).filter(box => box.name !== 'prep');

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
    return Object.values(state.experiments.boxes).filter(box => box.id === boxId)[0];
}

export const selectTask = (state: ISelectorState, experimentId: string, dayNum: number, taskNum: number) => {
    return (state.experiments.experiments[experimentId] as IExperiment).days[dayNum].tasks[taskNum];
}


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
                !response.inactiveSubscription).length;
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
                             !response.inactiveSubscription).length;
                     const taskCompleted = task.isRepeatable && task.minOccurences &&  responseCount >= task.minOccurences
                         || (!task.isRepeatable && responseCount === 1) ;

                     if (!taskCompleted) {
                         dayProgress[dayIndex] = false;
                     }
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
    experiment: IExperiment;
    day: number;
}

export const selectTodaysTasks = (state: IAccountSelectorState & ISelectorState) => {
    const subscriptions = selectSubscriptions(state);
    const tasksByExperiment: ITodayTasks[] = [];
    for (const experimentId of Object.keys(subscriptions)) {
        const currentDay = selectCurrentDay(state, experimentId);
        const experiment = selectExperimentById(state, experimentId) as IExperiment;
        const isSelectSubscriptionTask = experiment.days[0].tasks[0].blocks.some(block => block.type === 'select-subscription');
        const firstDayComplete  = selectDayProgress(state, experimentId)[0];

        if (currentDay > experiment.days.length - 1) {
            // This is to make sure a selectSubscription task will show up on the today screen as long as it isn't completed
            if (isSelectSubscriptionTask && !firstDayComplete) {
                tasksByExperiment.push({
                    experiment: experiment,
                    day: 0
                });
            }
            continue;
        }

        tasksByExperiment.push({
            experiment: experiment,
            day: currentDay
        });

        // on the penultimate day of an experiment users should see the prep experiment for the next experiment
        if (currentDay === experiment.days.length - 2 && experiment.nextExperiment) {
            const nextExperiment = selectExperimentById(state, experiment.nextExperiment);
            const nextExperimentPrep = selectExperimentById(state, nextExperiment.prepExperiment);
            tasksByExperiment.push({
                experiment: nextExperimentPrep,
                day: 0
            });
        }
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
