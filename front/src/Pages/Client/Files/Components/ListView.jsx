import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import { useDispatch, useSelector } from "react-redux";
import SizeCalculator from "../../../../Components/SizeCalculator";
import { getFile } from "../../../../store/slices/files";
import { setCurrentFolder } from "../../../../store/slices/folder";
import FileIcon from "../Components/FileIcon";

function ListView({
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
  };

  const handleClickFile = (file) => {
    const exactpath = path.join("&&&");
    dispatch(getFile({ id: file.id, label: file.label, path: exactpath, rootFolder: rootFolder }));
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
      <article className="list-view">
        {isLoadingFolder ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {folders.length === 0 ? null : (
              <>
                {folders.map((folder, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      name={`folder-${folder.id}`}
                      onChange={() => handleAddSelectedFolder(folder)}
                    />
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
      <article className="list-view">
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
                    <input type="checkbox" name={`file-${file.id}`} onChange={() => handleAddSelectedFile(file)} />
                    <FileIcon ext={file.extension} className="icon" />
                    <div onClick={() => handleClickFile(file)}>
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
    </>
  );
}

export default ListView;
