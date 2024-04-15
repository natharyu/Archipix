import FolderIcon from "@mui/icons-material/Folder";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFiles, setCurrentFile } from "../../../../store/slices/files";
import { setCurrentFolder } from "../../../../store/slices/folder";
import DownloadFileBtn from "./Downloads/DownloadFileBtn";
import DownloadFolderBtn from "./Downloads/DownloadFolderBtn";
import ShareFileModal from "./Modals/ShareFileModal";
import ShareFolderModal from "./Modals/ShareFolderModal";

/**
 * Renders a grid view component with folders and files.
 *
 * @param {Function} setFilePreview - Function to set file preview state
 * @param {Array} selectedFiles - Array of selected file objects
 * @param {Function} setSelectedFiles - Function to set selected files
 * @param {Array} selectedFolders - Array of selected folder objects
 * @param {Function} setSelectedFolders - Function to set selected folders
 * @param {Function} setShowDeleteFolderModal - Function to show delete folder modal
 * @param {Function} setShowDeleteFileModal - Function to show delete file modal
 * @param {Function} setFolderToDelete - Function to set folder to delete
 * @param {Function} setFileToDelete - Function to set file to delete
 * @return {JSX.Element} The grid view component
 */
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

  const [showShareFileModal, setShowShareFileModal] = useState(false);
  const [showShareFolderModal, setShowShareFolderModal] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [folderToShare, setFolderToShare] = useState(null);

  const dispatch = useDispatch();

  /**
   * Handles click on a folder, sets current folder state and resets file preview state.
   *
   * @param {number} id - Id of folder
   * @param {string} label - Label of folder
   */
  const handleClickFolder = (id, label) => {
    // Reset file preview state
    setFilePreview(false);

    // Set current folder state
    dispatch(
      setCurrentFolder({
        // Id of folder
        currentFolder: id,
        // Label of folder
        currentFolderName: label,
      })
    );

    // Get files of folder
    dispatch(getFiles(id));
  };

  /**
   * Handles click on a file, sets current file state and enables file preview.
   *
   * @param {object} file - File object
   */
  const handleClickFile = (file) => {
    // Set current file state
    dispatch(setCurrentFile(file));

    // Enable file preview
    setFilePreview(true);
  };

  /**
   * Handles click on delete file button.
   *
   * @param {number} file_id - Id of file to be deleted
   */
  const handleClickDeleteFile = async (file_id) => {
    // Show delete file modal
    setShowDeleteFileModal(true);

    // Set file to delete
    setFileToDelete(file_id);
  };

  /**
   * Handles click on delete folder button.
   *
   * @param {number} folder_id - Id of folder to be deleted
   */
  const handleClickDeleteFolder = async (folder_id) => {
    // Show delete folder modal
    setShowDeleteFolderModal(true);

    // Set folder to delete
    setFolderToDelete(folder_id);
  };

  /**
   * Adds or removes file from selected files.
   *
   * @param {object} file - File object
   *
   * @return {void}
   */
  const handleAddSelectedFile = (file) => {
    // If file is already selected, remove it from selected files
    if (selectedFiles.includes(file)) {
      setSelectedFiles(selectedFiles.filter((selectedFile) => selectedFile !== file));

      // Else add file to selected files
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  /**
   * Adds or removes folder from selected folders list.
   *
   * @param {object} folder - The folder to add or remove
   *
   * @returns {void}
   */
  const handleAddSelectedFolder = (folder) => {
    // If folder is already selected, remove it from selected folders
    if (selectedFolders.includes(folder)) {
      // Filter selected folders list to remove folder
      const filteredList = selectedFolders.filter((selectedFolder) => selectedFolder !== folder);

      // Set selected folders list
      setSelectedFolders(filteredList);

      // Else add folder to selected folders
    } else {
      // Add folder to selected folders list
      setSelectedFolders([...selectedFolders, folder]);
    }
  };

  return (
    <>
      {/* Folders grid view */}
      <article className="grid-view">
        {isLoadingFolder ? (
          <p>Chargement...</p>
        ) : (
          <>
            {/* If there are no folders, do not display anything */}
            {folders.length === 0 ? null : (
              <>
                {/* Map folders to display them as a grid */}
                {folders.map((folder, index) => (
                  <div key={index}>
                    {/* checkbox input to select/deselect folder */}
                    <input
                      type="checkbox"
                      name={`folder-${folder.id}`}
                      onChange={() => handleAddSelectedFolder(folder)}
                      checked={selectedFolders.includes(folder)}
                    />
                    {/* Button to download folder */}
                    <DownloadFolderBtn folder_id={folder.id} />
                    <button
                      className="share-icon"
                      onClick={() => {
                        setFolderToShare(folder);
                        setShowShareFolderModal(true);
                      }}
                    >
                      <ShareOutlinedIcon />
                    </button>

                    <div className="grid-folder" onClick={() => handleClickFolder(folder.id, folder.label)}>
                      {/* Folder icon */}
                      <FolderIcon className="grid-folder-icon" />
                      {/* Folder name */}
                      <p>{folder.label}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </article>

      {/* Files grid view */}
      <article className="grid-view">
        {isLoadingFiles ? (
          <p>Chargement...</p>
        ) : (
          <>
            {/* If there are no files, do not display anything */}
            {files.length === 0 ? null : (
              <>
                {/* Map files to display them as a grid */}
                {files.map((file, index) => (
                  <div className="grid-file-container" key={index}>
                    {/* checkbox input to select/deselect file */}
                    <input
                      type="checkbox"
                      name={`file-${file.id}`}
                      onChange={() => handleAddSelectedFile(file)}
                      checked={selectedFiles.includes(file)}
                    />
                    {/* Button to download file */}
                    <DownloadFileBtn file={file} />
                    <button
                      className="share-icon"
                      onClick={() => {
                        setFileToShare(file);
                        setShowShareFileModal(true);
                      }}
                    >
                      <ShareOutlinedIcon />
                    </button>
                    <div className="grid-file" onClick={() => handleClickFile(file)}>
                      {/* If file is an image, display it */}
                      {file.type.includes("image") && (
                        <img
                          src={`https://archipix.s3.eu-west-3.amazonaws.com/${path.join("/")}/${file.label}`}
                          alt={file.label}
                        />
                      )}

                      {/* If file is a video, display it */}
                      {file.type.includes("video") && (
                        <video src={`https://archipix.s3.eu-west-3.amazonaws.com/${path.join("/")}/${file.label}`} />
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
        {showShareFolderModal && (
          <ShareFolderModal setShowShareFolderModal={setShowShareFolderModal} folder={folderToShare} path={path} />
        )}
        {showShareFileModal && (
          <ShareFileModal setShowShareFileModal={setShowShareFileModal} file={fileToShare} path={path} />
        )}
      </article>
    </>
  );
}

export default GridView;
