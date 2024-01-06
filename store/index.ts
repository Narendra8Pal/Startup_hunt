import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userName";
import usersDocIdReducer from "./usersDocId";

export const store = configureStore({
  reducer: {
    userName: userReducer,
    usersDocId: usersDocIdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
