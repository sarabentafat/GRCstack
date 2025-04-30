// src/redux/slices/fieldSlice.js

import { createSlice } from "@reduxjs/toolkit";


const fieldSlice = createSlice({
  name: "field",
  initialState: {
    fields: [],
    field: null,
    loading: false,
    error: null,
  },
  reducers: {
    setFields: (state, action) => {
      state.fields = action.payload;
    },
    setField: (state, action) => {
      state.field = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const fieldReducer =fieldSlice.reducer;
const fieldActions = fieldSlice.actions;
export { fieldReducer, fieldActions };