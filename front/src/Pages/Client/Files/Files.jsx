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

/**
 * The files page of the client interface.
 *
 * @returns {JSX.Element} The files page component.
 */
function Files() {
  // Toggles the visibility of the add menu
  const [addMenu, setAddMenu] = useState(false);
  // Toggles the visibility of a file preview
  const [filePreview, setFilePreview] = useState(false);
  // Toggles the visibility of the delete folder modal
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  // The folder that the delete folder modal is currently displayed for
  const [folderToDelete, setFolderToDelete] = useState(null);
  // Toggles the visibility of the delete file modal
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  // The file that the delete file modal is currently displayed for
  const [fileToDelete, setFileToDelete] = useState(null);
  // Array of selected files
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Array of selected folders
  const [selectedFolders, setSelectedFolders] = useState([]);
  // Toggles the visibility of the delete multiple modal
  const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
  // Tracks the currently selected folder
  const { currentFolder, path, rootFolder, rootFolderName } = useSelector((state) => state.folder);
  // Tracks the current view mode
  const { viewMode } = useSelector((state) => state.user);
  // Redux dispatch function
  const dispatch = useDispatch();

  // Fetches the root folder when the component mounts
  useEffect(() => {
    dispatch(getRootFolder());
  }, []);

  // Sets the current folder to the root folder when the root folder is fetched
  useEffect(() => {
    if (rootFolder) {
      dispatch(setCurrentFolder({ currentFolder: rootFolder, currentFolderName: rootFolderName }));
    }
  }, [rootFolder]);

  // Fetches the files and folders for the current folder whenever the current folder changes
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
            <h3 className="head-close-add-file" onClick={() => setAddMenu(!addMenu)}>
              <CancelIcon /> Annuler
            </h3>
          ) : (
            <h3 className="head-add-file" onClick={() => setAddMenu(!addMenu)}>
              <AddCircleIcon /> Ajouter des fichiers
            </h3>
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
