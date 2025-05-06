import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginUser } from "../redux/apiCalls/authApiCall"; // Update the import path as needed

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const { user, error } = useSelector((state) => state.auth); // Destructure user and error from auth state

  useEffect(() => {
    if (user) {
      navigate("/user/accueil");
    }
    if (error) {
      setErrorMessage(error); // Set error message if error exists
    }
  }, [user, error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message
    try {
      await dispatch(loginUser({ email, password })).unwrap(); // Ensure error handling in case of failure
      console.log("Login successful");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMessage(
        error || t("login.error_message") // Set the error message
      );
    }
  };

  return (
    <div className="flex md:flex w-full items-center justify-between h-screen">
      <div className="flex w-[95%] mx-auto md:w-1/2 lg:w-1/3  px-7 mt-2 rounded-lg   flex-col justify-center md:mx-auto  ">
        <h2 className="text-2xl font-bold text-center">{t("login.welcome")}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="block font-bold text-gray-700">
              {t("login.email_label")}
            </label>
            <input
              type="email"
              id="email"
              placeholder={t("login.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block font-bold text-gray-700">
              {t("login.password_label")}
            </label>
            <input
              type="password"
              id="password"
              placeholder={t("login.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div> // Display the error message
          )}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-bluemain rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
            >
              {t("login.submit_button")}
            </button>
          </div>
          <div>
            {t("login.no_account")}{" "}
            <Link to={"/signup"} className="text-bluemain">
              {t("login.create_account")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
