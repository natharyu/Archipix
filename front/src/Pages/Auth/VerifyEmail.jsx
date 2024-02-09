import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setToast } from "../../store/slices/toast";
function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyEmail = async () => {
      await fetch(`/auth/verify-email/${token}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            return dispatch(setToast({ message: res.error, type: "error", showToast: true }));
          }
          setTimeout(() => {
            navigate("/connexion");
            dispatch(setToast({ message: res.message, type: "success", showToast: true }));
          }, 3000);
        });
    };
    verifyEmail().catch((error) => {
      dispatch(setToast({ message: error, type: "error", showToast: true }));
    });
  }, []);

  return (
    <section id="verify-email">
      <article>
        <h2>Vérification !</h2>
        <p>
          Vérification de l'adresse e-mail. Vous serez redirigé vers la page de connexion lorsque celle-ci sera
          terminée.
        </p>
      </article>
    </section>
  );
}

export default VerifyEmail;
