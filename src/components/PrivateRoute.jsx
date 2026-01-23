// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const PrivateRoute = ({ component: Component }) => {
//   const { isAuthenticated } = useAuth();

//   // If the user is not authenticated, redirect to the login page
//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   // If authenticated, render the desired component
//   return <Component />;
// };

// export default PrivateRoute;




// ------------------------------------------
// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "./Spinner";

const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated, loading } = useAuth();



  // Show loading spinner while checking authentication
  if (loading) {
    return <Spinner />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the component
  return <Component />;
};

export default PrivateRoute;