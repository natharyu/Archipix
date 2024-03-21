import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../store/slices/files";
import { getFolders, getPath, getRootFolder, setCurrentFolder } from "../../../store/slices/folder";
import AddMenu from "./Components/AddMenu";
import DeleteFileModal from "./Components/DeleteFileModal";
import DeleteFolderModal from "./Components/DeleteFolderModal";
import DeleteMultipleModal from "./Components/DeleteMultipleModal";
import FilePreview from "./Components/FilePreview";
import FolderTree from "./Components/FolderTree";
import GridView from "./Components/GridView";
import ListView from "./Components/ListView";

function Files() {
  const [addMenu, setAddMenu] = useState(false);
  const [filePreview, setFilePreview] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
  const { currentFolder, path, rootFolder, rootFolderName } = useSelector((state) => state.folder);
  const [view, setView] = useState("list");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRootFolder());
  }, []);

  useEffect(() => {
    if (rootFolder) {
      dispatch(setCurrentFolder({ currentFolder: rootFolder, currentFolderName: rootFolderName }));
    }
  }, [rootFolder]);

  useEffect(() => {
    if (currentFolder) {
      dispatch(getFiles(currentFolder));
      dispatch(getFolders(currentFolder));
      dispatch(getPath(currentFolder));
    }
  }, [currentFolder]);

  return (
    <>
      <section id="files">
        <article>
          {addMenu ? (
            <CancelIcon className="close-add-file" onClick={() => setAddMenu(!addMenu)} />
          ) : (
            <AddCircleIcon className="add-file" onClick={() => setAddMenu(!addMenu)} />
          )}
          <h2>Mes Fichiers</h2>
          <button onClick={() => setShowDeleteMultipleModal(true)}>Supprimer</button>
          <button onClick={() => setView(view === "list" ? "grid" : "list")}>
            {view === "list" ? "Liste" : "Grille"}
          </button>
        </article>
        <article className="folder-tree">
          <FolderTree />
        </article>
        {addMenu && <AddMenu setAddMenu={setAddMenu} />}
        {view === "list" ? (
          <ListView
            setFilePreview={setFilePreview}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedFolders={selectedFolders}
            setSelectedFolders={setSelectedFolders}
            setShowDeleteFileModal={setShowDeleteFileModal}
            setShowDeleteFolderModal={setShowDeleteFolderModal}
            setFolderToDelete={setFolderToDelete}
            setFileToDelete={setFileToDelete}
          />
        ) : (
          <GridView
            setFilePreview={setFilePreview}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedFolders={selectedFolders}
            setSelectedFolders={setSelectedFolders}
            setShowDeleteFileModal={setShowDeleteFileModal}
            setShowDeleteFolderModal={setShowDeleteFolderModal}
            setFolderToDelete={setFolderToDelete}
            setFileToDelete={setFileToDelete}
          />
        )}

        {showDeleteFolderModal && (
          <DeleteFolderModal setShowDeleteFolderModal={setShowDeleteFolderModal} folder_id={folderToDelete} />
        )}
        {showDeleteFileModal && (
          <DeleteFileModal
            setFilePreview={setFilePreview}
            setShowDeleteFileModal={setShowDeleteFileModal}
            file_id={fileToDelete}
          />
        )}
        {showDeleteMultipleModal && (
          <DeleteMultipleModal
            setShowDeleteMultipleModal={setShowDeleteMultipleModal}
            files={selectedFiles}
            folders={selectedFolders}
            setSelectedFiles={setSelectedFiles}
            setSelectedFolders={setSelectedFolders}
          />
        )}
        {showDeleteMultipleModal && (
          <DeleteMultipleModal
            setShowDeleteMultipleModal={setShowDeleteMultipleModal}
            files={selectedFiles}
            folders={selectedFolders}
            setSelectedFiles={setSelectedFiles}
            setSelectedFolders={setSelectedFolders}
          />
        )}
      </section>
      {filePreview && <FilePreview />}
    </>
  );
}

export default Files;
