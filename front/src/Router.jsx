import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Toast from "./Components/Toast";
import AdminHome from "./Pages/Admin/Home";
import AdminLayout from "./Pages/Admin/Layout/Layout";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ResetPassword from "./Pages/Auth/ResetPassword";
import Error from "./Pages/Client/Error";
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
