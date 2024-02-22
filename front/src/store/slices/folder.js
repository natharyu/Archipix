import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  rootFolder: "",
  rootFolderName: "",
  currentFolder: "",
  currentFolderName: "",
  path: [],
  pathName: [],
  folders: [],
  loading: false,
  error: null,
};
export const getFolders = createAsyncThunk("file/getFolders", async (parent_id) => {
  const response = await fetch(`/api/v1/folder/get/${parent_id}`, {
    method: "GET",
  });
  return await response.json();
});

export const getRootFolder = createAsyncThunk("folder/getRoot", async () => {
  const response = await fetch("/api/v1/folder/getRoot", {
    method: "GET",
    credentials: "include",
  });
  return await response.json();
});

export const getPath = createAsyncThunk("folder/getPath", async (folder_id) => {
  const response = await fetch(`/api/v1/folder/getPath/${folder_id}`, {
    method: "GET",
  });
  return await response.json();
});

export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    setRootFolder: (state, action) => {
      state.rootFolder = action.payload.rootFolder;
      state.rootFolderName = action.payload.rootFolderName;
    },
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload.currentFolder;
      state.currentFolderName = action.payload.currentFolderName;
    },
    resetFolderState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRootFolder.fulfilled, (state, action) => {
        state.rootFolder = action.payload.rootFolder;
        state.rootFolderName = action.payload.rootFolderName;
        state.loading = false;
      })
      .addCase(getPath.fulfilled, (state, action) => {
        state.path = action.payload.path;
        state.pathName = action.payload.pathName;
        state.loading = false;
      })
      .addCase(getFolders.fulfilled, (state, action) => {
        state.folders = action.payload;
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

export const { setRootFolder, setCurrentFolder, resetFolderState } = folderSlice.actions;

export default folderSlice.reducer;
