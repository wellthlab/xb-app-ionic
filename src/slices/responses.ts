import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import { logOut } from './globalActions';
import Box, { IResponse } from '../models/Box';

interface IResponsesState extends Partial<Record<string, (IResponse | undefined)[][]>> {}

interface ISelectorState {
    responses: IResponsesState;
}

export const getPlaylistResponses = createAsyncThunk(
    'modules/playlists/responses/fetched',
    async (options: { moduleId: string; playlistId: number }) => {
        const responses = await Box.getPlaylistResponses(options.moduleId, options.playlistId);
        return { ...options, responses };
    },
);

export const submitTaskResponse = createAsyncThunk(
    'modules/playlists/tasks/response/submitted',
    async (options: {
        payload: IResponse['payload'];
        moduleId: string;
        taskId: number;
        playlistId: number;
        draft: boolean;
    }) => {
        const response = await Box.submitTaskResponse(
            options.moduleId,
            options.playlistId,
            options.taskId,
            options.payload,
            options.draft,
        );

        return { ...options, response };
    },
);

export const selectPlaylistResponses = (state: ISelectorState, moduleId: string, playlistId: number) =>
    state.responses[moduleId]?.[playlistId];

export const selectTaskResponse = (state: ISelectorState, moduleId: string, playlistId: number, taskId: number) =>
    selectPlaylistResponses(state, moduleId, playlistId)?.[taskId];

export default createSlice({
    name: 'responses',
    initialState: {} as IResponsesState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getPlaylistResponses.fulfilled, (state, action) => {
                if (!action.payload.responses.length) {
                    return;
                }

                const moduleId = action.payload.moduleId;
                const playlistId = action.payload.playlistId;

                let responses = state[moduleId];
                if (!responses) {
                    responses = state[moduleId] = [];
                }

                responses[playlistId] = action.payload.responses;
            })
            .addCase(submitTaskResponse.fulfilled, (state, action) => {
                const { moduleId, taskId, playlistId, response } = action.payload;

                let responses = state[moduleId];
                if (!responses) {
                    responses = state[moduleId] = [];
                }

                let playlistResponses = responses[playlistId];
                if (!playlistResponses) {
                    playlistResponses = responses[playlistId] = [];
                }

                playlistResponses[taskId] = response;
            })
            .addCase(logOut.fulfilled, () => {});
    },
}).reducer;
