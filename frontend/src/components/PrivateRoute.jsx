import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth); // Get the user state from Redux

  return user ? children : <Navigate to="/" />; // If logged in, show the component, else redirect to landing page
};

export default PrivateRoute;
