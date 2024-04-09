import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../store/slices/files";
import { getFolders, getPath, getRootFolder, setCurrentFolder } from "../../../store/slices/folder";
import { setViewMode } from "../../../store/slices/user";
import AddMenu from "./Components/AddMenu";
import FilePreview from "./Components/FilePreview";
import FolderTree from "./Components/FolderTree";
import GridView from "./Components/GridView";
import ListView from "./Components/ListView";
import DeleteFileModal from "./Components/Modals/DeleteFileModal";
import DeleteFolderModal from "./Components/Modals/DeleteFolderModal";
import DeleteMultipleModal from "./Components/Modals/DeleteMultipleModal";
import SelectMenu from "./Components/Select/SelectMenu";

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
  const { viewMode } = useSelector((state) => state.user);
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
            <h2 className="head-close-add-file" onClick={() => setAddMenu(!addMenu)}>
              <CancelIcon /> Annuler
            </h2>
          ) : (
            <h2 className="head-add-file" onClick={() => setAddMenu(!addMenu)}>
              <AddCircleIcon /> Ajouter des fichiers
            </h2>
          )}
          <SelectMenu setSelectedFiles={setSelectedFiles} setSelectedFolders={setSelectedFolders} />
          {selectedFiles.length > 0 || selectedFolders.length > 0 ? (
            <button className="deleteBtn" onClick={() => setShowDeleteMultipleModal(true)}>
              Supprimer
            </button>
          ) : (
            <button className="deleteBtn" disabled>
              Supprimer
            </button>
          )}

          <div className="viewMode">
            <p>Affichage :</p>
            <div
              onClick={() => {
                setFilePreview(false);
                dispatch(setViewMode());
              }}
              className="viewModeSelector"
            >
              <GridViewIcon className={viewMode && "active"} />
              <ViewListIcon className={!viewMode && "active"} />
            </div>
          </div>
        </article>
        <article className="folder-tree">
          <FolderTree />
        </article>
        {addMenu && <AddMenu setAddMenu={setAddMenu} />}
        {!viewMode ? (
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
