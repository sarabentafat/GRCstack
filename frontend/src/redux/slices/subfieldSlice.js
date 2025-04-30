// src/redux/slices/fieldSlice.js

import { createSlice } from "@reduxjs/toolkit";

const subfieldSlice = createSlice({
  name: "subfield",
  initialState: {
    subfields: [],
    subfield: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSubfields: (state, action) => {
      state.subfields = action.payload; // Corrected field name
    },
    setSubfield: (state, action) => {
      state.subfield = action.payload; // Corrected field name
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const subfieldReducer = subfieldSlice.reducer;
const subfieldActions = subfieldSlice.actions;

export { subfieldReducer, subfieldActions };
