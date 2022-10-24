import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './slices/account';
import teamReducer from './slices/team';
import modulesReducer from './slices/modules';
import boxesReducer from './slices/boxes';
import responsesReducer from './slices/responses';

const store = configureStore({
    reducer: {
        account: accountReducer,
        team: teamReducer,
        modules: modulesReducer,
        boxes: boxesReducer,
        responses: responsesReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: true,
            },
        }),
});

export default store;
export const useDispatch: () => typeof store.dispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useReduxSelector;
