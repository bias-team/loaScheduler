import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './memberSlice';
import characterReducer from './characterSlice';

const store = configureStore({
  reducer: {
    member: memberReducer,
    character: characterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;