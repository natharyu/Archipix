import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../store/slices/auth";
import { setCurrentFolder, setRootFolder } from "../../store/slices/folder";
import { setToast } from "../../store/slices/toast";
import ForgotPassword from "./ForgotPassword";

/**
 * A function for handling the login process, including form submission and API call.
 *
 * @param {object} data - The data object containing email, password, and remember fields.
 * @return {void}
 */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * A function that handles form submission by sending a POST request to the authentication endpoint.
   *
   * @param {object} data - An object containing email, password, and remember values for authentication
   * @return {void}
   */
  const onSubmit = async (data) => {
    // Send a POST request to the authentication endpoint with the email, password, and remember fields.
    await fetch(`/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        remember: data.remember,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // If there's an error, display it to the user and abort.
        if (res.error) {
          return dispatch(setToast({ message: res.error, type: "error", showToast: true }));
        }
        // Otherwise, authenticate the user and redirect them to the home page.
        dispatch(checkAuth());
        dispatch(setRootFolder({ rootFolder: res.folder, rootFolderName: res.folderName }));
        dispatch(setCurrentFolder({ currentFolder: res.folder, currentFolderName: res.folderName }));
        navigate("/");
        dispatch(setToast({ message: res.message, type: "success", showToast: true }));
      });
  };

  return (
    <section id="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          E-mail :
          <input
            type="email"
            className={`${errors.email ? "inputError" : ""}`}
            placeholder="Email"
            autoComplete="email"
            autoFocus
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
            })}
          />
          <span>{errors.password?.message}</span>
        </label>
        <label className="remember">
          <input type="checkbox" {...register("remember")} />
          <p>Se souvenir de cet appareil pendant 30 jours</p>
        </label>
        <p className="forgotLink" onClick={() => document.getElementById("forgot-password").showModal()}>
          Mot de passe oublié?
        </p>
        <button type="submit">Se connecter</button>
      </form>
      <aside>
        <h3>Se connecter !</h3>
        <p>Se connecter dès maintenant pour profiter de tous les services disponibles.</p>
        <p>Vous n'avez pas de compte ?</p>
        <button onClick={() => navigate("/inscription")}>S'enregistrer</button>
      </aside>
      <ForgotPassword />
    </section>
  );
};

export default Login;
