import FolderIcon from "@mui/icons-material/Folder";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, setCurrentFile } from "../../../../store/slices/files";
import { setCurrentFolder } from "../../../../store/slices/folder";
import DownloadFolderBtn from "./DownloadFolderBtn";

function GridView({
  setFilePreview,
  selectedFiles,
  setSelectedFiles,
  selectedFolders,
  setSelectedFolders,
  setShowDeleteFolderModal,
  setShowDeleteFileModal,
  setFolderToDelete,
  setFileToDelete,
}) {
  const { files, isLoading: isLoadingFiles } = useSelector((state) => state.file);
  const { isLoading: isLoadingFolder, folders, path, rootFolder } = useSelector((state) => state.folder);

  const dispatch = useDispatch();

  const handleClickFolder = (id, label) => {
    setFilePreview(false);
    dispatch(setCurrentFolder({ currentFolder: id, currentFolderName: label }));
    dispatch(getFiles(id));
  };

  const handleClickFile = (file) => {
    dispatch(setCurrentFile(file));
    setFilePreview(true);
  };

  const handleClickDeleteFile = async (file_id) => {
    setShowDeleteFileModal(true);
    setFileToDelete(file_id);
  };

  const handleClickDeleteFolder = async (folder_id) => {
    setShowDeleteFolderModal(true);
    setFolderToDelete(folder_id);
  };

  const handleAddSelectedFile = (file) => {
    if (selectedFiles.includes(file)) {
      return setSelectedFiles(selectedFiles.filter((selectedFile) => selectedFile !== file));
    } else {
      return setSelectedFiles([...selectedFiles, file]);
    }
  };
  const handleAddSelectedFolder = (folder) => {
    if (selectedFolders.includes(folder)) {
      return setSelectedFolders(selectedFolders.filter((selectedFolder) => selectedFolder !== folder));
    } else {
      return setSelectedFolders([...selectedFolders, folder]);
    }
  };

  return (
    <>
      <article className="grid-view">
        {isLoadingFolder ? (
          <p>Chargement...</p>
        ) : (
          <>
            {folders.length === 0 ? null : (
              <>
                {folders.map((folder, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      name={`folder-${folder.id}`}
                      onChange={() => handleAddSelectedFolder(folder)}
                    />
                    <DownloadFolderBtn folder_id={folder.id} />

                    <div className="grid-folder" onClick={() => handleClickFolder(folder.id, folder.label)}>
                      <FolderIcon className="grid-folder-icon" />
                      <p>{folder.label}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </article>
      <article className="grid-view">
        {isLoadingFiles ? (
          <p>Chargement...</p>
        ) : (
          <>
            {files.length === 0 ? (
              <p>Aucun fichier présent dans ce dossier</p>
            ) : (
              <>
                {files.map((file, index) => (
                  <div className="grid-file-container" key={index}>
                    <input type="checkbox" name={`file-${file.id}`} onChange={() => handleAddSelectedFile(file)} />
                    <div className="grid-file" onClick={() => handleClickFile(file)}>
                      {file.type.includes("image") && (
                        <img src={`/uploads/${path.join("/")}/${file.label}`} alt={file.label} />
                      )}

                      {file.type.includes("video") && (
                        <video src={`/uploads/${path.join("/")}/${file.label}`} controls />
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </article>
    </>
  );
}

export default GridView;
