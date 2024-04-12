import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * The initial state of the auth slice
 */
const initialState = {
  isLoggedIn: "", // Whether the user is logged in or not
  role: "", // The user's role
  email: null, // The user's email
  loading: false, // Whether the user is currently loading or not
  error: null, // The error of the last failed request
};

/**
 * The thunk that checks the authentication of the user
 */
export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const response = await fetch(`/auth/refresh`, {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
});

/**
 * The auth slice
 */
export const authSlice = createSlice({
  name: "auth", // The name of the slice
  initialState, // The initial state of the slice
  reducers: {
    /**
     * The reducer that sets the user as logged in
     */
    login: (state) => {
      state.isLoggedIn = true;
    },
    /**
     * The reducer that sets the user as logged out
     */
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.email = null;
    },
  },
  /**
   * The extra reducers of the slice
   */
  extraReducers: (builder) => {
    builder
      /**
       * The reducer that handles the successful fulfilled case of the checkAuth thunk
       */
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.loading = false;
      })
      /**
       * The reducer that handles the rejected case of the checkAuth thunk
       */
      .addCase(checkAuth.rejected, (state) => {
        state.isLoggedIn = false;
        state.role = "";
        state.email = "";
        state.loading = false;
      })
      /**
       * The reducer that handles the pending case of the checkAuth thunk
       */
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      /**
       * The reducer that handles the rejected case of the checkAuth thunk
       */
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        }
      );
  },
});

/**
 * The actions of the auth slice
 */
export const { login, logout } = authSlice.actions;

/**
 * The reducer of the auth slice
 */
export default authSlice.reducer;
