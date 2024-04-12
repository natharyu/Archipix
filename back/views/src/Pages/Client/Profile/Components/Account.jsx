import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../../../../store/slices/toast";
import DeleteAccountModal from "./DeleteAccountModal";
/**
 * Function that manages the user account profile display and editing.
 *
 * @param {string} id - The user ID used to fetch and update user data
 * @return {JSX.Element} The JSX element representing the user account profile
 */
function Account() {
  const { id } = useSelector((state) => state.user); // user ID used to fetch and update user data
  const [isLoading, setIsLoading] = useState(false); // flag to display a loading message
  const [showEditAccount, setShowEditAccount] = useState(false); // flag to display the edit account form
  const [userAccount, setUserAccount] = useState({}); // user data fetched from the API
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false); // flag to display the delete account modal
  const dispatch = useDispatch(); // redux dispatch function

  // Fetch user data from API
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

  // Use effect hook to fetch user data when component mounts and when the component updates
  // (i.e when the user ID changes)
  useEffect(() => {
    setIsLoading(true); // display a loading message
    fetchUser(id); // fetch user data from API
    setIsLoading(false); // stop displaying the loading message
  }, [id]);

  // Function to handle edit account form submission
  const handleEditAccount = async () => {
    await fetch(`/api/v1/user/update/${id}`, {
      // send a PUT request to update user data
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userAccount), // send the updated user data as JSON in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setToast({ message: data.message, type: "success", showToast: true })); // display a success toast
        setShowEditAccount(false); // hide the edit account form
      })
      .catch((error) => {
        dispatch(setToast({ message: error, type: "error", showToast: true })); // display an error toast
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
                <p className="title">Email :</p>
                <p className="content">{userAccount.email}</p>
                <p className="title">Nom d'utilisateur :</p>
                <p className="content">{userAccount.username}</p>
                <p className="title">Prénom :</p>
                <p className="content">{userAccount?.firstname}</p>
                <p className="title">Nom :</p>
                <p className="content">{userAccount?.lastname}</p>
              </form>
              <div>
                <button onClick={() => setShowEditAccount(true)} className="edit-info">
                  Modifier mes informations
                </button>
                <button className="delete-account" onClick={() => setShowDeleteAccountModal(true)}>
                  Supprimer mon compte
                </button>
              </div>
            </>
          )}
        </>
      )}
      {showDeleteAccountModal && <DeleteAccountModal setShowDeleteAccountModal={setShowDeleteAccountModal} id={id} />}
    </article>
  );
}

export default Account;
