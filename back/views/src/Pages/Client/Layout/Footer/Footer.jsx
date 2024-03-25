import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Footer() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return (
    <footer>
      <section>
        <aside>
          <p>ArchiPix &copy; {new Date().getFullYear()} Tous droits réservés.</p>
        </aside>
        <nav>
          <h3>Menu</h3>
          <Link to="/">Accueil</Link>
          {isLoggedIn && <Link to="/mes-fichiers">Mes fichiers</Link>}
          <Link to="/a-propos">A propos</Link>
          <button onClick={() => document.getElementById("contact").showModal()}>Contact</button>
        </nav>
        <div>
          <h3>Contactez-nous</h3>
          <p>Email : anthony.dewitte@3wa.io</p>
          <p>Téléphone : +1 123-456-7890</p>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
