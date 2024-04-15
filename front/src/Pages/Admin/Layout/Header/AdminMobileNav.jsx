import { NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";

/**
 * Mobile navbar for the admin page.
 * @param {function} setShowAdminMobileNav - Function to set the state of the mobile nav.
 * @returns {JSX.Element} The admin mobile nav component.
 */
function AdminMobileNav({ setShowAdminMobileNav }) {
  return (
    <nav className="admin-mobile-nav">
      {/* Wrapper for the two lists */}
      <div>
        {/* Header for the menu */}
        <ul>
          <li>
            <h3>Menu</h3>
          </li>
          {/* Toggle for the dark/light theme */}
          <ThemeToggler />
          {/* Button to close the mobile nav */}
          <li>
            <button className="close-mobile-nav" onClick={() => setShowAdminMobileNav(false)}>
              X
            </button>
          </li>
        </ul>
        {/* List of links for the admin page */}
        <ul>
          <li>
            {/* Link to the home page */}
            <NavLink to="/" end onClick={() => setShowAdminMobileNav(false)}>
              Retour au site
            </NavLink>
          </li>
          <li>
            {/* Link to the admin home page */}
            <NavLink to="/admin" end onClick={() => setShowAdminMobileNav(false)}>
              Accueil
            </NavLink>
          </li>
          <li>
            {/* Link to the users page */}
            <NavLink to="/admin/users" onClick={() => setShowAdminMobileNav(false)}>
              Utilisateurs
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminMobileNav;
