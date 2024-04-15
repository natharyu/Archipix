import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToast } from "../../store/slices/toast";

/**
 * Function to handle user registration.
 *
 * @param {Object} data - User registration data.
 * @return {void} No return value.
 */
const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * A description of the entire function.
   *
   * @param {type} data - description of parameter
   * @return {type} description of return value
   */
  const onSubmit = async (data) => {
    // Send request to API to create new user
    setIsLoading(true);
    await fetch(`/auth/signup`, {
      method: "POST", // Use HTTP POST method
      headers: {
        // Set headers for JSON content
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Set request body
        email: data.email,
        password: data.password,
        username: data.username,
      }),
    })
      .then((res) => res.json()) // Parse response as JSON
      .then((res) => {
        // Handle response
        if (res.error) {
          // If error
          return dispatch(
            setToast({
              // Show toast with error message
              message: res.error,
              type: "error",
              showToast: true,
            })
          );
        }
        navigate("/connexion"); // Redirect user to login page
        dispatch(
          setToast({
            // Show toast with success message
            message: res.message,
            type: "success",
            showToast: true,
          })
        );
      });
    setIsLoading(false); // Stop showing loading indicator
  };

  return (
    <section id="register">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Nom d'utilisateur :
          <input
            type="text"
            className={`${errors.username ? "inputError" : ""}`}
            placeholder="Nom d'utilisateur"
            {...register("username", {
              required: "Veuillez saisir votre nom d'utilisateur.",
              pattern: {
                value: /[a-zA-Z0-9]{3,25}/,
                message: "Le nom d'utilisateur doit contenir entre 3 et 25 caractères.",
              },
            })}
          />
          <span>{errors.username?.message}</span>
        </label>
        <label>
          E-mail :
          <input
            type="email"
            className={`${errors.email ? "inputError" : ""}`}
            placeholder="Email"
            autoComplete="email"
            {...register("email", {
              required: "Veuillez saisir votre e-mail.",
              pattern: { value: /\S+@\S+\.\S+/, message: "E-mail invalide." },
            })}
          />
          <span>{errors.email?.message}</span>
        </label>
        <label>
          Mot de passe :
          <input
            type="password"
            className={`${errors.password ? "inputError" : ""}`}
            placeholder="Mot de passe"
            {...register("password", {
              required: "Veuillez saisir votre mot de passe.",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Doit comporter au minimum de 8 caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.",
              },
            })}
          />
          <span>{errors.password?.message}</span>
        </label>
        <button type="submit">{isLoading ? "En cours..." : "S'inscrire"}</button>
      </form>
      <aside>
        <h3>S'incrire !</h3>
        <p>S'inscrire dès maintenant pour profiter de tous les services disponibles.</p>
        <p>Vous avez déjà un compte ?</p>
        <button onClick={() => navigate("/connexion")}>Se connecter</button>
      </aside>
    </section>
  );
};
export default Register;
