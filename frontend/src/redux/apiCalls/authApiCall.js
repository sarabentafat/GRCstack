import { authActions } from "../slices/authSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";
// login user
export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/auth/login", user);
      dispatch(authActions.login(data));
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      // toast.error(error.response.data.message);
        dispatch(authActions.setError(error.response.data.message));

    }
  };
}
export function logoutUser() {
  console.log('hh')
  return async (dispatch) => {
    try {
      dispatch(authActions.logout());
      localStorage.removeItem("userInfo");
    } catch (error) {
      console.log(error);
    }
  };
}

// register user
export function registerUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/auth/register", user);
      dispatch(authActions.register(data.message));
    } catch (error) {
  
      console.log(error);
    }
  };
}

// Verify user account
export function verifyUser(userId, token) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/auth/${userId}/verify/${token}`);
      dispatch(authActions.verify(data.message));
    
    } catch (error) {
     
      console.log(error);
    }
  };
}

//check-email-username
// check-email-username
export function checkEmailUsername(user) {
  console.log("user",user);
  return async (dispatch) => {
    try {
      const response = await request.post("/api/auth/check-email-username", user);
      const { data } = response;
console.log(data)
      // Assuming authActions.checkEmailUsername expects an object with emailExists and usernameExists
      dispatch(authActions.checkemailusername(data)); 

    } catch (error) {
      console.log(error)

    }
  };
}
