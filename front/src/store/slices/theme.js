import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Theme slice for Redux store
 *
 * Tracks whether the user is in dark mode or not
 */
const initialState = {
  loading: false, // Whether a theme change is currently in progress
  error: null, // Any error that occurred while changing the theme
  darkMode: !!JSON.parse(localStorage.getItem("darkMode")), // Whether the user is in dark mode
};

/**
 * Async thunk to toggle the theme
 */
export const setTheme = createAsyncThunk("theme/getTheme", async () => {
  const darkMode = !!JSON.parse(localStorage.getItem("darkMode"));
  localStorage.setItem("darkMode", !darkMode);
});

/**
 * Slice for theme reducer
 */
export const themeSlice = createSlice({
  name: "theme", // Name of the slice
  initialState, // Initial state of the slice
  reducers: {
    /**
     * Reducer to update the theme when the page loads
     *
     * If the user is in dark mode, sets the theme to dark on page load
     * Otherwise, sets the theme to light
     */
    getTheme: (state) => {
      document.querySelector("html").dataset.theme = !state.darkMode ? "light" : "dark";
    },
  },
  /**
   * Add additional reducers for theme actions
   */
  extraReducers: (builder) => {
    /**
     * Reducer for when a theme change is fulfilled
     *
     * Sets the theme to whatever the user has stored in localStorage
     * Sets the loading state to false
     */
    builder
      .addCase(setTheme.fulfilled, (state) => {
        document.querySelector("html").dataset.theme = !state.darkMode ? "light" : "dark";
        state.darkMode = !state.darkMode;
        state.loading = false;
      })
      /**
       * Reducer for when a theme change is pending (i.e. the request is being sent)
       *
       * Sets the loading state to true
       */
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      /**
       * Reducer for when a theme change is rejected (i.e. the request failed)
       *
       * Sets the error state to the error message
       * Sets the loading state to false
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
 * Actions for the theme slice
 */
export const { getTheme } = themeSlice.actions;

/**
 * The reducer for the theme slice
 */
export default themeSlice.reducer;
