import { createAsyncThunk } from '@reduxjs/toolkit';

import Account, { ICohort, ISubscription } from '../models/Account';
import Team from '../models/Team';
import Experiment, { GenericExperiment } from '../models/Experiment';
import { getNewSubscriptions } from './account';

export const boot = createAsyncThunk('global/boot', async () => {
    const [account, team, experiments, boxes] = await Promise.all([
        Account.getDetails(),
        Team.getCurrentTeam(),
        Experiment.getExperiments(),
        Experiment.getBoxes(),
    ]);

    const subscriptions = account && account.subscriptions.length > 0 ? await Account.getSubscriptions(account.subscriptions) : [];
    const responses = subscriptions.length > 0 ? await Experiment.getResponses(subscriptions.map(s => s.id)) : {};
    const cohort = account ? await Account.getCohortDetails(account.cohortId) : null;
    const cohortExperimentsForSubscription = cohort ? getCohortExperimentsForSubscription(cohort, subscriptions, experiments) : [];

    if (cohortExperimentsForSubscription.length > 0) {
        const newSubs = await Account.subscribeToExperiments(cohortExperimentsForSubscription) as ISubscription[];
        subscriptions.push(...newSubs);
    }

    return {
        account,
        team,
        experiments,
        boxes,
        subscriptions,
        responses,
        cohort
    };
});

export const logOut = createAsyncThunk('global/loggedOut', async () => {
    return Account.logOut();
});

const getCohortExperimentsForSubscription = (cohort: ICohort, existingSubscriptions: ISubscription[], experiments: GenericExperiment[] ) => {
    const currTimeUTC = Date.now();

    const experimentsForSubscription = cohort
        .experimentSchedule
        .filter(schedule => schedule.startTimeUTC <= currTimeUTC)
        .flatMap(schedule => schedule.experiments)
        .map(experimentId =>  experiments.find(e => e.id === experimentId))
        .filter(experiment => experiment && !iSubscribedToExperiment(experiment, existingSubscriptions));

    return getNewSubscriptions(experimentsForSubscription as GenericExperiment[], currTimeUTC);
}

const iSubscribedToExperiment = (experiment: GenericExperiment, subscriptions: ISubscription[]) => {
    return subscriptions.some(subscription => subscription.experimentId === experiment.id)
        || ('children' in experiment && experiment.children.every(child => subscriptions.some(subscription => subscription.experimentId === child)));
}
