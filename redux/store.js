import { configureStore } from '@reduxjs/toolkit'
import UserReducer from './CategoryInfo'

// enableMapSet();
export const store = configureStore({
  reducer: {
    category: UserReducer,
  },
})