import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShares } from "../../../store/slices/shares";
import { getUserInfo } from "../../../store/slices/user";
import Account from "./Components/Account";
import Shares from "./Components/Shares";
import Stats from "./Components/Stats";

/**
 * The user's profile page
 * @returns {JSX.Element} The profile page
 */
function Profile() {
  // Toggle the visibility of the stats and account components
  const handleShowStats = () => {
    document.querySelector(".profile-stats").style.display = "flex";
    document.querySelector(".profile-account").style.display = "none";
    document.querySelector(".profile-shares").style.display = "none";
    document.getElementById("profile-stats").classList.add("active");
    document.getElementById("profile-account").classList.remove("active");
    document.getElementById("profile-shares").classList.remove("active");
  };

  const handleShowAccount = () => {
    document.querySelector(".profile-stats").style.display = "none";
    document.querySelector(".profile-account").style.display = "flex";
    document.querySelector(".profile-shares").style.display = "none";
    document.getElementById("profile-stats").classList.remove("active");
    document.getElementById("profile-account").classList.add("active");
    document.getElementById("profile-shares").classList.remove("active");
  };

  const handleShowShares = () => {
    document.querySelector(".profile-stats").style.display = "none";
    document.querySelector(".profile-account").style.display = "none";
    document.querySelector(".profile-shares").style.display = "flex";
    document.getElementById("profile-stats").classList.remove("active");
    document.getElementById("profile-account").classList.remove("active");
    document.getElementById("profile-shares").classList.add("active");
  };

  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const { id } = useSelector((state) => state.user);

  // Get the user's info when the component mounts
  useEffect(() => {
    if (!email) return;
    dispatch(getUserInfo(email));
  }, [email]);

  useEffect(() => {
    if (!id) return;
    dispatch(getShares(id));
  }, [id]);

  return (
    <section id="profile">
      <ul className="profile-nav">
        <li id="profile-stats" className="active" onClick={handleShowStats}>
          Mon résumé
        </li>
        <li id="profile-account" onClick={handleShowAccount}>
          Mon compte
        </li>
        <li id="profile-shares" onClick={handleShowShares}>
          Mes partages
        </li>
      </ul>
      <Stats />
      <Account />
      <Shares />
    </section>
  );
}

export default Profile;
