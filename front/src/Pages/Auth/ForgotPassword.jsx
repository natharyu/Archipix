import emailjs from "@emailjs/browser";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/toast";

/**
 * Component for handling forgot password functionality.
 *
 * @param {Object} data - the user input data for resetting the password
 * @return {JSX.Element} - the JSX element representing the forgot password dialog
 */
const ForgotPassword = () => {
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => emailjs.init("iq8iTsQa_1K4aIfac"), []);

  /**
   * A function that handles form submission for resetting password.
   *
   * @param {Object} data - the data object containing email for password reset
   * @return {Promise<void>} a Promise that resolves when the password reset is attempted
   */
  const onSubmit = async (data) => {
    // Attempt to reset the password using the email provided by the user
    try {
      setIsSending(true); // Set the sending state to true to disable the form submission button
      await fetch(`/auth/reset-password`, {
        method: "POST", // Use POST method to send the request
        headers: {
          // Set the content-type header to JSON
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email, // Set the email field in the request body
        }),
      })
        .then((res) => res.json()) // Parse the response as JSON
        .then((res) => {
          if (res.error) {
            // If the response contains an error field
            return dispatch(
              setToast({
                // Dispatch a toast action to display the error message
                message: res.error, // Set the error message from the response
                type: "error", // Set the toast type to error
                showToast: true, // Show the toast
              })
            );
          }
          document.getElementById("forgot-password").close(); // Close the forgot password dialog
          dispatch(
            setToast({
              // Dispatch a toast action to display the success message
              message: res.message, // Set the success message from the response
              type: "success", // Set the toast type to success
              showToast: true, // Show the toast
            })
          );
        });
      setIsSending(false); // Set the sending state to false to enable the form submission button
    } catch (error) {
      // Handle any errors that may occur
      setToast(error, "error", true); // Dispatch a toast action to display the error message
    }
  };

  return (
    <dialog id="forgot-password">
      <section>
        <div>
          <h4>Mot de passe oublié ?</h4>
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
