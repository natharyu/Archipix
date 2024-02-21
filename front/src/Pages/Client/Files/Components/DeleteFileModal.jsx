import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../../store/slices/files";
import { setToast } from "../../../../store/slices/toast";
function DeleteFileModal({ setShowDeleteFileModal, file_id }) {
  const { currentFolder, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    await fetch(`/api/v1/file/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_id: file_id, path: path.join("/") }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return dispatch(setToast({ type: "error", message: res.error, showToast: true }));
        }
        dispatch(setToast({ type: "success", message: res.message, showToast: true }));
        dispatch(getFiles(currentFolder));
        setShowDeleteFileModal(false);
      })
      .catch((err) => {
        dispatch(setToast({ type: "error", message: err, showToast: true }));
      });
  };
  return (
    <div className="delete-modal">
      <div>
        <p>Etes vous sur de vouloir supprimer ce fichier ?</p>
        <p>Cette action est definitive et ne peut pas être annulée.</p>
        <div className="delete-modal-buttons">
          <button onClick={handleConfirm}>Supprimer</button>
          <button onClick={() => setShowDeleteFileModal(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteFileModal;
