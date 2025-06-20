import { createSlice } from "@reduxjs/toolkit";

const auditSlice = createSlice({
  name: "audit",
  initialState: {
    audit: null, // Single audit, can be null initially
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAudit: (state, action) => {
      state.audit = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

const auditReducer = auditSlice.reducer;
const auditActions = auditSlice.actions;

export { auditReducer, auditActions };
