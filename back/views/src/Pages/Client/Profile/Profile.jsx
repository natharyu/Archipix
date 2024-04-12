import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../../../store/slices/user";
import Account from "./Components/Account";
import Stats from "./Components/Stats";

/**
 * The user's profile page
 * @returns {JSX.Element} The profile page
 */
function Profile() {
  // Toggle the visibility of the stats and account components
  /**
   * @param {MouseEvent} event The click event
   */
  const handleShowStats = (event) => {
    document.querySelector(".profile-stats").style.display = "flex";
    document.querySelector(".profile-account").style.display = "none";
    document.getElementById("profile-stats").classList.add("active");
    document.getElementById("profile-account").classList.remove("active");
  };
  /**
   * Toggle the visibility of the stats and account components
   * @param {MouseEvent} event The click event
   */
  const handleShowAccount = (event) => {
    document.querySelector(".profile-stats").style.display = "none";
    document.querySelector(".profile-account").style.display = "flex";
    document.getElementById("profile-stats").classList.remove("active");
    document.getElementById("profile-account").classList.add("active");
  };

  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);

  // Get the user's info when the component mounts
  useEffect(() => {
    if (!email) return;
    dispatch(getUserInfo(email));
  }, [email]);

  return (
    <section id="profile">
      <ul className="profile-nav">
        <li id="profile-stats" className="active" onClick={handleShowStats}>
          Mon résumé
        </li>
        <li id="profile-account" onClick={handleShowAccount}>
          Mon compte
        </li>
      </ul>
      <Stats />
      <Account />
    </section>
  );
}

export default Profile;
