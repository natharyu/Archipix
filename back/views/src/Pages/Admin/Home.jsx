import { useEffect, useState } from "react";
import "../../main.scss";

function Home() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const fetchTotalUsers = async () => {
    await fetch("/api/v1/user/total", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setTotalUsers(data.totalUsers))
      .catch((error) => console.log(error));
  };

  const fetchTotalFiles = async () => {
    await fetch("/api/v1/file/total", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setTotalFiles(data.totalFiles))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalFiles();
  }, []);
  return (
    <section id="admin-home">
      <article>
        <h2>Bienvenue sur le panneau administrateur</h2>
        <p>Ce panneau vous permet de voir les statistiques de l'application et de gérer les utilisateurs.</p>
      </article>

      <article>
        <h3>Statistiques de l'application</h3>
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
