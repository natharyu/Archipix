import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setToast } from "../../store/slices/toast";
/**
 * VerifyEmail component
 *
 * Handles email verification process.
 * Redirects the user to the login page after 2s
 *
 */
function VerifyEmail() {
  // React router navigation hook
  const navigate = useNavigate();
  // Params from the URL
  const { token } = useParams();
  // Redux dispatch function
  const dispatch = useDispatch();

  // Effect that fetches verification data and displays toast
  useEffect(() => {
    const verifyEmail = async () => {
      // Make an API call to the backend
      await fetch(`/auth/verify-email/${token}`)
        .then((res) => res.json())
        .then((res) => {
          // If there's an error, display it
          if (res.error) {
            return dispatch(
              setToast({
                message: res.error,
                type: "error",
                showToast: true,
              })
            );
          }
          // If there's no error, display a success message
          // and redirect the user to the login page
          setTimeout(() => {
            navigate("/connexion");
            dispatch(
              setToast({
                message: res.message,
                type: "success",
                showToast: true,
              })
            );
          }, 2000);
        });
    };
    // Catch errors
    verifyEmail().catch((error) => {
      dispatch(
        setToast({
          message: error,
          type: "error",
          showToast: true,
        })
      );
    });
  }, []); // Only run once

  return (
    <section id="verify-email">
      <article>
        <h3>Vérification !</h3>
        <p>
          Vérification de l'adresse e-mail. Vous serez redirigé vers la page de connexion lorsque celle-ci sera
          terminée.
        </p>
      </article>
    </section>
  );
}

export default VerifyEmail;
