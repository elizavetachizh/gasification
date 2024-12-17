import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.accessToken = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{ access: string; refresh: string }>,
    ) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      localStorage.setItem("refreshToken", action.payload.refresh);
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("refreshToken");
    },
    resetState() {
      return initialState; // Сброс состояния до начального
    },
  },
});

export const { setTokens, clearTokens, setAccessToken, clearAuth, resetState } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
