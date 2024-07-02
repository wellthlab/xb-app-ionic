import { createAsyncThunk } from '@reduxjs/toolkit';

import Account, { ICohort, ISubscription } from '../models/Account';
import Team from '../models/Team';
import Experiment, { GenericExperiment } from '../models/Experiment';
import { getNewSubscriptions } from './account';

export const boot = createAsyncThunk('global/boot', async () => {
    const [account, team, experiments, boxes, allCohortNames, scheduleExperiments] = await Promise.all([
        Account.getDetails(),
        Team.getCurrentTeam(),
        Experiment.getExperiments(),
        Experiment.getBoxes(),
        Account.getAllCohortNames(),
        Account.getScheduledExperiments()
    ]);

    const subscriptions = account && account.subscriptions.length > 0 ? await Account.getSubscriptions(account.subscriptions) : [];
    const responses = subscriptions.length > 0 ? await Experiment.getResponses(subscriptions.map(s => s.id)) : {};

    return {
        account,
        team,
        experiments,
        boxes,
        subscriptions,
        responses,
        allCohortNames,
        scheduleExperiments
    };
});

export const logOut = createAsyncThunk('global/loggedOut', async () => {
    return Account.logOut();
});

