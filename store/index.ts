import { configureStore } from "@reduxjs/toolkit";
import docIdReducer from "./docId";

export const store = configureStore({
  reducer: {
    docId: docIdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
