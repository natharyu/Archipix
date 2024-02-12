import { useDispatch, useSelector } from "react-redux";
function FolderTree({ currentFolder }) {
  const dispatch = useDispatch();
  const { rootFolder, rootFolderName } = useSelector((state) => state.folder);
  const entirePath = [];

  return <div>{currentFolder}</div>;
}

export default FolderTree;
