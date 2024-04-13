import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import Toast from "../../../Components/Toast";
import Header from "./Header/Header";

/**
 * The layout of the admin page.
 *
 * @returns {JSX.Element} The layout component
 */
function Layout() {
  // Select the necessary data from the Redux store
  const { showToast } = useSelector((state) => state.toast);

  // Render the layout component
  return (
    <div id="admin">
      {/* The root element of the admin page */}
      <Header />
      {/* The header element of the admin page */}
      <main>
        <aside>
          <NavLink to="/admin" end>
            {/* The link to the admin page */}
            Admin
          </NavLink>
          <NavLink to="/admin/users">
            {/* The link to the users page */}
            Utilisateurs
          </NavLink>
        </aside>
        <Outlet />
        {/* The rendered page */}
      </main>
      {showToast && <Toast />}
      {/* The toast component if it's displayed */}
    </div>
  );
}

export default Layout;
