import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToast } from "../../store/slices/toast";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    await fetch("/api/v1/user/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUsers();
    setIsLoading(false);
  }, []);

  const handleDeleteUser = async (id) => {
    await fetch(`/api/v1/user/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          fetchUsers();
          dispatch(setToast({ message: "Utilisateur supprimé avec succes", type: "success", showToast: true }));
        }
      })
      .catch((error) => dispatch(setToast({ message: error, type: "error", showToast: true })));
  };

  const handleEditUser = async (id) => {
    navigate(`/admin/users/${id}`);
  };

  const handleAddUser = async () => {
    navigate("/admin/users/add");
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const filteredUsers = search
    ? users.filter(
        (user) =>
          user.username.toUpperCase().includes(search.toUpperCase()) ||
          user.email.toUpperCase().includes(search.toUpperCase()) ||
          user.role.toUpperCase().includes(search.toUpperCase())
      )
    : users;

  return (
    <section id="users">
      <h2>Utilisateurs</h2>
      <div className="admin-search">
        <SearchIcon />
        <input
          placeholder="Rechercher..."
          type="search"
          name="userSeach"
          id="userSearch"
          onChange={handleSearchChange}
        />
        <button className="admin-add" onClick={handleAddUser}>
          Ajouter un utilisateur
        </button>
      </div>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th className="hideonmobile">Email</th>
              <th className="hideonmobile">Role</th>
              <th className="hideonmobile">Email vérifié</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td className="hideonmobile">{user.email}</td>
                <td className="hideonmobile">{user.role}</td>
                <td className="hideonmobile">{user.is_verified ? "Oui" : "Non"}</td>
                <td>
                  <button className="admin-edit" onClick={() => handleEditUser(user.id)}>
                    Modifier
                  </button>
                  <button className="admin-delete" onClick={() => handleDeleteUser(user.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Users;
