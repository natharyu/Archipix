import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFolders } from "../../../../store/slices/folder";
import { setToast } from "../../../../store/slices/toast";
import DragAndDrop from "./DragAndDrop";

/**
 * Component that renders the add menu for the client side
 * @param {Function} setAddMenu function to set the add menu state
 */
function AddMenu({ setAddMenu }) {
  // state to toggle the new folder creation form
  const [newFolder, setNewFolder] = useState(false);

  // ref to the input element for the folder name
  const newFolderName = useRef(null);

  // dispatch function to dispatch to the redux store
  const dispatch = useDispatch();

  // get the current folder and path from the redux store
  const { currentFolder, path } = useSelector((state) => state.folder);

  /**
   * Handles the form submit for creating a new folder
   * @param {Event} e event object
   */
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    // check if the folder name is not empty
    if (!newFolderName.current.value) return;

    // make a post request to the api to create the folder
    await fetch("/api/v1/folder/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentFolder: currentFolder,
        newFolderName: newFolderName.current.value,
        path: path.join("/"),
      }),
    }).then((res) => {
      if (res.ok) {
        // if the request was successful, dispatch a toast success message
        dispatch(
          setToast({
            type: "success",
            message: "Dossier créé avec succès !",
            showToast: true,
          })
        );

        // reset the folder name input and toggle the form
        newFolderName.current.value = "";
        setNewFolder(!newFolder);

        // close the add menu and fetch the updated folders
        setAddMenu(false);
        dispatch(getFolders(currentFolder));
      }
      if (!res.ok) {
        // if the request failed, dispatch a toast error message
        dispatch(
          setToast({
            type: "error",
            message: "Une erreur est survenue",
            showToast: true,
          })
        );
      }
    });
  };

  return (
    <>
      {/* if the new folder form is not visible, display a button to toggle it */}
      {!newFolder ? (
        <button className="create-new-folder" onClick={() => setNewFolder(!newFolder)}>
          <CreateNewFolderIcon />
          <p>Créer un nouveau dossier</p>
        </button>
      ) : (
        // if the new folder form is visible, display the form
        <form className="create-new-folder-form" onSubmit={handleCreateFolder}>
          <input type="text" placeholder="Nom du dossier" name="newFolderName" ref={newFolderName} />
          <div>
            <button className="create-new-folder" type="submit">
              Ajouter dossier
            </button>
            <button className="create-new-folder-cancel" onClick={() => setNewFolder(!newFolder)}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* display the drag and drop component */}
      <DragAndDrop setAddMenu={setAddMenu} />
    </>
  );
}

export default AddMenu;
