// src/redux/slices/yearSlice.js

import { createSlice } from "@reduxjs/toolkit";

const yearSlice = createSlice({
  name: "year",
  initialState: {
    years: [], // To store multiple years
    year: null, // To store a single year if needed
    loading: false, // To track the loading state
    error: null, // To store any error messages
  },
  reducers: {
    setYears: (state, action) => {
      state.years = action.payload; // Sets the array of years
    },
    setYear: (state, action) => {
      state.year = action.payload; // Sets a single year
    },
    setLoading: (state, action) => {
      state.loading = action.payload; // Sets the loading state
    },
    setError: (state, action) => {
      state.error = action.payload; // Sets an error message
    },
  },
});

const yearReducer = yearSlice.reducer;
const yearActions = yearSlice.actions;

export { yearReducer, yearActions };
