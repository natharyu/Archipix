import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToast } from "../../../store/slices/toast";
function AddUser() {
  const [newUser, setNewUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.username) {
      return dispatch(setToast({ message: "Veuillez remplir les champs requis", type: "warning", showToast: true }));
    }
    await fetch("/api/v1/user/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setToast({ message: data.message, type: "success", showToast: true }));
        navigate("/admin/users");
      })
      .catch((error) => dispatch(setToast({ message: error, type: "error", showToast: true })));
  };
  const handleCancel = () => {
    navigate("/admin/users");
  };

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
