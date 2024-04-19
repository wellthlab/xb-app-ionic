import { createAsyncThunk } from '@reduxjs/toolkit';

import Account, { IAccount } from '../models/Account';
import Team from '../models/Team';
import Experiment, { IResponse } from '../models/Experiment';

export const boot = createAsyncThunk('global/boot', async () => {
    const [account, team, experiments, boxes] = await Promise.all([
        Account.getDetails(),
        Team.getCurrentTeam(),
        Experiment.getExperiments(),
        Experiment.getBoxes()
    ]);

    const subscriptions = account && account.subscriptions.length > 0 ? await Account.getSubscriptions(account.subscriptions) : [];
    const responses = subscriptions.length > 0 ? await Experiment.getResponses(subscriptions.map(s => s.id)) : {};
    return {
        account,
        team,
        experiments,
        boxes,
        subscriptions,
        responses
    };
});

export const logOut = createAsyncThunk('global/loggedOut', async () => {
    return Account.logOut();
});
