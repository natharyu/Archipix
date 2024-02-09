import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";
import { logout } from "../../../../store/slices/auth";
import MobileNav from "./MobileNav";
function Header() {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch(`/auth/logout`, {
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        dispatch(logout());
        navigate("/connexion");
      } else {
        console.log(res.error);
      }
    });
  };

  return (
    <header>
      <div className="burger-menu" onClick={() => setShowMobileNav(!showMobileNav)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <Link to="/" className="brand">
        <h1>Home-Cloud</h1>
      </Link>
      <nav>
        <NavLink to="/">Accueil</NavLink>
        {isLoggedIn ? (
          <>
            <NavLink to="/mes-fichiers">Mes Fichiers</NavLink>
            <button onClick={handleLogout}>Deconnexion</button>
          </>
        ) : (
          <>
            <NavLink to="/connexion">Connexion</NavLink>
            <NavLink to="/inscription">Inscription</NavLink>
          </>
        )}

        <ThemeToggler />
      </nav>
      {showMobileNav && <MobileNav setShowMobileNav={setShowMobileNav} />}
    </header>
  );
}

export default Header;
