import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: "",
  role: "",
  email: null,
  loading: false,
  error: null,
};

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await fetch(`/auth/refresh`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoggedIn = false;
        state.role = "";
        state.email = "";
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        }
      );
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
