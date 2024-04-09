import { useSelector } from "react-redux";
import SizeCalculator from "../../../../Components/SizeCalculator";

function Stats() {
  const { usedStorageSize, totalFiles } = useSelector((state) => state.user);
  return (
    <article className="profile-stats">
      <div className="stats-card">
        <h3>Nombre total de fichiers :</h3>
        <span>{totalFiles}</span>
      </div>
      <div className="stats-card">
        <h3>Taille total de tous mes fichiers :</h3>
        <span>
          <SizeCalculator size={usedStorageSize} />
        </span>
      </div>
    </article>
  );
}

export default Stats;
