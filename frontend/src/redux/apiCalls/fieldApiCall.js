import request from "../../utils/request";
import { fieldActions } from "../slices/fieldSlice";
import { toast } from "react-toastify";

// Fetch all fields
export const fetchFields = () => async (dispatch) => {
  try {
    dispatch(fieldActions.setLoading(true)); // Corrected action creator
    const response = await request.get("/api/fields/");
    // console.log("Fetch Fields Response:", response); // Log the entire response
    if (response.data) {
      dispatch(fieldActions.setFields(response.data)); // Corrected action creator// Fixed typo 'consoole'
    } else {
    //   console.error("No data found in response");
      dispatch(fieldActions.setError("No data found in response")); // Corrected action creator
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch fields");
    // console.log("Fetch Fields Error:", error); // Log the error details
    dispatch(fieldActions.setError(error.message)); // Corrected action creator
  } finally {
    dispatch(fieldActions.setLoading(false)); // Corrected action creator
  }
};
// Fetch field by ID
export const fetchFieldById = (id) => async (dispatch) => {
  try {
    dispatch(fieldActions.setLoading(true)); // Set loading state to true
    const response = await request.get(`/api/fields/${id}`);
    // console.log("Fetch Field By ID Response:", response); // Log the entire response
    
    if (response.data) {
      dispatch(fieldActions.setField(response.data)); // Set the fetched field data
    } else {
    //   console.error("No data found in response");
      dispatch(fieldActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    
    console.log("Fetch Field By ID Error:", error); // Log the error details
    dispatch(fieldActions.setError(error.response?.data?.message || error.message)); // Set error state with the error message
  } finally {
    dispatch(fieldActions.setLoading(false)); // Set loading state to false
  }
};
