import { createSlice } from "@reduxjs/toolkit";

const frameworkSlice = createSlice({
  name: "framework",
  initialState: {
    frameworks: [], // Ensure this is an array
    framework: null, // Single framework, can be null initially
    loading: false,
    error: null,
  },
  reducers: {
    setframeworks: (state, action) => {
      state.frameworks = action.payload;
    },
    setframework: (state, action) => {
      state.framework = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const frameworkReducer = frameworkSlice.reducer;
const frameworkActions = frameworkSlice.actions;

export { frameworkReducer, frameworkActions };
