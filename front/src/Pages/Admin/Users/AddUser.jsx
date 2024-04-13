import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToast } from "../../../store/slices/toast";
/**
 * Component to add a new user in the admin panel.
 *
 * @returns {JSX.Element} The add user component.
 */
function AddUser() {
  // State to hold the new user's data
  const [newUser, setNewUser] = useState({});
  // State to toggle loading spinner
  const [isLoading, setIsLoading] = useState(false);
  // Navigate through routes
  const navigate = useNavigate();
  // Dispatch Redux actions
  const dispatch = useDispatch();

  /**
   * Handle user's submission by sending a POST request
   * to the /api/v1/user/add endpoint with the new user's data.
   */
  const handleAddUser = async () => {
    // If some required fields are missing, display a warning message
    if (!newUser.email || !newUser.password || !newUser.username) {
      return dispatch(
        setToast({
          message: "Veuillez remplir les champs requis",
          type: "warning",
          showToast: true,
        })
      );
    }

    // Send request to add new user
    await fetch("/api/v1/user/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        // If the new user was added successfully, display a success message
        // and redirect the user to the users page
        dispatch(
          setToast({
            message: data.message,
            type: "success",
            showToast: true,
          })
        );
        navigate("/admin/users");
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
   * Handle cancel button click by redirecting the user to the users page.
   */
  const handleCancel = () => {
    navigate("/admin/users");
  };

  /**
   * Update the new user's data state on input change.
   * Set the initial values of the new user by setting the is_verified and role fields.
   */
  useEffect(() => {
    setIsLoading(true);
    newUser.is_verified = 1;
    newUser.role = "user";
    setIsLoading(false);
  }, []);

  return (
    <section id="addUser">
      <h2>Ajouter un utilisateur</h2>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <form>
            <label htmlFor="email">
              Email <span>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required={true}
            />
            <label htmlFor="password">
              Mot de passe provisoire <span>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required={true}
            />
            <label htmlFor="username">
              Nom d'utilisateur <span>*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required={true}
            />
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              onChange={(e) => setNewUser({ ...newUser, firstname: e.target.value })}
            />
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              onChange={(e) => setNewUser({ ...newUser, lastname: e.target.value })}
            />
            <label htmlFor="isAdmin">Role</label>
            <select id="isAdmin" name="isAdmin" onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <p>
              <span>*</span> Champs obligatoires
            </p>
          </form>
          <div className="editUserButtons">
            <button className="admin-add" onClick={handleAddUser}>
              Ajouter
            </button>
            <button className="admin-delete" onClick={handleCancel}>
              Annuler
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default AddUser;
