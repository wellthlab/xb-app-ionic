import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    experiments: [

    ]
};

/**
 * The experiment slice handles experiments that the user is part of.
 * ALL experiments are actually groups; even if the user is the only member!
 * So this slice most closely relates to the "group" collection in MongoDB
 *
 */
const Slice = createSlice({
    name: 'experiments',
    initialState,
    reducers: {
        // Add an experiment to the list
        AddExperiment(state, action) {
            const group = action.payload.exp;
            state.experiments.push(group);
        }
    }
})

export const { AddExperiment } = Slice.actions

export default Slice.reducer
