import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userName";
import usersDocIdReducer from "./usersDocId";
import imgURLReducer from "./imgURL";
import getProjReducer from "./getProj";
import showDocIdIconReducer from "./docIdIcon";

export const store = configureStore({
  reducer: {
    userName: userReducer,
    usersDocId: usersDocIdReducer,
    imgURL: imgURLReducer,
    getProj: getProjReducer,
    showDocIdIcon: showDocIdIconReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
