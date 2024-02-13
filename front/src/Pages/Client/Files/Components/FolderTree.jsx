import { useSelector } from "react-redux";
function FolderTree() {
  const { pathName } = useSelector((state) => state.folder);

  return (
    <div>
      {pathName.map((folder, index) => (
        <span key={index}>{folder}/</span>
      ))}
    </div>
  );
}

export default FolderTree;
