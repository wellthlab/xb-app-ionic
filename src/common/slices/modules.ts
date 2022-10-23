import { createSelector, createSlice } from '@reduxjs/toolkit';

import { boot, logOut } from './globalActions';
import { selectModules } from './account';
import { IModule, ITask, IPlaylist } from '../models/Box';

interface IEnhancedTask extends ITask {
    id: string;
}

interface IEnhancedPlaylist extends IPlaylist {
    tasks: IEnhancedTask[];
}

interface IEnhancedModule extends IModule {
    playlists: IEnhancedPlaylist[];
}

interface IModulesState {
    items: Record<string, IEnhancedModule>;
    byBox: Record<string, string[]>;
}

interface ISelectorState {
    modules: IModulesState;
}

export const selectModuleById = (state: ISelectorState, id: string): IEnhancedModule | undefined =>
    state.modules.items[id];

const selectModuleIds = (state: ISelectorState, box: string) => state.modules.byBox[box];

export const selectModulesByBox = createSelector(selectModuleIds, selectModules, (moduleIds, subscribedModuleIds) => {
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
});

export const selectTask = (
    state: ISelectorState,
    moduleId: string,
    playlistId: number,
    taskId: number,
): IEnhancedTask | undefined => state.modules.items[moduleId]?.playlists[playlistId]?.tasks[taskId];

export default createSlice({
    name: 'modules',
    initialState: { items: {}, byBox: {} } as IModulesState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(boot.fulfilled, (state, action) => {
                const byBox: IModulesState['byBox'] = {};
                for (const module of action.payload.modules) {
                    state.items[module.id] = module as IEnhancedModule;

                    for (let i = 0; i < module.playlists.length; i++) {
                        const playlist = module.playlists[i];
                        for (let j = 0; j < playlist.tasks.length; j++) {
                            state.items[module.id].playlists[i].tasks[j].id = j.toString();
                        }
                    }

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
