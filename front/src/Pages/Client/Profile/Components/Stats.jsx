import { useSelector } from "react-redux";
import SizeCalculator from "../../../../Components/SizeCalculator";

/**
 * Component for displaying stats of the user's profile.
 */
function Stats() {
  // Select data from Redux store
  const { usedStorageSize, totalFiles } = useSelector((state) => state.user);

  // Render component
  return (
    <article className="profile-stats">
      <div className="stats-card">
        <h3>Nombre total de fichiers :</h3>
        <span>{totalFiles}</span>
      </div>
      <div className="stats-card">
        <h3>Taille total de tous mes fichiers :</h3>
        <span>
          {/* Pass the used storage size to SizeCalculator */}
          <SizeCalculator size={usedStorageSize} />
        </span>
      </div>
    </article>
  );
}

export default Stats;
