import { useState } from "react";
import { useSelector } from "react-redux";
/**
 * A function that handles selecting/deselecting files and updating the selected files array.
 *
 * @param {function} setSelectedFiles - A function to set the selected files array
 * @return {JSX.Element} A button element for selecting/deselecting files
 */
function SelectFiles({ setSelectedFiles }) {
  const [isCheckedFiles, setIsCheckedFiles] = useState(false);
  const { files } = useSelector((state) => state.file);

  /**
   * Handle the check all files checkbox.
   *
   * When the check all files checkbox is checked, it will check all the file
   * checkboxes and add the corresponding selected files to the selected files
   * state variable.
   *
   * When the check all files checkbox is unchecked, it will uncheck all the
   * file checkboxes and empty the selected files state variable.
   */
  const handleCheckFiles = () => {
    // Toggle the checked state
    setIsCheckedFiles(!isCheckedFiles);

    // Reset selected files
    setSelectedFiles([]);

    // Array to store the selected files
    const selectedFiles = [];

    // Loop through all checkboxes
    document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      // Check if the checkbox is a file checkbox
      if (checkbox.name.includes("file")) {
        // If the check all files checkbox is checked
        if (!isCheckedFiles) {
          // Get the file id
          const file_id = checkbox.name.replace("file-", "");

          // Find the file with the corresponding id in the files state
          const [file] = files.filter((file) => file.id === file_id);

          // Add the file to the array
          selectedFiles.push(file);

          // Check the file checkbox
          checkbox.checked = !isCheckedFiles;

          // Set the selected files array
          setSelectedFiles(selectedFiles);
        }

        // Toggle the file checkbox
        checkbox.checked = !isCheckedFiles;
      }
    });

    // Set the checked state to false
    setIsCheckedFiles(false);
  };

  return (
    <button className="selectBtn" onClick={handleCheckFiles}>
      {isCheckedFiles ? "Décocher tout" : "Cocher tous les fichiers"}
    </button>
  );
}

export default SelectFiles;
