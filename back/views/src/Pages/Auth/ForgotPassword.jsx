import emailjs from "@emailjs/browser";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/toast";

const ForgotPassword = () => {
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => emailjs.init("iq8iTsQa_1K4aIfac"), []);

  const onSubmit = async (data) => {
    try {
      setIsSending(true);
      await fetch(`/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            return dispatch(setToast({ message: res.error, type: "error", showToast: true }));
          }
          document.getElementById("forgot-password").close();
          dispatch(setToast({ message: res.message, type: "success", showToast: true }));
        });
      setIsSending(false);
    } catch (error) {
      setToast(error, "error", true);
    }
  };

  return (
    <dialog id="forgot-password">
      <section>
        <div>
          <h3>Mot de passe oublié ?</h3>
          <form method="dialog">
            <CloseOutlinedIcon
              className="closeBtn"
              onClick={() => document.getElementById("forgot-password").close()}
            />
          </form>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            E-mail :
            <input
              type="email"
              name="email"
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
          <button type="submit">{isSending ? "En cours..." : "Envoyer"}</button>
        </form>
      </section>
    </dialog>
  );
};

export default ForgotPassword;
