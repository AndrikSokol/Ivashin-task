import { combineReducers, configureStore } from "@reduxjs/toolkit";
import notesSlice from "../slices/note.slice";

const rootReducer = combineReducers({
  note: notesSlice,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
