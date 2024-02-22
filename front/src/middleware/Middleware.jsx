import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/auth";

export const LoggedOnly = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (
    location.pathname !== "/" &&
    location.pathname !== "/connexion" &&
    location.pathname !== "/inscription" &&
    location.pathname !== "/nouveau-mot-de-passe/:resetToken" &&
    location.pathname !== "/verification-email/:token"
  ) {
    fetch("/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          dispatch(logout());
          navigate("/connexion");
        }
      });
  }
};

export const AdminOnly = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (location.pathname.includes("/admin")) {
    fetch("/auth/refresh", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          dispatch(logout());
          navigate("/connexion");
        } else if (data.role !== "admin") {
          navigate("/");
        }
      });
  }
};
