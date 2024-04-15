import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetToast, setToast } from "../../../../../store/slices/toast";
function ShareFolderModal({ setShowShareFolderModal, folder, path }) {
  const [expiration, setExpiration] = useState(0);
  const dispatch = useDispatch();

  const handleShareFolder = async (folder, expiration) => {
    if (expiration <= 0) {
      return dispatch(
        setToast({ type: "warning", message: "Veuillez selectionner une duree de partage", showToast: true })
      );
    }
    await fetch(`/api/v1/share/folder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder_id: folder.id, user_id: folder.user_id, path: path, expiration: expiration }),
    })
      .then((res) => res.json())
      .then((data) => {
        const myModal = document.getElementById("share-file-modal");
        myModal.innerHTML = "";
        myModal.innerHTML =
          "<div><p>Partage effectue avec succes</p><p>la duree du partage est de " +
          expiration +
          " secondes</p><p>le lien de partage est : </p>" +
          "<p>https://archipix.dew-hub.ovh" +
          data +
          "</p>" +
          "</p>" +
          "<button id='copy-share-modal' class='copy-share-modal'>Copier le lien</button>" +
          "<button id='close-share-modal' class='close-share-modal'>Fermer</button>" +
          "</div>";
        const closeBtn = document.getElementById("close-share-modal");
        const copyBtn = document.getElementById("copy-share-modal");
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(`https://archipix.dew-hub.ovh${data}`);
          dispatch(resetToast());
          dispatch(setToast({ type: "success", message: "Lien copié dans le presse papier !", showToast: true }));
        });
        closeBtn.addEventListener("click", () => {
          setShowShareFolderModal(false);
        });
      });
  };

  return (
    <article className="share-modal" id="share-file-modal">
      <div>
        <p>Partage du dossier :</p>
        <p>veuillez selectionner la durée du partage (en secondes)</p>
        <p>3600s = 1h | 86400s = 24h (maximum)</p>
        <input
          type="number"
          name="expiration"
          id="expiration"
          onChange={(e) => setExpiration(e.target.value)}
          required={true}
          max={86400}
        />
        <div className="share-modal-buttons">
          <button onClick={() => handleShareFolder(folder, expiration)}>partager</button>
          <button onClick={() => setShowShareFolderModal(false)}>Annuler</button>
        </div>
      </div>
    </article>
  );
}

export default ShareFolderModal;
