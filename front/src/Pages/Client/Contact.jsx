import emailjs from "@emailjs/browser";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/toast";

/**
 * Component that renders the contact form.
 */
const Contact = () => {
  // Email input state
  const [email, setEmail] = useState("");

  // Message input state
  const [message, setMessage] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Redux dispatch
  const dispatch = useDispatch();

  // Initializes emailjs
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  /**
   * Handles email input changes.
   * @param {Event} e - Event
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  /**
   * Handles message input changes.
   * @param {Event} e - Event
   */
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  /**
   * Handles form submission.
   * @param {Event} e - Event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Service ID and template ID for emailjs
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    try {
      // Sends email using emailjs
      await emailjs.send(serviceId, templateId, {
        email: email,
        message: `message de ${email}: ${message}`,
      });

      // Closes dialog, shows success toast and resets form
      setIsLoading(false);
      document.getElementById("contact").close();
      dispatch(setToast({ message: "Message envoyé !", type: "success", showToast: true }));
      setEmail("");
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <dialog id="contact">
      <section>
        <form method="dialog">
          <CloseOutlinedIcon className="closeBtn" onClick={() => document.getElementById("contact").close()} />
        </form>
        <h4>Contactez-nous !</h4>
        <form id="contactForm" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Votre message
            <textarea
              placeholder="Votre message..."
              name="message"
              value={message}
              onChange={handleMessageChange}
              required
            ></textarea>
          </label>
          <button type="submit">{isLoading ? "En cours..." : "Envoyer"}</button>
        </form>
        <div>
          <p>Email : anthony.dewitte@3wa.io</p>
          <p>Téléphone : +1 123-456-789</p>
        </div>
      </section>
    </dialog>
  );
};
export default Contact;
