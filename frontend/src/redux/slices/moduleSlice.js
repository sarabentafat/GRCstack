// src/redux/slices/moduleSlice.js

import { createSlice } from "@reduxjs/toolkit";

const moduleSlice = createSlice({
  name: "module",
  initialState: {
    modules: [], // Ensure this is an array
    module: null, // Single module, can be null initially
    loading: false,
    error: null,
  },
  reducers: {
    setModules: (state, action) => {
      state.modules = action.payload;
    },
    setModule: (state, action) => {
      state.module = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});


const moduleReducer = moduleSlice.reducer;
const moduleActions = moduleSlice.actions;

export { moduleReducer, moduleActions };
