import { useSelector } from "react-redux";
function Account() {
  const { email, username, createdAt } = useSelector((state) => state.user);
  const date = new Date(createdAt).toLocaleDateString();
  return (
    <article className="profile-account">
      <h2>Mon compte</h2>
      <p>{email}</p>
      <p>{username}</p>
      <p>{date}</p>
    </article>
  );
}

export default Account;
