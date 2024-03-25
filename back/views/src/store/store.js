import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import fileSlice from "./slices/files";
import folderSlice from "./slices/folder";
import themeSlice from "./slices/theme";
import toastSlice from "./slices/toast";
import userSlice from "./slices/user";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    toast: toastSlice,
    file: fileSlice,
    folder: folderSlice,
    user: userSlice,
  },
});
