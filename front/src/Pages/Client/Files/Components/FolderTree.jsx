import { useDispatch, useSelector } from "react-redux";
import { setCurrentFolder } from "../../../../store/slices/folder";
/**
 * FolderTree component
 *
 * Displays a breadcrumb like path of the current folder the user is in.
 * Each clickable path element changes the redux store's current folder.
 */
function FolderTree() {
  // Get the path name and path from the redux store
  const { pathName, path } = useSelector((state) => state.folder);
  // Get the dispatch function from redux
  const dispatch = useDispatch();

  /**
   * Handles the click event on a path element in the breadcrumb.
   *
   * @param {string} folder - The name of the folder that was clicked
   * @param {number} index - The index of the folder in the path array
   */
  const handleClick = (folder, index) => {
    // Dispatch an action to update the redux store's current folder
    dispatch(
      setCurrentFolder({
        // The new current folder is the folder at the specified index
        currentFolder: path[index],
        // The new current folder name is the folder that was clicked
        currentFolderName: folder,
      })
    );
  };

  return (
    <div id="folder-tree">
      {
        /* Map over each folder in the path */
        pathName.map((folder, index) => (
          <p
            key={index} // Use the index as the key
            onClick={() => handleClick(folder, index)} // Handle the click event
          >
            {folder}/ {/* Display the folder name followed by a slash */}
          </p>
        ))
      }
    </div>
  );
}

export default FolderTree;
