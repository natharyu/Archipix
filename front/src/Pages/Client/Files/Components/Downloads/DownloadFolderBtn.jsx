import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetToast, setToast } from "../../../../../store/slices/toast";
function DownloadFolderBtn({ folder_id }) {
  const { path } = useSelector((state) => state.folder);
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useDispatch();
  const handleDownloadFolder = async (folder_id) => {
    dispatch(setToast({ message: "Création de l'archive", type: "info", showToast: true }));
    setIsDownloading(true);
    await fetch(`/api/v1/folder/download/${path.join("&&&")}/${folder_id}`, {
      method: "GET",
    })
      .then((response) => {
        console.log(response);
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
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement de l'archive:", error);
      });
    dispatch(resetToast());
    dispatch(setToast({ message: "Création de l'archive terminé", type: "success", showToast: true }));
    setIsDownloading(false);
  };

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
