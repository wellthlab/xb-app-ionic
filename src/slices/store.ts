import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './account';
import teamReducer from './team';
import experimentsReducer from './experiments';
import onboardingReducer from './onboarding';
import studyReducer from './study';

const store = configureStore({
    reducer: {
        account: accountReducer,
        team: teamReducer,
        experiments: experimentsReducer,
        onboarding: onboardingReducer,
        study: studyReducer,
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
