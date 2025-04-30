import { levelActions } from "../slices/levelSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Fetch all levels
export function fetchLevels() {
  return async (dispatch) => {
    dispatch(levelActions.setLoading());
    try {
      const response = await request.get("/api/levels");
      const { data } = response;
      dispatch(levelActions.setLevels(data));
      
    } catch (error) {
      handleApiError(error);
    } finally {
      dispatch(levelActions.clearLoading());
    }
  };
}

// Fetch a single level by ID
export function fetchLevelById(id) {
  console.log(id)
  return async (dispatch) => {
    dispatch(levelActions.setLoading());
    try {
      const response = await request.get(`/api/levels/${id}`);
      const { data } = response;
      dispatch(levelActions.setLevel(data));
    //   console.log(data)
    } catch (error) {
      handleApiError(error);
    } finally {
      dispatch(levelActions.clearLoading());
    }
  };
}

// Add a new level
export function addLevel(newLevel) {
  return async (dispatch) => {
    dispatch(levelActions.setLoading());
    try {
      const response = await request.post("/api/levels", newLevel);
      const { data } = response;
      dispatch(levelActions.setLevel(data));
  
    } catch (error) {
      handleApiError(error);
    } finally {
      dispatch(levelActions.clearLoading());
    }
  };
}

// Update an existing level
export function updateLevel(id, updatedLevel) {
  return async (dispatch) => {
    dispatch(levelActions.setLoading());
    try {
      const response = await request.put(`/api/levels/${id}`, updatedLevel);
      const { data } = response;
      dispatch(levelActions.updateLevel(data));
  
    } catch (error) {
      handleApiError(error);
    } finally {
      dispatch(levelActions.clearLoading());
    }
  };
}

// Delete a level
export function deleteLevel(id) {
  return async (dispatch) => {
    dispatch(levelActions.setLoading());
    try {
      await request.delete(`/api/levels/${id}`);
      dispatch(levelActions.setIsLevelDeleted());
    
    } catch (error) {
      handleApiError(error);
    } finally {
      dispatch(levelActions.clearLoading());
    }
  };
}

// Error handler function
function handleApiError(error) {
  // if (error.response) {
  //   toast.error(error.response.data.message);
  // } else if (error.request) {
  //   toast.error("No response received from the server.");
  // } else {
  //   toast.error("An unexpected error occurred.");
  // }
  console.error("API Error:", error);
}
