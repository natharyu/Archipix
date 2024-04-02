import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  username: "",
  createdAt: null,
  usedStorageSize: null,
  totalFiles: null,
  viewMode: !!JSON.parse(localStorage.getItem("viewMode")),
  loading: false,
  error: null,
};

export const getUserInfo = createAsyncThunk("user/getUserInfo", async (email) => {
  const response = await fetch(`/api/v1/user/get/info/${email}`, {
    method: "GET",
  });
  return await response.json();
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setViewMode: (state) => {
      const viewMode = !!JSON.parse(localStorage.getItem("viewMode"));
      localStorage.setItem("viewMode", !viewMode);
      state.viewMode = !!JSON.parse(localStorage.getItem("viewMode"));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.email = action.payload.user.email;
        state.username = action.payload.user.username;
        state.createdAt = action.payload.user.created_at;
        state.usedStorageSize = action.payload.totalSize;
        state.totalFiles = action.payload.totalFiles;
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

export const { setViewMode } = userSlice.actions;

export default userSlice.reducer;
