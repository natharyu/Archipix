import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";

/**
 * Renders the mobile navigation bar with different menu options based on user authentication status and role.
 *
 * @param {function} setShowMobileNav - A function to control the visibility of the mobile navigation bar.
 * @param {function} handleLogout - A function to handle the logout functionality.
 * @return {JSX.Element} The JSX element representing the mobile navigation bar.
 */
function MobileNav({ setShowMobileNav, handleLogout }) {
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  return (
    <nav className="mobile-nav">
      <div>
        <ul>
          <li>
            <h3>Menu</h3>
          </li>
          <ThemeToggler />
          <li>
            <CloseOutlinedIcon className="closeBtn" onClick={() => setShowMobileNav(false)} />
          </li>
        </ul>
        <ul>
          <li></li>
          <li>
            <NavLink to="/" onClick={() => setShowMobileNav(false)}>
              Accueil
            </NavLink>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to="/mes-fichiers" onClick={() => setShowMobileNav(false)}>
                  Mes Fichiers
                </NavLink>
              </li>
              <li>
                <NavLink to="/mon-compte" onClick={() => setShowMobileNav(false)}>
                  Mon compte
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Deconnexion</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/connexion" onClick={() => setShowMobileNav(false)}>
                  Connexion
                </NavLink>
              </li>
              <li>
                <NavLink to="/inscription" onClick={() => setShowMobileNav(false)}>
                  Inscription
                </NavLink>
              </li>
            </>
          )}
          {role === "admin" && (
            <li>
              <NavLink to="/admin" onClick={() => setShowMobileNav(false)}>
                Administration
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default MobileNav;
