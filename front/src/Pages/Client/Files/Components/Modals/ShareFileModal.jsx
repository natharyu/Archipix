import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetToast, setToast } from "../../../../../store/slices/toast";
function ShareFileModal({ setShowShareFileModal, file, path }) {
  const [expiration, setExpiration] = useState(0);
  const dispatch = useDispatch();
  const handleShareFile = async (file, expiration) => {
    if (expiration <= 0) {
      return dispatch(
        setToast({ type: "warning", message: "Veuillez selectionner une duree de partage", showToast: true })
      );
    }
    await fetch(`/api/v1/share/file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file_id: file.id, user_id: file.user_id, path: path, expiration: expiration }),
    })
      .then((res) => res.json())
      .then((data) => {
        const myModal = document.getElementById("share-file-modal");
        myModal.innerHTML = "";
        myModal.innerHTML =
          "<div><p>Partage effectue avec succes</p><p>la duree du partage est de " +
          expiration +
          " secondes</p><p>le lien de partage est : </p>" +
          `<p>${import.meta.env.VITE_FRONT_URL}` +
          data +
          "</p>" +
          "</p>" +
          "<button id='copy-share-modal' class='copy-share-modal'>Copier le lien</button>" +
          "<button id='close-share-modal' class='close-share-modal'>Fermer</button>" +
          "</div>";
        const closeBtn = document.getElementById("close-share-modal");
        const copyBtn = document.getElementById("copy-share-modal");
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(`${import.meta.env.VITE_FRONT_URL}${data}`);
          dispatch(resetToast());
          dispatch(setToast({ type: "success", message: "Lien copié dans le presse papier !", showToast: true }));
        });
        closeBtn.addEventListener("click", () => {
          setShowShareFileModal(false);
        });
      });
  };

  return (
    <article className="share-modal" id="share-file-modal">
      <div>
        <p>Partage du fichier :</p>
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
          <button onClick={() => handleShareFile(file, expiration)}>Partager</button>
          <button onClick={() => setShowShareFileModal(false)}>Annuler</button>
        </div>
      </div>
    </article>
  );
}

export default ShareFileModal;
