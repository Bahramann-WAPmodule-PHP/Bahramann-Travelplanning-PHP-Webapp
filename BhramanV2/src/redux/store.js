// BhramanV2/src/redux/store.js

import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './feature/LoginSlice'

export const store = configureStore({
  reducer: {
    LoginSlice: loginReducer, // or just `auth` or `user` — your choice
  },
});
