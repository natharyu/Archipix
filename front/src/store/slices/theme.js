import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  darkMode: !!JSON.parse(localStorage.getItem("darkMode")),
};

export const setTheme = createAsyncThunk("theme/getTheme", async () => {
  const darkMode = !!JSON.parse(localStorage.getItem("darkMode"));
  localStorage.setItem("darkMode", !darkMode);
});

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    getTheme: (state) => {
      document.querySelector("html").dataset.theme = !state.darkMode ? "light" : "dark";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTheme.fulfilled, (state) => {
        document.querySelector("html").dataset.theme = !state.darkMode ? "light" : "dark";
        state.darkMode = !state.darkMode;
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

export const { getTheme } = themeSlice.actions;

export default themeSlice.reducer;
