import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toast: {
    message: null,
    type: null,
  },
  showToast: false,
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setToast: (state, action) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
      };
      state.showToast = action.payload.showToast;
    },
    resetToast: (state) => {
      state.toast = {
        message: null,
        type: null,
      };
      state.showToast = false;
    },
  },
});

export const { setToast, resetToast } = toastSlice.actions;

export default toastSlice.reducer;
