import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../store/slices/auth";
import { getRootFolder } from "../../store/slices/folder";
import { setToast } from "../../store/slices/toast";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
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
        if (res.error) {
          return dispatch(setToast({ message: res.error, type: "error", showToast: true }));
        }
        dispatch(checkAuth());
        dispatch(getRootFolder());
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
        <h2>Se connecter !</h2>
        <p>Se connecter dès maintenant pour profiter de tous les services disponibles.</p>
        <p>Vous n'avez pas de compte ?</p>
        <button onClick={() => navigate("/inscription")}>S'enregistrer</button>
      </aside>
      <ForgotPassword />
    </section>
  );
};

export default Login;
