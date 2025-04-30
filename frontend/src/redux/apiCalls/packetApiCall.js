import request from "../../utils/request";
import { packetActions } from "../slices/packetSlice";
// Fetch all packets
export const fetchPackets = () => async (dispatch) => {
  try {
    dispatch(packetActions.setLoading(true)); // Set loading state to true
    const response = await request.get("/api/packets/"); // Endpoint for fetching all packets

    if (response.data) {
      dispatch(packetActions.setPackets(response.data)); // Action creator to set packets
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {

    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};

// Fetch packet by ID
// In packetApiCall.js
export const fetchPacketById = (packetId) => async (dispatch) => {
  try {
    dispatch(packetActions.setLoading(true));
    
    const { data } = await request.get(`/api/packets/${packetId}`);
    dispatch(packetActions.setPacket(data.packet));

    // console.log(data.starredQuestions);
    //   // Ensure it's an array
  } catch (error) {
    dispatch(packetActions.setError("Failed to fetch packet data"));
  } finally {
    dispatch(packetActions.clearLoading());
  }
};

// Fetch packets by user ID
export const fetchUserPackets= (userId) => async (dispatch) => {
  try {
    dispatch(packetActions.setLoading(true)); // Set loading state to true
    const response = await request.get(`/api/packets/user/${userId}`); // Endpoint for fetching packets by user ID

    if (response.data) {
      dispatch(packetActions.setUserPackets(response.data)); // Action creator to set packets
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    console.log("Failed to fetch packets for user");
   
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};


// Fetch packets by user ID
export const fetchPacketsByUserId = (userId) => async (dispatch) => {
  try {
    dispatch(packetActions.setLoading(true)); // Set loading state to true
    const response = await request.get(`/api/packets/user/${userId}`); // Endpoint for fetching packets by user ID

    if (response.data) {
      dispatch(packetActions.setdocPackets(response.data)); // Action creator to set packets
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    console.log("Failed to fetch packets for user");
   
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};

// Fetch packets by user ID
export const fetchPacketsP = (userId) => async (dispatch) => {
  try {
    dispatch(packetActions.setLoading(true)); // Set loading state to true
    const response = await request.get(`/api/packets/user/${userId}`); // Endpoint for fetching packets by user ID

    if (response.data) {
      dispatch(packetActions.setPacketsP(response.data)); // Action creator to set packets
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    console.log("Failed to fetch packets for user");
   
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};



// Fetch liked packets
export const fetchLikedPackets = (userId) => async (dispatch, getState) => {
  try {
    console.log(userId)
    const token = getState().auth.user.token;
    console.log(token)

    dispatch(packetActions.setLoading(true)); // Set loading state to true

    const { data } = await request.get(`/api/packets/liked/${userId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    console.log(data)
    if (data) {
      dispatch(packetActions.setLikedPackets(data)); // Action creator to set liked packets
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    console.log("Failed to fetch liked packets");
   
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};



// getAllPacketsUsers;
export const fetchAllPacketsUsers = () => async (dispatch) => {
  try {
    dispatch(packetActions.setLoading(true)); // Set loading state to true
    const response = await request.get("/api/packets/users"); // Endpoint for fetching liked packets
    if (response.data) {
      dispatch(packetActions.setPackets(response.data)); // Action creator to set liked packets
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};

// Create a new packet
export const createPacket = (packetData, userId) => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = state.auth.user.token;

    if (!token) {
      throw new Error("No authentication token found.");
    }

    dispatch(packetActions.setLoading(true)); // Set loading state to true

    // Prepare form data
    const formData = new FormData();

    // Append packet name and description
    formData.append("name", packetData.name);
    formData.append("description", packetData.description);

    // Append the main packet image
    if (packetData.packetPic) {
      formData.append("packetPic", packetData.packetPic);
    }

    // Append questions as a JSON string
    formData.append("questions", JSON.stringify(packetData.questions));

    // Append question images
    packetData.questions.forEach((question, index) => {
      if (question.questionPic) {
        formData.append(`questionImage${index}`, question.questionPic);
      }
    });

    // Send the POST request to create a new packet
    const response = await request.post(`/api/packets/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token.accessToken}`, // Use the token for authorization
      },
    });

    if (response.data) {
      dispatch(packetActions.addPacket(response.data)); // Action creator to add the new packet
      // toast.success("Packet created successfully"); // Notify user of success
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
    // toast.error(error.response?.data?.message || 'Failed to create packet'); // Notify user of the error
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};


// Toggle like on a packet
export const toggleLikePacket = (packetId) => async (dispatch, getState) => {
  try {
    console.log(packetId);
    const token = getState().auth.user.token;
    dispatch(packetActions.setLoading(true)); // Set loading state to true

    const { data } = await request.put(
      `/api/packets/like/${packetId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );
console.log("data",data)
    if (data) {
      dispatch(packetActions.updatePacketLikes({ packetId, likes: data.likes })); // Update the packet likes in state// Show success message
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
   
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};

// Check if a packet is liked by the user
export const isLikedPacketByUser = (packetId, userId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.user.token;

    dispatch(packetActions.setLoading(true)); // Set loading state to true

    const { data } = await request.get(
      `/api/packets/${packetId}/is-liked/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (data) {
      dispatch(packetActions.setIsLikedPacket(data.isLiked)); // Set the isLiked state in the store
    } else {
      dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
    }
  } catch (error) {
   
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    ); // Set error state with the error message
  } finally {
    dispatch(packetActions.clearLoading()); // Set loading state to false
  }
};

// Toggle star on a question within a packet
export const toggleStarQuestion =
  (packetId, questionId) => async (dispatch, getState) => {
    try {
      const token = getState().auth.user.token;
      const userId = getState().auth.user._id; // Assuming user ID is stored here

      dispatch(packetActions.setLoading(true));

      const { data } = await request.put(
        `/api/packets/${packetId}/questions/${questionId}/star`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      if (data) {
     
          dispatch(
          packetActions.updateQuestionStar({
            packetId,
            questionId,
            isStarred: data.isStarred,
            userId,
          })
          
        );
      } else {
        dispatch(packetActions.setError("No data found in response"));
      }
    } catch (error) {
    
      dispatch(
        packetActions.setError(error.response?.data?.message || error.message)
      );
    } finally {
      dispatch(packetActions.clearLoading());
    }
  };


// Update mistakes for a question within a packet
export const updateMistakesForQuestion = (packetId, questionId, mistakesCount) => async (dispatch, getState) => {
  try {
    const token = getState().auth.user.token;

    dispatch(packetActions.setLoading(true));

    const { data } = await request.put(
      `/api/packets/${packetId}/questions/${questionId}/mistakes`,
      { mistakesCount },
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      }
    );

    if (data) {
      dispatch(packetActions.updateQuestionMistakes({ packetId, questionId, mistakesCount: data.mistakesCount }));

    } else {
      dispatch(packetActions.setError("No data found in response"));
    }
  } catch (error) {
 
    dispatch(packetActions.setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(packetActions.clearLoading());
  }
};

// Fetch mistakes for a user
export const fetchMistakes = (userId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.user.token;

    dispatch(packetActions.setLoading(true));

    const { data } = await request.get(`/api/packets/mistakes/${userId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (data) {
      dispatch(packetActions.setMistakes(data));
    } else {
      dispatch(packetActions.setError("No data found in response"));
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch mistakes");
    dispatch(packetActions.setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(packetActions.clearLoading());
  }
};

// Fetch starred questions for a user
export const fetchStarredQuestions = (userId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.user.token;

    dispatch(packetActions.setLoading(true));

    const { data } = await request.get(`/api/packets/starred-questions/${userId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (data) {
      dispatch(packetActions.setStarredQuestions(data)); // Set starred questions in state
    } else {
      dispatch(packetActions.setError("No data found in response"));
    }
  } catch (error) {

    dispatch(packetActions.setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(packetActions.clearLoading());
  }
};
// Delete packet by ID
// Delete packet by ID
export const deletePacket = (packetId) => async (dispatch, getState) => {
  try {
    // Get the token from the auth state
    const token = getState().auth.user.token;
    console.log(token)

    // Make the DELETE request to the API
    const response = await request.delete(`/api/packets/${packetId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`, // Use the token for authorization
      },
    });
    console.log(response)

    // // Dispatch action to remove the packet from the state
    // dispatch(packetActions.removePacket(packetId));

    // Show success notification
    // toast.success("Packet successfully deleted");
  } catch (error) {
    // Set error state with the error message
    dispatch(
      packetActions.setError(error.response?.data?.message || error.message)
    );

    // Show error notification
    // toast.error("Failed to delete packet");
  } finally {
    // Clear the loading state
    dispatch(packetActions.clearLoading());
  }
};

// Update an existing packet
export const updatePacket =
  (packetData, packetId) => async (dispatch, getState) => {
    console.log(packetId);
    try {
      const state = getState();
      const token = state.auth.user.token;
      console.log(token);

      const formData = new FormData();
      console.log(packetData);

      formData.append("name", packetData.name);
      formData.append("description", packetData.description);
      formData.append("questions", JSON.stringify(packetData.questions));

      // if (packetData.packetImage) {
      //   formData.append("image", packetData.packetImage);
      // }

      // (packetData.questionImages || []).forEach((image, index) => {
      //   if (image) {
      //     formData.append(`questionImage${index}`, image);
      //   }
      // });

      // Log FormData contents
      [...formData.entries()].forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      if (!token) {
        throw new Error("No authentication token found.");
      }

      dispatch(packetActions.setLoading(true)); // Set loading state to true

      const response = await request.put(`/api/packets/${packetId}`, formData, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`, // Use the token for authorization
        },
      });

      console.log("response", response);

      if (response.data) {
        dispatch(packetActions.updatePacket(response.data)); // Action creator to update the packet in the state
      } else {
        dispatch(packetActions.setError("No data found in response")); // Set an error if no data is found
      }
    } catch (error) {
      dispatch(
        packetActions.setError(error.response?.data?.message || error.message)
      ); // Set error state with the error message
    } finally {
      dispatch(packetActions.clearLoading()); // Set loading state to false
    }
  };
