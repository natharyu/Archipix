import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";
import AdminMobileNav from "./AdminMobileNav";
function Header() {
  const [showAdminMobileNav, setShowAdminMobileNav] = useState(false);
  return (
    <header>
      <div className="burger-menu" onClick={() => setShowAdminMobileNav(!showAdminMobileNav)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <Link to="/admin" className="brand">
        <h1>Panneau d'administration</h1>
      </Link>
      <nav>
        <ThemeToggler />
        <NavLink to="/">Retour au site</NavLink>
      </nav>
      {showAdminMobileNav && <AdminMobileNav setShowAdminMobileNav={setShowAdminMobileNav} />}
    </header>
  );
}

export default Header;
