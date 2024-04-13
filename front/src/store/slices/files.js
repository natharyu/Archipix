import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * File slice initial state
 */
const initialState = {
  files: [], // list of files in a folder
  currentFile: null, // current file object
  loading: false, // is file loading in progress
  error: null, // error message during file loading
};

/**
 * Async thunk to get files list
 * @param {string} folder_id - folder id
 * @returns {Object[]} files list
 */
export const getFiles = createAsyncThunk("file/getFiles", async (folder_id) => {
  const response = await fetch(`/api/v1/file/get/${folder_id}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * Async thunk to get files list
 * @param {string} folder_id - folder id
 * @returns {Object[]} files list
 */
export const shareGetFiles = createAsyncThunk("file/shareGetFiles", async (folder_id) => {
  const response = await fetch(`/api/v1/share/get/files/${folder_id}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * Async thunk to get single file
 * @param {Object} file - file object with id, label, path and rootFolder
 * @returns {Object} file object
 */
export const getFile = createAsyncThunk("file/getFile", async ({ id, label, path, rootFolder }) => {
  const response = await fetch(`/api/v1/file/get/${rootFolder}/${id}/${label}/${path}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * Async thunk to get single file
 * @param {Object} file - file object with id, label, path and rootFolder
 * @returns {Object} file object
 */
export const shareGetFile = createAsyncThunk("file/shareGetFile", async (id) => {
  const response = await fetch(`/api/v1/share/get/file/${id}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * File slice reducer
 */
export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    /**
     * Set files list
     * @param {State} state - current state
     * @param {Object} action - action object
     * @param {Object[]} action.payload - files list
     */
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    /**
     * Set current file
     * @param {State} state - current state
     * @param {Object} action - action object
     * @param {Object} action.payload - file object
     */
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    /**
     * Reset current file
     * @param {State} state - current state
     */
    resetCurrentFile: (state) => {
      state.currentFile = null;
    },
    /**
     * Reset file state to initialState
     */
    resetFileState: () => initialState,
  },
  /**
   * File slice extra reducers
   */
  extraReducers: (builder) => {
    builder
      .addCase(getFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.loading = false;
      })
      .addCase(shareGetFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.loading = false;
      })
      .addCase(getFile.fulfilled, (state, action) => {
        state.currentFile = action.payload;
        state.loading = false;
      })
      .addCase(shareGetFile.fulfilled, (state, action) => {
        state.currentFile = action.payload;
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

/**
 * Export file slice actions
 */
export const { setFiles, setCurrentFile, resetCurrentFile, resetFileState } = fileSlice.actions;

/**
 * Export file slice reducer
 */
export default fileSlice.reducer;
