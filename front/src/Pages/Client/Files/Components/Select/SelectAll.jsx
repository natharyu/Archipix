import { useState } from "react";
import { useSelector } from "react-redux";
/**
 * Function to select all folders and files.
 *
 * @param {function} setSelectedFolders - A function to set the selected folders
 * @param {function} setSelectedFiles - A function to set the selected files
 * @return {JSX.Element} The button component for selecting all items
 */
function SelectAll({ setSelectedFolders, setSelectedFiles }) {
  const { folders } = useSelector((state) => state.folder);
  const { files } = useSelector((state) => state.file);
  const [isChecked, setIsChecked] = useState(false);

  /**
   * Function to handle the check all checkbox.
   *
   * When the check all checkbox is checked, it will check all the folder
   * and file checkboxes and add the corresponding selected folders and files
   * to their respective state variables.
   *
   * When the check all checkbox is unchecked, it will uncheck all the
   * folder and file checkboxes and empty their respective state variables.
   */
  const handleCheckAll = () => {
    setIsChecked(!isChecked); // Toggle the checked state
    setSelectedFolders([]); // Reset selected folders
    setSelectedFiles([]); // Reset selected files

    const selectedFolders = []; // Array to store the selected folders
    const selectedFiles = []; // Array to store the selected files

    document
      .querySelectorAll("input[type=checkbox]") // Get all checkboxes
      .forEach((checkbox) => {
        // Check if the checkbox is a folder checkbox
        if (checkbox.name.includes("folder")) {
          if (!isChecked) {
            // If the check all checkbox is checked, add the folder to the
            // selected folders array and check the folder checkbox
            const folder_id = checkbox.name.replace("folder-", ""); // Get the folder id
            const [folder] = folders.filter((folder) => folder.id === folder_id); // Get the folder from the folders state
            selectedFolders.push(folder); // Add the folder to the array
            checkbox.checked = !isChecked; // Check the folder checkbox
            setSelectedFolders(selectedFolders); // Set the selected folders array
          }
          checkbox.checked = !isChecked; // Toggle the folder checkbox
        }

        // Check if the checkbox is a file checkbox
        if (checkbox.name.includes("file")) {
          if (!isChecked) {
            // If the check all checkbox is checked, add the file to the
            // selected files array and check the file checkbox
            const file_id = checkbox.name.replace("file-", ""); // Get the file id
            const [file] = files.filter((file) => file.id === file_id); // Get the file from the files state
            selectedFiles.push(file); // Add the file to the array
            checkbox.checked = !isChecked; // Check the file checkbox
            setSelectedFiles(selectedFiles); // Set the selected files array
          }
          checkbox.checked = !isChecked; // Toggle the file checkbox
        }
      });

    setIsChecked(false); // Reset the checked state
  };

  return (
    <>
      <button className="selectBtn" onClick={handleCheckAll}>
        {isChecked ? "Décocher tout" : "Cocher tout"}
      </button>
    </>
  );
}

export default SelectAll;
