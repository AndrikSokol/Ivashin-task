import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { INoteData } from "../types/notes.interface";

interface INotesState {
  notes: INoteData[];
}

const initialState: INotesState = {
  notes: [],
};
export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<INoteData[] | INoteData>) => {
      if (Array.isArray(action.payload)) {
        state.notes = [...action.payload];
      } else {
        state.notes.push(action.payload);
      }
    },
    deleteNote: (state, action: PayloadAction<INoteData>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload.id);
    },
    editNote: (state, action: PayloadAction<INoteData>) => {
      const noteToUpdateIndex = state.notes.findIndex(
        (note) => note.id == action.payload.id
      );
      if (noteToUpdateIndex !== -1) {
        state.notes[noteToUpdateIndex] = action.payload;
      }
    },
  },
});

export const { addNote, deleteNote, editNote } = notesSlice.actions;
export default notesSlice.reducer;
