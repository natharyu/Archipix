import { useDispatch, useSelector } from "react-redux";
import { getFiles } from "../../../../store/slices/files";
import { getFolders, getPath, setCurrentFolder } from "../../../../store/slices/folder";
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
    dispatch(getFiles(path[index]));
    dispatch(getFolders(path[index]));
    dispatch(getPath(path[index]));
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
