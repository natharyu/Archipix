import DownloadIcon from "@mui/icons-material/Download";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetToast, setToast } from "../../../../../store/slices/toast";
function DownloadFileBtn({ file }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useDispatch();
  const { path } = useSelector((state) => state.folder);
  const handleDownloadFile = async () => {
    dispatch(setToast({ message: "Fichier en cours de telechargement", type: "info", showToast: true }));
    setIsDownloading(true);

    await fetch(`/api/v1/file/download/${path.join("&&&")}/${file.id}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du téléchargement du fichier");
        }
        return response.blob();
      })
      .then((blob) => {
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${file.label}`);
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Erreur lors du téléchargement du fichier:", error);
      });

    dispatch(resetToast());
    dispatch(setToast({ message: "Fichier telechargé", type: "success", showToast: true }));

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

export default DownloadFileBtn;
