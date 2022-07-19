import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import user from './userSlice';
import photos from './photoSlice';
import device from './deviceSlice';

const rootReducer = combineReducers({
    user,
    photos,
    device
})

export const makeStore = () => (
    configureStore({
        reducer: rootReducer
    })
)

export const wrapper = createWrapper(makeStore);