import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Footer() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return (
    <footer>
      <section>
        <aside>
          <p>&copy; {new Date().getFullYear()} ArchiPix.</p>
          <p>Tous droits réservés.</p>
          <div>
            <a href="/mentions-legales">Mentions legales</a>
            <a href="/politique-confidentialite">Politique de confidentialité</a>
          </div>
        </aside>
        <nav>
          <h3>Menu</h3>
          <Link to="/">Accueil</Link>
          {isLoggedIn && <Link to="/mes-fichiers">Mes fichiers</Link>}
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
