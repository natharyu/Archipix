import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

/**
 * The Footer component
 * @returns {JSX.Element} The footer element
 */
function Footer() {
  // Retrieves the authentication state from the Redux store
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    // The HTML <footer> element
    <footer>
      <section>
        <aside>
          <p>
            {/* Copyright notice */}
            &copy; {new Date().getFullYear()} ArchiPix.
          </p>
          <p>
            {/* Rights reserved notice */}
            Tous droits réservés.
          </p>
          <div>
            <a href="/mentions-legales">Mentions legales</a>
            <a href="/politique-confidentialite">Politique de confidentialité</a>
          </div>
        </aside>
        <nav>
          <h3>Menu</h3>
          <Link to="/">Accueil</Link>
          {/* Link to the user's files (if logged in) */}
          {isLoggedIn && (
            <>
              <Link to="/mes-fichiers">Mes fichiers</Link>
              <Link to="/mon-compte">Mon compte</Link>
            </>
          )}
          <button onClick={() => document.getElementById("contact").showModal()}>Contact</button>
        </nav>
        <div>
          <h3>Contactez-nous</h3>
          <p>Email : anthony.dewitte@3wa.io</p>
          <p>Téléphone : +33 123-456-789</p>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
