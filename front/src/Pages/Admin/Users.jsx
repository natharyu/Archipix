import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToast } from "../../store/slices/toast";

/**
 * The component that displays all the users in the admin dashboard.
 */
function Users() {
  // The list of users
  const [users, setUsers] = useState([]);
  // The search query
  const [search, setSearch] = useState("");
  // Whether the component is loading data from the server
  const [isLoading, setIsLoading] = useState(false);
  // The function to navigate to a different route
  const navigate = useNavigate();
  // The function to dispatch actions to the redux store
  const dispatch = useDispatch();

  /**
   * Fetches all the users from the server.
   */
  const fetchUsers = async () => {
    setIsLoading(true);
    await fetch("/api/v1/user/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  /**
   * When the component mounts, fetch all the users from the server.
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Deletes a user from the server and reloads the users.
   *
   * @param {number} id The id of the user to be deleted
   */
  const handleDeleteUser = async (id) => {
    await fetch(`/api/v1/user/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          fetchUsers();
          dispatch(
            setToast({
              message: "Utilisateur supprimé avec succes",
              type: "success",
              showToast: true,
            })
          );
        }
      })
      .catch((error) =>
        dispatch(
          setToast({
            message: error,
            type: "error",
            showToast: true,
          })
        )
      );
  };

  /**
   * Navigates to the edit user page.
   *
   * @param {number} id The id of the user to be edited
   */
  const handleEditUser = (id) => {
    navigate(`/admin/users/${id}`);
  };

  /**
   * Navigates to the add user page.
   */
  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  /**
   * Updates the search query.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The change event
   */
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  /**
   * Filters the users based on the search query.
   */
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
      <h3>Utilisateurs</h3>
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
        <h3>Loading...</h3>
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
