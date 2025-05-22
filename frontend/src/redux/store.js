import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { profileReducer } from "./slices/profileSlice";
import { levelReducer } from "./slices/levelSlice";
import { fieldReducer } from "./slices/fieldSlice";
import { subfieldReducer } from "./slices/subfieldSlice";
// import { yearReducer } from "./slices/yearSlice";
// import { moduleReducer } from "./slices/moduleSlice";
import { packetReducer } from "./slices/packetSlice";
import { projectReducer } from "./slices/projectSlice";
import { auditReducer } from "./slices/auditSlice";
import { frameworkReducer } from "./slices/frameworkSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    framework:frameworkReducer,
    project:projectReducer,
    audit:auditReducer,

  },
});
export default store;
