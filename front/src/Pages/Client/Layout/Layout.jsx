import { Outlet } from "react-router-dom";
import Contact from "../Contact";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

/**
 * The Layout component renders the Header, main content,
 * Footer and Contact components.
 *
 * @returns {JSX.Element} The Layout component.
 */
function Layout() {
  return (
    <div id="client">
      {/* Container for the entire page */}
      <Header /> {/* Render the Header component */}
      <main>
        {" "}
        {/* Main content container */}
        <Outlet /> {/* Render the children pages */}
      </main>
      <Footer /> {/* Render the Footer component */}
      <Contact /> {/* Render the Contact component */}
    </div>
  );
}

export default Layout;
