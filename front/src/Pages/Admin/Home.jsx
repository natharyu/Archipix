import { useEffect, useState } from "react";
import "../../main.scss";

/**
 * Home component for admin page.
 *
 * @returns {JSX.Element} The admin home component
 */
function Home() {
  // States to keep track of the total number of users and files
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  /**
   * Fetch the total number of users from the API
   */
  const fetchTotalUsers = async () => {
    try {
      const res = await fetch("/api/v1/user/total", { method: "GET" });
      const data = await res.json();
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fetch the total number of files from the API
   */
  const fetchTotalFiles = async () => {
    try {
      const res = await fetch("/api/v1/file/total", { method: "GET" });
      const data = await res.json();
      setTotalFiles(data.totalFiles);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Use effect to fetch the total number of users and files when the
   * component mounts and never re-run
   */
  useEffect(() => {
    fetchTotalUsers();
    fetchTotalFiles();
  }, []);

  return (
    <section id="admin-home">
      <article>
        <h3>Bienvenue sur le panneau administrateur</h3>
        <p>Ce panneau vous permet de voir les statistiques de l'application et de gérer les utilisateurs.</p>
      </article>

      <article>
        <h4>Statistiques de l'application</h4>
        <h4>
          Nombre d'utilisateurs total : <span>{totalUsers}</span>
        </h4>
        <h4>
          Nombre de fichiers total : <span>{totalFiles}</span>
        </h4>
      </article>
    </section>
  );
}

export default Home;
