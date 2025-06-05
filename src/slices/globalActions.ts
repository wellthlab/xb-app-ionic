import { createAsyncThunk } from '@reduxjs/toolkit';

import Account from '../models/Account';
import Team from '../models/Team';
import Experiment from '../models/Experiment';

export const boot = createAsyncThunk('global/boot', async (lang: string) => {
    const [account, team, experiments, boxes, allCohortNames, scheduledExperiments] = await Promise.all([
        Account.getDetails(),
        Team.getCurrentTeam(),
        Experiment.getExperiments(lang),
        Experiment.getBoxes(lang),
        Account.getAllCohortNames(),
        Account.getScheduledExperiments(),
    ]);

    const subscriptions =
        account && account.subscriptions.length > 0 ? await Account.getSubscriptions(account.subscriptions) : [];
    const responses = subscriptions.length > 0 ? await Experiment.getResponses(subscriptions.map((s) => s.id)) : {};

    return {
        account,
        team,
        experiments,
        boxes,
        subscriptions,
        responses,
        allCohortNames,
        scheduledExperiments,
    };
});

export const logOut = createAsyncThunk('global/loggedOut', async () => {
    return Account.logOut();
});
