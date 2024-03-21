import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type imgURLState = {
  getProj: boolean;
};
const initialState: imgURLState = {
  getProj: false,
};

const getProjSlice = createSlice({
  name: "getProj",
  initialState,
  reducers: {
    setGetProj: (state, action) => {
      state.getProj = action.payload;
    },
  },
});

export const { setGetProj } = getProjSlice.actions;
export default getProjSlice.reducer;
