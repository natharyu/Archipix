import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../store/slices/auth";
import { setToast } from "../../../../store/slices/toast";
function DeleteAccountModal({ setShowDeleteAccountModal, id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleConfirm = async (id) => {
    await fetch(`/api/v1/user/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          dispatch(logout());
          navigate("/");
          dispatch(setToast({ message: "Compte et fichiers supprimés avec succes", type: "success", showToast: true }));
        }
      })
      .catch((error) => dispatch(setToast({ message: error, type: "error", showToast: true })));
  };

  return (
    <div className="delete-account-modal">
      <div>
        <p>Etes vous sur de vouloir supprimer votre compte ?</p>
        <p>Cette action est definitive et ne peut pas être annulée.</p>
        <div className="delete-modal-buttons">
          <button onClick={() => handleConfirm(id)}>Supprimer</button>
          <button onClick={() => setShowDeleteAccountModal(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountModal;
