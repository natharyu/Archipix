/**
 * Component representing the politique confidentialite page.
 * @returns {JSX.Element} The component
 */
function PolitiqueConfidentialite() {
  // The template for the page
  return (
    <section id="politique">
      <h3>Politique de Confidentialité</h3>
      <p>
        Cette Politique de Confidentialité décrit la manière dont ArchiPix collecte, utilise et partage vos informations
        personnelles lorsque vous utilisez notre application.
      </p>

      <h4>Collecte et Utilisation des Informations</h4>
      <p>
        Nous collectons des informations personnelles lorsque vous utilisez notre application. Les informations
        personnelles peuvent inclure, mais sans s'y limiter, votre nom, votre adresse e-mail, vos informations de
        connexion et d'autres informations que vous choisissez de fournir.
      </p>
      <p>
        Nous utilisons ces informations pour fournir, maintenir et améliorer notre application, répondre à vos demandes,
        personnaliser votre expérience utilisateur et communiquer avec vous.
      </p>

      <h4>Protection des Informations</h4>
      <p>
        La sécurité de vos informations personnelles est importante pour nous, et nous mettons en œuvre des mesures de
        sécurité raisonnables pour protéger vos informations contre tout accès non autorisé, toute utilisation abusive
        ou toute divulgation.
      </p>

      <h4>Partage des Informations</h4>
      <p>Nous ne partagerons pas vos informations personnelles avec des tiers sauf dans les cas suivants :</p>
      <ul>
        <li>
          - Lorsque nous sommes légalement tenus de le faire pour répondre à des exigences légales, protéger nos droits
          ou assurer la sécurité des utilisateurs.
        </li>
        <li>- Avec votre consentement préalable.</li>
      </ul>

      <h4>Cookies</h4>
      <p>
        Nous utilisons des cookies et des technologies similaires pour collecter des informations sur votre utilisation
        de notre application et améliorer votre expérience utilisateur. Vous pouvez contrôler les cookies via les
        paramètres de votre navigateur.
      </p>

      <h4>Accès et Modification de Vos Informations</h4>
      <p>
        Vous pouvez accéder et modifier vos informations personnelles en vous connectant à votre compte utilisateur sur
        notre application. Si vous rencontrez des difficultés pour accéder ou modifier vos informations, veuillez nous
        contacter.
      </p>

      <h4>Modifications de cette Politique de Confidentialité</h4>
      <p>
        Nous nous réservons le droit de mettre à jour ou de modifier cette Politique de Confidentialité à tout moment.
        Les modifications prendront effet dès leur publication sur notre application. Nous vous encourageons à consulter
        régulièrement cette Politique de Confidentialité pour rester informé de nos pratiques de confidentialité.
      </p>

      <h4>Contactez-Nous</h4>
      <p>
        Si vous avez des questions ou des préoccupations concernant cette Politique de Confidentialité, veuillez nous
        contacter à l'adresse suivante : anthony.dewitte@3wa.io. Ou via le formulaire de contact disponible
        <a onClick={() => document.getElementById("contact").showModal()}> ICI</a>
      </p>

      <p>Dernière mise à jour : 20 Avril 2024</p>
    </section>
  );
}

export default PolitiqueConfidentialite;
