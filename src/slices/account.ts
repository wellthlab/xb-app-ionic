import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import Account, { ICredentials, IProfile, IAccount, IBoxSubscription } from '../models/Account';

export const authenticateUser = createAsyncThunk('account/authenticated', (credentials: ICredentials) => {
    return Account.authenticate(credentials);
});

export const registerUser = createAsyncThunk('account/registered', async (credentials: ICredentials) => {
    await Account.create(credentials);
    return Account.authenticate(credentials);
});

export const updateUserProfile = createAsyncThunk(
    'account/profile/updated',
    (payload: Omit<IProfile, 'id' | 'email'>) => {
        return Account.updateProfile(payload);
    },
);

export const subscribeToBox = createAsyncThunk<IBoxSubscription | undefined, string, { state: ISelectorState }>(
    'account/boxes/subscribed',
    (box, { getState }) => {
        const boxes = selectSubscribedBoxNames(getState());

        if (boxes.includes(box)) {
            return;
        }

        return Account.subscribeToBox(box);
    },
);

export const markAccountAsDeleted = createAsyncThunk('account/deleted', async () => {
    return Account.markAsDeleted();
});

export const updateProgress = createAsyncThunk(
    'account/updateProgress',
    async ({ box, dayId, taskId }: { box: string; dayId: number; taskId: number }) => {
        await Account.updateProgress(box, dayId, taskId);
        return { box, dayId, taskId };
    },
);

interface IAccountState {
    id?: string;
    profile?: IProfile;
    boxes: IAccount['boxes'];
    deleted?: boolean;
}

interface ISelectorState {
    account: IAccountState;
}

export const selectIsAuthenticated = (state: ISelectorState) => !!state.account.id;
export const setIsEnrolled = (state: ISelectorState) => !!state.account.profile;
export const selectProfile = (state: ISelectorState) => state.account.profile;
export const selectIsDeleted = (state: ISelectorState) => state.account.deleted;
export const selectSubscribedBoxNames = (state: ISelectorState) => state.account.boxes.map((subs) => subs.box);
export const selectSubscribedBoxes = (state: ISelectorState) => state.account.boxes;
export const selectProgress = (state: ISelectorState, box: string) =>
    state.account.boxes.find((sub) => sub.box === box)?.progress;
export const selectUserId = (state: ISelectorState) => state.account.id;
export const selectDepartment = (state: ISelectorState) => state.account.profile?.department;
export const selectFullName = (state: ISelectorState) =>
    state.account.profile ? state.account.profile.firstName + ' ' + state.account.profile.lastName : null;

export default createSlice({
    name: 'account',
    initialState: { id: Account.persistedId, boxes: [] } as IAccountState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.id = action.payload.id;
                }
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.id = action.payload.id;
                }
            })
            .addCase(markAccountAsDeleted.fulfilled, (state) => {
                state.deleted = true;
            })
            .addCase(boot.fulfilled, (state, action) => {
                if (action.payload.account) {
                    const { boxes, profile, deleted } = action.payload.account;
                    state.profile = profile;
                    state.boxes = boxes;
                    state.deleted = deleted;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            })
            .addCase(boot.rejected, (state) => {
                // Failed to boot for whatever reason, we set authenticated to false

                state.boxes = [];
                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(logOut.fulfilled, (state) => {
                state.boxes = [];
                delete state.id;
                delete state.profile;
                delete state.deleted;
            })
            .addCase(subscribeToBox.fulfilled, (state, action) => {
                if (action.payload) {
                    state.boxes.push(action.payload);
                }
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                for (const sub of state.boxes) {
                    if (sub.box === action.payload.box) {
                        let dayProgress = sub.progress[action.payload.dayId];

                        if (!dayProgress) {
                            dayProgress = sub.progress[action.payload.dayId] = [];
                        }

                        dayProgress[action.payload.taskId] = true;
                    }
                }
            });
    },
}).reducer;
