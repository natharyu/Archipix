import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      Layout
      <main id="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
