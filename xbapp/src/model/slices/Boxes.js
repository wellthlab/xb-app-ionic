import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    boxes: [
        {
            _box_id: 3277,
            _approved: true,
            name: "DemonstrationBox",
            blurb: "created for test",
            description: "sleep short description",
            warning: "warning",
            category: "Engage",
            experiment_groups: [true, true]
        },
        {
            _box_id: 3277,
            _approved: true,
            name: "DanceBetter",
            blurb: "created for test",
            description: "dance short description",
            warning: "warning",
            category: "Move",
            experiment_groups: [true, true]
        }
    ]
};

/**
 * The experiment slice handles experiments that the user is part of.
 * ALL experiments are actually groups; even if the user is the only member!
 * So this slice most closely relates to the "group" collection in MongoDB
 *
 */
const BoxSlice = createSlice({
    name: 'boxes',
    initialState,
    reducers: {
        // Add an experiment to the list
        AddBox(state, action) {
            const box = action.payload.box;
            state.boxes.push(box);

            // TODO: Add experiment information to group

            // TODO: Calculate things like overdue entries, day number
        }
    }
})

export const { AddBox } = BoxSlice.actions

export default BoxSlice.reducer
