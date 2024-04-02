import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    await fetch("/api/v1/user/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log(error));
  };

  useEffect(async () => {
    await fetchUsers();
  }, []);

  return (
    <div>
      Users
      {users == [] ? (
        <h1>Loading...</h1>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;
