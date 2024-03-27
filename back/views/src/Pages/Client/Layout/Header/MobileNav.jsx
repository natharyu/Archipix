import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";

function MobileNav({ setShowMobileNav, handleLogout }) {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <nav className="mobile-nav">
      <div>
        <ul>
          <li>
            <h2>Menu</h2>
          </li>
          <ThemeToggler />
          <li>
            <button className="close-mobile-nav" onClick={() => setShowMobileNav(false)}>
              X
            </button>
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
        </ul>
      </div>
    </nav>
  );
}

export default MobileNav;