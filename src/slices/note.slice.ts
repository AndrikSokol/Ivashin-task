import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { INote } from "../types/notes.interface";

interface INotesState {
  notes: INote[];
}

const initialState: INotesState = {
  notes: [],
};
export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<INote[]>) => {
      state.notes = [...action.payload];
    },
    deleteNote: (state, action: PayloadAction<any>) => {
      state.notes = state.notes.filter((note) => note !== action.payload);
    },
  },
});

export const { addNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
