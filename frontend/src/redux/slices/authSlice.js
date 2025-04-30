import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    registerMessage: null,
    verifyMessage: null,
    checkemailusernameMessage: null,
    isVerified: null,
    error:null
  },
  reducers: {
    login(state, action) {
      state.user = action.payload; //data from the server=payload= data lijaya fl payload
    },
    setError(state,action){
      state.error = action.payload;
    },
    logout(state, action) {
      state.user = action.payload;
    },
    register(state, action) {
      state.registerMessage = action.payload;
    },
    verify(state, action) {
      state.verifyMessage = action.payload;
    },
    checkemailusername(state, action) {
      state.checkemailusernameMessage = action.payload;
    },
    setUserPhoto(state, action) {
      state.user.profilePic = action.payload;
    },
    setUsername(state, action) {
      state.user.username = action.payload;
    },
    setVerificationStatus(state, action) {
      state.isVerified = action.payload;
    },
  },
});
const authReducer = authSlice.reducer;
const authActions = authSlice.actions;
export { authReducer, authActions };
