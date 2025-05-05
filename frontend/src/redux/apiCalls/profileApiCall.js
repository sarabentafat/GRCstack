import { profileActions } from "../slices/profileSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";
import { authActions } from "../slices/authSlice";

// get user profile
export function getUserProfile(id) {
  return async (dispatch) => {
    try {
      const response = await request.get(`/api/users/profile/${id}`);
      const { data } = response;
   
      // Ensure that the profileActions are correctly imported
      dispatch(profileActions.setProfile(data));
      // console.log(  dispatch(profileActions.setProfile(data)).payload)
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // The server responded with an error status
        // toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        // toast.error("No response received from the server.");
        console.log("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an error
        // toast.error("An unexpected error occurred.");
        console.log("An unexpected error occurred.");
      }

      // Log the error for further debugging if needed
      console.error("Error in getUserProfile:", error);
    }
  };
}
// get user profile
export function getUserMainProfile(id) {
  return async (dispatch) => {
    try {
      const response = await request.get(`/api/users/profile/${id}`);
      const { data } = response;
   
      // Ensure that the profileActions are correctly imported
      dispatch(profileActions.setMainProfile(data));
      dispatch(profileActions.setStreakLength(data.statistics.streakLength));
      // console.log(  dispatch(profileActions.setProfile(data)).payload)
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // The server responded with an error status
        // toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        // toast.error("No response received from the server.");
        console.log("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an error
        // toast.error("An unexpected error occurred.");
        console.log("An unexpected error occurred.");
      }

      // Log the error for further debugging if needed
      console.error("Error in getUserProfile:", error);
    }
  };
}


// upload profile photo
export function uploadProfilePhoto(id, newPhoto) {
  console.log(newPhoto);
  console.log(id);

  return async (dispatch, getState) => {
    try {
      console.log("Uploading profile photo...");

      // Ensure newPhoto is a FormData object
      if (!(newPhoto instanceof FormData)) {
        const formData = new FormData();
        formData.append('image', newPhoto);
        console.log(formData)
        newPhoto = formData;
      }

      const response = await request.put(
        `/api/users/profile/profile-photo-upload/${id}`,
        newPhoto,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token.accessToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      const { data } = response;
      console.log(data);
      dispatch(profileActions.updateProfilePhoto(data.profilePic));
      // toast.success(data.message);
      console.log(data.message);
    } catch (error) {
      // Log the error for further debugging if needed
      console.error("Error in uploadProfilePhoto:", error);
    }
  };
}


//update profile
export function updateProfile(userId, profile) {
  console.log("userId",userId)
  console.log("profile",profile)

  return async (dispatch, getState) => {
     const token = getState().auth.user.token;

    try {
      const { data } = await request.put(
        `/api/users/profile/${userId}`,
        profile,
        {
          headers: {
         Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      dispatch(profileActions.updateProfile(data));
      dispatch(authActions.setUsername(data.username));

      // Corrected the method to JSON.parse
      const user = JSON.parse(localStorage.getItem("userInfo"));
      user.username = data?.username;
      localStorage.setItem("userInfo", JSON.stringify(user));
      // toast.success(data.message);
      console.log(data.message);
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // Corrected the method to toast.error()
        // toast.error(error.response.data.message);
        console.log(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        // toast.error("No response received from the server.");
        console.log("No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an error
        // toast.error("An unexpected error occurred.");
        console.log("An unexpected error occurred.");
      }

      // Log the error for further debugging if needed
      console.error("Error in updateProfile:", error);
    }
  };
}
//delete profile
export function deleteProfile(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await request.delete(`/api/users/profile/${userId}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
        },
      });

      dispatch(profileActions.setIsProfileDeleted());

      // toast.success(data?.message);
      setTimeout(() => dispatch(profileActions.clearIsProfileDeleted()), 2000);
    } catch (error) {
      // toast.error(error.response.data.message);
      dispatch(profileActions.clearLoading());
    }
  };
}
// Add points to the user's profile
// Add points to the user's profile
export function addPoints(userId, points) {
  return async (dispatch, getState) => {
    try {
      // Retrieve the token from the Redux state
      const token = getState().auth.user.token;
      // Make the PUT request to add points
      const { data } = await request.put(
        `/api/users/profile/add-points/${userId}`,
        { points }, // Ensure points are sent as an object with key 'points'
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`, // Make sure this matches the token structure in your state
          },
        }
      );

      dispatch(profileActions.updateProfileScore(data.totalScore));
      // toast.success(data.message);
    } catch (error) {
      // Handle different error scenarios
      // if (error.response) {
      //   // The server responded with an error status
      //   toast.error(error.response.data.message);
      // } else if (error.request) {
      //   // The request was made but no response was received
      //   toast.error("No response received from the server.");
      // } else {
      //   // Something happened in setting up the request that triggered an error
      //   toast.error("An unexpected error occurred.");
      // }

      // Log the error for further debugging if needed
      console.error("Error in addPoints:", error);
    }
  };
}

// Update streak days
export function updateStreak(userId) {
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  console.log(userId)
  return async (dispatch, getState) => {
     const token = getState().auth.user.token;
  
    try {

        const { data } = await request.put(
        `/api/users/profile/update-streak/${userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
    console.log(data.isAlreadyUpdated)
    dispatch(profileActions.setIsAlready(data.isAlreadyUpdated));
        dispatch(profileActions.setStreakLength(data.streakLength));
      dispatch(profileActions.updateStreakDays(data.streakDays));
        
      // toast.success(data.message);
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        console.log(error.response.data.message)
        // toast.error(error.response.data.message);
      } else if (error.request) {
        // toast.error('No response received from the server.');
        console.log("No response received from the server.");
      } else {
        // toast.error('An unexpected error occurred.');
        console.log("An unexpected error occurred.");
      }

      console.error('Error in updateStreak:', error);
    }
  };
}
