import HomeImage from "../../assets/images/home.jpeg";
/**
 * Home page component
 * @returns {JSX.Element} Home page
 */
function Home() {
  // JSX element for home page
  return (
    <section id="home">
      <article>
        <figure>
          {/* Image accueil */}
          <img src={HomeImage} alt="Image accueil" />
        </figure>
      </article>
      <article>
        <h3>ArchiPix</h3>
        <p>
          Découvrez notre solution de stockage dans le cloud, une plateforme innovante conçue pour répondre à vos
          besoins de stockage et de gestion de fichiers en toute sécurité.
        </p>
        <p>
          Notre application offre une expérience utilisateur fluide et intuitive, vous permettant d'accéder à vos
          fichiers à tout moment, où que vous soyez. Vos données sont protégées et accessibles en permanence.
        </p>
      </article>
    </section>
  );
}

export default Home;
