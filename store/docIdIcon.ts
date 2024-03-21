import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type imgURLState = {
  showDocIdIcon: boolean;
};
const initialState: imgURLState = {
  showDocIdIcon: false,
};

const showDocIdIconSlice = createSlice({
  name: "showDocIdIcon",
  initialState,
  reducers: {
    setShowDocIdIcon: (state, action) => {
      state.showDocIdIcon = action.payload;
    },
  },
});

export const { setShowDocIdIcon } = showDocIdIconSlice.actions;
export default showDocIdIconSlice.reducer;
