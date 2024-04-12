import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";
import AdminMobileNav from "./AdminMobileNav";
/**
 * The header component for the admin pages.
 *
 * @returns {JSX.Element} The header component.
 */
function Header() {
  // Tracks whether the admin mobile nav is visible or not.
  const [showAdminMobileNav, setShowAdminMobileNav] = useState(false);

  /**
   * Toggles the visibility of the admin mobile nav.
   */
  const toggleAdminMobileNav = () => {
    setShowAdminMobileNav(!showAdminMobileNav);
  };

  return (
    <header>
      {/* Hamburger menu button. */}
      <div className="burger-menu" onClick={toggleAdminMobileNav}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      {/* Link to the admin homepage. */}
      <Link to="/admin" className="brand">
        <h1>Panneau d'administration</h1>
      </Link>
      <nav>
        {/* Theme toggler. */}
        <ThemeToggler />
        {/* Link to the main site. */}
        <NavLink to="/">Retour au site</NavLink>
      </nav>
      {/* Conditionally renders the admin mobile nav. */}
      {showAdminMobileNav && <AdminMobileNav setShowAdminMobileNav={setShowAdminMobileNav} />}
    </header>
  );
}

export default Header;
