import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import Toast from "../../../Components/Toast";
import Header from "./Header/Header";

function Layout() {
  const { showToast } = useSelector((state) => state.toast);
  return (
    <div id="admin">
      <Header />
      <main>
        <aside>
          <NavLink to="/admin" end>
            Admin
          </NavLink>
          <NavLink to="/admin/users">Utilisateurs</NavLink>
        </aside>
        <Outlet />
      </main>
      {showToast && <Toast />}
    </div>
  );
}

export default Layout;
