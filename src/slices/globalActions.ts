import { createAsyncThunk } from '@reduxjs/toolkit';

import Account from '../models/Account';
import Team from '../models/Team';
import Experiment from '../models/Experiment';

export const boot = createAsyncThunk('global/boot', async () => {
    const [account, team, experiments] = await Promise.all([
        Account.getDetails(),
        Team.getCurrentTeam(),
        Experiment.getExperiments(),
    ]);

    return {
        account,
        team,
        experiments,
    };
});

export const logOut = createAsyncThunk('global/loggedOut', async () => {
    return Account.logOut();
});
