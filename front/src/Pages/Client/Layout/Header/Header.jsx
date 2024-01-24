import { useState } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";
import MobileNav from "./MobileNav";
function Header() {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <header>
      <div className="burger-menu" onClick={() => setShowMobileNav(!showMobileNav)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <h1>Mon e-commerce</h1>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/connexion">Login</NavLink>
        <ThemeToggler />
      </nav>
      {showMobileNav && <MobileNav setShowMobileNav={setShowMobileNav} />}
    </header>
  );
}

export default Header;
