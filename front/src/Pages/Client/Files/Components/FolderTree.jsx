import { useDispatch, useSelector } from "react-redux";
import { setCurrentFolder } from "../../../../store/slices/folder";
function FolderTree() {
  const { pathName, path } = useSelector((state) => state.folder);
  const dispatch = useDispatch();

  const handleClick = (folder, index) => {
    dispatch(
      setCurrentFolder({
        currentFolder: path[index],
        currentFolderName: folder,
      })
    );
  };

  return (
    <div>
      {pathName.map((folder, index) => (
        <button key={index} onClick={() => handleClick(folder, index)}>
          {folder}/
        </button>
      ))}
    </div>
  );
}

export default FolderTree;
