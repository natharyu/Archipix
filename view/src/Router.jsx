import { Route, Routes } from "react-router-dom";
import AdminHome from "./Pages/Admin/Home";
import AdminLayout from "./Pages/Admin/Layout/Layout";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Error from "./Pages/Client/Error";
import ClientHome from "./Pages/Client/Home";
import ClientLayout from "./Pages/Client/Layout/Layout";
function Router() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<ClientHome />} />
        <Route path="connexion" element={<Login />} />
        <Route path="enregistrement" element={<Register />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
      </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default Router;
