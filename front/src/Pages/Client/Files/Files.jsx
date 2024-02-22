import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SizeCalculator from "../../../Components/SizeCalculator";
import { getFile, getFiles } from "../../../store/slices/files";
import { getFolders, getPath, getRootFolder, setCurrentFolder } from "../../../store/slices/folder";
import AddMenu from "./Components/AddMenu";
import DeleteFileModal from "./Components/DeleteFileModal";
import DeleteFolderModal from "./Components/DeleteFolderModal";
import FileIcon from "./Components/FileIcon";
import FilePreview from "./Components/FilePreview";
import FolderTree from "./Components/FolderTree";

function Files() {
  const [addMenu, setAddMenu] = useState(false);
  const [filePreview, setFilePreview] = useState(false);
  const [showDeleteFolderModal, setShowDeleteFolderModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const { files, isLoading: isLoadingFiles } = useSelector((state) => state.file);
  const {
    currentFolder,
    isLoading: isLoadingFolder,
    folders,
    path,
    rootFolder,
    rootFolderName,
  } = useSelector((state) => state.folder);
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

  const handleClickFolder = (id, label) => {
    setFilePreview(false);
    dispatch(setCurrentFolder({ currentFolder: id, currentFolderName: label }));
  };

  const handleClickFile = (file_id, label) => {
    setFilePreview(true);
    const exactpath = path.join("&&&");
    dispatch(getFile({ id: file_id, label: label, path: exactpath, rootFolder: rootFolder }));
  };

  const handleClickDeleteFile = async (file_id) => {
    setShowDeleteFileModal(true);
    setFileToDelete(file_id);
  };

  const handleClickDeleteFolder = async (folder_id) => {
    setShowDeleteFolderModal(true);
    setFolderToDelete(folder_id);
  };

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
        </article>
        <article className="folder-tree">
          <FolderTree />
        </article>
        {addMenu && <AddMenu setAddMenu={setAddMenu} />}
        <article>
          {isLoadingFolder ? (
            <p>Chargement...</p>
          ) : (
            <ul>
              {folders.length === 0 ? null : (
                <>
                  {folders.map((folder, index) => (
                    <li key={index}>
                      <p onClick={() => handleClickFolder(folder.id, folder.label)}>
                        <FolderIcon className="icon" />
                        {folder.label}
                      </p>
                      <DeleteIcon className="delete-icon" onClick={() => handleClickDeleteFolder(folder.id)} />
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </article>
        <article>
          {isLoadingFiles ? (
            <p>Chargement...</p>
          ) : (
            <ul>
              {files.length === 0 ? (
                <p>Aucun fichier présent dans ce dossier</p>
              ) : (
                <>
                  {files.map((file, index) => (
                    <li key={index}>
                      <FileIcon ext={file.extension} className="icon" />
                      <div onClick={() => handleClickFile(file.id, file.label)}>
                        <p>{file.label}</p>
                        <SizeCalculator size={file.size} />
                      </div>
                      <DeleteIcon className="delete-icon" onClick={() => handleClickDeleteFile(file.id)} />
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </article>
        {showDeleteFolderModal && (
          <DeleteFolderModal setShowDeleteFolderModal={setShowDeleteFolderModal} folder_id={folderToDelete} />
        )}
        {showDeleteFileModal && (
          <DeleteFileModal setShowDeleteFileModal={setShowDeleteFileModal} file_id={fileToDelete} />
        )}
      </section>
      {filePreview && <FilePreview />}
    </>
  );
}

export default Files;
