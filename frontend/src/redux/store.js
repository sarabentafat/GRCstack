import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { profileReducer } from "./slices/profileSlice";
import { levelReducer } from "./slices/levelSlice";
import { fieldReducer } from "./slices/fieldSlice";
import { subfieldReducer } from "./slices/subfieldSlice";
import { yearReducer } from "./slices/yearSlice";
import { moduleReducer } from "./slices/moduleSlice";
import { packetReducer } from "./slices/packetSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    level: levelReducer,
    field:fieldReducer,
    subfield:subfieldReducer,
    year:yearReducer,
    module:moduleReducer,
    packet:packetReducer
  },
});
export default store;
