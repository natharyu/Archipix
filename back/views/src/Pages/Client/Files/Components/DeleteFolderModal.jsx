import { useDispatch, useSelector } from "react-redux";
import { getFolders } from "../../../../store/slices/folder";
import { setToast } from "../../../../store/slices/toast";
function DeleteFolderModal({ setShowDeleteFolderModal, folder_id }) {
  const { currentFolder, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    await fetch(`/api/v1/folder/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder_id: folder_id, path: path.join("/") }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return dispatch(setToast({ message: res.error, type: "error", showToast: true }));
        }
        dispatch(setToast({ message: res.message, type: "success", showToast: true }));
        setTimeout(() => dispatch(getFolders(currentFolder)), 200);
        setShowDeleteFolderModal(false);
      })
      .catch((err) => {
        dispatch(setToast({ message: err, type: "error", showToast: true }));
      });
  };
  return (
    <div className="delete-modal">
      <div>
        <p>Etes vous sur de vouloir supprimer ce dossier ?</p>
        <p>Si vous supprimez ce dossier, toutes ses sous-dossiers et fichiers seront supprimés aussi.</p>
        <p>Cette action est definitive et ne peut pas être annulée.</p>
        <div className="delete-modal-buttons">
          <button onClick={handleConfirm}>Supprimer</button>
          <button onClick={() => setShowDeleteFolderModal(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteFolderModal;
