import request from "../../utils/request";
import { auditActions } from "../slices/auditSlice";

// Fetch audit by ID
export const getauditFromProjectById = (projectId,auditId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.user?.token;
    if (!token) {
      throw new Error("No authentication token found");
    }
console.log("*********token", token);
    dispatch(auditActions.setLoading(true));
    const response = await request.get(`/api/audits/${projectId}/${auditId}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    console.log("*********audit", response.data);

    if (response.data && response.data.audit) {
      dispatch(auditActions.setaudit(response.data.audit));
    } else {
      dispatch(auditActions.setError("No audit found in response"));
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch audit");
    dispatch(
      auditActions.setError(error.response?.data?.message || error.message)
    );
  } finally {
    dispatch(auditActions.setLoading(false));
  }
};
