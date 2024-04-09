import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setToast } from "../../../store/slices/toast";

function EditUser() {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateUser, setUpdateUser] = useState({});

  const { id } = useParams();

  const fetchUser = async () => {
    await fetch(`/api/v1/user/get/${id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUser(id);
    setIsLoading(false);
  }, []);

  const handleCancel = () => {
    navigate("/admin/users");
  };
  const handleUpdateUser = async () => {
    await fetch(`/api/v1/user/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUser),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return dispatch(setToast({ message: data.error, type: "error", showToast: true }));
        }
        navigate("/admin/users");
        dispatch(setToast({ message: data.message, type: "success", showToast: true }));
      })
      .catch((error) => dispatch(setToast({ message: error, type: "error", showToast: true })));
  };

  return (
    <section id="editUser">
      <h2>Modifier l'utilisateur</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
              setUpdateUser({ ...updateUser, email: e.target.value });
            }}
          />
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={(e) => {
              setUser({ ...user, username: e.target.value });
              setUpdateUser({ ...updateUser, username: e.target.value });
            }}
          />
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={user.firstname}
            onChange={(e) => {
              setUser({ ...user, firstname: e.target.value });
              setUpdateUser({ ...updateUser, firstname: e.target.value });
            }}
          />
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={user.lastname}
            onChange={(e) => {
              setUser({ ...user, lastname: e.target.value });
              setUpdateUser({ ...updateUser, lastname: e.target.value });
            }}
          />
          <label htmlFor="storage">Stockage</label>
          <input
            type="text"
            id="storage"
            name="storage"
            value={user.storage}
            onChange={(e) => {
              setUser({ ...user, storage: e.target.value });
              setUpdateUser({ ...updateUser, storage: e.target.value });
            }}
            disabled
          />
          <label htmlFor="isAdmin">Role</label>
          <select
            id="isAdmin"
            name="isAdmin"
            value={user.role}
            onChange={(e) => {
              setUser({ ...user, role: e.target.value });
              setUpdateUser({ ...updateUser, role: e.target.value });
            }}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <label htmlFor="is_verified">Email vérifié</label>
          <select
            id="is_verified"
            name="is_verified"
            value={user.is_verified}
            onChange={(e) => {
              setUser({ ...user, is_verified: e.target.value });
              setUpdateUser({ ...updateUser, is_verified: e.target.value });
            }}
          >
            <option value={0}>Non</option>
            <option value={1}>Oui</option>
          </select>
        </form>
      )}
      <div className="editUserButtons">
        <button className="admin-edit" onClick={handleUpdateUser}>
          Modifier
        </button>
        <button className="admin-delete" onClick={handleCancel}>
          Annuler
        </button>
      </div>
    </section>
  );
}

export default EditUser;
