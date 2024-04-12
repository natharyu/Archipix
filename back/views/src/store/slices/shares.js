import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Share slice initial state
 */
const initialState = {
  shares: [], // list of shares for an user
  loading: false, // is file loading in progress
  error: null, // error message during file loading
};

/**
 * Async thunk to get single file
 * @param {Object} file - file object with id, label, path and rootFolder
 * @returns {Object} file object
 */
export const getShares = createAsyncThunk("share/getShares", async (id) => {
  const response = await fetch(`/api/v1/user/get/share/${id}`, {
    method: "GET",
  });
  return await response.json();
});

/**
 * File slice reducer
 */
export const shareSlice = createSlice({
  name: "share",
  initialState,
  reducers: {
    setShares: (state, action) => {
      state.shares = action.payload;
    },
  },
  /**
   * File slice extra reducers
   */
  extraReducers: (builder) => {
    builder
      .addCase(getShares.fulfilled, (state, action) => {
        state.shares = action.payload;
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
export const { setShares } = shareSlice.actions;

/**
 * Export file slice reducer
 */
export default shareSlice.reducer;
