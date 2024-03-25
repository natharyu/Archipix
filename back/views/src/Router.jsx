import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Toast from "./Components/Toast";
import AdminHome from "./Pages/Admin/Home";
import AdminLayout from "./Pages/Admin/Layout/Layout";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ResetPassword from "./Pages/Auth/ResetPassword";
import VerifyEmail from "./Pages/Auth/VerifyEmail";
import Error from "./Pages/Client/Error";
import Files from "./Pages/Client/Files/Files";
import ClientHome from "./Pages/Client/Home";
import ClientLayout from "./Pages/Client/Layout/Layout";
import Profile from "./Pages/Client/Profile/Profile";
import { AdminOnly, LoggedOnly } from "./middleware/Middleware";
import { checkAuth } from "./store/slices/auth";
function Router() {
  const dispatch = useDispatch();
  const { showToast } = useSelector((state) => state.toast);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route path="" element={<ClientHome />} />
          <Route path="connexion" element={<Login />} />
          <Route path="inscription" element={<Register />} />
          <Route path="nouveau-mot-de-passe/:resetToken" element={<ResetPassword />} />
          <Route path="verification-email/:token" element={<VerifyEmail />} />
          <Route
            path="mes-fichiers"
            element={
              <LoggedOnly>
                <Files />
              </LoggedOnly>
            }
          />
          <Route
            path="mon-compte"
            element={
              <LoggedOnly>
                <Profile />
              </LoggedOnly>
            }
          />
          <Route path="*" element={<Error />} />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminOnly>
              <AdminLayout />
            </AdminOnly>
          }
        >
          <Route
            index
            element={
              <AdminOnly>
                <AdminHome />
              </AdminOnly>
            }
          />
        </Route>
      </Routes>
      {showToast && <Toast />}
    </BrowserRouter>
  );
}

export default Router;
