import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

function Layout() {
  return (
    <div id="admin">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
