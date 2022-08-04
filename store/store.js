import { configureStore } from '@reduxjs/toolkit'
import cycleReducer from './cycleSlice';
import userReducer from './userSlice';
export const store = configureStore({
  reducer: {
    cycle: cycleReducer,
    user: userReducer,
  },
})