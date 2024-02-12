import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  files: [],
  loading: false,
  error: null,
};

export const getFiles = createAsyncThunk("file/getFiles", async (folder_id) => {
  const response = await fetch(`/api/v1/file/get/${folder_id}`, {
    method: "GET",
  });
  return await response.json();
});

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFiles.fulfilled, (state, action) => {
        state.files = action.payload;
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

export const {} = fileSlice.actions;

export default fileSlice.reducer;
