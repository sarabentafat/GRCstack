import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    mainProfile: null,
    loading: false,
    isProfileDeleted: false,
    totalScore: 0,
    streakDays: [],
    streakLength: 0,
    isAlready: true,
  },
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload; // Ensure payload contains full profile data
    },
    setStreakLength(state, action) {
      state.streakLength = action.payload; // Ensure payload contains full profile data
    },
    setIsAlready(state, action) {
      state.isAlready = action.payload; // Ensure payload contains full profile data
    },
    setMainProfile(state, action) {
      state.mainProfile = action.payload; // Ensure payload contains full profile data
    },
    updateProfileScore(state, action) {
      state.totalScore = action.payload; // Update totalScore
    },
    updateProfilePhoto(state, action) {
      if (state.profile) {
        state.profile.profilePic = action.payload.profilePic;
      }
    },
    updateProfile(state, action) {
      state.profile = action.payload; // Ensure payload contains full profile data
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    updateStreakDays: (state, action) => {
      state.streakDays = action.payload.streakDays;
    },
    setIsProfileDeleted(state) {
      state.isProfileDeleted = true;
      state.loading = false;
    },
    clearIsProfileDeleted(state) {
      state.isProfileDeleted = true;
      state.loading = false;
    },
  },
});

const profileReducer = profileSlice.reducer;
const profileActions = profileSlice.actions;
export { profileReducer, profileActions };
