import { createSlice } from "@reduxjs/toolkit";

interface hashtagsState {
  hashtags: string[];
}
const initialState: hashtagsState = {
  hashtags: [],
};

export const hashtagsSlice = createSlice({
  name: "hashtags",
  initialState,
  reducers: {
    addHashtags: (state, action) => {
      state.hashtags = action.payload;
    },

    deleteHashtags: (state, action) => {},
  },
});

export const { addHashtags, deleteHashtags } = hashtagsSlice.actions;
export default hashtagsSlice.reducer;
