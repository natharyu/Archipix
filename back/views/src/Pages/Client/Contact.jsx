import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToast } from "../../store/slices/toast";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY), []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    try {
      await emailjs.send(serviceId, templateId, {
        email: email,
        message: `message de ${email}: ${message}`,
      });
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
          <button className="closeBtn">✕</button>
        </form>
        <h3>Contactez-nous !</h3>
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
