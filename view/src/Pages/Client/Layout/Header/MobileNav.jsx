import { NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";
function MobileNav({ setShowMobileNav }) {
  return (
    <nav className="mobile-nav">
      <div>
        <ul>
          <li>
            <h2>Menu</h2>
          </li>
          <li>
            <button className="close" onClick={() => setShowMobileNav(false)}>
              X
            </button>
          </li>
        </ul>
        <ul>
          <li>
            <ThemeToggler />
          </li>
          <li>
            <NavLink to="/" onClick={() => setShowMobileNav(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/connexion" onClick={() => setShowMobileNav(false)}>
              Login
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MobileNav;
