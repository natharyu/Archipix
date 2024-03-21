import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../../store/slices/files";
import { getFolders } from "../../../../store/slices/folder";
import { setToast } from "../../../../store/slices/toast";
function DeleteMultipleModal({ setShowDeleteMultipleModal, files, folders, setSelectedFiles, setSelectedFolders }) {
  const { currentFolder, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    await fetch(`/api/v1/file/deleteMany`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: files, folders: folders, path: path.join("/") }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          return dispatch(setToast({ type: "error", message: res.error, showToast: true }));
        }
        setSelectedFiles([]);
        setSelectedFolders([]);
        setShowDeleteMultipleModal(false);
        setTimeout(() => {
          dispatch(setToast({ type: "success", message: res.message, showToast: true }));
          dispatch(getFiles(currentFolder));
          dispatch(getFolders(currentFolder));
        }, 200);
      })
      .catch((err) => {
        dispatch(setToast({ type: "error", message: err, showToast: true }));
      });
  };

  return (
    <div className="delete-modal">
      <div>
        <p>Etes vous sur de vouloir les supprimer ?</p>
        <p>Cette action est definitive et ne peut pas être annulée.</p>
        <div className="delete-modal-buttons">
          <button onClick={handleConfirm}>Supprimer</button>
          <button onClick={() => setShowDeleteMultipleModal(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMultipleModal;
