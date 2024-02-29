import { Outlet } from "react-router-dom";
import Contact from "../Contact";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

function Layout() {
  return (
    <div id="client">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Contact />
    </div>
  );
}

export default Layout;
