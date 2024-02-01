import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import useToastStore from "store/toast.jsx";
import { useForm } from "react-hook-form";
// import { createCustomer } from "slices/stripeSlice.js";
import { useDispatch } from "react-redux";

const Register = () => {
  const navigate = useNavigate();
  // const { setToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    let stripeId;
    await dispatch(createCustomer({ email: data.email }))
      .then((res) => (stripeId = res.payload.id))
      .catch((err) => setToast(err.message, "error", true));
    await fetch(`${import.meta.env.VITE_AUTH_BASEURL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        stripeId: stripeId,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          // return setToast(res.error, "error", true);
        }
        navigate("/login");
        // setToast(res.message, "success", true);
      });

    setIsLoading(false);
  };

  return (
    <section id="register">
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">
          {isLoading ? <span className="loading loading-dots loading-md"></span> : "S'inscrire"}
        </button>
      </form>
      <aside>
        <h2>S'incrire !</h2>
        <p>S'inscrire dès maintenant pour profiter de tous les services disponibles.</p>
        <p>Vous avez déjà un compte ?</p>
        <button onClick={() => navigate("/connexion")}>Se connecter</button>
      </aside>
    </section>
  );
};
export default Register;
