import { useDispatch, useSelector } from "react-redux";
import { getFolders } from "../../../../../store/slices/folder";
import { setToast } from "../../../../../store/slices/toast";
/**
 * Delete folder modal component.
 *
 * @param {Object} props Component properties
 * @param {Function} props.setShowDeleteFolderModal Function to call when closing the modal
 * @param {string} props.folder_id ID of the folder to delete
 * @returns {JSX.Element} Delete folder modal
 */
function DeleteFolderModal({ setShowDeleteFolderModal, folder_id }) {
  /**
   * Currently opened folder and its path.
   * @type {{currentFolder: string, path: string[]}}
   */
  const { currentFolder, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();

  /**
   * Confirm folder deletion and close modal.
   * @returns {Promise<void>}
   */
  const handleConfirm = async () => {
    try {
      const res = await fetch(`/api/v1/folder/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder_id: folder_id,
          path: path.join("/"),
        }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      dispatch(setToast({ message: data.message, type: "success", showToast: true }));
      setTimeout(() => dispatch(getFolders(currentFolder)), 200);
      setShowDeleteFolderModal(false);
    } catch (err) {
      dispatch(setToast({ message: err, type: "error", showToast: true }));
    }
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
