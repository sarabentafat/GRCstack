import { createSlice } from "@reduxjs/toolkit";

const levelSlice = createSlice({
  name: "level",
  initialState: {
    levels: [], // This will now be an array of names
    level: null,
    loading: false,
    isLevelDeleted: false,
  },
  reducers: {
    setLevels(state, action) {
      state.levels = action.payload; // Set the levels to the array of names
    },
    setLevel(state, action) {
      state.level = action.payload; // Ensure payload contains full level data
    },
    updateLevel(state, action) {
      state.level = action.payload; // Ensure payload contains updated level data
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setIsLevelDeleted(state) {
      state.isLevelDeleted = true;
      state.loading = false;
    },
    clearIsLevelDeleted(state) {
      state.isLevelDeleted = false;
      state.loading = false;
    },
  },
});


const levelReducer = levelSlice.reducer;
const levelActions = levelSlice.actions;
export { levelReducer, levelActions };
