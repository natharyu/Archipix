import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  rootFolder: "", // root folder
  rootFolderName: "", // root folder name
  currentFolder: "", // current folder
  currentFolderName: "", // current folder name
  path: [], // path of the current folder
  pathName: [], // path name of the current folder
  folders: [], // folders of the current folder
  loading: false, // loading state
  error: null, // error state
};

/**
 * Async thunk to get folders list
 * @param {string} parent_id - parent folder id
 * @returns {Object[]} folders list
 */
export const getFolders = createAsyncThunk("folder/getFolders", async (parent_id) => {
  const response = await fetch(`/api/v1/folder/get/${parent_id}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * Async thunk to get folders list
 * @param {string} parent_id - parent folder id
 * @returns {Object[]} folders list
 */
export const shareGetFolders = createAsyncThunk("filfoldere/shareGetFolders", async (parent_id) => {
  const response = await fetch(`/api/v1/share/get/folders/${parent_id}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * Async thunk to get the root folder of the logged in user
 * @returns {Object} root folder object
 */
export const getRootFolder = createAsyncThunk("folder/getRoot", async () => {
  const response = await fetch("/api/v1/folder/getRoot", {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
});

/**
 * Async thunk to get the path of a folder
 * @param {string} folder_id - The folder id
 * @returns {string[]} The path of the folder as an array of folder names
 */
export const getPath = createAsyncThunk("folder/getPath", async (folder_id) => {
  const response = await fetch(`/api/v1/folder/getPath/${folder_id}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * Async thunk to get the path of a folder
 * @param {string} folder_id - The folder id
 * @returns {string[]} The path of the folder as an array of folder names
 */
export const shareGetPath = createAsyncThunk("folder/shareGetPath", async (folder_id) => {
  const response = await fetch(`/api/v1/share/getPath/${folder_id}`, {
    method: "GET",
  });
  return await response.json();
});

export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    /**
     * Set the root folder and its name
     * @param {Object} action - The action
     * @param {string} action.payload.rootFolder - The root folder id
     * @param {string} action.payload.rootFolderName - The root folder name
     */
    setRootFolder: (state, action) => {
      state.rootFolder = action.payload.rootFolder;
      state.rootFolderName = action.payload.rootFolderName;
    },
    /**
     * Set the current folder and its name
     * @param {Object} action - The action
     * @param {string} action.payload.currentFolder - The current folder id
     * @param {string} action.payload.currentFolderName - The current folder name
     */
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload.currentFolder;
      state.currentFolderName = action.payload.currentFolderName;
    },

    /**
     * Set the folders
     * @param {Object} action - The action
     * @param {Object[]} action.payload.folders - The folders
     */
    setFolders: (state, action) => {
      state.folders = action.payload.folders;
    },

    resetFolderState: () => initialState,
  },
  /**
   * Handle additional reducers for the folder slice.
   * @param {Object} builder - The redux-toolkit builder
   */
  extraReducers: (builder) => {
    /**
     * Handle the fulfilled action of getting the root folder.
     * @param {Object} state - The state
     * @param {Object} action - The action
     * @param {string} action.payload.rootFolder - The root folder id
     * @param {string} action.payload.rootFolderName - The root folder name
     */
    builder.addCase(getRootFolder.fulfilled, (state, action) => {
      state.rootFolder = action.payload.rootFolder;
      state.rootFolderName = action.payload.rootFolderName;
      state.loading = false;
    });
    /**
     * Handle the fulfilled action of getting the path.
     * @param {Object} state - The state
     * @param {Object} action - The action
     * @param {string[]} action.payload.path - The path
     * @param {string} action.payload.pathName - The path name
     */
    builder.addCase(getPath.fulfilled, (state, action) => {
      state.path = action.payload.path;
      state.pathName = action.payload.pathName;
      state.loading = false;
    });
    /**
     * Handle the fulfilled action of getting the path.
     * @param {Object} state - The state
     * @param {Object} action - The action
     * @param {string[]} action.payload.path - The path
     * @param {string} action.payload.pathName - The path name
     */
    builder.addCase(shareGetPath.fulfilled, (state, action) => {
      state.path = action.payload.path;
      state.pathName = action.payload.pathName;
      state.loading = false;
    });
    /**
     * Handle the fulfilled action of getting the folders.
     * @param {Object} state - The state
     * @param {Object} action - The action
     * @param {Object[]} action.payload - The folders
     */
    builder.addCase(getFolders.fulfilled, (state, action) => {
      state.folders = action.payload;
      state.loading = false;
    });
    /**
     * Handle the fulfilled action of getting the folders.
     * @param {Object} state - The state
     * @param {Object} action - The action
     * @param {Object[]} action.payload - The folders
     */
    builder.addCase(shareGetFolders.fulfilled, (state, action) => {
      state.folders = action.payload;
      state.loading = false;
    });
    /**
     * Handle the pending actions of the folder slice.
     * @param {Object} state - The state
     */
    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
      }
    );
    /**
     * Handle the rejected actions of the folder slice.
     * @param {Object} state - The state
     * @param {Object} action - The action
     * @param {string} action.error.message - The error message
     */
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      }
    );
  },
});

export const { setRootFolder, setCurrentFolder, setFolders, resetFolderState } = folderSlice.actions;

export default folderSlice.reducer;
