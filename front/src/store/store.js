import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import themeSlice from "./slices/theme";
import toastSlice from "./slices/toast";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    toast: toastSlice,
  },
});
