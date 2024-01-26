import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userName";
import usersDocIdReducer from "./usersDocId";
import imgURLReducer from "./imgURL";

export const store = configureStore({
  reducer: {
    userName: userReducer,
    usersDocId: usersDocIdReducer,
    imgURL: imgURLReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
