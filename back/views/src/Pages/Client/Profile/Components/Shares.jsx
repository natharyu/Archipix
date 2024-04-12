import { useDispatch, useSelector } from "react-redux";
import { setShares } from "../../../../store/slices/shares";
import { resetToast, setToast } from "../../../../store/slices/toast";

function Shares() {
  const { shares } = useSelector((state) => state.share);
  const dispatch = useDispatch();

  const handleDeleteShare = async (id) => {
    dispatch(resetToast());
    await fetch(`/api/v1/share/delete/${id}`, { method: "DELETE" });
    dispatch(setShares(shares.filter((share) => share.id !== id)));
    dispatch(setToast({ type: "success", message: "Partage supprimé avec succès !", showToast: true }));
  };

  return (
    <article className="profile-shares">
      {shares && shares.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Lien</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shares.map((share) => (
              <tr key={share.id}>
                <td>
                  <p>{share.url}</p>
                </td>
                <td>
                  {new Date(share.expiration) > new Date() ? (
                    <p className="valid-link">Lien valide</p>
                  ) : (
                    <p className="expired-link">Lien expiré</p>
                  )}
                </td>
                <td>
                  <button
                    className="copy-link"
                    onClick={() => {
                      navigator.clipboard.writeText(share.url);
                      dispatch(resetToast());
                      dispatch(
                        setToast({ type: "success", message: "Lien copié dans le presse papier !", showToast: true })
                      );
                    }}
                  >
                    Copier le lien
                  </button>
                  <button className="delete-link" onClick={() => handleDeleteShare(share.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun partage</p>
      )}
    </article>
  );
}

export default Shares;
