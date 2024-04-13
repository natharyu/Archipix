import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import fileSlice from "./slices/files";
import folderSlice from "./slices/folder";
import shareSlice from "./slices/shares";
import themeSlice from "./slices/theme";
import toastSlice from "./slices/toast";
import userSlice from "./slices/user";

/**
 * The store has five main reducers:
 * - auth: handles the user's authentication state.
 * - theme: handles the user's chosen theme.
 * - toast: handles the state of toast messages.
 * - file: handles the data of files and folders.
 * - folder: handles the data of the current folder and its parents.
 * - user: handles the state of the user object.
 * - share: handles the state of the share object.
 */
export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    toast: toastSlice,
    file: fileSlice,
    folder: folderSlice,
    user: userSlice,
    share: shareSlice,
  },
});
