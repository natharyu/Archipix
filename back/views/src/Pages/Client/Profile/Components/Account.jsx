import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../../store/slices/toast";
function Account() {
  const { id } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [userAccount, setUserAccount] = useState({});
  const dispatch = useDispatch();

  const fetchUser = async (id) => {
    await fetch(`/api/v1/user/get/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserAccount(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUser(id);
    setIsLoading(false);
  }, [id]);

  const handleEditAccount = async () => {
    await fetch(`/api/v1/user/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userAccount),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setToast({ message: data.message, type: "success", showToast: true }));
        setShowEditAccount(false);
      })
      .catch((error) => {
        dispatch(setToast({ message: error, type: "error", showToast: true }));
      });
  };

  return (
    <article className="profile-account">
      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {showEditAccount ? (
            <>
              <form className="edit-account-form">
                <p>Compte crée le : {new Date(userAccount.created_at).toLocaleDateString()}</p>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={userAccount.email}
                  onChange={(e) => setUserAccount({ ...userAccount, email: e.target.value })}
                />
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Nom d'utilisateur"
                  value={userAccount.username}
                  onChange={(e) => setUserAccount({ ...userAccount, username: e.target.value })}
                />
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mot de passe"
                  onChange={(e) => setUserAccount({ ...userAccount, password: e.target.value })}
                />
                <label htmlFor="firstname">Prénom</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Prénom"
                  value={userAccount?.firstname}
                  onChange={(e) => setUserAccount({ ...userAccount, firstname: e.target.value })}
                />
                <label htmlFor="lastname">Nom</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Nom"
                  value={userAccount?.lastname}
                  onChange={(e) => setUserAccount({ ...userAccount, lastname: e.target.value })}
                />
              </form>
              <div>
                <button onClick={() => setShowEditAccount(false)} className="cancel-edit">
                  Annuler les modifications
                </button>
                <button className="save-edit" onClick={handleEditAccount}>
                  Sauvegarder les modifications
                </button>
              </div>
            </>
          ) : (
            <>
              <form className="account-form">
                <p>Compte crée le : {new Date(userAccount.created_at).toLocaleDateString()}</p>
                <p>Email : {userAccount.email}</p>
                <p>Nom d'utilisateur : {userAccount.username}</p>
                <p>Prénom : {userAccount?.firstname}</p>
                <p>Nom : {userAccount?.lastname}</p>
              </form>
              <button onClick={() => setShowEditAccount(true)} className="edit-info">
                Modifier mes informations
              </button>
            </>
          )}
        </>
      )}
    </article>
  );
}

export default Account;
