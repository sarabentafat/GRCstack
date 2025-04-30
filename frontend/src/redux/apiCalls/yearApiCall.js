import request from "../../utils/request";
import { yearActions } from "../slices/yearSlice";
import { toast } from "react-toastify";

// Fetch all years
export const fetchYears = () => async (dispatch) => {
  try {
    dispatch(yearActions.setLoading(true)); // Set loading state to true
    const response = await request.get("/api/years/"); // Endpoint for fetching years

    if (response.data) {
      dispatch(yearActions.setYears(response.data)); // Corrected action to set years
    } else {
      dispatch(yearActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch years"); // Show a toast notification with the error message
    dispatch(
      yearActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(yearActions.setLoading(false)); // Set loading state to false
  }
};

// Fetch year by ID
export const fetchYearById = (id) => async (dispatch) => {
  try {
    console.log("iddddddd",id)
    dispatch(yearActions.setLoading(true)); // Set loading state to true
    const response = await request.get(`/api/years/${id}`); // Endpoint for fetching a year by ID
console.log('res',response)
    if (response.data) {
      dispatch(yearActions.setYear(response.data)); // Corrected action to set a single year
    } else {
      dispatch(yearActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch year"); // Show a toast notification with the error message
    dispatch(
      yearActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(yearActions.setLoading(false)); // Set loading state to false
  }
};
