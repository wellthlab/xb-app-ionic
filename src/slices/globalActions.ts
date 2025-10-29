import { createAsyncThunk } from '@reduxjs/toolkit';

import Account from '../models/Account';
import Experiment from '../models/Experiment';

export const boot = createAsyncThunk('global/boot', async (lang: string) => {
    const [account, experiments, boxes] = await Promise.all([
        Account.getDetails(),
        Experiment.getExperiments(lang),
        Experiment.getBoxes(lang),
    ]);

    return {
        account,
        experiments,
        boxes,
    };
});

export const logOut = createAsyncThunk('global/loggedOut', async () => {
    return Account.logOut();
});
