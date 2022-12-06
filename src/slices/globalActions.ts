import { createAsyncThunk } from '@reduxjs/toolkit';

import Account from '../models/Account';
import Team from '../models/Team';
import Box from '../models/Box';

export const boot = createAsyncThunk('global/boot', async () => {
    const [account, team, modules, boxes] = await Promise.all([
        Account.getDetails(),
        Team.getCurrentTeam(),
        Box.getAllModules(),
        Box.getBoxes(),
    ]);

    return {
        account,
        team,
        modules,
        boxes,
    };
});

export const logOut = createAsyncThunk('global/loggedOut', async () => {
    return Account.logOut();
});
