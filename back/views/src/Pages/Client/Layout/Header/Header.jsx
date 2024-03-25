import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggler from "../../../../Components/ThemeToggler";
import { logout } from "../../../../store/slices/auth";
import { resetFileState } from "../../../../store/slices/files";
import { resetFolderState } from "../../../../store/slices/folder";
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
        dispatch(resetFileState());
        dispatch(resetFolderState());
        navigate("/connexion");
      } else {
        console.log(res.error);
      }
    });
  };

  return (
    <header>
      <div className="burger-menu" onClick={() => setShowMobileNav(!showMobileNav)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <Link to="/" className="brand">
        <h1>
          <svg className="logo" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" viewBox="-1 3 26 18">
            <path d="M19.35 10.03A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.03A6.004 6.004 0 0 0 0 14a6 6 0 0 0 6 6h13a5 5 0 0 0 5-5c0-2.64-2.05-4.78-4.65-4.97z" />
          </svg>
          ArchiPix
        </h1>
      </Link>
      <nav>
        <NavLink to="/">Accueil</NavLink>
        {isLoggedIn ? (
          <>
            <NavLink to="/mes-fichiers">Mes Fichiers</NavLink>
            <NavLink to="/mon-compte">Mon compte</NavLink>
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
