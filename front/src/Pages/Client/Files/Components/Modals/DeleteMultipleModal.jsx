import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../../../store/slices/files";
import { getFolders } from "../../../../../store/slices/folder";
import { setToast } from "../../../../../store/slices/toast";
/**
 * Delete multiple modal component
 * @param {Function} setShowDeleteMultipleModal Function to hide the delete multiple modal
 * @param {Array} files Array of selected files
 * @param {Array} folders Array of selected folders
 * @param {Function} setSelectedFiles Function to set the selected files
 * @param {Function} setSelectedFolders Function to set the selected folders
 */
function DeleteMultipleModal({ setShowDeleteMultipleModal, files, folders, setSelectedFiles, setSelectedFolders }) {
  // Destructure the currentFolder and path from the folder redux state
  const { currentFolder, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();

  /**
   * Handle confirm button click event
   * Delete the selected files and folders on the server
   */
  const handleConfirm = async () => {
    try {
      const res = await fetch(`/api/v1/file/deleteMany`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files, folders, path: path.join("/") }),
      });
      const data = await res.json();

      if (data.error) {
        // Show error toast if there is an error
        return dispatch(setToast({ type: "error", message: data.error, showToast: true }));
      }

      // Empty the selected files and folders
      setSelectedFiles([]);
      setSelectedFolders([]);
      // Hide the delete multiple modal
      setShowDeleteMultipleModal(false);

      // Show success toast after 500ms
      setTimeout(() => {
        dispatch(setToast({ type: "success", message: data.message, showToast: true }));
        // Refresh the files and folders
        dispatch(getFiles(currentFolder));
        dispatch(getFolders(currentFolder));
      }, 500);
    } catch (err) {
      // Show error toast if there is an error
      dispatch(setToast({ type: "error", message: err, showToast: true }));
    }
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
