import DownloadIcon from "@mui/icons-material/Download";
import FolderIcon from "@mui/icons-material/Folder";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFile, getFiles } from "../../../../store/slices/files";
import { setCurrentFolder } from "../../../../store/slices/folder";

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
  const [isDownloading, setIsDownloading] = useState(false);

  const dispatch = useDispatch();

  const handleClickFolder = (id, label) => {
    setFilePreview(false);
    dispatch(setCurrentFolder({ currentFolder: id, currentFolderName: label }));
    dispatch(getFiles(id));
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

  const handleDownloadFolder = async (folder_id) => {
    setIsDownloading(true);
    await fetch(`/api/v1/folder/download/${path.join("&&&")}/${folder_id}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement du zip");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${folder_id}.zip`);
        document.body.appendChild(link);
        link.click();

        link.onload = () => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        };
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement de l'archive:", error);
      });
    setIsDownloading(false);
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
                    {isDownloading ? (
                      <span className="loader"></span>
                    ) : (
                      <button className="download-button" onClick={() => handleDownloadFolder(folder.id, path)}>
                        <DownloadIcon />
                      </button>
                    )}

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
