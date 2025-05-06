import request from "../../utils/request";
import { frameworkActions } from "../slices/frameworkSlice";

// Fetch all frameworks
export const getFrameworks = () => async (dispatch, getState) => {
  try {
    const token = getState().auth.user?.token;
    console.log("token", token);
    if (!token) {
      throw new Error("No authentication token found");
    }
    console.log("tokensssssssss", token.accessToken);

    dispatch(frameworkActions.setLoading(true));
    const response = await request.get("/api/frameworks", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("frameworkss hna", response.data);
      dispatch(frameworkActions.setframeworks(response.data));

  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch frameworks");
    dispatch(
      frameworkActions.setError(error.response?.data?.message || error.message)
    );
  } finally {
    dispatch(frameworkActions.setLoading(false));
  }
};

// Fetch framework by ID
export const getframeworkById = (id) => async (dispatch, getState) => {
  try {
    console.log("id", id);
    const token = getState().auth.user?.token;
    if (!token) {
      throw new Error("No authentication token found");
    }

    dispatch(frameworkActions.setLoading(true));
    const response = await request.get(`/api/frameworks/${id}`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });
    console.log("responseaaaaa", response.data);

    if (response.data) {
      dispatch(frameworkActions.setframework(response.data));
    } else {
      dispatch(frameworkActions.setError("No framework found in response"));
    }
  } catch (error) {
    // toast.error(error.response?.data?.message || "Failed to fetch framework");
    dispatch(
      frameworkActions.setError(error.response?.data?.message || error.message)
    );
  } finally {
    dispatch(frameworkActions.setLoading(false));
  }
};

export const mapFramework = (formData) => async (dispatch, getState) => {
  try {
       dispatch(frameworkActions.setLoading(true));
       dispatch(frameworkActions.setError(null));

    console.log('rana hna ***********')

    const token = getState().auth.user?.token;
    if (!token) {
      throw new Error("No authentication token found");
    }
    // dispatch(frameworkActions.setLoading(true));
   console.log("formData", formData);
    const response = await request.post("/api/frameworks/map", formData, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle response: mapping and Excel download
    const { mapping, excelFile } = response.data;

    // Update the store with the mapped frameworks
    dispatch(frameworkActions.setframeworks([mapping]));

    // Generate Excel file download
    const downloadLink = document.createElement("a");
    downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelFile}`;
    downloadLink.download = "mapped_framework.xlsx";
    downloadLink.click();
  } catch (error) {
    dispatch(
      frameworkActions.setError(error.response?.data?.message || error.message)
    );
    console.error("Mapping Error:", error);
  } finally {
    dispatch(frameworkActions.setLoading(false));
  }
};
