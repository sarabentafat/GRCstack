
import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [], // Ensure this is an array
    project: null, // Single project, can be null initially
    loading: false,
    error: null,
  },
  reducers: {
    setprojects: (state, action) => {
      state.projects = action.payload;
    },
    setproject: (state, action) => {
      state.project = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});


const projectReducer = projectSlice.reducer;
const projectActions = projectSlice.actions;

export { projectReducer, projectActions };
