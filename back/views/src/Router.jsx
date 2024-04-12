import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Toast from "./Components/Toast";
import AdminHome from "./Pages/Admin/Home";
import AdminLayout from "./Pages/Admin/Layout/Layout";
import Users from "./Pages/Admin/Users";
import AddUser from "./Pages/Admin/Users/AddUser";
import EditUser from "./Pages/Admin/Users/EditUser";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ResetPassword from "./Pages/Auth/ResetPassword";
import VerifyEmail from "./Pages/Auth/VerifyEmail";
import Error from "./Pages/Client/Error";
import Files from "./Pages/Client/Files/Files";
import ClientHome from "./Pages/Client/Home";
import ClientLayout from "./Pages/Client/Layout/Layout";
import MentionsLegales from "./Pages/Client/MentionsLegales";
import PolitiqueConfidentialite from "./Pages/Client/PolitiqueConfidentialite";
import Profile from "./Pages/Client/Profile/Profile";
import ShareFile from "./Pages/Client/Share/ShareFile";
import ShareFolder from "./Pages/Client/Share/ShareFolder";
import { AdminOnly, LoggedOnly } from "./middleware/Middleware";
import { checkAuth } from "./store/slices/auth";
/**
 * The Router component is the entry point of the app.
 * It handles the routing of the different pages and
 * components of the app.
 */
function Router() {
  // Redux dispatch and toast state from store
  const dispatch = useDispatch();
  const { showToast } = useSelector((state) => state.toast);

  // On mount, check if user is authenticated
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      {/* The switch will render the first matched route */}
      <Routes>
        {/* Public routes */}
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
          <Route path="politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="mentions-legales" element={<MentionsLegales />} />
          <Route path="share/folder/:id" element={<ShareFolder />} />
          <Route path="share/file/:id" element={<ShareFile />} />
          {/* If no route matches, render the Error component */}
          <Route path="*" element={<Error />} />
        </Route>
        {/* Private routes */}
        <Route
          path="/admin"
          element={
            <AdminOnly>
              <AdminLayout />
            </AdminOnly>
          }
        >
          <Route
            path=""
            element={
              <AdminOnly>
                <AdminHome />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminOnly>
                <Users />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/users/add"
            element={
              <AdminOnly>
                <AddUser />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <AdminOnly>
                <EditUser />
              </AdminOnly>
            }
          />
        </Route>
      </Routes>
      {/* If toast is displayed, render the Toast component */}
      {showToast && <Toast />}
    </BrowserRouter>
  );
}

export default Router;
