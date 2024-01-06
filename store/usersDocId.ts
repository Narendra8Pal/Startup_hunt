import { createSlice } from "@reduxjs/toolkit";

type DocIdState = {
  usersDocId: string;
};

const initialState: DocIdState = {
  usersDocId: "",
};

const usersDocIdSlice = createSlice({
  name: "usersDocId",
  initialState,
  reducers: {
    setUsersDocId: (state, action) => {
      state.usersDocId = action.payload;
    },
  },
});

export const { setUsersDocId } = usersDocIdSlice.actions;
export default usersDocIdSlice.reducer;
