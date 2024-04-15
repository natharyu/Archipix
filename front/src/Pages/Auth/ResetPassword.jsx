import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setToast } from "../../store/slices/toast";

/**
 * ResetPassword page component.
 *
 * @returns {JSX.Element} ResetPassword page.
 */
const ResetPassword = () => {
  // Redux dispatch.
  const dispatch = useDispatch();
  // React Router navigate.
  const navigate = useNavigate();
  // Reset token from URL.
  const { resetToken } = useParams();
  // React Hook Form.
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  /**
   * Form submit handler.
   *
   * @param {Object} data Form data.
   * @returns {Promise<void>}
   */
  const onSubmit = async (data) => {
    // Fetch API.
    await fetch(`/auth/reset-password/${resetToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword: data.newPassword }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          // Display the error message from server.
          return dispatch(setToast({ message: res.error, type: "error", showToast: true }));
        }
        // Redirect to login page.
        navigate("/connexion");
        // Display the success message from server.
        dispatch(setToast({ message: res.message, type: "success", showToast: true }));
      });
  };

  return (
    <section id="reset-password">
      <h3>Choisir un nouveau mot de passe</h3>
      <p>Veuillez choisir un nouveau mot de passe.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Mot de passe :
          <input
            type="password"
            className={`${errors.newPassword ? "inputError" : ""}`}
            placeholder="Nouveau mot de passe"
            {...register("newPassword", {
              required: "Veuillez saisir votre nouveau mot de passe.",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Doit comporter au minimum de 8 caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
              },
            })}
          />
          <span>{errors.newPassword?.message}</span>
        </label>

        <label>
          Confirmer le mot de passe :
          <input
            type="password"
            className={`${errors.newPasswordConfirm ? "inputError" : ""}`}
            placeholder="Confimez le mot de passe"
            {...register("newPasswordConfirm", {
              required: true,
              validate: (value) => {
                if (watch("newPassword") !== value) {
                  return "Vos mots de passe ne sont pas identiques";
                }
              },
            })}
          />
          <span>{errors.newPasswordConfirm?.message}</span>
        </label>

        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
    </section>
  );
};

export default ResetPassword;
