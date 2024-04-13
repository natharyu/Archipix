import { createSlice } from "@reduxjs/toolkit";

/**
 * The toast slice stores information about toast messages.
 * When a toast is added, its message and type are stored in the state.
 * When a toast is removed, the state is reset to its initial values.
 */
const initialState = {
  toast: {
    message: null, // The message to display in the toast
    type: null, // The type of toast (e.g. "success", "error", "warning")
  },
  showToast: false, // Whether the toast should be shown
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    /**
     * Add a toast message to the state.
     * @param {object} state The current state of the store
     * @param {object} action The action being dispatched
     * @param {string} action.payload.message The message to display in the toast
     * @param {string} action.payload.type The type of toast (e.g. "success", "error", "warning")
     * @param {boolean} action.payload.showToast Whether the toast should be shown
     */
    setToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
      };
      state.showToast = action.payload.showToast;
    },
    /**
     * Reset the toast state to its initial values.
     * @param {object} state The current state of the store
     */
    resetToast: (state) => {
      state.toast = {
        message: null,
        type: null,
      };
      state.showToast = false;
    },
  },
});

/**
 * Actions to be dispatched to the store.
 */
export const { setToast, resetToast } = toastSlice.actions;

/**
 * The reducer for the toast slice.
 */
export default toastSlice.reducer;
