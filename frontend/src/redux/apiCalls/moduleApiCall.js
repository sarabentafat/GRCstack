// src/redux/actions/moduleActions.js
import request from "../../utils/request";
import { toast } from "react-toastify";
import { moduleActions } from "../slices/moduleSlice";

// Fetch all modules
export const fetchModules = () => async (dispatch) => {
  try {
    dispatch(moduleActions.setLoading(true)); // Set loading state to true
    const response = await request.get("/api/modules/"); // Corrected endpoint for fetching modules

    if (response.data) {
      dispatch(moduleActions.setModules(response.data)); // Corrected action creator
    } else {
      dispatch(moduleActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch modules"); // Show a toast notification with the error message
    dispatch(
      moduleActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(moduleActions.setLoading(false)); // Set loading state to false
  }
};

// Fetch module by ID
export const fetchModuleById = (id) => async (dispatch) => {
  try {
    dispatch(moduleActions.setLoading(true)); // Set loading state to true
    const response = await request.get(`/api/modules/${id}`); // Corrected endpoint for fetching a module by ID

    if (response.data) {
      dispatch(moduleActions.setModule(response.data)); // Corrected action creator
    } else {
      dispatch(moduleActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch module"); // Show a toast notification with the error message
    dispatch(
      moduleActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(moduleActions.setLoading(false)); // Set loading state to false
  }
};
