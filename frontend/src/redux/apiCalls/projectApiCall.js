import request from "../../utils/request";
import { projectActions } from "../slices/projectSlice";

// Fetch all projects
export const getProjects = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.user?.token;
    console.log("token", token);
    if (!token) {
      throw new Error("No authentication token found");
    }
    console.log("tokensssssssss", token.accessToken);

    dispatch(projectActions.setLoading(true));
    const response = await request.get("/api/projects", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
console.log("response", response.data);
    if (response.data && response.data.projects) {
      dispatch(projectActions.setprojects(response.data.projects));
    } else {
      dispatch(projectActions.setError("No projects found in response"));
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch projects");
    dispatch(
      projectActions.setError(error.response?.data?.message || error.message)
    );
  } finally {
    dispatch(projectActions.setLoading(false));
  }
};

// Fetch project by ID
export const getProjectById = (id) => async (dispatch, getState) => {
  try {
    const token = getState().auth.user?.token;
    if (!token) {
      throw new Error("No authentication token found");
    }

    dispatch(projectActions.setLoading(true));
    const response = await request.get(`/api/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    console.log("responseaaaaa", response.data);

    if (response.data && response.data.project) {
      dispatch(projectActions.setproject(response.data.project));
    } else {
      dispatch(projectActions.setError("No project found in response"));
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch project");
    dispatch(
      projectActions.setError(error.response?.data?.message || error.message)
    );
  } finally {
    dispatch(projectActions.setLoading(false));
  }
};
