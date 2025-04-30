import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/apiCalls/authApiCall";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <button onClick={handleLogout} className="flex items-center text-red-500">
      <FaSignOutAlt size={25} />
      <span className="ml-2 hidden lg:block">Déconnecter</span>
    </button>
  );
};

export default LogoutButton;
