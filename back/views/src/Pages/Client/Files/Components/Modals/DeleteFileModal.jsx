import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../../../store/slices/files";
import { setToast } from "../../../../../store/slices/toast";
/**
 * Delete file modal component
 * @param {Object} props component props
 * @param {Function} props.setShowDeleteFileModal function to set the visibility of the modal
 * @param {string} props.file_id id of the file to delete
 * @param {Function} props.setFilePreview function to set the file preview visibility
 */
function DeleteFileModal({ setShowDeleteFileModal, file_id, setFilePreview }) {
  /**
   * Get current folder and path from redux store
   */
  const { currentFolder, path } = useSelector((state) => state.folder);
  /**
   * Get dispatch function from redux store
   */
  const dispatch = useDispatch();
  /**
   * Handle confirm button click
   * Send a DELETE request to /api/v1/file/delete
   * with file_id and path of the file to delete as JSON payload
   * If the request fails, show an error toast
   * If the request succeeds, show a success toast
   * Update files and file preview visibility after a delay
   */
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
        setTimeout(() => dispatch(getFiles(currentFolder)), 200);
        setFilePreview(false);
        setShowDeleteFileModal(false);
      })
      .catch((err) => {
        dispatch(setToast({ type: "error", message: err, showToast: true }));
      });
  };
  return (
    <div className="delete-modal">
      <div>
        <p>Etes vous sure de vouloir supprimer ce fichier ?</p>
        <p>Cette action est definitive et ne peut pas être annulee.</p>
        <div className="delete-modal-buttons">
          <button onClick={handleConfirm}>Supprimer</button>
          <button onClick={() => setShowDeleteFileModal(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteFileModal;
