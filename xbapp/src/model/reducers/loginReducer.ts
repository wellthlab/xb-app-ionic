
import { createSlice } from '@reduxjs/toolkit'

const initialState = []

// See: https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#using-createslice
const todosSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loggedIn(state, action) {
            //createSlice allows us to safely mutate state, because it's really a proxy ;)
            state.loggedin = true;
        },
        loggedOut(state, action) {
            state.loggedin = false;
        }
    }
})

export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions

export default todosSlice.reducer
