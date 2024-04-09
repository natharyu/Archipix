import { NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";

function AdminMobileNav({ setShowAdminMobileNav }) {
  return (
    <nav className="admin-mobile-nav">
      <div>
        <ul>
          <li>
            <h2>Menu</h2>
          </li>
          <ThemeToggler />
          <li>
            <button className="close-mobile-nav" onClick={() => setShowAdminMobileNav(false)}>
              X
            </button>
          </li>
        </ul>
        <ul>
          <li>
            <NavLink to="/" end onClick={() => setShowAdminMobileNav(false)}>
              Retour au site
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" end onClick={() => setShowAdminMobileNav(false)}>
              Accueil
            </NavLink>
          </li>
          <li>
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
