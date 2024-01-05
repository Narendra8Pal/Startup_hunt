import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserState = {
  docId: string;
};
const initialState: UserState = {
  docId: "",
};

const docIdSlice = createSlice({
  name: "docId",
  initialState,
  reducers: {
    setDocId: (state, action) => {
      state.docId = action.payload;
    },
  },
});

export const { setDocId } = docIdSlice.actions;
export default docIdSlice.reducer;
