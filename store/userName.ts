import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type UserState = {
  user: string;
};
const initialState: UserState = {
  user: "",
};

const userNameSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userNameSlice.actions;
export default userNameSlice.reducer;
