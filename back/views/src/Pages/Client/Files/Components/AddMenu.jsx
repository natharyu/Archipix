import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFolders } from "../../../../store/slices/folder";
import { setToast } from "../../../../store/slices/toast";
import DragAndDrop from "./DragAndDrop";

function AddMenu({ setAddMenu }) {
  const [newFolder, setNewFolder] = useState(false);
  const newFolderName = useRef(null);
  const dispatch = useDispatch();
  const { currentFolder, path } = useSelector((state) => state.folder);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.current.value) return;
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
        dispatch(setToast({ type: "success", message: "Dossier créé avec succès !", showToast: true }));
        newFolderName.current.value = "";
        setNewFolder(!newFolder);
        setAddMenu(false);
        dispatch(getFolders(currentFolder));
      }
      if (!res.ok) {
        dispatch(setToast({ type: "error", message: "Une erreur est survenue", showToast: true }));
      }
    });
  };

  return (
    <>
      {!newFolder ? (
        <button className="create-new-folder" onClick={() => setNewFolder(!newFolder)}>
          {" "}
          <CreateNewFolderIcon />
          <p>Créer un nouveau dossier</p>
        </button>
      ) : (
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

      <DragAndDrop setAddMenu={setAddMenu} />
    </>
  );
}

export default AddMenu;
