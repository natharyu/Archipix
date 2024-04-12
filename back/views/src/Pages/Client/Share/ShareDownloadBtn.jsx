import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetToast, setToast } from "../../../store/slices/toast";
/**
 * Function to handle the download of a file.
 *
 * @param {object} file - The file object to be downloaded
 * @return {JSX.Element} The download button or loader based on download state
 */
function ShareDownloadBtn({ file }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useDispatch();
  const { path } = useSelector((state) => state.folder);
  /**
   * Function to handle downloading a file asynchronously.
   *
   * @return {Promise<void>} A promise that resolves when the file is successfully downloaded
   */
  const handleDownloadFile = async () => {
    // Download file asynchronously
    // Show a loading state and dispatch a toast message
    dispatch(resetToast());
    dispatch(setToast({ message: "Fichier en cours de téléchargement", type: "info", showToast: true }));
    setIsDownloading(true);

    await fetch(`/api/v1/share/download/file/${path.join("&&&")}/${file.id}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement du fichier");
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a temporary URL to download the file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // Set the name of the downloaded file
        link.setAttribute("download", `${file.label}`);
        // Add the link to the DOM and click it
        document.body.appendChild(link);
        link.click();
        // Remove the link from the DOM
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        // Display an error message in case of download failure
        console.error("Erreur lors du téléchargement du fichier:", error);
      });

    // Reset loading state and display a success toast message
    dispatch(resetToast());
    dispatch(setToast({ message: "Fichier téléchargé", type: "success", showToast: true }));

    setIsDownloading(false);
  };

  return (
    <>
      {isDownloading ? (
        <span className="loader"></span>
      ) : (
        <button className="download-button" onClick={() => handleDownloadFile()}>
          <DownloadIcon />
        </button>
      )}
    </>
  );
}

export default ShareDownloadBtn;
