import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    groups: [
        {
            _group_id: 3277,
            name: "Fred's HR Heroes Step Challenge",
            description: "",
            current_experiment: {
                _experiment_id: 34,
                name: "28 day movement targets",
                day: 6,
                maxdays: 28,
                instructions: "Try to get at least 15 minutes of movement each day."
            },
            users: [true,true,true]
        },
        {
            _group_id: 3083,
            name: "Blobby Blobby Blobby",
            description: "",
            current_experiment: {
                _experiment_id: 31,
                name: "14 day extreme hula-hoop workout",
                day: 3,
                maxdays: 14,
                instructions: "Take 20 minutes to hoola hoop each morning, as soon as you wake up."
            },
            users: [true]
        }
    ]
};

/**
 * The experiment slice handles experiments that the user is part of.
 * ALL experiments are actually groups; even if the user is the only member!
 * So this slice most closely relates to the "group" collection in MongoDB
 *
 */
const GroupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        // Add an experiment to the list
        ADDGROUP(state, action) {
            const group = action.payload.group;
            state.groups.push(group);

            // TODO: Add experiment information to group

            // TODO: Calculate things like overdue entries, day number
        }
    }
})

export const { AddGroup } = GroupSlice.actions

export default GroupSlice.reducer
