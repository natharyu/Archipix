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

  useEffect(async () => {
    await fetchTotalUsers();
    await fetchTotalFiles();
  }, []);
  return (
    <div>
      Home
      <h2>Total Users: {totalUsers}</h2>
      <h2>Total Files: {totalFiles}</h2>
    </div>
  );
}

export default Home;
