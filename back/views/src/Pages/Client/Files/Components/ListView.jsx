import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SizeCalculator from "../../../../Components/SizeCalculator";
import { setCurrentFile } from "../../../../store/slices/files";
import { setCurrentFolder } from "../../../../store/slices/folder";
import FileIcon from "../Components/FileIcon";
import DownloadFileBtn from "./Downloads/DownloadFileBtn";
import DownloadFolderBtn from "./Downloads/DownloadFolderBtn";
import ShareFileModal from "./Modals/ShareFileModal";
import ShareFolderModal from "./Modals/ShareFolderModal";

/**
 * Renders a list view component with folders and files, allowing selection and deletion.
 *
 * @param {Function} setFilePreview - Function to set the file preview state
 * @param {Array} selectedFiles - Array of selected files
 * @param {Function} setSelectedFiles - Function to set the selected files
 * @param {Array} selectedFolders - Array of selected folders
 * @param {Function} setSelectedFolders - Function to set the selected folders
 * @param {Function} setShowDeleteFolderModal - Function to show delete folder modal
 * @param {Function} setShowDeleteFileModal - Function to show delete file modal
 * @param {Function} setShowShareModal - Function to show share modal
 * @param {Function} setFolderToDelete - Function to set folder to delete
 * @param {Function} setFileToDelete - Function to set file to delete
 * @return {JSX.Element} The list view component with folders and files
 */
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
  const { isLoading: isLoadingFolder, folders } = useSelector((state) => state.folder);
  const { path } = useSelector((state) => state.folder);
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
  };

  /**
   * Handles click on a file, sets current file state and enables file preview.
   *
   * @param {Object} file - The file to be handled
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
   * @param {number} file_id - Id of file to delete
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
   * @param {number} folder_id - Id of folder to delete
   */
  const handleClickDeleteFolder = async (folder_id) => {
    // Show delete folder modal
    setShowDeleteFolderModal(true);

    // Set folder to delete
    setFolderToDelete(folder_id);
  };

  /**
   * Adds or removes file from selected files list.
   *
   * @param {Object} file - The file to add or remove
   *
   * @returns {void}
   */
  const handleAddSelectedFile = (file) => {
    // If file is already selected, remove it
    if (selectedFiles.includes(file)) {
      // Filter selected files list to remove file
      const filteredList = selectedFiles.filter((selectedFile) => selectedFile !== file);

      // Set selected files list
      setSelectedFiles(filteredList);
      // If file is not selected, add it
    } else {
      // Add file to selected files list
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  /**
   * Adds or removes folder from selected folders list.
   *
   * @param {Object} folder - The folder to add or remove
   *
   * @returns {void}
   */
  const handleAddSelectedFolder = (folder) => {
    // If folder is already selected, remove it
    if (selectedFolders.includes(folder)) {
      // Filter selected folders list to remove folder
      const filteredList = selectedFolders.filter((selectedFolder) => selectedFolder !== folder);

      // Set selected folders list
      setSelectedFolders(filteredList);
      // If folder is not selected, add it
    } else {
      // Add folder to selected folders list
      setSelectedFolders([...selectedFolders, folder]);
    }
  };

  return (
    <>
      {/* List of folders */}
      <article className="list-view">
        {isLoadingFolder ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {/* If there are no folders, do not render anything */}
            {folders.length === 0 ? null : (
              <>
                {/* Map through folders */}
                {folders.map((folder, index) => (
                  <li key={index}>
                    {/* Checkbox to select folder */}
                    <input
                      type="checkbox"
                      name={`folder-${folder.id}`}
                      onChange={() => handleAddSelectedFolder(folder)}
                      checked={selectedFolders.includes(folder)}
                    />
                    <FolderIcon className="icon" />
                    <div onClick={() => handleClickFolder(folder.id, folder.label)}>
                      <p>{folder.label}</p>
                      <p>Dossier</p>
                    </div>
                    {/* Button to download the folder */}
                    <DownloadFolderBtn folder_id={folder.id} />
                    {/* Button to delete the folder */}
                    <button className="delete-icon" onClick={() => handleClickDeleteFolder(folder.id)}>
                      <DeleteIcon />
                    </button>
                    <button
                      className="share-icon"
                      onClick={() => {
                        setFolderToShare(folder);
                        setShowShareFolderModal(true);
                      }}
                    >
                      <ShareOutlinedIcon />
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
      </article>
      {/* List of files */}
      <article className="list-view">
        {isLoadingFiles ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {/* If there are no files, do not render anything */}
            {files.length === 0 ? null : (
              <>
                {/* Map through files */}
                {files.map((file, index) => (
                  <li key={index}>
                    {/* Checkbox to select file */}
                    <input
                      type="checkbox"
                      name={`file-${file.id}`}
                      onChange={() => handleAddSelectedFile(file)}
                      checked={selectedFiles.includes(file)}
                    />
                    {/* Icon representing the file type */}
                    <FileIcon ext={file.extension} className="icon" />
                    <div onClick={() => handleClickFile(file)}>
                      <p>{file.label}</p>
                      {/* Show file size */}
                      <SizeCalculator size={file.size} />
                    </div>
                    {/* Button to download the file */}
                    <DownloadFileBtn file={file} />
                    {/* Button to delete the file */}
                    <button className="delete-icon" onClick={() => handleClickDeleteFile(file.id)}>
                      <DeleteIcon />
                    </button>
                    <button
                      className="share-icon"
                      onClick={() => {
                        setFileToShare(file);
                        setShowShareFileModal(true);
                      }}
                    >
                      <ShareOutlinedIcon />
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
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

export default ListView;
