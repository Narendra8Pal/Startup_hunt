import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type imgURLState = {
  imgURL: boolean;
};
const initialState: imgURLState = {
  imgURL: false,
};

const imgURLSlice = createSlice({
  name: "imgURL",
  initialState,
  reducers: {
    setImgUrl: (state, action) => {
      state.imgURL = action.payload;
    },
  },
});

export const { setImgUrl } = imgURLSlice.actions;
export default imgURLSlice.reducer;
