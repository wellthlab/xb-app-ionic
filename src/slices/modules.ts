import { createSelector, createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import { selectSubscribedModules, selectUserId } from './account';
import { selectTeamMembers } from './team';
import { IModule, ITask } from '../models/Box';

interface IModulesState {
    items: Partial<Record<string, IModule>>;
    byBox: Partial<Record<string, string[]>>;
}

interface ISelectorState {
    modules: IModulesState;
}

export const selectModuleById = (state: ISelectorState, id: string) => state.modules.items[id];

const selectModuleIds = (state: ISelectorState, box: string) => state.modules.byBox[box];

export const selectModulesByBox = createSelector(
    selectModuleIds,
    selectSubscribedModules,
    (moduleIds, subscribedModuleIds) => {
        if (!moduleIds) {
            return;
        }

        const subscribeds = [];
        const remaining = [];

        for (const moduleId of moduleIds) {
            if (subscribedModuleIds.includes(moduleId)) {
                subscribeds.push(moduleId);
                continue;
            }

            remaining.push(moduleId);
        }

        return [subscribeds, remaining] as const;
    },
);

export const selectModuleSubcriberInitials = createSelector(
    selectTeamMembers,
    selectUserId,
    (_: ISelectorState, id: string) => id,
    (members, userId, id) => {
        if (!members) {
            return;
        }

        const initials = [];

        for (const member of members) {
            if (userId === member.id) {
                continue;
            }

            for (const subs of member.modules) {
                if (subs.id === id) {
                    const firstName = member.profile.firstName;
                    const lastName = member.profile.lastName;

                    const initial = firstName[0].toUpperCase() + lastName[0].toUpperCase();

                    initials.push({ id: member.id, initial });
                }
            }
        }

        return initials;
    },
);

export const selectPlaylistTasks = (state: ISelectorState, moduleId: string, playlistId: number) =>
    state.modules.items[moduleId]?.playlists[playlistId]?.tasks;

export const selectTask = (
    state: ISelectorState,
    moduleId: string,
    playlistId: number,
    taskId: number,
): ITask | undefined => selectPlaylistTasks(state, moduleId, playlistId)?.[taskId];

export default createSlice({
    name: 'modules',
    initialState: { items: {}, byBox: {} } as IModulesState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {
                const byBox: IModulesState['byBox'] = {};
                for (const module of action.payload.modules) {
                    state.items[module.id] = module;

                    let box = byBox[module.box];
                    if (!box) {
                        box = byBox[module.box] = [];
                    }

                    box.push(module.id);
                    state.byBox = byBox;
                }
            })
            .addCase(logOut.fulfilled, (state) => {
                state.items = {};
                state.byBox = {};
            });
    },
}).reducer;
