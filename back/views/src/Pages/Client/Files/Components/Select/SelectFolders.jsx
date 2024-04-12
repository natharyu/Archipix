import { useState } from "react";
import { useSelector } from "react-redux";
/**
 * Function to handle selecting folders.
 *
 * @param {Object} setSelectedFolders - function to set selected folders
 * @return {JSX.Element} The button component to select/deselect folders
 */
function SelectFolders({ setSelectedFolders }) {
  const [isCheckedFolders, setIsCheckedFolders] = useState(false);
  const { folders } = useSelector((state) => state.folder);

  /**
   * Function to handle checking/unchecking all folders checkboxes.
   *
   * @returns {void}
   */
  const handleCheckFolders = () => {
    // Toggle the isCheckedFolders state
    setIsCheckedFolders((prevIsCheckedFolders) => !prevIsCheckedFolders);

    // Reset the selectedFolders state
    setSelectedFolders([]);

    // Create an empty array to store the selected folders
    const selectedFolders = [];

    // Loop over all the checkboxes with type=checkbox
    document.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      // If the checkbox has the name attribute folder-{id}
      if (checkbox.name.includes("folder")) {
        // If isCheckedFolders is currently false
        if (!isCheckedFolders) {
          // Get the folder id from the checkbox name
          const folder_id = checkbox.name.replace("folder-", "");

          // Filter the folders state to find the folder with the id
          const [folder] = folders.filter((folder) => folder.id === folder_id);

          // Add the folder to the selectedFolders array
          selectedFolders.push(folder);

          // Check the checkbox
          checkbox.checked = !isCheckedFolders;

          // Update the selectedFolders state
          setSelectedFolders(selectedFolders);
        }

        // Toggle the checkbox
        checkbox.checked = !isCheckedFolders;
      }
    });

    // Reset isCheckedFolders to false
    setIsCheckedFolders(false);
  };

  return (
    <>
      <button className="selectBtn" onClick={handleCheckFolders}>
        {isCheckedFolders ? "Décocher tout" : "Cocher tous les dossiers"}
      </button>
    </>
  );
}

export default SelectFolders;
