import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
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
import { checkAuth } from "./store/slices/auth";
function Router() {
  const dispatch = useDispatch();
  const { showToast } = useSelector((state) => state.toast);

  useEffect(() => {
    // dispatch(getTheme());
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<ClientHome />} />
          <Route path="connexion" element={<Login />} />
          <Route path="inscription" element={<Register />} />
          <Route path="nouveau-mot-de-passe/:resetToken" element={<ResetPassword />} />
          <Route path="verification-email/:token" element={<VerifyEmail />} />
          <Route path="mes-fichiers" element={<Files />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      {showToast && <Toast />}
    </>
  );
}

export default Router;
