import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/auth";

/**
 * LoggedOnly
 *
 * This component is used to restrict access to routes
 * that are only accessible when the user is logged in
 */
const LoggedOnly = ({ children }) => {
  // The navigate hook from react-router-dom
  const navigate = useNavigate();
  // The dispatch hook from react-redux
  const dispatch = useDispatch();
  // A state to keep track of whether the user is logged in
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Fetch the authorization information from the API
    fetch("/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      // Parse the JSON response
      .then((res) => res.json())
      // If the user is not logged in
      .then((data) => {
        // Redirect to the login page
        if (data.message) {
          dispatch(logout());
          navigate("/connexion");
          // If the user is logged in
        } else {
          // Set the authorized state to true
          setAuthorized(true);
        }
      })
      // If there is an error redirect to the login page
      .catch(() => {
        navigate("/connexion");
      });
    // Only run this useEffect hook on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user is authorized render the children,
  // otherwise render null
  return authorized ? children : null;
};

/**
 * AdminOnly
 *
 * This component is used to restrict access to routes
 * that are only accessible to admins
 */
const AdminOnly = ({ children }) => {
  // The navigate hook from react-router-dom
  const navigate = useNavigate();
  // The dispatch hook from react-redux
  const dispatch = useDispatch();
  // A state to keep track of whether the user is authorized
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Fetch the authorization information from the API
    fetch("/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      // Parse the JSON response
      .then((res) => res.json())
      // If the user is not logged in
      .then((data) => {
        // Redirect to the error page
        if (data.message) {
          dispatch(logout());
          navigate("/error");
          // If the user is not an admin
        } else if (data.role !== "admin") {
          navigate("/error");
          // If the user is logged in and an admin
        } else {
          // Set the authorized state to true
          setAuthorized(true);
        }
      })
      // If there is an error redirect to the error page
      .catch(() => {
        navigate("/error");
      });
    // Only run this useEffect hook on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);

  // If the user is authorized render the children,
  // otherwise render null
  return authorized ? children : null;
};

export { AdminOnly, LoggedOnly };
