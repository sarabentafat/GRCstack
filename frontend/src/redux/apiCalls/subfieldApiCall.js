import request from "../../utils/request";
import { subfieldActions } from "../slices/subfieldSlice";
import { toast } from "react-toastify";

// Fetch all subfields
export const fetchSubfields = () => async (dispatch) => {
  try {
    dispatch(subfieldActions.setLoading(true)); // Set loading state to true
    const response = await request.get("/api/subfields/"); // Adjusted endpoint for fetching subfields

    if (response.data) {
      dispatch(subfieldActions.setSubfields(response.data)); // Corrected action creator
    } else {
      dispatch(subfieldActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch subfields"); // Show a toast notification with the error message
    dispatch(
      subfieldActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(subfieldActions.setLoading(false)); // Set loading state to false
  }
};

// Fetch subfield by ID
export const fetchSubfieldById = (id) => async (dispatch) => {
  try {
    dispatch(subfieldActions.setLoading(true)); // Set loading state to true
    const response = await request.get(`/api/subfields/${id}`); // Adjusted endpoint for fetching a subfield by ID

    if (response.data) {
      dispatch(subfieldActions.setSubfield(response.data)); // Corrected action creator
       
    } else {
      dispatch(subfieldActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch subfield"); // Show a toast notification with the error message
    dispatch(
      subfieldActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(subfieldActions.setLoading(false)); // Set loading state to false
  }
};
