import { createSlice } from "@reduxjs/toolkit";
import { Account } from "@/src/lib/features/accounts/accountsApi";

const initialState: Account = {
  login: "",
  email: "",
  name: "",
  is_staff: false,
  is_active: false,
  counterparty: "",
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setTypeStaff: (state, action) => {
      state.is_staff = action.payload;
    },
  },
});

export const { setTypeStaff } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;
