import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetToast, setToast } from "../../../../../store/slices/toast";
/**
 * Download a folder as a zip archive.
 *
 * @param {string} folder_id - The ID of the folder to be downloaded
 * @return {JSX.Element} Rendered JSX for the download button
 */
function DownloadFolderBtn({ folder_id }) {
  const { path } = useSelector((state) => state.folder); // The path of the current folder
  const [isDownloading, setIsDownloading] = useState(false); // Whether the archive is being downloaded
  const dispatch = useDispatch(); // Redux dispatch function

  /**
   * Download a folder as a zip archive.
   *
   * @param {string} folder_id - The ID of the folder to be downloaded
   */
  const handleDownloadFolder = async (folder_id) => {
    dispatch(setToast({ message: "Création de l'archive", type: "info", showToast: true })); // Show a toast
    setIsDownloading(true); // Set isDownloading to true
    await fetch(`/api/v1/folder/download/${path.join("&&&")}/${folder_id}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement du zip"); // Throw an error if the request failed
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob); // Create a URL for the blob
        const link = document.createElement("a"); // Create a new link
        link.href = url;
        link.setAttribute("download", `${folder_id}.zip`); // Set the download attribute of the link
        document.body.appendChild(link); // Add the link to the DOM
        link.click();
        URL.revokeObjectURL(url); // Revoke the object URL
        document.body.removeChild(link); // Remove the link from the DOM
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement de l'archive:", error); // Log the error
      });
    dispatch(resetToast()); // Hide the toast
    dispatch(setToast({ message: "Création de l'archive terminé", type: "success", showToast: true })); // Show a success toast
    setIsDownloading(false); // Set isDownloading to false
  }; // handleDownloadFolder

  return (
    <>
      {isDownloading ? (
        <span className="loader"></span>
      ) : (
        <button className="download-button" onClick={() => handleDownloadFolder(folder_id, path)}>
          <DownloadIcon />
        </button>
      )}
    </>
  );
}

export default DownloadFolderBtn;
