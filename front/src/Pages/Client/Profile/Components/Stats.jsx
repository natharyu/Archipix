import { useSelector } from "react-redux";
import SizeCalculator from "../../../../Components/SizeCalculator";

function Stats() {
  const { usedStorageSize, totalFiles } = useSelector((state) => state.user);
  const totalStorageSize = 1073741824 * 2;
  const percentage = Math.floor((usedStorageSize / totalStorageSize) * 100);
  return (
    <article className="profile-stats">
      <h2>Stats</h2>
      <p>{totalFiles}</p>
      <SizeCalculator size={usedStorageSize} />
      <progress value={percentage} max="100">
        <span>{percentage}%</span>
      </progress>
      <SizeCalculator size={totalStorageSize} />
    </article>
  );
}

export default Stats;
