import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/auth";

const LoggedOnly = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          dispatch(logout());
          navigate("/connexion");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        navigate("/connexion");
      });
  }, []);

  return authorized ? children : null;
};

const AdminOnly = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    fetch("/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          dispatch(logout());
          navigate("/error");
        } else if (data.role !== "admin") {
          navigate("/error");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        navigate("/error");
      });
  }, [dispatch, navigate]);

  return authorized ? children : null;
};

export { AdminOnly, LoggedOnly };
