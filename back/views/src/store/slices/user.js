import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * The initial state of the user slice
 */
const initialState = {
  email: "", // The user's email address
  username: "", // The user's username
  createdAt: null, // The timestamp when the user was created
  usedStorageSize: null, // The amount of storage space used by the user
  totalFiles: null, // The number of files uploaded by the user
  id: null, // The user's id
  viewMode: !!JSON.parse(localStorage.getItem("viewMode")), // The user's preferred view mode (grid/list)
  loading: false, // Indicates if a user info request is in progress
  error: null, // The error message if a request fails
};

/**
 * Fetches the user info for the provided email address
 */
export const getUserInfo = createAsyncThunk("user/getUserInfo", async (email) => {
  const response = await fetch(`/api/v1/user/get/info/${email}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * The user slice containing the user's info and user preferences
 */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Toggles the view mode between dark and light
     */
    setViewMode: (state) => {
      const viewMode = !!JSON.parse(localStorage.getItem("viewMode"));
      localStorage.setItem("viewMode", !viewMode);
      state.viewMode = !!JSON.parse(localStorage.getItem("viewMode"));
    },
  },
  extraReducers: (builder) => {
    builder
      /**
       * Handles the result of a successful user info request
       */
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.username = action.payload.user.username;
        state.createdAt = action.payload.user.created_at;
        state.usedStorageSize = action.payload.totalSize;
        state.totalFiles = action.payload.totalFiles;
        state.id = action.payload.user.id;
        state.loading = false;
      })
      /**
       * Sets the loading state to true when a request is in progress
       */
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      /**
       * Handles the result of a failed user info request
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
 * Exports the actions of the user slice
 */
export const { setViewMode } = userSlice.actions;

/**
 * Exports the reducer of the user slice
 */
export default userSlice.reducer;
